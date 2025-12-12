import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

// Direct query to debug sitemap API
const SITEMAP_DEBUG_QUERY = `#graphql
  query SitemapDebug($page: Int!) {
    sitemap(type: PRODUCT) {
      resources(page: $page) {
        items {
          handle
          updatedAt
        }
      }
      pagesCount {
        count
      }
    }
  }
` as const;

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  // Debug: Check what the sitemap API actually returns
  const url = new URL(request.url);
  if (url.searchParams.get('debug') === 'true' && params.type === 'products') {
    const page = Number.parseInt(params.page || '1', 10);
    const debugData = await storefront.query(SITEMAP_DEBUG_QUERY, {
      variables: { page },
    });
    return new Response(JSON.stringify(debugData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }

  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-GB'],
    getLink: ({type, baseUrl, handle, locale}) => {
      // Handle empty/missing handle - return baseUrl (homepage)
      if (!handle) return baseUrl;
      
      // Build the canonical URL path
      const path = `${baseUrl}/${type}/${handle}`;
      
      return path;
    },
  });

  // No caching for sitemaps during debugging - remove after fix confirmed
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  return response;
}
