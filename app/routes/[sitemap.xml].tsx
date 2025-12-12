import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
  });

  // No caching during debugging
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  return response;
}
