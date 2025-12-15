/**
 * Nicotine Pouches Collection Page
 * 
 * SEO-optimized main category page for nicotine pouches
 * Target keywords: "nicotine pouches", "snus", "tobacco-free nicotine"
 * Search volume: 22,200+ monthly searches (plus 200k+ from related terms)
 * Difficulty: 38 (medium, achievable)
 * 
 * This is a NEW category opportunity for Vapourism with massive search potential
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for nicotine pouch products using tag-based query
  // Uses Shopify search syntax: space-separated tags with OR operator
  const searchResults = await searchProducts(
    storefront,
    '(tag:nicotine_pouches OR tag:snus)',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Nicotine Pouches';
  const seoTitle = 'Nicotine Pouches UK | Tobacco-Free Nicotine | Vapourism 2025';
  const seoDescription = 'Shop premium nicotine pouches UK. ✓ Velo ✓ Zyn ✓ Nordic Spirit ✓ Tobacco-free ✓ Discreet ✓ Fast UK delivery. Browse 100+ products with best prices.';

  return json({
    products: searchResults.products,
    totalCount: searchResults.totalCount,
    seo: {
      title: seoTitle,
      description: seoDescription,
    },
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [
      {title: 'Nicotine Pouches UK | Vapourism'},
      {name: 'description', content: 'Shop premium nicotine pouches at Vapourism. Wide range of brands including Velo, ZYN, and Nordic Spirit. Fast UK delivery and best prices.'},
      {name: 'robots', content: 'noindex'}
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'nicotine pouches, nicotine pouches uk, snus, velo, zyn, nordic spirit, tobacco free nicotine, nicotine pouches online'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function NicotinePouchesCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  // Track collection view with GA4
  useCollectionTracking({
    products,
    listId: 'collection_nicotine_pouches',
    listName: 'Nicotine Pouches Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Nicotine Pouches UK
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tobacco-free nicotine pouches from leading brands. Discreet, convenient, and available in multiple strengths.
        </p>
      </div>

      {/* Key Benefits - Sleeker Design */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Tobacco-Free</h3>
          <p className="text-sm text-gray-600">Pure nicotine</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Discreet</h3>
          <p className="text-sm text-gray-600">Use anywhere</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Various Strengths</h3>
          <p className="text-sm text-gray-600">3mg - 20mg</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Great Flavors</h3>
          <p className="text-sm text-gray-600">Mint, fruit & more</p>
        </div>
      </div>

      {/* Popular Brands - Above the Fold */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Brand</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link 
            to="/collections/velo-nicotine-pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Velo</h3>
            <p className="text-gray-600 mb-4">Market leader with consistent quality and smooth delivery</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Velo →</span>
          </Link>
          
          <Link 
            to="/collections/zyn-nicotine-pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Zyn</h3>
            <p className="text-gray-600 mb-4">Premium US brand with exceptional flavor profiles</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Zyn →</span>
          </Link>
          
          <Link 
            to="/search?tag=nordic_spirit&tag=nicotine_pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Nordic Spirit</h3>
            <p className="text-gray-600 mb-4">Scandinavian heritage with natural flavors</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Nordic Spirit →</span>
          </Link>
        </div>
      </div>

      {/* Products Grid - Move higher */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {products.length > 0 ? `All Nicotine Pouches (${totalCount})` : 'Nicotine Pouches Coming Soon'}
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all"
              >
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-blue-600 transition line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.vendor}</p>
                  {product.priceRange && (
                    <p className="text-xl font-bold mt-2 text-blue-600">
                      £{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-xl text-gray-600 mb-2 font-semibold">Products arriving soon!</p>
            <p className="text-gray-500">
              We're adding nicotine pouches from Velo, Zyn, and Nordic Spirit to our range.
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Info Sections - Sleek Design */}
      <div className="mb-16 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>What Are Nicotine Pouches?</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-3 text-gray-700">
            <p>
              Nicotine pouches are small, discreet pouches containing nicotine and food-grade ingredients. 
              Unlike traditional snus, they contain <strong>no tobacco</strong>, making them a cleaner 
              alternative for nicotine consumption.
            </p>
            <p>
              Simply place a pouch between your lip and gum, and the nicotine is absorbed through your 
              gum tissue. Each pouch lasts 20-60 minutes and can be disposed of hygienically after use.
            </p>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>How to Use</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50">
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span><strong>Choose Your Strength</strong> - Start with a lower nicotine strength if you're new</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span><strong>Place the Pouch</strong> - Position between your upper lip and gum</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span><strong>Feel the Sensation</strong> - You'll notice a tingling feeling as nicotine is released</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span><strong>Enjoy</strong> - Keep the pouch in for 20-60 minutes</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span><strong>Dispose</strong> - Remove and dispose hygienically</span>
              </li>
            </ol>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Strength Guide</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 border text-left">Strength</th>
                  <th className="px-4 py-3 border text-left">Nicotine</th>
                  <th className="px-4 py-3 border text-left">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Light</td>
                  <td className="px-4 py-2 border">3-6mg</td>
                  <td className="px-4 py-2 border">Beginners</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Regular</td>
                  <td className="px-4 py-2 border">8-11mg</td>
                  <td className="px-4 py-2 border">Moderate users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Strong</td>
                  <td className="px-4 py-2 border">12-17mg</td>
                  <td className="px-4 py-2 border">Heavy users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Extra Strong</td>
                  <td className="px-4 py-2 border">18-20mg</td>
                  <td className="px-4 py-2 border">Very heavy users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>FAQs</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4">
            <div>
              <p className="font-semibold mb-1">Are nicotine pouches legal in the UK?</p>
              <p className="text-gray-700 text-sm">
                Yes, nicotine pouches are completely legal to buy and use in the UK.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Are they the same as snus?</p>
              <p className="text-gray-700 text-sm">
                No. Snus contains tobacco while nicotine pouches are tobacco-free.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">How long does a pouch last?</p>
              <p className="text-gray-700 text-sm">
                Typically 20-60 minutes depending on strength and preference.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Can I use them on a plane?</p>
              <p className="text-gray-700 text-sm">
                Yes! They produce no smoke or vapor, so they're allowed in most places.
              </p>
            </div>
          </div>
        </details>
      </div>

      {/* Related Links - Sleeker Design */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="font-semibold text-xl mb-4 text-center">Related Products</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/search?tag=disposable" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Disposable Vapes
          </Link>
          <Link to="/search?tag=e-liquid" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            E-Liquids
          </Link>
          <Link to="/" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Shop All
          </Link>
        </div>
      </div>
    </div>
  );
}
