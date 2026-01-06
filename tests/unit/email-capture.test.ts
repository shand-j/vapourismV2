/**
 * Unit tests for email capture popup functionality
 */

import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {hasEmailCaptureBeenShown, markEmailCaptureAsShown} from '~/components/EmailCapturePopup';
import {isValidEmail, normalizeEmail} from '~/lib/email-validation';

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
  it('should validate basic email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user_name@example-domain.com',
      'a@b.c',
      '123@456.com',
    ];

    validEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('should reject emails without @ symbol', () => {
    const invalidEmails = [
      'notanemail',
      'no-at-symbol.com',
      'email.example.com',
      '',
      'test',
    ];

    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('should reject emails with spaces', () => {
    const invalidEmails = [
      'spaces in@email.com',
      'user @example.com',
      'user@exam ple.com',
    ];

    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('should reject malformed email addresses', () => {
    const invalidEmails = [
      'a@',
      '@b.com',
      'a@@b.com',
      'user@',
      '@example.com',
    ];

    invalidEmails.forEach((email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('should reject emails that are too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(isValidEmail(longEmail)).toBe(false);
  });

  it('should normalize emails correctly', () => {
    expect(normalizeEmail('Test@Example.COM')).toBe('test@example.com');
    expect(normalizeEmail('  user@domain.com  ')).toBe('user@domain.com');
    expect(normalizeEmail('User.Name@Example.Co.UK')).toBe('user.name@example.co.uk');
  });
});
