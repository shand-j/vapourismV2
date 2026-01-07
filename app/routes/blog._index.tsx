import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {DEFAULT_BLOG_HANDLE} from '~/lib/shopify-blog';

/**
 * Redirect /blog to /blogs/news for backward compatibility
 * Uses 301 permanent redirect for SEO
 */
export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.search;
  
  // Preserve query params (e.g., pagination params like ?after=)
  return redirect(`/blogs/${DEFAULT_BLOG_HANDLE}${searchParams}`, 301);
}
