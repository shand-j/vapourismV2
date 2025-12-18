/**
 * React Hook for UX Signals Tracking
 * 
 * Provides easy integration of UX signals tracking for SEO optimization
 * in React components. Handles lifecycle and cleanup automatically.
 * 
 * Usage:
 * ```tsx
 * function MyPage() {
 *   const { metrics, engagement, isEngaged, vitalsRating } = useUXSignals();
 *   
 *   return (
 *     <div>
 *       <p>Scroll depth: {engagement.maxScrollDepth}%</p>
 *       <p>Time on page: {engagement.timeOnPage}s</p>
 *       <p>Core Web Vitals: {vitalsRating}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect, useState, useCallback } from 'react';
import {
  initializeUXSignalsTracking,
  getCoreWebVitals,
  getEngagementMetrics,
  isUserEngaged,
  getCoreWebVitalsSummary,
  sendCoreWebVitalsToGA4,
  sendEngagementMetricsToGA4,
  trackScrollMilestone,
  getDeviceType,
  SCROLL_MILESTONES,
  type CoreWebVitalsMetrics,
  type EngagementMetrics,
} from '../ux-signals';

export interface UseUXSignalsOptions {
  /** Whether to automatically send metrics to GA4 on unmount */
  sendToGA4OnUnmount?: boolean;
  /** Whether to track scroll milestones (25%, 50%, 75%, 90%, 100%) */
  trackScrollMilestones?: boolean;
  /** Custom scroll milestone percentages to track */
  customScrollMilestones?: number[];
  /** Interval in ms to update metrics state (default: 1000) */
  updateInterval?: number;
  /** Whether tracking is enabled (useful for dev mode toggle) */
  enabled?: boolean;
}

export interface UseUXSignalsReturn {
  /** Current Core Web Vitals metrics */
  metrics: CoreWebVitalsMetrics;
  /** Current engagement metrics */
  engagement: EngagementMetrics;
  /** Whether user is considered "engaged" based on thresholds */
  isEngaged: boolean;
  /** Summary rating for Core Web Vitals (good, needs-improvement, poor, incomplete) */
  vitalsRating: 'good' | 'needs-improvement' | 'poor' | 'incomplete';
  /** Current device type */
  deviceType: 'mobile' | 'tablet' | 'desktop';
  /** Manually send Core Web Vitals to GA4 */
  sendVitalsToGA4: () => void;
  /** Manually send engagement metrics to GA4 */
  sendEngagementToGA4: () => void;
  /** Force refresh of current metrics state */
  refreshMetrics: () => void;
}

/**
 * Hook for tracking UX signals in React components
 * 
 * Automatically initializes tracking on mount and cleans up on unmount.
 * Provides real-time access to Core Web Vitals and engagement metrics.
 */
export function useUXSignals(options: UseUXSignalsOptions = {}): UseUXSignalsReturn {
  const {
    sendToGA4OnUnmount = true,
    trackScrollMilestones = true,
    customScrollMilestones,
    updateInterval = 1000,
    enabled = true,
  } = options;

  // State for metrics
  const [metrics, setMetrics] = useState<CoreWebVitalsMetrics>({});
  const [engagement, setEngagement] = useState<EngagementMetrics>({
    maxScrollDepth: 0,
    timeOnPage: 0,
    interactionCount: 0,
    engagedBeyondFold: false,
    reachedContentEnd: false,
  });
  const [engaged, setEngaged] = useState(false);
  const [vitalsRating, setVitalsRating] = useState<'good' | 'needs-improvement' | 'poor' | 'incomplete'>('incomplete');
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(new Set());

  // Manual metric refresh
  const refreshMetrics = useCallback(() => {
    setMetrics(getCoreWebVitals());
    setEngagement(getEngagementMetrics());
    setEngaged(isUserEngaged());
    setVitalsRating(getCoreWebVitalsSummary());
    setDeviceType(getDeviceType());
  }, []);

  // GA4 sending callbacks
  const sendVitalsToGA4 = useCallback(() => {
    sendCoreWebVitalsToGA4();
  }, []);

  const sendEngagementToGA4 = useCallback(() => {
    sendEngagementMetricsToGA4();
  }, []);

  // Initialize tracking and set up interval
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    // Initialize all tracking
    const cleanup = initializeUXSignalsTracking();

    // Set initial device type
    setDeviceType(getDeviceType());

    // Set up periodic metric updates
    const intervalId = setInterval(() => {
      refreshMetrics();
    }, updateInterval);

    // Initial metrics fetch (after a short delay to allow observers to fire)
    const initialFetchTimeout = setTimeout(() => {
      refreshMetrics();
    }, 100);

    return () => {
      cleanup();
      clearInterval(intervalId);
      clearTimeout(initialFetchTimeout);

      // Send to GA4 on unmount if enabled
      if (sendToGA4OnUnmount) {
        sendCoreWebVitalsToGA4();
        sendEngagementMetricsToGA4();
      }
    };
  }, [enabled, updateInterval, refreshMetrics, sendToGA4OnUnmount]);

  // Track scroll milestones
  useEffect(() => {
    if (!enabled || !trackScrollMilestones) {
      return;
    }

    const milestones = customScrollMilestones ?? SCROLL_MILESTONES;
    
    for (const milestone of milestones) {
      if (engagement.maxScrollDepth >= milestone && !trackedMilestones.has(milestone)) {
        trackScrollMilestone(milestone);
        setTrackedMilestones(prev => new Set([...prev, milestone]));
      }
    }
  }, [enabled, trackScrollMilestones, customScrollMilestones, engagement.maxScrollDepth, trackedMilestones]);

  return {
    metrics,
    engagement,
    isEngaged: engaged,
    vitalsRating,
    deviceType,
    sendVitalsToGA4,
    sendEngagementToGA4,
    refreshMetrics,
  };
}

/**
 * Simplified hook that just returns whether tracking is supported
 * Useful for conditional rendering of performance dashboards
 */
export function useUXSignalsSupported(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
      'PerformanceObserver' in window &&
      typeof window.requestAnimationFrame === 'function'
    );
  }, []);

  return supported;
}

/**
 * Hook for tracking a specific scroll depth milestone
 * Returns true when the milestone has been reached
 */
export function useScrollMilestone(milestone: number): boolean {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || reached) {
      return;
    }

    const checkScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
        if (scrollDepth >= milestone) {
          setReached(true);
          trackScrollMilestone(milestone);
        }
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollDepth();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check immediately in case already scrolled
    checkScrollDepth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [milestone, reached]);

  return reached;
}

export default useUXSignals;
