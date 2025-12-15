/**
 * Hayati Pro Ultra Collection Page
 * 
 * SEO-optimized category page for Hayati Pro Ultra disposable vapes
 * Target keywords: "hayati pro ultra", "hayati pro ultra 25000"
 * Search volume: 27,100+ monthly searches
 * Difficulty: 10 (QUICK WIN - low competition)
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati Pro Ultra products using vendor field and product-specific tags
  // Vendor filtering is the correct approach for brand-specific pages
  const searchResults = await searchProducts(
    storefront,
    'vendor:Hayati tag:pro_ultra tag:disposable',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Hayati Pro Ultra';
  const seoTitle = 'Hayati Pro Ultra 25000 | Premium Disposable Vapes UK | Vapourism 2025';
  const seoDescription = 'Shop Hayati Pro Ultra 25000 puff disposable vapes. ✓ 25,000 puffs ✓ Rechargeable ✓ Premium flavors ✓ Fast UK delivery. Browse the complete range with best prices.';

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
    return [{title: 'Hayati Pro Ultra 25000 | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati pro ultra, hayati pro ultra 25000, hayati 25000 puffs, hayati disposable vape uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function HayatiProUltraCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati Pro Ultra 25000 | Premium Disposable Vapes UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience the revolutionary Hayati Pro Ultra 25000 - the ultimate long-lasting disposable 
          vape with an incredible 25,000 puffs. Featuring rechargeable battery, premium flavors, 
          and exceptional value for money.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ 25,000 Puffs</h3>
          <p className="text-gray-600">Extended usage - lasts weeks not days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Rechargeable</h3>
          <p className="text-gray-600">USB-C charging - use every last drop</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Flavors</h3>
          <p className="text-gray-600">Authentic, long-lasting taste profiles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Best Value</h3>
          <p className="text-gray-600">Exceptional cost per puff ratio</p>
        </div>
      </div>

      {/* What Makes Pro Ultra Special */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">What Makes Hayati Pro Ultra Special?</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            The Hayati Pro Ultra 25000 represents the pinnacle of disposable vape technology. 
            With an <strong>unprecedented 25,000 puff capacity</strong>, this device offers 
            exceptional longevity that far exceeds traditional disposables.
          </p>
          <p>
            Each Pro Ultra features a <strong>high-capacity battery</strong> that's fully rechargeable 
            via USB-C, ensuring you can use every drop of e-liquid. The advanced mesh coil technology 
            delivers consistent flavor and vapor production from the first puff to the last.
          </p>
          <p className="font-semibold">
            Whether you're a heavy vaper or simply want the best value, the Hayati Pro Ultra 25000 
            is the ultimate choice for premium disposable vaping in the UK.
          </p>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Use Hayati Pro Ultra 25000</h2>
        <ol className="space-y-3 ml-4 list-decimal text-gray-700">
          <li><strong>Unbox:</strong> Remove device from packaging and any protective caps</li>
          <li><strong>Activate:</strong> Simply inhale from the mouthpiece - no buttons needed</li>
          <li><strong>Monitor Battery:</strong> LED indicator shows battery level</li>
          <li><strong>Recharge When Needed:</strong> Connect USB-C cable to maintain optimal performance</li>
          <li><strong>Enjoy 25,000 Puffs:</strong> Device will naturally deplete after extended use</li>
          <li><strong>Dispose Responsibly:</strong> Recycle at designated e-waste collection points</li>
        </ol>
      </div>

      {/* Specifications */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Hayati Pro Ultra 25000 Specifications</h2>
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
              <td className="px-4 py-2 border font-semibold">Battery</td>
              <td className="px-4 py-2 border">850mAh rechargeable (USB-C)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">E-liquid Capacity</td>
              <td className="px-4 py-2 border">28ml pre-filled</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Nicotine Strength</td>
              <td className="px-4 py-2 border">20mg (2%) nicotine salt</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Coil Type</td>
              <td className="px-4 py-2 border">Advanced mesh coil</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Activation</td>
              <td className="px-4 py-2 border">Draw-activated (no buttons)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Charging</td>
              <td className="px-4 py-2 border">USB-C (cable not included)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Hayati Pro Ultra 25000 Flavors ({totalCount})
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
            <p className="text-gray-600 mb-4">Hayati Pro Ultra products coming soon!</p>
            <p className="text-sm text-gray-500">
              We're adding the complete Hayati Pro Ultra 25000 range. Check back shortly for all flavors.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Pro Ultra */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati Pro Ultra 25000?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Unbeatable Longevity:</strong> 25,000 puffs means weeks of continuous use</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Superior Value:</strong> Lowest cost per puff in the market</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Rechargeable Design:</strong> Never waste unused e-liquid</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Consistent Performance:</strong> Mesh coil maintains flavor quality throughout</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Premium Flavors:</strong> Authentic taste that lasts</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> Meets all UK vaping regulations</span>
          </li>
        </ul>
      </div>

      {/* Comparison with Other Disposables */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Hayati Pro Ultra vs Standard Disposables</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Feature</th>
                <th className="px-4 py-2 border">Hayati Pro Ultra 25000</th>
                <th className="px-4 py-2 border">Standard Disposable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Puff Count</td>
                <td className="px-4 py-2 border text-green-600">25,000 puffs</td>
                <td className="px-4 py-2 border">600-6000 puffs</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Battery</td>
                <td className="px-4 py-2 border text-green-600">Rechargeable 850mAh</td>
                <td className="px-4 py-2 border">Non-rechargeable</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">E-liquid Capacity</td>
                <td className="px-4 py-2 border text-green-600">28ml</td>
                <td className="px-4 py-2 border">2-12ml</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Cost Per Puff</td>
                <td className="px-4 py-2 border text-green-600">Ultra-low</td>
                <td className="px-4 py-2 border">Higher</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Usage Duration</td>
                <td className="px-4 py-2 border text-green-600">2-4 weeks</td>
                <td className="px-4 py-2 border">1-7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How long does 25,000 puffs actually last?</h3>
            <p className="text-gray-700">
              For an average vaper taking 300-500 puffs per day, the Hayati Pro Ultra 25000 will 
              last approximately 2-4 weeks. Heavy users can expect 1-2 weeks, while light users 
              may get a month or more.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How often do I need to charge it?</h3>
            <p className="text-gray-700">
              Typically every 2-3 days depending on usage. The 850mAh battery provides excellent 
              runtime between charges. A full charge takes approximately 1-2 hours via USB-C.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Is it better value than regular disposables?</h3>
            <p className="text-gray-700">
              Absolutely! The Pro Ultra 25000 offers the lowest cost per puff of any disposable 
              vape. You'll save money compared to buying multiple smaller disposables while 
              enjoying consistent premium quality.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">What happens when the 25,000 puffs run out?</h3>
            <p className="text-gray-700">
              The device will naturally stop producing vapor when the e-liquid is depleted. 
              At this point, dispose of it responsibly at an e-waste recycling center.
            </p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More Hayati & High-Capacity Vapes</h3>
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
            All Disposables
          </Link>
        </div>
      </div>
    </div>
  );
}
