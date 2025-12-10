/**
 * Collection Page Route - REDIRECTS TO SEARCH
 * 
 * All collection URLs now redirect to /search with appropriate tag filters.
 * This maintains backward compatibility with existing URLs/bookmarks.
 * 
 * URL: /collections/:handle → /search?tag=...
 */

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getCollectionRedirectUrl} from '../lib/menu-config';

/**
 * Redirect all collection routes to search with appropriate tags
 */
export async function loader({params}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    // Redirect to main search page
    return redirect('/search', {status: 301});
  }

  // Get the search URL with appropriate tags for this collection
  const redirectUrl = getCollectionRedirectUrl(handle);
  
  if (redirectUrl) {
    return redirect(redirectUrl, {status: 301});
  }

  // For unknown collections, redirect to search with the handle as a query
  return redirect(`/search?q=${encodeURIComponent(handle.replaceAll('-', ' '))}`, {status: 301});
}
