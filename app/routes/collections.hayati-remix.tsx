/**
 * Hayati Remix Collection Page
 * 
 * SEO-optimized category page for Hayati Remix pod system devices
 * Target keywords: "hayati remix", "hayati remix device"
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati Remix device products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:hayati tag:remix tag:device',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Hayati Remix';
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
      {title: 'Hayati Remix | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati remix, hayati remix device, pod system uk, refillable vape uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function HayatiRemixCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_hayati_remix',
    listName: 'Hayati Remix Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati Remix | Premium Pod System UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the Hayati Remix pod system - an advanced refillable device designed for use with 
          Hayati Pro Max e-liquids. Modern design meets exceptional performance.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Advanced Pod System</h3>
          <p className="text-gray-600">Easy-fill refillable pods with leak-resistant design</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Enhanced Battery</h3>
          <p className="text-gray-600">Extended battery life for all-day use</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Build</h3>
          <p className="text-gray-600">Stylish design with durable construction</p>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Hayati Remix Specifications</h2>
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
              <td className="px-4 py-2 border">800mAh rechargeable</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Charging</td>
              <td className="px-4 py-2 border">USB-C fast charging</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Coil Resistance</td>
              <td className="px-4 py-2 border">1.0Ω/1.2Ω mesh coil options</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Activation</td>
              <td className="px-4 py-2 border">Draw-activated with LED indicator</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Design</td>
              <td className="px-4 py-2 border">Sleek, modern, ergonomic grip</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Device Comparison */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Hayati Remix vs X4</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Feature</th>
                <th className="px-4 py-2 border">Remix</th>
                <th className="px-4 py-2 border">X4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Battery</td>
                <td className="px-4 py-2 border">800mAh</td>
                <td className="px-4 py-2 border">650mAh</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Coil Options</td>
                <td className="px-4 py-2 border">1.0Ω/1.2Ω</td>
                <td className="px-4 py-2 border">1.2Ω</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Design</td>
                <td className="px-4 py-2 border">Modern, LED indicator</td>
                <td className="px-4 py-2 border">Compact, minimal</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Best For</td>
                <td className="px-4 py-2 border">Power users, variety</td>
                <td className="px-4 py-2 border">Simplicity, portability</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link to="/collections/hayati-x4" className="text-blue-600 hover:underline font-semibold">
            Compare with Hayati X4 →
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Hayati Remix Devices & Pods ({totalCount})
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
              Check back shortly for Hayati Remix devices and pods.
            </p>
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-blue-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">How to Use Your Hayati Remix</h2>
        <ol className="space-y-3 list-decimal list-inside">
          <li><strong>Charge Your Device:</strong> Connect USB-C cable and charge until LED shows full</li>
          <li><strong>Insert Pod:</strong> Click the refillable pod into place</li>
          <li><strong>Fill the Pod:</strong> Remove pod, open side-fill port, add Hayati Pro Max e-liquid</li>
          <li><strong>Prime the Coil:</strong> Wait 5 minutes for optimal saturation</li>
          <li><strong>Vape:</strong> Draw on the mouthpiece - device activates automatically</li>
          <li><strong>Monitor:</strong> LED indicator shows battery level and activation</li>
        </ol>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati Remix?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Superior Battery:</strong> 800mAh for extended vaping sessions</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Coil Variety:</strong> Choose 1.0Ω or 1.2Ω for your preference</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Modern Design:</strong> Sleek aesthetics with LED feedback</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Cost-Effective:</strong> Refillable pods dramatically reduce ongoing costs</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Optimized for Hayati:</strong> Works perfectly with Pro Max e-liquids</span>
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
          <Link to="/collections/hayati-x4" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati X4 Device
          </Link>
          <Link to="/search?tag=device" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Devices
          </Link>
        </div>
      </div>
    </div>
  );
}
