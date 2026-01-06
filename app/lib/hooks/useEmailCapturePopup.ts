/**
 * Email Capture Popup Manager Hook
 * 
 * Manages when to show the email capture popup based on different triggers:
 * - Exit intent (mouse leaving viewport)
 * - Timer (after X seconds on site)
 * - Manual trigger (e.g., search page landing)
 * 
 * Respects "already shown" cookie to prevent annoying repeat displays.
 */

import {useState, useEffect, useCallback, useRef} from 'react';
import {hasEmailCaptureBeenShown} from '~/components/EmailCapturePopup';

export interface UseEmailCapturePopupOptions {
  /**
   * Enable exit intent detection (mouse leaving viewport)
   * Default: false
   */
  enableExitIntent?: boolean;
  
  /**
   * Enable timer-based trigger (show after X seconds)
   * Default: false
   */
  enableTimer?: boolean;
  
  /**
   * Timer duration in milliseconds
   * Default: 30000 (30 seconds)
   */
  timerDuration?: number;
  
  /**
   * Show immediately on mount (e.g., for search page)
   * Default: false
   */
  showImmediately?: boolean;
  
  /**
   * Trigger identifier for analytics
   */
  trigger?: 'exit' | 'timer' | 'search' | 'manual';
}

export function useEmailCapturePopup(options: UseEmailCapturePopupOptions = {}) {
  const {
    enableExitIntent = false,
    enableTimer = false,
    timerDuration = 30000,
    showImmediately = false,
    trigger = 'manual',
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const hasShownRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if popup should be shown at all
  const shouldShow = useCallback(() => {
    // Don't show if already shown in this session
    if (hasShownRef.current) return false;
    
    // Don't show if already shown before (from cookie)
    if (hasEmailCaptureBeenShown()) return false;
    
    return true;
  }, []);

  // Show the popup
  const showPopup = useCallback(() => {
    if (!shouldShow()) return;
    
    setIsOpen(true);
    hasShownRef.current = true;
    
    // Track popup view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_capture_view', {
        trigger,
      });
    }
  }, [shouldShow, trigger]);

  // Close the popup
  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Exit intent detection
  useEffect(() => {
    if (!enableExitIntent) return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableExitIntent, showPopup]);

  // Timer-based trigger
  useEffect(() => {
    if (!enableTimer) return;
    
    timerRef.current = setTimeout(() => {
      showPopup();
    }, timerDuration);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enableTimer, timerDuration, showPopup]);

  // Immediate trigger (e.g., search page landing)
  useEffect(() => {
    if (!showImmediately) return;
    
    // Small delay to prevent flash
    const timer = setTimeout(() => {
      showPopup();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [showImmediately, showPopup]);

  return {
    isOpen,
    closePopup,
    showPopup,
    trigger,
  };
}
