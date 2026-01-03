/**
 * Email Capture Popup Component
 * 
 * Displays a popup to capture user emails for 10% discount offer.
 * Features:
 * - GDPR-compliant marketing consent checkbox (optional, unticked by default)
 * - Only shows once per user (tracked via cookie)
 * - Multiple trigger modes: exit intent, timer, immediate
 * - Checks for existing customer before submitting
 */

import React, {useState, useCallback, useEffect} from 'react';
import {X} from 'lucide-react';
import {cn} from '~/lib/utils';

interface EmailCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'exit' | 'timer' | 'search' | 'manual';
}

const STORAGE_KEY = 'vapourism_email_capture_shown';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Check if the popup has been shown before
 */
export function hasEmailCaptureBeenShown(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    const shownDate = new Date(data.timestamp);
    const expiryDate = new Date(shownDate);
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    // If expired, clear and return false
    if (new Date() > expiryDate) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Mark the popup as shown
 */
export function markEmailCaptureAsShown(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      timestamp: new Date().toISOString(),
      shown: true,
    }));
  } catch {
    // localStorage not available
  }
}

export function EmailCapturePopup({isOpen, onClose, trigger = 'manual'}: EmailCapturePopupProps) {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setMarketingConsent(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Submit to API route
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          marketingConsent,
          trigger,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.alreadyExists) {
          // Customer already exists - still show success
          setSuccess(true);
          markEmailCaptureAsShown();
          
          // Track event
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'email_capture_existing', {
              trigger,
              marketing_consent: marketingConsent,
            });
          }
          
          // Auto-close after 3 seconds
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          setError(result.error || 'Failed to submit. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success!
      setSuccess(true);
      markEmailCaptureAsShown();

      // Track successful submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_capture_success', {
          trigger,
          marketing_consent: marketingConsent,
        });
      }

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, marketingConsent, trigger, onClose]);

  const handleClose = useCallback(() => {
    // Track dismissal
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_capture_dismissed', {
        trigger,
      });
    }
    onClose();
  }, [trigger, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="email-capture-title"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          // Success state
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">You're all set! 🎉</h2>
              <p className="mt-2 text-slate-600">
                Check your inbox for your exclusive 10% discount code.
              </p>
            </div>
          </div>
        ) : (
          // Form state
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 id="email-capture-title" className="text-2xl font-bold text-slate-900">
                Get 10% Off Your First Order
              </h2>
              <p className="text-slate-600">
                Join our community and receive an exclusive discount code instantly
              </p>
            </div>

            <div className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email-capture-input" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-capture-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                  className={cn(
                    "w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900",
                    "placeholder:text-slate-400",
                    "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                    "disabled:bg-slate-50 disabled:text-slate-500"
                  )}
                />
              </div>

              {/* GDPR Marketing Consent - Optional, unticked by default */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  id="marketing-consent"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
                <label htmlFor="marketing-consent" className="flex-1 text-sm text-slate-600">
                  I'd like to receive marketing emails about new products, offers, and vaping tips. 
                  <span className="text-slate-500"> (Optional)</span>
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-3",
                  "text-base font-semibold text-white shadow-lg shadow-violet-500/30",
                  "transition-all duration-200",
                  "hover:from-violet-700 hover:to-violet-800 hover:shadow-xl hover:shadow-violet-500/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Claim My 10% Discount'
                )}
              </button>

              {/* Privacy notice */}
              <p className="text-center text-xs text-slate-500">
                By submitting, you agree to receive your discount code. 
                We respect your privacy and won't share your email. 
                See our{' '}
                <a href="/policies/privacy-policy" className="text-violet-600 underline hover:text-violet-700">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
