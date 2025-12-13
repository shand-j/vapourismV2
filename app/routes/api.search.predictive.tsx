/**
 * Predictive Search API Route
 * 
 * Endpoint: /api/search/predictive?q=query
 * Returns autocomplete results from Shopify predictive search
 */

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {predictiveSearch} from '../lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {searchParams} = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return json({
      products: [],
      collections: [], // Empty - collections not used
      queries: [],
    });
  }

  try {
    const results = await predictiveSearch(
      context.storefront,
      query,
      10, // limit per type
      ['PRODUCT', 'QUERY'] // Exclude collections - not used in this store
    );

    return json(results, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Predictive search API error:', error);
    
    return json(
      {
        products: [],
        collections: [], // Empty - collections not used
        queries: [],
        error: 'Search failed',
      },
      {status: 500}
    );
  }
}
