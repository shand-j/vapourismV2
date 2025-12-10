import {redirect} from '@shopify/remix-oxygen';

/**
 * Help Redirect
 * 
 * Redirects to the FAQ page which serves as the main help resource.
 */
export async function loader() {
  return redirect('/faq', {
    status: 301,
  });
}

export default function Help() {
  // This component won't render as loader always redirects
  return null;
}
