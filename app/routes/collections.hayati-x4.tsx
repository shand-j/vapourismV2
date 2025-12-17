/**
 * Hayati X4 Collection Page
 * 
 * SEO-optimized category page for Hayati X4 pod system devices
 * Target keywords: "hayati x4", "hayati x4 device"
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati X4 device products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:hayati tag:x4 tag:device',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Hayati X4';
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
      {title: 'Hayati X4 | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati x4, hayati x4 device, pod system uk, refillable vape uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://www.vapourism.co.uk/collections/hayati-x4'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
  ];
};

export default function HayatiX4Collection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_hayati_x4',
    listName: 'Hayati X4 Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati X4 | Premium Pod System UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience the Hayati X4 pod system - a versatile, refillable device designed for use with 
          Hayati Pro Max e-liquids. Compact design with powerful performance.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Refillable Pods</h3>
          <p className="text-gray-600">Easy-fill system for your favorite e-liquids</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Compact Design</h3>
          <p className="text-gray-600">Pocket-friendly and portable</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Long Battery Life</h3>
          <p className="text-gray-600">All-day vaping with USB-C charging</p>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Hayati X4 Specifications</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Feature</th>
              <th className="px-4 py-2 border">Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-semibold">Pod Capacity</td>
              <td className="px-4 py-2 border">2ml refillable</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Battery Capacity</td>
              <td className="px-4 py-2 border">650mAh rechargeable</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Charging</td>
              <td className="px-4 py-2 border">USB-C fast charging</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Coil Resistance</td>
              <td className="px-4 py-2 border">1.2Ω mesh coil</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Activation</td>
              <td className="px-4 py-2 border">Draw-activated</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Design</td>
              <td className="px-4 py-2 border">Compact, lightweight, ergonomic</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Hayati X4 Devices & Pods ({totalCount})
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
              Check back shortly for Hayati X4 devices and pods.
            </p>
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-blue-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">How to Use Your Hayati X4</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li><strong>Charge Your Device:</strong> Connect USB-C cable and charge until indicator shows full</li>
          <li><strong>Fill the Pod:</strong> Remove pod, open fill port, add Hayati Pro Max e-liquid</li>
          <li><strong>Prime the Coil:</strong> Wait 3-5 minutes before first use</li>
          <li><strong>Vape:</strong> Simply draw on the mouthpiece - no buttons required</li>
          <li><strong>Maintain:</strong> Replace pod when flavor diminishes</li>
        </ol>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati X4?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Cost-Effective:</strong> Refillable pods save money vs disposables</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Eco-Friendly:</strong> Reduce waste with refillable system</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Versatile:</strong> Use any 10ml e-liquid (optimized for Hayati Pro Max)</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Beginner-Friendly:</strong> Simple draw-activated operation</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> Meets all UK vaping regulations</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Related Collections</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-max" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Max E-Liquids
          </Link>
          <Link to="/collections/hayati-remix" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Remix Device
          </Link>
          <Link to="/search?tag=device" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
