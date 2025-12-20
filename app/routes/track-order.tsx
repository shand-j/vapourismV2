import {redirect, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';

/**
 * Track Order Redirect
 * 
 * Redirects to the account orders page where users can view their order history.
 * Uses a relative redirect to avoid redirect chains that could occur with external URLs.
 */

export const meta: MetaFunction = () => [
  {title: 'Track Order | Vapourism'},
  {name: 'robots', content: 'noindex, nofollow'},
];

export async function loader({context}: LoaderFunctionArgs) {
  // Redirect to the account orders page on the same domain
  // Using a relative URL avoids redirect chains that would occur
  // if we redirected to an external domain (e.g., myshopify.com)
  // which would then redirect back to the canonical domain
  return redirect('/account/orders', {
    status: 301,
  });
}

export default function TrackOrder() {
  // This component won't render as loader always redirects
  return null;
}
