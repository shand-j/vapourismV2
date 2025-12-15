/**
 * Lost Mary BM6000 Collection Page
 * 
 * SEO-optimized category page for Lost Mary BM6000 disposable vapes
 * Target keywords: "lost mary bm6000"
 * Search volume: 22,200 monthly searches, difficulty: 17
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Lost Mary BM6000 products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:lost_mary tag:bm6000 tag:disposable',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Lost Mary BM6000';
  const seoTitle = 'Lost Mary BM6000 | 6000 Puff Vape Pods UK | Vapourism 2025';
  const seoDescription = 'Shop Lost Mary BM6000 disposable vape pods. ✓ 6000 puffs ✓ Rechargeable ✓ Premium flavors ✓ Fast UK delivery. Browse the complete range with best prices.';

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
    return [{title: 'Lost Mary BM6000 | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'lost mary bm6000, lost mary 6000 puff, bm6000 vape, lost mary disposable uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function LostMaryBM6000Collection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  // Track collection view with GA4
  useCollectionTracking({
    products,
    listId: 'collection_lost_mary_bm6000',
    listName: 'Lost Mary BM6000 Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Lost Mary BM6000 | 6000 Puff Vape Pods UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience the authentic Lost Mary BM6000 range with 6000 puffs, rechargeable battery, 
          and exceptional flavor quality. The perfect choice for UK vapers seeking convenience and value.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ 6000 Puffs</h3>
          <p className="text-gray-600">Extended usage with consistent flavor</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Rechargeable</h3>
          <p className="text-gray-600">USB-C charging - use every last drop</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Flavors</h3>
          <p className="text-gray-600">Wide selection of authentic Lost Mary flavors</p>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">How to Use Lost Mary BM6000</h2>
        <ol className="space-y-3 ml-4 list-decimal">
          <li className="text-gray-700"><strong>Unbox:</strong> Remove device from packaging</li>
          <li className="text-gray-700"><strong>Remove Cap:</strong> Take off the silicone cap from mouthpiece</li>
          <li className="text-gray-700"><strong>Inhale:</strong> Simply draw on the mouthpiece to activate</li>
          <li className="text-gray-700"><strong>Recharge:</strong> Connect USB-C cable when battery low (LED indicator)</li>
          <li className="text-gray-700"><strong>Dispose:</strong> Recycle responsibly when e-liquid depleted</li>
        </ol>
      </div>

      {/* Specifications */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Lost Mary BM6000 Specifications</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Feature</th>
              <th className="px-4 py-2 border">Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-semibold">Puff Count</td>
              <td className="px-4 py-2 border">Up to 6000 puffs</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Battery</td>
              <td className="px-4 py-2 border">650mAh rechargeable (USB-C)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">E-liquid Capacity</td>
              <td className="px-4 py-2 border">12ml pre-filled</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Nicotine Strength</td>
              <td className="px-4 py-2 border">20mg (2%) nicotine salt</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Activation</td>
              <td className="px-4 py-2 border">Draw-activated (no buttons)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Lost Mary BM6000 Flavors ({totalCount})
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-blue-600 transition">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{product.vendor}</p>
                  {product.priceRange && (
                    <p className="text-lg font-bold mt-2">
                      £{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Products coming soon!</p>
            <p className="text-sm text-gray-500">
              Check back shortly for the complete Lost Mary BM6000 flavor range.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Lost Mary BM6000?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Trusted Brand:</strong> Lost Mary is one of the UK's most popular vape brands</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Exceptional Value:</strong> 6000 puffs provide excellent cost per use</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Rechargeable Design:</strong> Never waste unused e-liquid</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Consistent Performance:</strong> Reliable vapor and flavor from start to finish</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> Meets all UK regulations</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More Lost Mary & Disposable Vapes</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-ultra" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Ultra 25000
          </Link>
          <Link to="/collections/crystal-bar" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Crystal Bar
          </Link>
          <Link to="/collections/elux-legend" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Elux Legend
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Disposables
          </Link>
        </div>
      </div>
    </div>
  );
}
