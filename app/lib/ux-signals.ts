/**
 * UX Signals Library for SEO Optimization
 * 
 * Tracks user experience signals that correlate with SEO rankings:
 * - Core Web Vitals (LCP, INP, CLS)
 * - User engagement metrics (scroll depth, time on page)
 * - Interaction signals (clicks, form submissions, search usage)
 * 
 * These signals help Google assess page experience and can influence search rankings.
 * All tracking respects user consent preferences via the analytics module.
 */

import { hasAnalyticsConsent } from './analytics';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Core Web Vitals thresholds as defined by Google
 * https://web.dev/vitals/
 */
export interface CoreWebVitalsThresholds {
  /** Largest Contentful Paint - measures loading performance */
  lcp: {
    good: number;      // <= 2500ms
    needsImprovement: number; // <= 4000ms
  };
  /** Interaction to Next Paint - measures interactivity/responsiveness */
  inp: {
    good: number;      // <= 200ms
    needsImprovement: number; // <= 500ms
  };
  /** Cumulative Layout Shift - measures visual stability */
  cls: {
    good: number;      // <= 0.1
    needsImprovement: number; // <= 0.25
  };
}

export interface CoreWebVitalsMetrics {
  lcp?: number;
  inp?: number;
  cls?: number;
  fcp?: number;  // First Contentful Paint (auxiliary metric)
  ttfb?: number; // Time to First Byte (auxiliary metric)
}

export interface CoreWebVitalsRating {
  metric: keyof CoreWebVitalsMetrics;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface EngagementMetrics {
  /** Maximum scroll depth reached (0-100%) */
  maxScrollDepth: number;
  /** Time spent on page in seconds */
  timeOnPage: number;
  /** Number of interactions (clicks, scrolls, etc.) */
  interactionCount: number;
  /** Whether user engaged beyond the fold */
  engagedBeyondFold: boolean;
  /** Whether user reached the end of content */
  reachedContentEnd: boolean;
}

export interface InteractionEvent {
  /** Currently tracked interaction types */
  type: 'click' | 'form_start' | 'form_submit';
  element?: string;
  value?: string | number;
  timestamp: number;
}

export interface UXSignalsReport {
  pageUrl: string;
  pageTitle: string;
  timestamp: string;
  coreWebVitals: CoreWebVitalsMetrics;
  engagement: EngagementMetrics;
  interactions: InteractionEvent[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Google's Core Web Vitals thresholds (2024)
 */
export const CORE_WEB_VITALS_THRESHOLDS: CoreWebVitalsThresholds = {
  lcp: {
    good: 2500,           // 2.5 seconds
    needsImprovement: 4000, // 4 seconds
  },
  inp: {
    good: 200,            // 200ms
    needsImprovement: 500, // 500ms
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },
};

/**
 * Engagement thresholds for SEO quality signals
 */
export const ENGAGEMENT_THRESHOLDS = {
  /** Minimum scroll depth to be considered engaged (%) */
  minEngagedScrollDepth: 25,
  /** Minimum time on page to be considered engaged (seconds) */
  minEngagedTimeOnPage: 30,
  /** Scroll depth to consider content fully consumed (%) */
  contentEndScrollDepth: 90,
  /** Below-the-fold scroll threshold (%) */
  belowFoldThreshold: 15,
};

// =============================================================================
// CORE WEB VITALS TRACKING
// =============================================================================

/**
 * State to track current metrics
 */
let currentMetrics: CoreWebVitalsMetrics = {};
let engagementState: EngagementMetrics = {
  maxScrollDepth: 0,
  timeOnPage: 0,
  interactionCount: 0,
  engagedBeyondFold: false,
  reachedContentEnd: false,
};
let interactions: InteractionEvent[] = [];
let pageLoadTime: number | null = null;
let isTracking = false;

/**
 * Rate a Core Web Vital metric against Google's thresholds
 */
export function rateCoreWebVital(
  metric: 'lcp' | 'inp' | 'cls',
  value: number
): CoreWebVitalsRating {
  const thresholds = CORE_WEB_VITALS_THRESHOLDS[metric];
  
  let rating: 'good' | 'needs-improvement' | 'poor';
  if (value <= thresholds.good) {
    rating = 'good';
  } else if (value <= thresholds.needsImprovement) {
    rating = 'needs-improvement';
  } else {
    rating = 'poor';
  }
  
  return { metric, value, rating };
}

/**
 * Observe and track Largest Contentful Paint (LCP)
 * LCP measures loading performance - how quickly the main content loads
 */
export function observeLCP(callback?: (entry: PerformanceEntry) => void): (() => void) | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        currentMetrics.lcp = lastEntry.startTime;
        callback?.(lastEntry);
      }
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    
    return () => observer.disconnect();
  } catch {
    return null;
  }
}

/**
 * Observe and track Interaction to Next Paint (INP)
 * INP measures responsiveness - how quickly the page responds to interactions
 */
export function observeINP(callback?: (entry: PerformanceEntry) => void): (() => void) | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }
  
  try {
    let worstINP = 0;
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // INP is calculated from event timing entries
        const eventEntry = entry as PerformanceEventTiming;
        const inp = eventEntry.processingEnd - eventEntry.startTime;
        
        if (inp > worstINP) {
          worstINP = inp;
          currentMetrics.inp = inp;
          callback?.(entry);
        }
      }
    });
    
    // Type assertion needed as 'event' type is valid but not in TS lib types
    observer.observe({ type: 'event', buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
    
    return () => observer.disconnect();
  } catch {
    return null;
  }
}

/**
 * Observe and track Cumulative Layout Shift (CLS)
 * CLS measures visual stability - how much the layout shifts unexpectedly
 */
export function observeCLS(callback?: (clsValue: number) => void): (() => void) | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }
  
  try {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        
        // Only count shifts without recent user input
        if (!layoutShiftEntry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          
          // If the entry occurred more than 1 second after the last session entry
          // or more than 5 seconds after the first session entry, start a new session
          if (
            firstSessionEntry &&
            lastSessionEntry &&
            (entry.startTime - lastSessionEntry.startTime > 1000 ||
             entry.startTime - firstSessionEntry.startTime > 5000)
          ) {
            // Start new session
            sessionValue = layoutShiftEntry.value;
            sessionEntries = [entry];
          } else {
            sessionValue += layoutShiftEntry.value;
            sessionEntries.push(entry);
          }
          
          // Keep track of the max session value as the CLS
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            currentMetrics.cls = clsValue;
            callback?.(clsValue);
          }
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    return () => observer.disconnect();
  } catch {
    return null;
  }
}

/**
 * Observe First Contentful Paint (FCP) - auxiliary metric
 */
export function observeFCP(callback?: (entry: PerformanceEntry) => void): (() => void) | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }
  
  try {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          currentMetrics.fcp = entry.startTime;
          callback?.(entry);
        }
      }
    });
    
    observer.observe({ type: 'paint', buffered: true });
    
    return () => observer.disconnect();
  } catch {
    return null;
  }
}

/**
 * Get Time to First Byte (TTFB) - auxiliary metric
 */
export function getTTFB(): number | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }
  
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      currentMetrics.ttfb = ttfb;
      return ttfb;
    }
  } catch {
    // Ignore errors
  }
  
  return null;
}

// =============================================================================
// ENGAGEMENT TRACKING
// =============================================================================

/**
 * Track scroll depth
 */
export function trackScrollDepth(): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const updateScrollDepth = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
      
      if (scrollDepth > engagementState.maxScrollDepth) {
        engagementState.maxScrollDepth = scrollDepth;
        
        if (scrollDepth >= ENGAGEMENT_THRESHOLDS.belowFoldThreshold) {
          engagementState.engagedBeyondFold = true;
        }
        
        if (scrollDepth >= ENGAGEMENT_THRESHOLDS.contentEndScrollDepth) {
          engagementState.reachedContentEnd = true;
        }
      }
    }
  };
  
  // Throttle scroll handler
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
}

/**
 * Track time on page
 */
export function trackTimeOnPage(): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  pageLoadTime = Date.now();
  
  const updateTimeOnPage = () => {
    if (pageLoadTime) {
      engagementState.timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
    }
  };
  
  const intervalId = setInterval(updateTimeOnPage, 1000);
  
  // Also update on visibility change to account for tab switches
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      updateTimeOnPage();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * Track user interactions
 */
export function trackInteractions(): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const recordInteraction = (event: InteractionEvent) => {
    interactions.push(event);
    engagementState.interactionCount++;
  };
  
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const elementDesc = getElementDescription(target);
    
    recordInteraction({
      type: 'click',
      element: elementDesc,
      timestamp: Date.now(),
    });
  };
  
  const handleFormFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      const form = target.closest('form');
      const formName = form?.getAttribute('name') || form?.getAttribute('id') || 'unknown-form';
      
      recordInteraction({
        type: 'form_start',
        element: formName,
        timestamp: Date.now(),
      });
    }
  };
  
  const handleFormSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    const formName = form.getAttribute('name') || form.getAttribute('id') || 'unknown-form';
    
    recordInteraction({
      type: 'form_submit',
      element: formName,
      timestamp: Date.now(),
    });
  };
  
  window.addEventListener('click', handleClick, { passive: true });
  window.addEventListener('focusin', handleFormFocus, { passive: true });
  window.addEventListener('submit', handleFormSubmit, { passive: true });
  
  return () => {
    window.removeEventListener('click', handleClick);
    window.removeEventListener('focusin', handleFormFocus);
    window.removeEventListener('submit', handleFormSubmit);
  };
}

/**
 * Get a brief description of an element for tracking
 */
function getElementDescription(element: HTMLElement): string {
  // Try to get meaningful identifier
  const tagName = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const className = element.className 
    ? `.${element.className.split(' ').slice(0, 2).join('.')}`
    : '';
  const ariaLabel = element.getAttribute('aria-label');
  const text = element.textContent?.slice(0, 30).trim();
  
  if (ariaLabel) {
    return `${tagName}[${ariaLabel}]`;
  }
  
  if (id) {
    return `${tagName}${id}`;
  }
  
  if (className) {
    return `${tagName}${className}`;
  }
  
  if (text) {
    return `${tagName}["${text}${text.length > 30 ? '...' : ''}"]`;
  }
  
  return tagName;
}

// =============================================================================
// TRACKING INITIALIZATION
// =============================================================================

/**
 * Initialize all UX signals tracking
 * Returns cleanup function to stop tracking
 */
export function initializeUXSignalsTracking(): () => void {
  if (typeof window === 'undefined' || isTracking) {
    return () => {};
  }
  
  isTracking = true;
  
  // Reset state
  currentMetrics = {};
  engagementState = {
    maxScrollDepth: 0,
    timeOnPage: 0,
    interactionCount: 0,
    engagedBeyondFold: false,
    reachedContentEnd: false,
  };
  interactions = [];
  
  const cleanups: ((() => void) | null)[] = [];
  
  // Core Web Vitals
  cleanups.push(observeLCP());
  cleanups.push(observeINP());
  cleanups.push(observeCLS());
  cleanups.push(observeFCP());
  
  // Get TTFB immediately
  getTTFB();
  
  // Engagement tracking
  cleanups.push(trackScrollDepth());
  cleanups.push(trackTimeOnPage());
  cleanups.push(trackInteractions());
  
  return () => {
    isTracking = false;
    cleanups.forEach(cleanup => cleanup?.());
  };
}

// =============================================================================
// REPORTING
// =============================================================================

/**
 * Get current UX signals report
 */
export function getUXSignalsReport(): UXSignalsReport {
  return {
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageTitle: typeof document !== 'undefined' ? document.title : '',
    timestamp: new Date().toISOString(),
    coreWebVitals: { ...currentMetrics },
    engagement: { ...engagementState },
    interactions: [...interactions],
    deviceType: getDeviceType(),
    connectionType: getConnectionType(),
  };
}

/**
 * Get current Core Web Vitals metrics
 */
export function getCoreWebVitals(): CoreWebVitalsMetrics {
  return { ...currentMetrics };
}

/**
 * Get current engagement metrics
 */
export function getEngagementMetrics(): EngagementMetrics {
  return { ...engagementState };
}

/**
 * Check if user is considered "engaged" based on thresholds
 */
export function isUserEngaged(): boolean {
  return (
    engagementState.maxScrollDepth >= ENGAGEMENT_THRESHOLDS.minEngagedScrollDepth ||
    engagementState.timeOnPage >= ENGAGEMENT_THRESHOLDS.minEngagedTimeOnPage ||
    engagementState.interactionCount >= 3
  );
}

/**
 * Get a simple device type classification
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  
  const width = window.innerWidth;
  if (width < 768) {
    return 'mobile';
  }
  if (width < 1024) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Get connection type if available (Network Information API)
 */
export function getConnectionType(): string | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }
  
  const connection = (navigator as Navigator & {
    connection?: { effectiveType?: string };
  }).connection;
  
  return connection?.effectiveType;
}

// =============================================================================
// GA4 INTEGRATION
// =============================================================================

/**
 * Send Core Web Vitals to GA4
 * Uses the recommended event structure for Google Analytics
 */
export function sendCoreWebVitalsToGA4(): void {
  if (!hasAnalyticsConsent() || globalThis.window === undefined || typeof globalThis.window.gtag !== 'function') {
    return;
  }
  
  const metrics = getCoreWebVitals();
  
  // Send LCP
  if (metrics.lcp !== undefined) {
    const rating = rateCoreWebVital('lcp', metrics.lcp);
    globalThis.window.gtag('event', 'web_vitals', {
      metric_name: 'LCP',
      metric_value: Math.round(metrics.lcp),
      metric_rating: rating.rating,
      metric_delta: Math.round(metrics.lcp),
    });
  }
  
  // Send INP
  if (metrics.inp !== undefined) {
    const rating = rateCoreWebVital('inp', metrics.inp);
    globalThis.window.gtag('event', 'web_vitals', {
      metric_name: 'INP',
      metric_value: Math.round(metrics.inp),
      metric_rating: rating.rating,
      metric_delta: Math.round(metrics.inp),
    });
  }
  
  // Send CLS
  if (metrics.cls !== undefined) {
    const rating = rateCoreWebVital('cls', metrics.cls);
    globalThis.window.gtag('event', 'web_vitals', {
      metric_name: 'CLS',
      metric_value: Math.round(metrics.cls * 1000), // CLS is usually a decimal, scale for GA4
      metric_rating: rating.rating,
      metric_delta: Math.round(metrics.cls * 1000),
    });
  }
  
  // Send FCP (auxiliary)
  if (metrics.fcp !== undefined) {
    globalThis.window.gtag('event', 'web_vitals', {
      metric_name: 'FCP',
      metric_value: Math.round(metrics.fcp),
      metric_delta: Math.round(metrics.fcp),
    });
  }
  
  // Send TTFB (auxiliary)
  if (metrics.ttfb !== undefined) {
    globalThis.window.gtag('event', 'web_vitals', {
      metric_name: 'TTFB',
      metric_value: Math.round(metrics.ttfb),
      metric_delta: Math.round(metrics.ttfb),
    });
  }
}

/**
 * Send engagement metrics to GA4
 */
export function sendEngagementMetricsToGA4(): void {
  if (!hasAnalyticsConsent() || globalThis.window === undefined || typeof globalThis.window.gtag !== 'function') {
    return;
  }
  
  const engagement = getEngagementMetrics();
  
  globalThis.window.gtag('event', 'page_engagement', {
    scroll_depth: engagement.maxScrollDepth,
    time_on_page: engagement.timeOnPage,
    interaction_count: engagement.interactionCount,
    engaged_beyond_fold: engagement.engagedBeyondFold,
    reached_content_end: engagement.reachedContentEnd,
    is_engaged_user: isUserEngaged(),
    device_type: getDeviceType(),
    connection_type: getConnectionType(),
  });
}

/**
 * Track a specific scroll depth milestone
 * Useful for tracking specific engagement points (25%, 50%, 75%, 100%)
 */
export function trackScrollMilestone(depth: number): void {
  if (!hasAnalyticsConsent() || globalThis.window === undefined || typeof globalThis.window.gtag !== 'function') {
    return;
  }
  
  globalThis.window.gtag('event', 'scroll_milestone', {
    scroll_depth: depth,
    page_path: globalThis.window.location.pathname,
    page_title: globalThis.document.title,
  });
}

// =============================================================================
// STRUCTURED DATA GENERATION
// =============================================================================

/**
 * Generate WebPage schema with additional UX-related properties
 * This helps search engines understand page performance characteristics
 */
export function generateWebPageSchema(options: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  breadcrumb?: Array<{ name: string; url: string }>;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: 'en-GB',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Vapourism',
      url: 'https://www.vapourism.co.uk',
    },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.author && {
      author: {
        '@type': 'Organization',
        name: options.author,
      },
    }),
    ...(options.breadcrumb && options.breadcrumb.length > 0 && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: options.breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    }),
    // Speakable specification for voice search optimization
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.product-description', '.main-content'],
    },
  };
  
  return schema;
}

/**
 * Generate SpeakableSpecification schema for voice search
 * Helps Google Assistant and other voice assistants understand content
 */
export function generateSpeakableSchema(options: {
  url: string;
  cssSelectors: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: options.url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: options.cssSelectors,
    },
  };
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Pre-configured scroll depth milestones for tracking
 */
export const SCROLL_MILESTONES = [25, 50, 75, 90, 100];

/**
 * Check if Core Web Vitals are all in "good" range
 */
export function hasGoodCoreWebVitals(): boolean {
  const metrics = getCoreWebVitals();
  
  const lcpGood = metrics.lcp !== undefined && metrics.lcp <= CORE_WEB_VITALS_THRESHOLDS.lcp.good;
  const inpGood = metrics.inp !== undefined && metrics.inp <= CORE_WEB_VITALS_THRESHOLDS.inp.good;
  const clsGood = metrics.cls !== undefined && metrics.cls <= CORE_WEB_VITALS_THRESHOLDS.cls.good;
  
  // Only return true if we have all metrics and they're all good
  return lcpGood && inpGood && clsGood;
}

/**
 * Get a summary rating for Core Web Vitals
 */
export function getCoreWebVitalsSummary(): 'good' | 'needs-improvement' | 'poor' | 'incomplete' {
  const metrics = getCoreWebVitals();
  
  if (metrics.lcp === undefined || metrics.inp === undefined || metrics.cls === undefined) {
    return 'incomplete';
  }
  
  const ratings = [
    rateCoreWebVital('lcp', metrics.lcp),
    rateCoreWebVital('inp', metrics.inp),
    rateCoreWebVital('cls', metrics.cls),
  ];
  
  if (ratings.every(r => r.rating === 'good')) {
    return 'good';
  }
  
  if (ratings.some(r => r.rating === 'poor')) {
    return 'poor';
  }
  
  return 'needs-improvement';
}
