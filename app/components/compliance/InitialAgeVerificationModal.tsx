import React, {FormEvent, useEffect, useRef, useState} from 'react';

const STORAGE_KEY = 'initialAgeVerified';
const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30;
const AGE_VERIFICATION_COOKIE = 'vapourism_age_verified';
const COOKIE_MAX_AGE_SECONDS = Math.floor(THIRTY_DAYS_IN_MS / 1000);

interface StoredVerification {
  verified: boolean;
  expiresAt: number;
}

interface InitialAgeVerificationModalProps {
  onVisibilityChange?: (isOpen: boolean) => void;
}

function readStoredVerification(): StoredVerification | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredVerification;
    if (!parsed.verified || typeof parsed.expiresAt !== 'number') {
      clearPersistedVerification();
      return null;
    }
    if (parsed.expiresAt <= Date.now()) {
      clearPersistedVerification();
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Unable to parse age verification payload', error);
    clearPersistedVerification();
    return null;
  }
}

function hasVerificationCookie() {
  if (typeof document === 'undefined') return false;
  const cookieSource = document.cookie || '';
  return cookieSource.split('; ').some((entry) => entry.startsWith(`${AGE_VERIFICATION_COOKIE}=`));
}

function persistVerificationCookie() {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + THIRTY_DAYS_IN_MS);
  const secureFlag = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AGE_VERIFICATION_COOKIE}=true; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; expires=${expires.toUTCString()}; SameSite=Lax${secureFlag}`;
}

function clearVerificationCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AGE_VERIFICATION_COOKIE}=; path=/; max-age=0; expires=${new Date(0).toUTCString()}; SameSite=Lax`;
}

function clearPersistedVerification() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  clearVerificationCookie();
}

function persistVerification() {
  if (typeof window === 'undefined') return;
  const payload: StoredVerification = {
    verified: true,
    expiresAt: Date.now() + THIRTY_DAYS_IN_MS,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  persistVerificationCookie();
}

function calculateAge(dateString: string): number {
  const today = new Date();
  const date = new Date(dateString);
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
}

export function InitialAgeVerificationModal({onVisibilityChange}: InitialAgeVerificationModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState<string | null>(null);
  const previousOverflow = useRef<string>('');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    const storedVerification = readStoredVerification();
    const hasCookie = hasVerificationCookie();

    if (!storedVerification || !hasCookie) {
      if (!hasCookie && storedVerification) {
        clearPersistedVerification();
      } else if (!storedVerification && hasCookie) {
        clearVerificationCookie();
      }
      const timeout = window.setTimeout(() => setIsOpen(true), 400);
      return () => window.clearTimeout(timeout);
    }

    return () => undefined;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return () => undefined;
    (window as any).showAgeGate = () => setIsOpen(true);
    (window as any).clearAgeGate = () => {
      clearPersistedVerification();
      setIsOpen(true);
    };

    return () => {
      delete (window as any).showAgeGate;
      delete (window as any).clearAgeGate;
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    onVisibilityChange?.(isOpen);
    if (typeof document === 'undefined') return;

    if (isOpen) {
      previousOverflow.current = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = previousOverflow.current;
    }

    return () => {
      document.documentElement.style.overflow = previousOverflow.current;
    };
  }, [isOpen, isMounted, onVisibilityChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (Number.isNaN(age) || age < 18) {
      setError('You must be 18 or older to continue');
      return;
    }

    persistVerification();
    setIsOpen(false);
  };

  const handleExit = () => {
    if (typeof window === 'undefined') return;
    window.location.href = 'https://www.google.com';
  };

  if (!isMounted || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-indigo-900/40" aria-hidden />

      <div className="relative z-[1] w-full max-w-lg rounded-[32px] border border-white/20 bg-white/95 p-8 text-center shadow-[0_45px_120px_rgba(15,23,42,0.55)]">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">Compliance</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">Age verification required</h2>
        <p className="mt-3 text-sm text-slate-600">
          Vapourism is a UK vaping retailer. Confirm you are 18 or older to unlock the experience. We store your
          verification for 30 days in your browser.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div>
            <label htmlFor="dob" className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Date of birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              required
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-slate-900 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm font-semibold text-rose-600" data-testid="age-gate-error">{error}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.35)]"
            >
              Verify and continue
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Exit site
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
