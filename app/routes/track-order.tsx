import {redirect, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Track Your Order | Vapourism Order Status'},
  {
    name: 'description',
    content: 'Track your Vapourism order status and delivery. Enter your order number and email to view real-time shipping updates and estimated delivery dates.',
  },
];

/**
 * Track Order Redirect
 * 
 * Redirects to Shopify's hosted order status page.
 * Users can enter their order number and email on Shopify's hosted page.
 */
export async function loader({context}: LoaderFunctionArgs) {
  // Get shop domain from environment or context
  const shopDomain = context.env?.PUBLIC_STORE_DOMAIN || 'vapourism.co.uk';
  
  // Redirect to Shopify's hosted order status lookup
  // This is the standard Shopify order status URL pattern
  return redirect(`https://${shopDomain}/account/orders`, {
    status: 301,
  });
}

export default function TrackOrder() {
  // This component won't render as loader always redirects
  return null;
}
