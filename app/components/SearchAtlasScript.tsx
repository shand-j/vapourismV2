/**
 * SearchAtlas OTTO Pixel Script
 * 
 * @deprecated This component is no longer used. The SearchAtlas OTTO pixel is now
 * rendered server-side directly in app/root.tsx <head> section for proper crawler
 * detection. SearchAtlas requires the pixel script to be in <head> and visible to
 * crawlers, which client-side injection via useEffect cannot provide.
 * 
 * Historical note: This component was previously used to load the script client-side
 * only to avoid React hydration mismatches (Error #418), but this approach prevented
 * SearchAtlas from detecting the pixel during crawls.
 * 
 * The fix (December 2025): Moved the script to <head> in app/root.tsx as a static
 * server-rendered tag with async/defer attributes to prevent render blocking.
 */

import {useEffect} from 'react';

interface SearchAtlasScriptProps {
  uuid?: string;
}

export function SearchAtlasScript({
  uuid = 'bc389022-b99a-470f-a7a5-14a7389ffee7',
}: SearchAtlasScriptProps) {
  useEffect(() => {
    // Only run on client side, after hydration
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if (document.getElementById('sa-dynamic-optimization-loader')) {
      return;
    }

    // Create and append the script element
    const script = document.createElement('script');
    script.id = 'sa-dynamic-optimization-loader';
    script.src = 'https://dashboard.searchatlas.com/scripts/dynamic_optimization.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-uuid', uuid);
    script.setAttribute('data-nowprocket', '');
    script.setAttribute('data-nitro-exclude', '');

    // Append to document head
    document.head.appendChild(script);

    // No cleanup needed - the script should persist for the page lifetime
  }, [uuid]);

  // This component doesn't render anything
  return null;
}
