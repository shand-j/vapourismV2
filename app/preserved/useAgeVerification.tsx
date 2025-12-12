import { useState, useEffect, useCallback, useRef } from 'react';
import { getClientScriptSrc, CALLBACK_ONLOAD, CALLBACK_ONREADY, CALLBACK_ONSUCCESS, CALLBACK_ONERROR } from '~/lib/ageverif.client';

// AgeVerif type can be defined or imported as needed
interface AgeVerif {
  start: (opts?: any) => Promise<any>;
  clear: () => void;
  destroy: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ageverif?: AgeVerif;
    ageverifLoaded?: (args: { verified: boolean }) => void;
    ageverifSuccess?: () => void;
    ageverifError?: (error: any) => void;
  }
}

const AGEVERIF_TEST_KEY = 'test-key-for-development';
const AGEVERIF_LIVE_KEY = undefined;
const AGEVERIF_KEY = process.env.NODE_ENV === 'production' ? AGEVERIF_LIVE_KEY || AGEVERIF_TEST_KEY : AGEVERIF_TEST_KEY;

interface UseAgeVerifProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useAgeVerif({ onSuccess, onError }: UseAgeVerifProps = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [ageverif, setAgeverif] = useState<AgeVerif | null>(null);
  const [lastError, setLastError] = useState<any>(null);
  const [pendingResult, setPendingResult] = useState<{resolve: (value: any) => void, reject: (reason: any) => void} | null>(null);
  
  // Track whether we've initialized to prevent double setup
  const hasInitialized = useRef(false);
  
  // Keep a ref to the current pending resolver so event listeners always
  // see the latest resolver without needing to re-register handlers.
  const pendingRef = (globalThis as any).__ageverif_pending_ref || { current: null };
  // Ensure it's stored globally for HMR stability across module reloads
  (globalThis as any).__ageverif_pending_ref = pendingRef;
  
  // Store callbacks in refs so event listeners always use latest versions
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  // Main effect: loads script and sets up listeners ONCE, cleans up only on unmount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Install global shims that the external checker may call. These shims
    // dispatch CustomEvents so the hook can update React state in a controlled way.
    // dispatch CustomEvents so the hook can update React state in a controlled way.
    const dispatchEvent = (name: string, detail?: any) => {
      try {
        window.dispatchEvent(new CustomEvent(name, { detail }));
      } catch (e) {
        // ignore
      }
    };

    // Install global callback shims that the external checker can call via query params
    (window as any)[CALLBACK_ONLOAD] = (args: { verified: boolean }) => dispatchEvent('ageverif:loaded', args);
    (window as any)[CALLBACK_ONREADY] = (args?: any) => dispatchEvent('ageverif:ready', args);
    (window as any)[CALLBACK_ONSUCCESS] = (result?: any) => dispatchEvent('ageverif:success', result);
    (window as any)[CALLBACK_ONERROR] = (error: any) => dispatchEvent('ageverif:error', error);

    const onLoaded = (e: any) => {
      const verified = e?.detail?.verified ?? false;
      setIsLoaded(true);
      setIsVerified(verified);
      setAgeverif((window as any).ageverif || null);
    };
    const onReady = (e: any) => {
      setIsLoaded(true);
      setAgeverif((window as any).ageverif || null);
    };
    const onSuccessEvt = (e: any) => {
      const raw = e?.detail ?? null;
      // Normalise the shape returned by the external checker. The checker
      // frequently emits { verification: { uid, token, assuranceLevel, ... } }
      // so callers expect a top-level `verified` flag and easy access to `token`.
      const normalized = raw && raw.verification ? {
        // mark verified explicitly
        verified: true,
        // spread verification payload (uid, assuranceLevel, ageThreshold, token...)
        ...raw.verification,
        // ensure token is accessible at top-level if present
        token: raw.verification.token ?? raw.token ?? undefined,
      } : {
        // fallback: preserve raw shape but ensure verified flag if present
        verified: !!(raw && (raw.verified === true)),
        ...raw,
      };

      setIsVerified(true);
      // Dev-only logging
      if (process.env.NODE_ENV === 'development') {
        try {
          // eslint-disable-next-line no-console
          console.log('[ageverif] success event raw:', raw, 'normalized:', normalized);
        } catch (e) {
          // ignore logging failures
        }
      }
      const resolver = pendingRef.current ?? pendingResult;
      if (resolver) {
        try {
          resolver.resolve(normalized);
        } catch (err) {
          // ignore resolve errors
        }
        pendingRef.current = null;
        setPendingResult(null);
      }
      onSuccessRef.current?.();
      return normalized;
    };
    const onErrorEvt = (e: any) => {
      setLastError(e?.detail);
      const resolver = pendingRef.current ?? pendingResult;
      if (resolver) {
        try {
          resolver.reject(e?.detail);
        } catch (err) {
          // ignore
        }
        pendingRef.current = null;
        setPendingResult(null);
      }
      onErrorRef.current?.(e?.detail);
    };

    // Listen for both the prefixed events (our shim) and the
    // unprefixed events some checker builds emit (e.g. `success`, `ready`).
    // This increases resilience against third-party build differences.
    window.addEventListener('ageverif:loaded', onLoaded as EventListener);
    window.addEventListener('loaded', onLoaded as EventListener);
    window.addEventListener('ageverif:ready', onReady as EventListener);
    window.addEventListener('ready', onReady as EventListener);
    window.addEventListener('ageverif:success', onSuccessEvt as EventListener);
    window.addEventListener('success', onSuccessEvt as EventListener);
    window.addEventListener('ageverif:error', onErrorEvt as EventListener);
    window.addEventListener('error', onErrorEvt as EventListener);
    const script = document.createElement('script');
    // Use canonical checker URL built from helper (includes key and callback query params)
    const src = getClientScriptSrc();
    script.src = src;
    // Dev-only logging
    if (process.env.NODE_ENV === 'development') {
      try {
        // eslint-disable-next-line no-console
        console.log('[ageverif] loading script:', src);
      } catch (e) {
        // ignore logging failures
      }
    }
    // mark as async
    script.async = true;
    // If the external script doesn't call our global shims immediately,
    // capture any attached `window.ageverif` on load and poll briefly
    // so startVerification can use the instance.
    let pollInterval: number | null = null;
    script.onload = () => {
      setIsLoaded(true);
      const av = (window as any).ageverif || null;
      setAgeverif(av);
      if (!av) {
        // Poll for a short period (10s max) for the client to attach
        let attempts = 0;
        pollInterval = window.setInterval(() => {
          const maybe = (window as any).ageverif;
          if (maybe) {
            setAgeverif(maybe);
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          } else if (++attempts > 40) {
            // give up after ~10s
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          }
        }, 250);
      }
    };
    script.onerror = () => {
      setIsLoaded(true);
      setIsVerified(false);
    };
    document.head.appendChild(script);
    const loadTimeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoaded(true);
        setIsVerified(false);
      }
    }, 10000);
    return () => {
      clearTimeout(loadTimeout);
      // clear poll if present
      if (typeof pollInterval === 'number' && pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      // Only clean up on actual unmount - check hasInitialized ref
      // This prevents premature cleanup when dependencies change
      const existingScript = document.querySelector(`script[src="${getClientScriptSrc()}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      delete (window as any)[CALLBACK_ONLOAD];
      delete (window as any)[CALLBACK_ONREADY];
      delete (window as any)[CALLBACK_ONSUCCESS];
      delete (window as any)[CALLBACK_ONERROR];
      window.removeEventListener('ageverif:loaded', onLoaded as EventListener);
      window.removeEventListener('loaded', onLoaded as EventListener);
      window.removeEventListener('ageverif:ready', onReady as EventListener);
      window.removeEventListener('ready', onReady as EventListener);
      window.removeEventListener('ageverif:success', onSuccessEvt as EventListener);
      window.removeEventListener('success', onSuccessEvt as EventListener);
      window.removeEventListener('ageverif:error', onErrorEvt as EventListener);
      window.removeEventListener('error', onErrorEvt as EventListener);
      // Reset init flag so hook can reinitialize if component remounts
      hasInitialized.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run once on mount, cleanup on unmount only

  const startVerification = useCallback(async (opts?: any) => {
    // If the script hasn't finished loading yet, wait up to a short timeout.
    const maxWait = 10000; // ms
    const interval = 200; // ms

    let av: AgeVerif | null = ageverif;

    if (!av) {
      let waited = 0;
      // quick synchronous check first
      av = (window as any).ageverif || null;
      while (!av && waited < maxWait) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, interval));
        waited += interval;
        av = (window as any).ageverif || null;
        if (av) break;
      }
      // ensure isLoaded flag when we observed the script or timed out
      if (!isLoaded) setIsLoaded(true);
    }

    if (!av || typeof av.start !== 'function') {
      const err = new Error('AgeVerif client not available or missing start()');
      setLastError(err);
      onErrorRef.current?.(err);
      throw err;
    }

    try {
      if (pendingResult) {
        throw new Error('Verification already in progress');
      }
      const resultPromise = new Promise((resolve, reject) => {
        const r = { resolve, reject };
        setPendingResult(r);
        pendingRef.current = r;
        // safety timeout to avoid hanging indefinitely
        const t = window.setTimeout(() => {
          try {
            r.reject(new Error('AgeVerif timeout'));
          } catch (err) {
            // ignore
          }
          if (pendingRef.current === r) pendingRef.current = null;
          setPendingResult(null);
        }, 30000);
        // wrap resolve/reject to clear timer
        const origResolve = r.resolve;
        const origReject = r.reject;
        r.resolve = (v: any) => { clearTimeout(t); origResolve(v); };
        r.reject = (e: any) => { clearTimeout(t); origReject(e); };
        // write back updated r with wrapped functions
        pendingRef.current = r;
        setPendingResult(r);
      });
      av.start(opts);
      const result = await resultPromise;
      if (result && (result as any).verified) {
        setIsVerified(true);
        onSuccessRef.current?.();
      }
      try {
        // eslint-disable-next-line no-console
        console.log('[ageverif] startVerification resolved:', result);
      } catch (e) {
        // ignore
      }
      // keep stored instance in React state
      setAgeverif(av);
      return result as any;
    } catch (error) {
      setLastError(error);
      onErrorRef.current?.(error);
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, ageverif, pendingResult]); // Removed callback deps, using refs instead

  return {
    isLoaded,
    isVerified,
    lastError,
    startVerification,
  };
}
