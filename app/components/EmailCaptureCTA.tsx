/**
 * Email Capture CTA Component for Blog Posts
 * 
 * Displays an inline call-to-action for email capture with 10% discount offer.
 * Features:
 * - GDPR-compliant marketing consent checkbox (optional, unticked by default)
 * - Inline form submission
 * - Respects "already shown" cookie (but still displays CTA)
 * - Styled to match blog design system
 */

import React, {useState, useCallback} from 'react';
import {cn} from '~/lib/utils';
import {markEmailCaptureAsShown} from './EmailCapturePopup';

export function EmailCaptureCTA() {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          trigger: 'blog_cta',
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
              trigger: 'blog_cta',
              marketing_consent: marketingConsent,
            });
          }
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
          trigger: 'blog_cta',
          marketing_consent: marketingConsent,
        });
      }

    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, marketingConsent]);

  return (
    <div className="not-prose my-12 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-violet-50/50 shadow-xl">
      <div className="p-8 md:p-10">
        {success ? (
          // Success state
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Thank you! 🎉</h3>
              <p className="mt-2 text-slate-600">
                Check your inbox for your exclusive 10% discount code.
              </p>
            </div>
          </div>
        ) : (
          // Form state
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Enjoying this article?
              </h3>
              <p className="mt-2 text-lg text-slate-600">
                Get 10% off your first order when you join our community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="blog-email-input" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  id="blog-email-input"
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
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                <input
                  id="blog-marketing-consent"
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
                <label htmlFor="blog-marketing-consent" className="flex-1 text-sm text-slate-600">
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
                We respect your privacy. See our{' '}
                <a href="/policies/privacy-policy" className="text-violet-600 underline hover:text-violet-700">
                  Privacy Policy
                </a>.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
