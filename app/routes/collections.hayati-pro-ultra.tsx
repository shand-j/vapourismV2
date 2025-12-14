/**
 * Hayati Pro Ultra Collection Page
 * 
 * SEO-optimized category page for Hayati Pro Ultra 25000 puff disposable vapes
 * Target keywords: "hayati pro ultra", "hayati pro ultra 25000"
 * Search volume: 27,100 monthly searches, difficulty: 10
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati Pro Ultra products using tag filtering
  const searchResults = await searchProducts(
    storefront,
    '',
    ['hayati', 'pro_ultra', 'disposable'],
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  // Get top brands for SEO
  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);

  // Generate SEO metadata
  const categoryTitle = 'Hayati Pro Ultra';
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
      {title: 'Hayati Pro Ultra | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati pro ultra, hayati pro ultra 25000, 25000 puff vape, hayati disposable, premium disposable vape uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
  ];
};

export default function HayatiProUltraCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati Pro Ultra 25000 | Premium Disposable Vapes UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Shop the complete range of Hayati Pro Ultra 25000 puff disposable vapes. 
          Experience exceptional flavor and unmatched longevity with up to 25,000 puffs per device.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ 25,000 Puffs</h3>
          <p className="text-gray-600">Extended usage with industry-leading puff capacity</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Flavors</h3>
          <p className="text-gray-600">Wide selection of authentic and exotic flavor profiles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Fast UK Delivery</h3>
          <p className="text-gray-600">Quick dispatch with tracked shipping</p>
        </div>
      </div>

      {/* Product Comparison Table */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Hayati Pro Ultra Specifications</h2>
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
              <td className="px-4 py-2 border">Up to 25,000 puffs</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Battery Capacity</td>
              <td className="px-4 py-2 border">Rechargeable (USB-C)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">E-liquid Capacity</td>
              <td className="px-4 py-2 border">20ml pre-filled</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Nicotine Strength</td>
              <td className="px-4 py-2 border">20mg (2%) nicotine salt</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Design</td>
              <td className="px-4 py-2 border">Compact, pocket-friendly, LED display</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Browse All Hayati Pro Ultra Products ({totalCount})
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
              Check back shortly for the complete Hayati Pro Ultra range.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati Pro Ultra?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Industry-Leading Capacity:</strong> 25,000 puffs provide exceptional value and longevity</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Authentic Flavors:</strong> Premium e-liquid formulations for consistent taste</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Rechargeable Design:</strong> USB-C charging ensures you use every last puff</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>LED Display:</strong> Battery and e-liquid level indicators</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> Meets all UK vaping regulations</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Related Categories</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-max" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Max
          </Link>
          <Link to="/collections/lost-mary-bm6000" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Lost Mary BM6000
          </Link>
          <Link to="/collections/crystal-bar" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Crystal Bar
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Disposable Vapes
          </Link>
        </div>
      </div>
    </div>
  );
}
