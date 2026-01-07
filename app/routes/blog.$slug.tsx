import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {DEFAULT_BLOG_HANDLE} from '~/lib/shopify-blog';

/**
 * Redirect /blog/:slug to /blogs/news/:slug for backward compatibility
 * Uses 301 permanent redirect for SEO
 */
export async function loader({params}: LoaderFunctionArgs) {
  const {slug} = params;
  
  if (!slug) {
    // Redirect to blog index if no slug
    return redirect(`/blogs/${DEFAULT_BLOG_HANDLE}`, 301);
  }
  
  return redirect(`/blogs/${DEFAULT_BLOG_HANDLE}/${slug}`, 301);
}
