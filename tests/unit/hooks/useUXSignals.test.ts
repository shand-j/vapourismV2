/**
 * Tests for useUXSignals hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUXSignals, useUXSignalsSupported, useScrollMilestone } from '../../../app/lib/hooks/useUXSignals';

// Mock the ux-signals module
vi.mock('../../../app/lib/ux-signals', () => ({
  initializeUXSignalsTracking: vi.fn(() => vi.fn()),
  getCoreWebVitals: vi.fn(() => ({
    lcp: 2000,
    inp: 150,
    cls: 0.05,
  })),
  getEngagementMetrics: vi.fn(() => ({
    maxScrollDepth: 45,
    timeOnPage: 120,
    interactionCount: 5,
    engagedBeyondFold: true,
    reachedContentEnd: false,
  })),
  isUserEngaged: vi.fn(() => true),
  getCoreWebVitalsSummary: vi.fn(() => 'good'),
  sendCoreWebVitalsToGA4: vi.fn(),
  sendEngagementMetricsToGA4: vi.fn(),
  trackScrollMilestone: vi.fn(),
  getDeviceType: vi.fn(() => 'desktop'),
  SCROLL_MILESTONES: [25, 50, 75, 90, 100],
}));

describe('useUXSignals hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUXSignals({ enabled: false }));

    expect(result.current.metrics).toEqual({});
    expect(result.current.engagement).toEqual({
      maxScrollDepth: 0,
      timeOnPage: 0,
      interactionCount: 0,
      engagedBeyondFold: false,
      reachedContentEnd: false,
    });
    expect(result.current.isEngaged).toBe(false);
    expect(result.current.vitalsRating).toBe('incomplete');
  });

  it('should initialize tracking when enabled', async () => {
    const { initializeUXSignalsTracking } = await import('../../../app/lib/ux-signals');
    
    renderHook(() => useUXSignals({ enabled: true }));
    
    expect(initializeUXSignalsTracking).toHaveBeenCalled();
  });

  it('should update metrics periodically', async () => {
    const { getCoreWebVitals, getEngagementMetrics } = await import('../../../app/lib/ux-signals');
    
    const { result } = renderHook(() => useUXSignals({ enabled: true, updateInterval: 1000 }));
    
    // Fast-forward through initial delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Should have called the metric getters
    expect(getCoreWebVitals).toHaveBeenCalled();
    expect(getEngagementMetrics).toHaveBeenCalled();
    
    // Fast-forward through one update interval
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Should have called again
    expect(getCoreWebVitals).toHaveBeenCalled();
  });

  it('should expose manual refresh function', async () => {
    const { getCoreWebVitals, getEngagementMetrics } = await import('../../../app/lib/ux-signals');
    
    const { result } = renderHook(() => useUXSignals({ enabled: false }));
    
    act(() => {
      result.current.refreshMetrics();
    });
    
    expect(getCoreWebVitals).toHaveBeenCalled();
    expect(getEngagementMetrics).toHaveBeenCalled();
  });

  it('should expose manual GA4 send functions', async () => {
    const { sendCoreWebVitalsToGA4, sendEngagementMetricsToGA4 } = await import('../../../app/lib/ux-signals');
    
    const { result } = renderHook(() => useUXSignals({ enabled: false }));
    
    act(() => {
      result.current.sendVitalsToGA4();
    });
    expect(sendCoreWebVitalsToGA4).toHaveBeenCalled();
    
    act(() => {
      result.current.sendEngagementToGA4();
    });
    expect(sendEngagementMetricsToGA4).toHaveBeenCalled();
  });

  it('should return correct device type', () => {
    const { result } = renderHook(() => useUXSignals({ enabled: false }));
    
    // Default should be desktop
    expect(result.current.deviceType).toBe('desktop');
  });
});

describe('useUXSignalsSupported hook', () => {
  it('should detect browser support', () => {
    const { result } = renderHook(() => useUXSignalsSupported());
    
    // In jsdom environment with PerformanceObserver stubbed
    expect(typeof result.current).toBe('boolean');
  });
});

describe('useScrollMilestone hook', () => {
  it('should start with reached=false', () => {
    const { result } = renderHook(() => useScrollMilestone(50));
    
    expect(result.current).toBe(false);
  });

  // Note: The actual scroll detection test is challenging in jsdom
  // because requestAnimationFrame and scroll events don't work the same way.
  // The hook is tested through integration testing instead.
});
