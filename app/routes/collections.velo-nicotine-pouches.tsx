/**
 * Velo Nicotine Pouches Collection Page
 * 
 * SEO-optimized brand page for Velo nicotine pouches
 * Target keywords: "velo", "velo nicotine pouches", "velo pouches uk"
 * Search volume: 27,100 monthly searches
 * Difficulty: 30 (medium, achievable)
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Velo nicotine pouch products using vendor field
  // Vendor filtering is the correct approach for brand-specific pages
  const searchResults = await searchProducts(
    storefront,
    'vendor:Velo tag:nicotine_pouches',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Velo Nicotine Pouches';
  const seoTitle = 'Velo Nicotine Pouches UK | Premium Tobacco-Free | Vapourism 2025';
  const seoDescription = 'Shop Velo nicotine pouches UK. ✓ Tobacco-free ✓ Multiple strengths ✓ Great flavors ✓ Discreet ✓ Fast UK delivery. Browse the complete Velo range.';

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
    return [{title: 'Velo Nicotine Pouches UK | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'velo, velo nicotine pouches, velo pouches uk, velo snus, tobacco free nicotine pouches'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function VeloPouchesCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Velo Nicotine Pouches UK
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          UK's leading nicotine pouch brand with premium tobacco-free satisfaction and exceptional flavors.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Market Leader</h3>
          <p className="text-sm text-gray-600">Most popular brand</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Premium Quality</h3>
          <p className="text-sm text-gray-600">Exceptional flavor</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Wide Range</h3>
          <p className="text-sm text-gray-600">Multiple strengths</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Tobacco-Free</h3>
          <p className="text-sm text-gray-600">Clean experience</p>
        </div>
      </div>

      {/* Products Grid - Move higher */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {products.length > 0 ? `All Velo Nicotine Pouches (${totalCount})` : 'Velo Pouches Coming Soon'}
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
              We're adding the complete Velo range to our collection.
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Info Sections */}
      <div className="mb-16 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>About Velo</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-3 text-gray-700">
            <p>
              Velo is the UK's leading nicotine pouch brand, trusted by thousands of users for its 
              <strong> consistent quality</strong> and <strong>superior flavor profiles</strong>.
            </p>
            <p>
              Each Velo pouch is crafted with pharmaceutical-grade nicotine and natural 
              flavoring to deliver a smooth, satisfying experience without any tobacco.
            </p>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Popular Flavors</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4">
            <div>
              <p className="font-semibold mb-1">Velo Ice Cool</p>
              <p className="text-sm text-gray-700">
                Classic mint flavor with an icy cool sensation. Most popular variant.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Velo Freeze</p>
              <p className="text-sm text-gray-700">
                Intense mint with extra cooling effect. Perfect for strong flavor lovers.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Velo Polar Mint</p>
              <p className="text-sm text-gray-700">
                Smooth spearmint with a cooling finish. Balanced and not too intense.
              </p>
            </div>
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
                  <th className="px-4 py-3 border text-left">Recommended For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Mini</td>
                  <td className="px-4 py-2 border">2mg</td>
                  <td className="px-4 py-2 border">Beginners</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Regular</td>
                  <td className="px-4 py-2 border">4mg</td>
                  <td className="px-4 py-2 border">Light to moderate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Strong</td>
                  <td className="px-4 py-2 border">10mg</td>
                  <td className="px-4 py-2 border">Regular users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo X-Strong</td>
                  <td className="px-4 py-2 border">11mg</td>
                  <td className="px-4 py-2 border">Heavy users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* Related Links */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="font-semibold text-xl mb-4 text-center">Related Products</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/collections/nicotine-pouches" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            All Nicotine Pouches
          </Link>
          <Link to="/collections/zyn-nicotine-pouches" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Zyn Pouches
          </Link>
          <Link to="/search?tag=disposable" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Disposable Vapes
          </Link>
        </div>
      </div>
    </div>
  );
}
