/**
 * Crystal Bar Collection Page
 * 
 * SEO-optimized category page for Crystal Bar disposable vapes
 * Target keywords: "crystal bar"
 * Search volume: 14,800 monthly searches, difficulty: 8
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Crystal Bar products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:crystal tag:disposable',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const categoryTitle = 'Crystal Bar';
  const seoTitle = 'Crystal Bar | Premium Disposable Vapes UK | Vapourism 2025';
  const seoDescription = 'Shop Crystal Bar disposable vapes. ✓ Crystal clear flavor ✓ Smooth vapor production ✓ Fast UK delivery ✓ Authentic products. Browse the complete Crystal range.';

  return json({
    products: searchResults.products,
    totalCount: searchResults.totalCount,
    seo: {title: seoTitle, description: seoDescription},
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [
      {title: 'Crystal Bar | Vapourism'},
      {name: 'description', content: 'Explore Crystal Bar disposable vapes at Vapourism. Premium UK vape shop with fast delivery and best prices.'},
      {name: 'robots', content: 'noindex'}
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'crystal bar, crystal vape, crystal disposable vape uk, crystal bar flavors'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function CrystalBarCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_crystal_bar',
    listName: 'Crystal Bar Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Crystal Bar | Premium Disposable Vapes UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Experience crystal-clear flavor with the Crystal Bar range of premium disposable vapes. 
          Smooth vapor production and exceptional taste in every puff.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Crystal Clear Flavor</h3>
          <p className="text-gray-600">Pure, authentic taste profiles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Smooth Vapor</h3>
          <p className="text-gray-600">Comfortable throat hit every time</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Quality</h3>
          <p className="text-gray-600">High-quality materials and construction</p>
        </div>
      </div>

      {/* Brand Story */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Crystal Bar Disposable Vapes</h2>
        <p className="text-gray-700 mb-4">
          Crystal Bar has quickly become one of the UK's favorite disposable vape brands, 
          known for delivering exceptional flavor clarity and smooth vapor production. Each device 
          is carefully crafted to provide a premium vaping experience from the first puff to the last.
          The brand stands out in the crowded disposable market through its focus on authentic taste profiles 
          and reliable performance that UK vapers have come to trust.
        </p>
        <p className="text-gray-700 mb-4">
          With a focus on quality ingredients and innovative design, Crystal Bar offers vapers 
          a reliable choice for everyday use. The brand's commitment to authentic flavors and 
          consistent performance has made it a top choice among UK vapers who demand both convenience 
          and quality from their disposable vapes.
        </p>
        <p className="text-gray-700">
          Every Crystal Bar device undergoes rigorous quality control testing to ensure compliance with UK TPD 
          regulations and safety standards. The brand uses food-grade materials, pharmaceutical-grade nicotine, 
          and premium flavor concentrates to deliver an exceptional vaping experience. Crystal Bar disposables 
          are designed for adult smokers transitioning away from traditional cigarettes, as well as experienced 
          vapers seeking convenient, hassle-free options for on-the-go use.
        </p>
      </div>

      {/* Why Choose Crystal Bar */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Why Choose Crystal Bar Vapes?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Beginner-Friendly Design</h3>
            <p className="text-gray-700">
              Crystal Bar disposables are perfect for new vapers with their simple draw-activated operation. 
              No buttons, no settings, no maintenance required—just open the package and start vaping. 
              The consistent power output ensures smooth flavor delivery without the learning curve associated 
              with traditional vape devices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Cost-Effective Vaping</h3>
            <p className="text-gray-700">
              Compared to daily cigarette purchases, Crystal Bar offers significant savings without compromising 
              on satisfaction. Each device provides hundreds of puffs at a fraction of the cost of traditional 
              smoking. No need to purchase separate e-liquid, coils, or accessories—everything comes built-in 
              and ready to use.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Wide Flavor Selection</h3>
            <p className="text-gray-700">
              Crystal Bar offers an extensive range of flavors catering to diverse preferences. Whether you prefer 
              fruity blends, refreshing menthol, classic tobacco, or indulgent dessert profiles, there's a Crystal 
              Bar flavor to match your taste. Popular options include mixed berries, tropical fruits, cooling ice 
              varieties, and smooth tobacco blends.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Portable and Discreet</h3>
            <p className="text-gray-700">
              The compact, lightweight design makes Crystal Bar perfect for vaping on the move. Slip it into your 
              pocket or bag without bulk or worry. The sleek appearance and moderate vapor production allow for 
              discreet use in appropriate settings, making it ideal for busy lifestyles and social situations.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Crystal Bar Products ({totalCount})
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
              Check back shortly for the complete Crystal Bar range.
            </p>
          </div>
        )}
      </div>

      {/* Product Highlights */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Crystal Bar Product Highlights</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Variety of Options:</strong> Multiple puff counts and models available</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Authentic Flavors:</strong> From classic to exotic taste profiles</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Draw-Activated:</strong> No buttons or settings - just vape</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Portable Design:</strong> Sleek and pocket-friendly</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>UK Compliant:</strong> Meets all TPD regulations</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Explore More Disposable Vapes</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-ultra" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Ultra
          </Link>
          <Link to="/collections/lost-mary-bm6000" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Lost Mary BM6000
          </Link>
          <Link to="/collections/elux-legend" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Elux Legend
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Disposables
          </Link>
        </div>
      </div>
    </div>
  );
}
