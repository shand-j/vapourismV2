/**
 * Cookie Consent Banner Component
 * 
 * GDPR-compliant cookie consent for UK vaping retailer.
 * Gates GA4 analytics loading until user accepts.
 */

import React, {useState, useEffect, useCallback} from 'react';
import {updateGtagConsent} from '~/lib/analytics';

interface ConsentPreferences {
  necessary: boolean; // Always true - required for site function
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = 'vapourism_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

function getStoredConsent(): ConsentPreferences | null {
  if (globalThis.window === undefined) return null;
  
  try {
    const stored = globalThis.localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as ConsentPreferences;
    
    // Check if consent has expired (1 year)
    const consentDate = new Date(parsed.timestamp);
    const expiryDate = new Date(consentDate);
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    if (new Date() > expiryDate) {
      globalThis.localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(preferences: ConsentPreferences): void {
  if (globalThis.window === undefined) return;
  
  try {
    globalThis.localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
  } catch {
    // localStorage not available
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Small delay to prevent flash on page load
      const timer = globalThis.setTimeout(() => setIsVisible(true), 500);
      return () => globalThis.clearTimeout(timer);
    }
    
    // If consent exists, update gtag with stored preferences
    updateGtagConsent(stored.analytics, stored.marketing);
    return undefined;
  }, []);

  const handleAcceptAll = useCallback(() => {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    
    saveConsent(preferences);
    updateGtagConsent(true, true);
    setIsVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    
    saveConsent(preferences);
    updateGtagConsent(false, false);
    setIsVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    const preferences: ConsentPreferences = {
      necessary: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      timestamp: new Date().toISOString(),
    };
    
    saveConsent(preferences);
    updateGtagConsent(analyticsEnabled, marketingEnabled);
    setIsVisible(false);
  }, [analyticsEnabled, marketingEnabled]);

  if (!isVisible) return null;

  return (
    <section 
      className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6"
      aria-labelledby="cookie-consent-title"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {showSettings ? (
          // Settings view
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Cookie Preferences</h2>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close settings"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Necessary cookies - always enabled */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <h3 className="font-medium text-slate-900">Necessary Cookies</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    Always On
                  </span>
                </div>
              </div>
              
              {/* Analytics cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 id="analytics-label" className="font-medium text-slate-900">Analytics Cookies</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Help us understand how visitors interact with our website using Google Analytics.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Enable analytics cookies</span>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="peer sr-only"
                    aria-labelledby="analytics-label"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-violet-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-violet-300" />
                </label>
              </div>
              
              {/* Marketing cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <h3 id="marketing-label" className="font-medium text-slate-900">Marketing Cookies</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <span className="sr-only">Enable marketing cookies</span>
                  <input
                    type="checkbox"
                    checked={marketingEnabled}
                    onChange={(e) => setMarketingEnabled(e.target.checked)}
                    className="peer sr-only"
                    aria-labelledby="marketing-label"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-violet-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-violet-300" />
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        ) : (
          // Main consent view
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-xl bg-violet-100 p-3">
                <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 id="cookie-consent-title" className="text-lg font-semibold text-slate-900">
                  We value your privacy
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. 
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies as described in our{' '}
                  <a href="/policies/cookie-policy" className="text-violet-600 underline hover:text-violet-700">
                    Cookie Policy
                  </a>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="order-3 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:order-1"
              >
                Manage preferences
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="order-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="order-1 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 sm:order-3"
              >
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
