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
  
  // Search for Velo nicotine pouch products using tag-based query
  // Space-separated tags = implicit AND (tag:velo AND tag:nicotine_pouches)
  const searchResults = await searchProducts(
    storefront,
    'tag:velo tag:nicotine_pouches',
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Velo Nicotine Pouches UK | Premium Tobacco-Free
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience the UK's leading nicotine pouch brand. Velo offers a premium, tobacco-free 
          alternative with exceptional flavors and a range of nicotine strengths to suit every preference.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Market Leader</h3>
          <p className="text-gray-600">UK's most popular nicotine pouch brand</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Quality</h3>
          <p className="text-gray-600">Exceptional flavor and nicotine delivery</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Wide Range</h3>
          <p className="text-gray-600">Multiple strengths and flavors available</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Tobacco-Free</h3>
          <p className="text-gray-600">Clean, modern nicotine experience</p>
        </div>
      </div>

      {/* About Velo */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Velo Nicotine Pouches</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Velo is the UK's leading nicotine pouch brand, trusted by thousands of users for its 
            <strong> consistent quality</strong> and <strong>superior flavor profiles</strong>. 
            Formerly known as Lyft, Velo has established itself as the premium choice for 
            tobacco-free nicotine satisfaction.
          </p>
          <p>
            Each Velo pouch is carefully crafted with pharmaceutical-grade nicotine and natural 
            flavoring to deliver a smooth, satisfying experience without any tobacco. The pouches 
            are designed to be discreet, comfortable, and long-lasting.
          </p>
          <p className="font-semibold">
            Whether you're looking for a light, regular, or strong nicotine hit, Velo has the 
            perfect strength to match your needs.
          </p>
        </div>
      </div>

      {/* Popular Velo Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Velo Flavors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Velo Ice Cool</h3>
            <p className="text-gray-600">
              Classic mint flavor with an icy cool sensation. The most popular Velo variant 
              for a refreshing nicotine experience.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Velo Freeze</h3>
            <p className="text-gray-600">
              Intense mint with extra cooling effect. Perfect for those who love a strong, 
              refreshing flavor.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="font-bold text-xl mb-2">Velo Polar Mint</h3>
            <p className="text-gray-600">
              Smooth spearmint with a cooling finish. A balanced mint flavor that's not 
              too intense.
            </p>
          </div>
        </div>
      </div>

      {/* Velo Strength Guide */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Velo Strength Guide</h2>
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
              <td className="px-4 py-2 border font-semibold">Velo Mini (2mg)</td>
              <td className="px-4 py-2 border">2mg</td>
              <td className="px-4 py-2 border">Beginners, very light users</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Velo Regular (4mg)</td>
              <td className="px-4 py-2 border">4mg</td>
              <td className="px-4 py-2 border">Light to moderate users</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Velo Strong (10mg)</td>
              <td className="px-4 py-2 border">10mg</td>
              <td className="px-4 py-2 border">Regular vapers/smokers</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Velo X-Strong (11mg)</td>
              <td className="px-4 py-2 border">11mg</td>
              <td className="px-4 py-2 border">Heavy users, high tolerance</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Velo Products ({totalCount})
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
            <p className="text-gray-600 mb-4">Velo products coming soon!</p>
            <p className="text-sm text-gray-500">
              We're adding Velo nicotine pouches to our range. Check back shortly.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Velo */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Velo?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Trusted Brand:</strong> The UK's #1 nicotine pouch brand</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Premium Ingredients:</strong> Pharmaceutical-grade nicotine and natural flavors</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Consistent Quality:</strong> Every pouch delivers the same great experience</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Wide Selection:</strong> Multiple strengths and flavors to choose from</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Discreet Design:</strong> Slim pouches that fit comfortably</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Long-Lasting:</strong> Up to 60 minutes of nicotine satisfaction</span>
          </li>
        </ul>
      </div>

      {/* How to Use Velo */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Use Velo Pouches</h2>
        <ol className="space-y-3 ml-4 list-decimal text-gray-700">
          <li><strong>Select Your Strength:</strong> Choose a Velo strength appropriate for your nicotine tolerance</li>
          <li><strong>Place Under Lip:</strong> Position the pouch between your upper lip and gum</li>
          <li><strong>Feel the Tingle:</strong> A mild tingling sensation indicates nicotine release</li>
          <li><strong>Enjoy 30-60 Minutes:</strong> Keep the pouch in place for optimal satisfaction</li>
          <li><strong>Dispose Responsibly:</strong> Remove and dispose of the pouch - do not swallow</li>
        </ol>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More Nicotine Pouches</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Nicotine Pouches
          </Link>
          <Link to="/collections/zyn-nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Zyn Pouches
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
