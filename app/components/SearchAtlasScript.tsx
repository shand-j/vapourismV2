/**
 * SearchAtlas OTTO Pixel Script
 * 
 * Loads the SearchAtlas SEO optimization script client-side only to avoid:
 * 1. React hydration mismatches (Error #418) - SearchAtlas modifies DOM at runtime
 * 2. CSP violations from dynamically created inline scripts
 * 
 * By loading this script after React hydration completes, we ensure:
 * - React's initial render matches the server
 * - The script can modify the DOM without causing reconciliation errors
 */

import {useEffect} from 'react';

interface SearchAtlasScriptProps {
  uuid?: string;
}

export function SearchAtlasScript({
  uuid = 'd709ea19-b642-442c-ab07-012003668401',
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
