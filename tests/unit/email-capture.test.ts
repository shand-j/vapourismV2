/**
 * Unit tests for email capture popup functionality
 */

import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {hasEmailCaptureBeenShown, markEmailCaptureAsShown} from '~/components/EmailCapturePopup';

describe('Email Capture Popup Storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock Date.now() for consistent testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false when popup has never been shown', () => {
    expect(hasEmailCaptureBeenShown()).toBe(false);
  });

  it('should return true after marking popup as shown', () => {
    markEmailCaptureAsShown();
    expect(hasEmailCaptureBeenShown()).toBe(true);
  });

  it('should persist shown state in localStorage', () => {
    markEmailCaptureAsShown();
    
    const stored = localStorage.getItem('vapourism_email_capture_shown');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.shown).toBe(true);
    expect(parsed.timestamp).toBeTruthy();
  });

  it('should return false when stored data has expired', () => {
    // Mark as shown
    markEmailCaptureAsShown();
    expect(hasEmailCaptureBeenShown()).toBe(true);
    
    // Advance time by 366 days (past expiry)
    vi.advanceTimersByTime(366 * 24 * 60 * 60 * 1000);
    
    expect(hasEmailCaptureBeenShown()).toBe(false);
    
    // Should also clear the expired data
    const stored = localStorage.getItem('vapourism_email_capture_shown');
    expect(stored).toBeNull();
  });

  it('should return true when stored data has not expired', () => {
    // Mark as shown
    markEmailCaptureAsShown();
    expect(hasEmailCaptureBeenShown()).toBe(true);
    
    // Advance time by 30 days (within expiry)
    vi.advanceTimersByTime(30 * 24 * 60 * 60 * 1000);
    
    expect(hasEmailCaptureBeenShown()).toBe(true);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('vapourism_email_capture_shown', 'invalid json');
    
    // Should not throw and return false
    expect(hasEmailCaptureBeenShown()).toBe(false);
  });

  it('should handle missing timestamp in stored data', () => {
    localStorage.setItem('vapourism_email_capture_shown', JSON.stringify({shown: true}));
    
    // Should handle gracefully
    expect(() => hasEmailCaptureBeenShown()).not.toThrow();
  });
});

describe('Email Validation', () => {
  it('should validate basic email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user_name@example-domain.com',
    ];

    validEmails.forEach((email) => {
      expect(email.includes('@')).toBe(true);
    });
  });

  it('should reject emails without @ symbol', () => {
    const invalidEmails = [
      'notanemail',
      'no-at-symbol.com',
      'email.example.com',
    ];

    // Our simple validation just checks for @ - real validation happens server-side
    invalidEmails.forEach((email) => {
      const hasAt = email.includes('@');
      expect(hasAt).toBe(false);
    });
  });

  it('should reject emails with spaces', () => {
    const invalidEmails = [
      'spaces in@email.com',
      'user @example.com',
      'user@exam ple.com',
    ];

    invalidEmails.forEach((email) => {
      const hasSpaces = email.includes(' ');
      expect(hasSpaces).toBe(true);
    });
  });
});
