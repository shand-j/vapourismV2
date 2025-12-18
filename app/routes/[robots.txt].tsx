import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {parseGid} from '@shopify/hydrogen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const {shop} = await context.storefront.query(ROBOTS_QUERY);

  const shopId = parseGid(shop.id).id;
  const body = robotsTxtData({url: url.origin, shopId});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url, shopId}: {shopId?: string; url?: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
${generalDisallowRules({shopId, sitemapUrl})}
`.trim();
}

/**
 * This function generates disallow rules that generally follow what Shopify's
 * Online Store has as defaults for their robots.txt
 */
function generalDisallowRules({
  shopId,
  sitemapUrl,
}: {
  shopId?: string;
  sitemapUrl?: string;
}) {
  return `
# Block crawling of checkout and account pages
Disallow: /checkout
Disallow: /checkout/*
Disallow: /account
Disallow: /account/*
Disallow: /cart
Disallow: /cart/*
Disallow: /orders/*
Disallow: /carts/*
Disallow: /search
Disallow: /search?*

# Block query parameter variations to prevent duplicate content
Disallow: /*?*variant=*
Disallow: /*?*oseid=*
Disallow: /*?*preview_theme_id*
Disallow: /*?*currency=*
Disallow: /*?*after=*
Disallow: /*?*sort=*
Disallow: /*?*tag=*
Disallow: /*?*vendor=*
Disallow: /*?*price_min=*
Disallow: /*?*price_max=*
Disallow: /*?*availability=*
Disallow: /*?*type=*
Disallow: /*?utm_*
Disallow: /*?*utm_*

# Allow crawling of products and pages
Allow: /products/
Allow: /pages/
Allow: /policies/

${shopId ? `Disallow: /${shopId}/checkouts/` : ''}
${shopId ? `Disallow: /${shopId}/orders/` : ''}
${shopId ? `Disallow: /*/checkouts/` : ''}
${shopId ? `Disallow: /*/orders/` : ''}
${shopId ? `Disallow: /*/carts/` : ''}

# Sitemap
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}
`.trim();
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;
