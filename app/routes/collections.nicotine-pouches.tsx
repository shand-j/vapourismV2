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
    return [{title: 'Nicotine Pouches UK | Vapourism'}, {name: 'robots', content: 'noindex'}];
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Nicotine Pouches UK | Tobacco-Free Nicotine
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the complete range of nicotine pouches - a modern, tobacco-free alternative 
          to traditional nicotine products. Discreet, convenient, and available in various 
          strengths and flavors from leading brands like Velo, Zyn, and Nordic Spirit.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Tobacco-Free</h3>
          <p className="text-gray-600">No tobacco, just pure nicotine satisfaction</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Discreet</h3>
          <p className="text-gray-600">Use anywhere without vapor or smoke</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Multiple Strengths</h3>
          <p className="text-gray-600">From 3mg to 20mg to suit your needs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Great Flavors</h3>
          <p className="text-gray-600">Mint, fruit, and menthol varieties</p>
        </div>
      </div>

      {/* What Are Nicotine Pouches */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">What Are Nicotine Pouches?</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Nicotine pouches are small, discreet pouches containing nicotine and food-grade ingredients. 
            Unlike traditional snus, they contain <strong>no tobacco</strong>, making them a cleaner 
            alternative for nicotine consumption.
          </p>
          <p>
            Simply place a pouch between your lip and gum, and the nicotine is absorbed through your 
            gum tissue. Each pouch lasts 20-60 minutes and can be disposed of hygienically after use.
          </p>
          <p className="font-semibold">
            Perfect for situations where vaping isn't possible - meetings, flights, restaurants, or 
            anywhere you need a discreet nicotine option.
          </p>
        </div>
      </div>

      {/* How to Use */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">How to Use Nicotine Pouches</h2>
        <ol className="space-y-3 ml-4 list-decimal text-gray-700">
          <li><strong>Choose Your Strength:</strong> Start with a lower nicotine strength if you're new</li>
          <li><strong>Place the Pouch:</strong> Position between your upper lip and gum</li>
          <li><strong>Feel the Sensation:</strong> You'll notice a tingling feeling as nicotine is released</li>
          <li><strong>Enjoy:</strong> Keep the pouch in for 20-60 minutes for optimal satisfaction</li>
          <li><strong>Dispose:</strong> Remove and dispose of hygienically - do not swallow</li>
        </ol>
      </div>

      {/* Popular Brands */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Nicotine Pouch Brands</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-bold text-xl mb-2">Velo</h3>
            <p className="text-gray-600 mb-4">
              Market-leading brand with a huge range of flavors and strengths. Known for consistent 
              quality and smooth nicotine delivery.
            </p>
            <Link 
              to="/collections/velo-nicotine-pouches" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Shop Velo →
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-bold text-xl mb-2">Zyn</h3>
            <p className="text-gray-600 mb-4">
              Premium US brand gaining popularity in the UK. Exceptional flavor profiles and 
              reliable nicotine satisfaction.
            </p>
            <Link 
              to="/collections/zyn-nicotine-pouches" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Shop Zyn →
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-bold text-xl mb-2">Nordic Spirit</h3>
            <p className="text-gray-600 mb-4">
              Scandinavian heritage brand offering authentic Nordic-style pouches with natural flavors 
              and premium ingredients.
            </p>
            <Link 
              to="/search?tag=nordic_spirit&tag=nicotine_pouches" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Shop Nordic Spirit →
            </Link>
          </div>
        </div>
      </div>

      {/* Nicotine Strength Guide */}
      <div className="mb-12 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Nicotine Strength Guide</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Strength</th>
              <th className="px-4 py-2 border">Nicotine Content</th>
              <th className="px-4 py-2 border">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-semibold">Light</td>
              <td className="px-4 py-2 border">3-6mg per pouch</td>
              <td className="px-4 py-2 border">Beginners, light vapers/smokers</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Regular</td>
              <td className="px-4 py-2 border">8-11mg per pouch</td>
              <td className="px-4 py-2 border">Regular vapers, moderate smokers</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Strong</td>
              <td className="px-4 py-2 border">12-17mg per pouch</td>
              <td className="px-4 py-2 border">Heavy vapers, experienced users</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border font-semibold">Extra Strong</td>
              <td className="px-4 py-2 border">18-20mg per pouch</td>
              <td className="px-4 py-2 border">Very heavy users, high tolerance</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Nicotine Pouches ({totalCount})
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
              We're adding nicotine pouches to our range. Check back shortly for the complete selection.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Nicotine Pouches */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Nicotine Pouches?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Tobacco-Free:</strong> No tobacco means no tobacco-related health concerns</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Smoke & Vapor Free:</strong> Use anywhere without disturbing others</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Discreet:</strong> No one will know you're using them</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Long-Lasting:</strong> Each pouch provides 20-60 minutes of satisfaction</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Convenient:</strong> Small tins fit in any pocket</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>No Charging:</strong> Ready to use immediately, no maintenance</span>
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Are nicotine pouches legal in the UK?</h3>
            <p className="text-gray-700">
              Yes, nicotine pouches are completely legal to buy and use in the UK. They are regulated 
              as consumer products and must meet safety standards.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Are nicotine pouches the same as snus?</h3>
            <p className="text-gray-700">
              No. While similar in use, snus contains tobacco while nicotine pouches are tobacco-free. 
              This makes nicotine pouches legal throughout the EU, including the UK.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How long does a nicotine pouch last?</h3>
            <p className="text-gray-700">
              Typically 20-60 minutes depending on the strength and your usage preferences. Most users 
              keep pouches in for 30-45 minutes.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I use nicotine pouches on a plane?</h3>
            <p className="text-gray-700">
              Yes! Since they produce no smoke or vapor, nicotine pouches can be used on flights and 
              in most indoor locations where smoking and vaping are prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Related Products</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/velo-nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Velo Pouches
          </Link>
          <Link to="/collections/zyn-nicotine-pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Zyn Pouches
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Disposable Vapes
          </Link>
          <Link to="/search?tag=e-liquid" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            E-Liquids
          </Link>
        </div>
      </div>
    </div>
  );
}
