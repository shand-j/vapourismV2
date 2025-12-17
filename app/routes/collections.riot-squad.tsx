/**
 * Riot Squad E-Liquids Collection Page
 * 
 * SEO-optimized brand page for Riot Squad e-liquids
 * Target keywords: "riot squad"
 * Search volume: 1,000 monthly searches, difficulty: 5 (EASIEST WIN)
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Riot Squad e-liquid products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:riot_squad tag:e-liquid',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const seoTitle = 'Riot Squad E-Liquids | Premium Vape Juice UK | Vapourism 2025';
  const seoDescription = 'Shop Riot Squad premium e-liquids. ✓ Award-winning flavors ✓ 50ml shortfills ✓ 10ml nic salts ✓ Fast UK delivery ✓ Authentic Riot Squad products. Browse the complete range.';

  return json({
    products: searchResults.products,
    totalCount: searchResults.totalCount,
    seo: {title: seoTitle, description: seoDescription},
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [{title: 'Riot Squad | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'riot squad, riot squad e-liquid, riot squad vape juice, riot squad uk, punx e-liquid'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://www.vapourism.co.uk/collections/riot-squad'},
  ];
};

export default function RiotSquadCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_riot_squad',
    listName: 'Riot Squad Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Riot Squad E-Liquids | Premium Vape Juice UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience award-winning e-liquids from Riot Squad. Known for bold flavors and exceptional 
          quality, Riot Squad offers both shortfills and nicotine salts for every vaper's preference.
        </p>
      </div>

      {/* Brand Story */}
      <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Riot Squad</h2>
        <p className="text-gray-700 mb-4">
          Riot Squad is a UK-based premium e-liquid manufacturer known for creating bold, innovative 
          flavors that push the boundaries of conventional vaping. With multiple award-winning ranges 
          including the iconic Punx series, Riot Squad has established itself as a leader in the UK 
          vaping industry.
        </p>
        <p className="text-gray-700">
          Each Riot Squad e-liquid is crafted with meticulous attention to detail, using only the 
          finest ingredients to deliver exceptional flavor experiences. From fruity blends to dessert 
          creations, Riot Squad offers something for every palate.
        </p>
      </div>

      {/* Product Ranges */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-3">50ml Shortfills</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• 0mg nicotine (add nic shots)</li>
            <li>• High VG ratios (70/30)</li>
            <li>• Perfect for sub-ohm vaping</li>
            <li>• Large cloud production</li>
            <li>• Intense flavor profiles</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-3">10ml Nic Salts</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• 10mg & 20mg strengths</li>
            <li>• Smooth throat hit</li>
            <li>• Fast nicotine delivery</li>
            <li>• Ideal for pod systems</li>
            <li>• MTL vaping style</li>
          </ul>
        </div>
      </div>

      {/* Popular Ranges */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Riot Squad Popular Ranges</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Punx Series</h3>
            <p className="text-gray-600">
              Classic fruit and candy flavors with a rebellious twist. The flagship range that put Riot Squad on the map.
            </p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Bar Edition</h3>
            <p className="text-gray-600">
              Disposable vape-inspired flavors recreated for your refillable device. Authentic taste profiles.
            </p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Fresh Series</h3>
            <p className="text-gray-600">
              Cooling menthol and ice blends perfect for refreshing vaping experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Riot Squad E-Liquids ({totalCount})
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
              Check back shortly for the complete Riot Squad e-liquid range.
            </p>
          </div>
        )}
      </div>

      {/* Flavor Profiles */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular Riot Squad Flavors</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Fruity Favorites</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Mixed berries and tropical blends</li>
              <li>• Citrus and orange combinations</li>
              <li>• Watermelon and melon mixes</li>
              <li>• Grape and apple variants</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Dessert & Candy</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Sweet candy shop flavors</li>
              <li>• Classic dessert profiles</li>
              <li>• Cream and custard blends</li>
              <li>• Cake and pastry creations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose Riot Squad */}
      <div className="border-t pt-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Riot Squad?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Award-Winning Flavors:</strong> Multiple industry awards and recognition</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>UK Made:</strong> Manufactured in the UK to highest standards</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Premium Ingredients:</strong> Only the finest quality ingredients used</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> All products meet UK regulations</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Wide Selection:</strong> Something for every vaping preference</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More E-Liquid Brands</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/search?tag=e-liquid" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All E-Liquids
          </Link>
          <Link to="/search?tag=shortfill" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            50ml Shortfills
          </Link>
          <Link to="/search?tag=nic_salt" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Nic Salts
          </Link>
        </div>
      </div>
    </div>
  );
}
