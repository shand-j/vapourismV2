/**
 * Zyn Nicotine Pouches Collection Page
 * 
 * SEO-optimized brand page for Zyn nicotine pouches
 * Target keywords: "zyn", "zyn nicotine pouches", "zyn pouches uk"
 * Search volume: 22,200 monthly searches
 * Difficulty: 40 (medium, achievable)
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Zyn nicotine pouch products using vendor field
  // Vendor filtering is the correct approach for brand-specific pages
  const searchResults = await searchProducts(
    storefront,
    'vendor:Zyn tag:nicotine_pouches',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Zyn Nicotine Pouches';
  const seoTitle = 'Zyn Nicotine Pouches UK | Premium Tobacco-Free Nicotine | Vapourism 2025';
  const seoDescription = 'Shop Zyn nicotine pouches UK. ✓ Premium US brand ✓ Tobacco-free ✓ Great flavors ✓ Multiple strengths ✓ Discreet ✓ Fast UK delivery. Browse the complete Zyn range.';

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
    return [{title: 'Zyn Nicotine Pouches UK | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'zyn, zyn nicotine pouches, zyn pouches uk, zyn snus, tobacco free nicotine pouches'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function ZynPouchesCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Zyn Nicotine Pouches UK
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Premium US brand with exceptional flavors and smooth nicotine delivery. Tobacco-free satisfaction.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Premium Brand</h3>
          <p className="text-sm text-gray-600">Leading US manufacturer</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Exceptional Flavor</h3>
          <p className="text-sm text-gray-600">Authentic profiles</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Smooth Delivery</h3>
          <p className="text-sm text-gray-600">Consistent satisfaction</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Tobacco-Free</h3>
          <p className="text-sm text-gray-600">Clean experience</p>
        </div>
      </div>

      {/* About Zyn */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Zyn Nicotine Pouches</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Zyn is a premium nicotine pouch brand from Swedish Match, one of the world's leading 
            manufacturers of smoke-free nicotine products. Originally launched in the US, Zyn has 
            quickly become a favorite among discerning users for its <strong>exceptional quality</strong> 
            and <strong>authentic flavors</strong>.
          </p>
          <p>
            Each Zyn pouch contains pharmaceutical-grade nicotine and carefully selected natural 
            ingredients to deliver a smooth, satisfying experience. The pouches are designed with 
            a slim, comfortable fit that's virtually unnoticeable when in use.
          </p>
          <p className="font-semibold">
            Zyn's commitment to quality and innovation has made it one of the fastest-growing 
            nicotine pouch brands globally.
          </p>
        </div>
      </div>

      {/* Popular Zyn Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Zyn Flavors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Zyn Spearmint</h3>
            <p className="text-gray-600">
              Classic spearmint flavor with a smooth, refreshing taste. Perfect for those 
              who prefer traditional mint.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Zyn Cool Mint</h3>
            <p className="text-gray-600">
              Crisp peppermint with a cooling sensation. Zyn's most popular flavor 
              for a clean, invigorating experience.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Zyn Citrus</h3>
            <p className="text-gray-600">
              Bright citrus flavor for something different. A fruity alternative 
              to traditional mint pouches.
            </p>
          </div>
        </div>
      </div>

      {/* Zyn Strength Guide */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Zyn Strength Guide</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Strength Level</th>
              <th className="px-4 py-2 border">Nicotine per Pouch</th>
              <th className="px-4 py-2 border">Recommended For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-semibold">Zyn 3mg</td>
              <td className="px-4 py-2 border">3mg</td>
              <td className="px-4 py-2 border">Beginners, light users</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Zyn 6mg</td>
              <td className="px-4 py-2 border">6mg</td>
              <td className="px-4 py-2 border">Regular users, moderate nicotine needs</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Zyn 9mg</td>
              <td className="px-4 py-2 border">9mg</td>
              <td className="px-4 py-2 border">Experienced users, higher tolerance</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-gray-600 mt-4">
          Note: Zyn uses a unique formulation that may feel slightly stronger than equivalent 
          strengths from other brands. Start with a lower strength if you're new to Zyn.
        </p>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Zyn Products ({totalCount})
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
            <p className="text-gray-600 mb-4">Zyn products coming soon!</p>
            <p className="text-sm text-gray-500">
              We're adding Zyn nicotine pouches to our range. Check back shortly.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Zyn */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Zyn?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            
            <span><strong>Premium Quality:</strong> Made by Swedish Match, world leaders in smokeless products</span>
          </li>
          <li className="flex items-start">
            
            <span><strong>Authentic Flavors:</strong> Natural, non-artificial taste profiles</span>
          </li>
          <li className="flex items-start">
            
            <span><strong>Smooth Satisfaction:</strong> Even nicotine release without harshness</span>
          </li>
          <li className="flex items-start">
            
            <span><strong>Comfortable Fit:</strong> Slim design that stays in place</span>
          </li>
          <li className="flex items-start">
            
            <span><strong>Reliable Results:</strong> Consistent experience every time</span>
          </li>
          <li className="flex items-start">
            
            <span><strong>Globally Trusted:</strong> Used by millions worldwide</span>
          </li>
        </ul>
      </div>

      {/* Zyn vs Others */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Zyn vs Other Brands</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Feature</th>
                <th className="px-4 py-2 border">Zyn</th>
                <th className="px-4 py-2 border">Other Brands</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Flavor Quality</td>
                <td className="px-4 py-2 border text-green-600">Natural, authentic</td>
                <td className="px-4 py-2 border">Varies</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Nicotine Delivery</td>
                <td className="px-4 py-2 border text-green-600">Smooth, consistent</td>
                <td className="px-4 py-2 border">Can be harsh</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Pouch Comfort</td>
                <td className="px-4 py-2 border text-green-600">Slim, barely noticeable</td>
                <td className="px-4 py-2 border">Bulkier designs</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Quality Control</td>
                <td className="px-4 py-2 border text-green-600">Pharmaceutical standards</td>
                <td className="px-4 py-2 border">Varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* How to Use Zyn */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Use Zyn Pouches</h2>
        <ol className="space-y-3 ml-4 list-decimal text-gray-700">
          <li><strong>Choose Your Strength:</strong> Start with 3mg or 6mg if you're new to Zyn</li>
          <li><strong>Place Under Lip:</strong> Position the pouch between your upper lip and gum</li>
          <li><strong>Feel the Effect:</strong> Mild tingling is normal - this is nicotine being released</li>
          <li><strong>Enjoy 20-60 Minutes:</strong> Keep the pouch in place for your desired duration</li>
          <li><strong>Dispose Properly:</strong> Remove and throw away - do not swallow the pouch</li>
        </ol>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More Nicotine Pouches</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Nicotine Pouches
          </Link>
          <Link to="/collections/velo-nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Velo Pouches
          </Link>
          <Link to="/search?tag=nordic_spirit" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Nordic Spirit
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Disposable Vapes
          </Link>
        </div>
      </div>
    </div>
  );
}
