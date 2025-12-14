/**
 * Hayati Pro Max Collection Page
 * 
 * SEO-optimized category page for Hayati Pro Max disposable vapes
 * Target keywords: "hayati pro max"
 * Search volume: 22,200 monthly searches, difficulty: 16
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati Pro Max products
  const searchResults = await searchProducts(
    storefront,
    '',
    ['hayati', 'pro_max', 'disposable'],
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Hayati Pro Max';
  const seoTitle = SEOAutomationService.generateCategoryTitle(categoryTitle, searchResults.totalCount);
  const seoDescription = SEOAutomationService.generateCategoryMetaDescription(
    categoryTitle,
    searchResults.totalCount,
    topBrands
  );

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
      {title: 'Hayati Pro Max | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati pro max, hayati pro max 6000, hayati disposable vape, long lasting vape uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function HayatiProMaxCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati Pro Max | Long-Lasting Vapes UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the Hayati Pro Max range with extended battery life and premium flavor delivery. 
          Perfect for vapers seeking reliable, long-lasting disposable devices.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Extended Capacity</h3>
          <p className="text-gray-600">Long-lasting performance with high puff count</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Rechargeable Battery</h3>
          <p className="text-gray-600">USB-C charging for maximum value</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Build</h3>
          <p className="text-gray-600">High-quality construction and design</p>
        </div>
      </div>

      {/* Comparison with Pro Ultra */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Hayati Pro Max vs Pro Ultra</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Feature</th>
                <th className="px-4 py-2 border">Pro Max</th>
                <th className="px-4 py-2 border">Pro Ultra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Puff Count</td>
                <td className="px-4 py-2 border">6,000-8,000 puffs</td>
                <td className="px-4 py-2 border">Up to 25,000 puffs</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Size</td>
                <td className="px-4 py-2 border">Compact & portable</td>
                <td className="px-4 py-2 border">Larger capacity</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Best For</td>
                <td className="px-4 py-2 border">Daily carry, convenience</td>
                <td className="px-4 py-2 border">Maximum longevity</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link to="/collections/hayati-pro-ultra" className="text-blue-600 hover:underline font-semibold">
            Compare with Hayati Pro Ultra 25000 →
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Hayati Pro Max Products ({totalCount})
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
              Check back shortly for the complete Hayati Pro Max range.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati Pro Max?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Portable Design:</strong> Perfect size for everyday carry</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Reliable Performance:</strong> Consistent vapor production throughout device life</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Authentic Hayati Quality:</strong> Premium construction and materials</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Wide Flavor Selection:</strong> Something for every taste preference</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Related Collections</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-ultra" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Ultra 25000
          </Link>
          <Link to="/collections/lost-mary-bm6000" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Lost Mary BM6000
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Disposables
          </Link>
        </div>
      </div>
    </div>
  );
}
