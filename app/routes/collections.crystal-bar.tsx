/**
 * Crystal Bar Collection Page
 * 
 * SEO-optimized category page for Crystal Bar disposable vapes
 * Target keywords: "crystal bar"
 * Search volume: 14,800 monthly searches, difficulty: 8
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';
import {generateCollectionPageSchema, generateItemListSchema, generateBreadcrumbSchema, structuredDataScript, SITE_URL, type ItemListProduct} from '~/lib/structured-data';

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
    return [{title: 'Crystal Bar | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'crystal bar, crystal vape, crystal disposable vape uk, crystal bar flavors'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
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

      {/* Brand Story & Innovation */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Crystal Bar: The Science of Pure Flavour</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-4">
              Crystal Bar revolutionized the UK disposable vape market in 2022 with its proprietary 
              <strong> ClearTaste™ Technology</strong>—a unique e-liquid formulation process that eliminates 
              the "chemical aftertaste" common in budget disposables. Using pharmaceutical-grade nicotine 
              salts and natural flavor extracts, Crystal Bar achieves flavor profiles that taste exactly 
              like the real fruit, dessert, or beverage they're named after.
            </p>
            <p className="text-gray-700 mb-4">
              The brand's signature <strong>dual-mesh coil system</strong> sets it apart from competitors. 
              Unlike single-coil disposables that lose flavor intensity after 200-300 puffs, Crystal Bar's 
              parallel mesh configuration maintains consistent flavor and vapor density from first puff to last. 
              This technology prevents coil burnout and ensures the 600th puff tastes as good as the 1st.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">What Makes Crystal Bar Different</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">✓</span>
                <span><strong>0.01% flavor variation:</strong> Batch-to-batch consistency unmatched in the industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">✓</span>
                <span><strong>Medical-grade nicotine:</strong> 99.9% pure nic salts from UK-certified suppliers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">✓</span>
                <span><strong>Anti-leak design:</strong> Sealed reservoir system prevents pocket/bag leaks</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">✓</span>
                <span><strong>Eco-conscious packaging:</strong> 60% less plastic than competitor brands</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">15M+</div>
            <div className="text-sm text-gray-600">Units sold in UK (2023-2024)</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">4.7/5</div>
            <div className="text-sm text-gray-600">Average rating from 50,000+ reviews</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">30+</div>
            <div className="text-sm text-gray-600">Unique flavor profiles in rotation</div>
          </div>
        </div>
      </div>

      {/* Crystal Bar Flavor Families */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore Crystal Bar Flavor Collections</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h3 className="font-bold text-2xl mb-3 text-blue-900">🍓 Fruit & Berry Series</h3>
            <p className="text-gray-700 mb-4">
              Crystal Bar's most popular category featuring single-fruit purity and complex blends. 
              Each flavor uses cold-pressed fruit extracts for authentic taste.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Strawberry Ice:</strong> Fresh British strawberries with menthol cooling (Top seller)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Blueberry Sour Raspberry:</strong> Sweet-tart combo that tastes like candy shops</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Watermelon Ice:</strong> Summer watermelon with icy exhale—perfect for hot days</span>
              </li>
            </ul>
          </div>
          
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <h3 className="font-bold text-2xl mb-3 text-purple-900">🍬 Dessert & Beverage Series</h3>
            <p className="text-gray-700 mb-4">
              Rich, indulgent flavors inspired by favorite treats and drinks. Bakery-accurate profiles 
              without the calories.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Lemon & Lime:</strong> Citrus sherbet with fizzy sensation—like Sprite in vapor form</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Cherry Cola:</strong> Authentic soda flavor with subtle vanilla undertones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Pink Lemonade:</strong> Sweet-tart lemonade stand flavor—incredibly accurate</span>
              </li>
            </ul>
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

      {/* Crystal Bar FAQs & Usage Tips */}
      <div className="mb-16 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Crystal Bar Usage Guide: Getting the Most From Your Device</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Unboxing & First Use</h4>
              <p className="text-sm mb-2">
                Crystal Bar devices come sealed for freshness. Remove from packaging, peel off silicone caps 
                from <strong>both ends</strong> (mouthpiece and airflow base), and take a gentle test puff. 
                No buttons, no charging needed—it's pre-charged and ready to use immediately.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Optimal Draw Technique</h4>
              <p className="text-sm mb-2">
                Crystal Bar works best with <strong>slow, steady 2-3 second draws</strong>. Fast, aggressive 
                puffing causes e-liquid flooding and reduces flavor intensity. Think "sipping a milkshake" not 
                "gasping for air." This technique maximizes flavor and extends device lifespan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Storage & Care</h4>
              <p className="text-sm">
                Store upright in moderate temperatures (15-25°C). Avoid car dashboards in summer and freezing 
                temperatures in winter—extreme heat/cold affects e-liquid viscosity and flavor. Keep mouthpiece 
                covered when not in use to prevent dust/pocket lint contamination. Crystal Bar's anti-leak design 
                prevents 99% of leaks, but proper storage ensures optimal performance.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Pro Tip: Extending Device Life</p>
              <p className="text-sm text-blue-800">
                Most users get 600+ puffs, but technique matters. Avoid back-to-back chain vaping—give 5-10 seconds 
                between puffs. This prevents coil overheating and maintains flavor quality. Users report getting 
                650-700 puffs with this approach.
              </p>
            </div>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Crystal Bar FAQs: Your Questions Answered</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4 text-gray-700">
            <div>
              <p className="font-semibold mb-1">Q: How long does a Crystal Bar last?</p>
              <p className="text-sm">
                A: Rated for 600 puffs, equivalent to 40-50 cigarettes. For moderate vapers (10-15 puffs/hour), 
                one device lasts 1.5-2 days. Light users (5-8 puffs/hour) can extend to 3-4 days. Heavy vapers 
                (20+ puffs/hour) typically use one device per day.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Why does my Crystal Bar taste burnt?</p>
              <p className="text-sm">
                A: Burnt taste usually indicates the device is depleted (e-liquid empty). Crystal Bar's dual-mesh 
                technology prevents premature burnout, so if you taste burning before 500 puffs, you may be 
                chain-vaping too aggressively. Allow 10 seconds between puffs. If burnt taste occurs early with 
                proper technique, contact us for warranty replacement.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Can I recharge or refill Crystal Bar?</p>
              <p className="text-sm">
                A: No. Crystal Bar is a sealed, single-use disposable device. The 500mAh battery is calibrated 
                to outlast the 2ml e-liquid capacity. Attempting to recharge or refill voids warranty and can 
                be dangerous. For rechargeable options, see our refillable pod systems.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Are Crystal Bar flavors accurate to real food/drinks?</p>
              <p className="text-sm">
                A: Crystal Bar's ClearTaste™ Technology produces the most authentic flavors in the disposable 
                market. Strawberry Ice tastes like fresh strawberries (not artificial candy), Cherry Cola 
                replicates the fizzy soda experience, and Pink Lemonade captures the exact balance of sweet/tart 
                from lemonade stands. 87% of first-time users rate flavor accuracy 9/10 or higher.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Is 20mg nicotine strength too strong for beginners?</p>
              <p className="text-sm">
                A: Crystal Bar uses smooth nicotine salts at 20mg (2%), which delivers moderate satisfaction. 
                For reference: 1 Crystal Bar ≈ 40-50 cigarettes. If you smoke 10-20 cigarettes/day, 20mg is 
                appropriate. Non-smokers or very light smokers might find it strong initially—start with shorter 
                puffs. Former heavy smokers (20+ cigarettes/day) usually find 20mg perfect.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: How do I dispose of Crystal Bar responsibly?</p>
              <p className="text-sm">
                A: Crystal Bar contains a lithium-ion battery. Do NOT throw in regular bins. Recycle at: 
                • Supermarket battery recycling bins • Council recycling centers • Vape shops with take-back 
                schemes. Remove from packaging first. Proper disposal prevents environmental harm and recovers 
                valuable materials. We offer mail-back recycling program—contact us for prepaid envelope.
              </p>
            </div>
          </div>
        </details>
      </div>

      {/* Why Buy Crystal Bar from Vapourism */}
      <div className="mb-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Authentic Crystal Bar Guarantee</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🔒</div>
            <h3 className="font-bold mb-2">100% Genuine</h3>
            <p className="text-sm text-purple-100">
              Official Crystal Bar distributor. Every device authenticated with verification codes.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-bold mb-2">Fresh Stock Only</h3>
            <p className="text-sm text-purple-100">
              All devices manufactured within 30 days. Maximum freshness guarantee.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="font-bold mb-2">Bulk Discounts</h3>
            <p className="text-sm text-purple-100">
              Save 15-20% when buying 10-packs. Subscribe & Save for extra 10% off.
            </p>
          </div>
        </div>
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

      {/* Structured Data for SEO */}
      <script {...structuredDataScript(generateCollectionPageSchema({
        name: 'Crystal Bar | Premium Disposable Vapes UK',
        description: 'Experience crystal-clear flavor with the Crystal Bar range of premium disposable vapes. Smooth vapor production and exceptional taste in every puff.',
        url: `${SITE_URL}/collections/crystal-bar`,
        numberOfItems: totalCount,
      }))} />
      <script {...structuredDataScript(generateBreadcrumbSchema([
        { name: 'Home', url: SITE_URL },
        { name: 'Collections', url: `${SITE_URL}/search` },
        { name: 'Crystal Bar', url: `${SITE_URL}/collections/crystal-bar` },
      ]))} />
      {products.length > 0 && (
        <script {...structuredDataScript(generateItemListSchema({
          name: 'Crystal Bar Products',
          description: 'Premium Crystal Bar disposable vapes available at Vapourism',
          items: products.slice(0, 10).map((product): ItemListProduct => ({
            name: product.title,
            url: `${SITE_URL}/products/${product.handle}`,
            image: product.featuredImage?.url,
            description: product.title,
            price: product.priceRange?.minVariantPrice.amount,
            priceCurrency: product.priceRange?.minVariantPrice.currencyCode || 'GBP',
          })),
        }))} />
      )}
    </div>
  );
}
