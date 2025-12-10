import {StrictMode, startTransition} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {RemixBrowser} from '@remix-run/react';

// Early AgeVerif proxy: attach listeners before React mounts so events
// fired very early by the vendor widget (postMessage / global callbacks)
// are captured and normalized. This improves reliability when the
// verification widget fires before React effects attach.
try {
  const normalize = (raw: any) => {
    if (!raw) return raw;
    if (raw.verification) {
      return {
        verified: true,
        ...raw.verification,
        token: raw.verification.token ?? raw.token ?? undefined,
      };
    }
    if (raw.token) return { verified: true, token: raw.token, ...raw };
    return raw;
  };

  const resolvePending = (payload: any) => {
    try {
      const pendingRef = (globalThis as any).__ageverif_pending_ref;
      const resolver = pendingRef?.current;
      if (resolver && typeof resolver.resolve === 'function') {
        resolver.resolve(payload);
        // clear to avoid duplicate resolution
        pendingRef.current = null;
      }
    } catch (e) {
      // best-effort
      // eslint-disable-next-line no-console
      console.debug('[ageverif.proxy] resolve failed', e);
    }
  };

  // Proxy postMessage from the AgeVerif iframe
  window.addEventListener('message', (ev: MessageEvent) => {
    try {
      const data = ev?.data;
      if (!data || typeof data !== 'object') return;
      // vendor uses { type: 'verified', token: '...' }
      if (data.type === 'verified' && data.token) {
        const normalized = normalize({ verification: data });
        // re-dispatch a consistent CustomEvent for consumers
        window.dispatchEvent(new CustomEvent('ageverif:success', { detail: normalized }));
        // also try resolving any pending resolver directly
        resolvePending(normalized);
      }
    } catch (e) {
      // ignore
    }
  });

  // Proxy direct/global callbacks (some builds call these functions)
  (window as any).ageverifSuccess = (payload: any) => {
    const normalized = normalize(payload);
    try { window.dispatchEvent(new CustomEvent('ageverif:success', { detail: normalized })); } catch (e) {}
    resolvePending(normalized);
  };
  (window as any).ageverifLoaded = (payload: any) => {
    try { window.dispatchEvent(new CustomEvent('ageverif:loaded', { detail: payload })); } catch (e) {}
  };
  (window as any).ageverifReady = (payload: any) => {
    try { window.dispatchEvent(new CustomEvent('ageverif:ready', { detail: payload })); } catch (e) {}
  };
  (window as any).ageverifError = (err: any) => {
    try { window.dispatchEvent(new CustomEvent('ageverif:error', { detail: err })); } catch (e) {}
  };
} catch (e) {
  // early proxy must never break the app
  // eslint-disable-next-line no-console
  console.warn('[ageverif.proxy] failed to attach early listeners', e);
}
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
