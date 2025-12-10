/**
 * Collections Index Route - REDIRECTS TO SEARCH
 * 
 * The collections listing page now redirects to the main search page.
 * All navigation is handled through tag-based search.
 */

import {redirect} from '@shopify/remix-oxygen';

export async function loader() {
  return redirect('/search', {status: 301});
}
