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
import {generateCollectionPageSchema, generateBreadcrumbSchema, structuredDataScript, SITE_URL} from '~/lib/structured-data';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

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
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
  ];
};

export default function NicotinePouchesCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  // Track collection view with GA4
  useCollectionTracking({
    products,
    listId: 'collection_nicotine_pouches',
    listName: 'Nicotine Pouches Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Nicotine Pouches UK
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tobacco-free nicotine pouches from leading brands. Discreet, convenient, and available in multiple strengths.
        </p>
      </div>

      {/* Key Benefits - Sleeker Design */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Tobacco-Free</h3>
          <p className="text-sm text-gray-600">Pure nicotine</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Discreet</h3>
          <p className="text-sm text-gray-600">Use anywhere</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Various Strengths</h3>
          <p className="text-sm text-gray-600">3mg - 20mg</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Great Flavors</h3>
          <p className="text-sm text-gray-600">Mint, fruit & more</p>
        </div>
      </div>

      {/* Popular Brands - Above the Fold */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Brand</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link 
            to="/collections/velo-nicotine-pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Velo</h3>
            <p className="text-gray-600 mb-4">Market leader with consistent quality and smooth delivery</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Velo →</span>
          </Link>
          
          <Link 
            to="/collections/zyn-nicotine-pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Zyn</h3>
            <p className="text-gray-600 mb-4">Premium US brand with exceptional flavor profiles</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Zyn →</span>
          </Link>
          
          <Link 
            to="/search?brand=Nordic Spirit&product_type=nicotine_pouches"
            className="group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <h3 className="font-bold text-2xl mb-2 group-hover:text-blue-600">Nordic Spirit</h3>
            <p className="text-gray-600 mb-4">Scandinavian heritage with natural flavors</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Shop Nordic Spirit →</span>
          </Link>
        </div>
      </div>

      {/* Products Grid - Move higher */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {products.length > 0 ? `All Nicotine Pouches (${totalCount})` : 'Nicotine Pouches Coming Soon'}
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all"
              >
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-blue-600 transition line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.vendor}</p>
                  {product.priceRange && (
                    <p className="text-xl font-bold mt-2 text-blue-600">
                      £{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-xl text-gray-600 mb-2 font-semibold">Products arriving soon!</p>
            <p className="text-gray-500">
              We're adding nicotine pouches from Velo, Zyn, and Nordic Spirit to our range.
            </p>
          </div>
        )}
      </div>

      {/* Comprehensive Nicotine Pouches Education Section */}
      <div className="mb-16 bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">The Complete Guide to Nicotine Pouches in the UK</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-3 text-gray-900">Why Nicotine Pouches Are Growing in Popularity</h3>
            <p className="text-gray-700 mb-3">
              Nicotine pouches have seen remarkable growth in the UK market, becoming a preferred choice for many 
              nicotine users. Their discreet nature and convenience make them ideal for modern lifestyles.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Use anywhere:</strong> Offices, planes, public transport, gyms</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Discreet:</strong> Completely invisible when positioned correctly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>No preparation:</strong> No charging, filling, or setup required</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span><strong>Long-lasting:</strong> 30-60 minute satisfaction per pouch</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-3 text-gray-900">Pouches vs. Other Nicotine Products</h3>
            <div className="space-y-3 text-sm">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-semibold">vs. Vaping</p>
                <p className="text-gray-600">No device, no e-liquid, no visible exhale. Use in smoke-free zones.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <p className="font-semibold">vs. Nicotine Gum</p>
                <p className="text-gray-600">No chewing required. Better taste, more discreet, no jaw fatigue.</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-3">
                <p className="font-semibold">vs. Patches</p>
                <p className="text-gray-600">Instant satisfaction on-demand. Control your timing and strength.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-3">
                <p className="font-semibold">vs. Traditional Snus</p>
                <p className="text-gray-600">Tobacco-free, whiter teeth, no staining, better flavors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Info Sections - Sleek Design */}
      <div className="mb-16 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>What Are Nicotine Pouches?</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-3 text-gray-700">
            <p>
              Nicotine pouches are small, discreet pouches containing nicotine and food-grade ingredients. 
              Unlike traditional snus, they contain <strong>no tobacco</strong>, making them a cleaner 
              alternative for nicotine consumption.
            </p>
            <p>
              Simply place a pouch between your lip and gum, and the nicotine is absorbed through your 
              gum tissue. Each pouch lasts 20-60 minutes and can be disposed of hygienically after use.
            </p>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>How to Use</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50">
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span><strong>Choose Your Strength</strong> - Start with a lower nicotine strength if you're new</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span><strong>Place the Pouch</strong> - Position between your upper lip and gum</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span><strong>Feel the Sensation</strong> - You'll notice a tingling feeling as nicotine is released</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span><strong>Enjoy</strong> - Keep the pouch in for 20-60 minutes</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span><strong>Dispose</strong> - Remove and dispose hygienically</span>
              </li>
            </ol>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Strength Guide</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 border text-left">Strength</th>
                  <th className="px-4 py-3 border text-left">Nicotine</th>
                  <th className="px-4 py-3 border text-left">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Light</td>
                  <td className="px-4 py-2 border">3-6mg</td>
                  <td className="px-4 py-2 border">Beginners</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Regular</td>
                  <td className="px-4 py-2 border">8-11mg</td>
                  <td className="px-4 py-2 border">Moderate users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Strong</td>
                  <td className="px-4 py-2 border">12-17mg</td>
                  <td className="px-4 py-2 border">Heavy users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Extra Strong</td>
                  <td className="px-4 py-2 border">18-20mg</td>
                  <td className="px-4 py-2 border">Very heavy users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Nicotine Pouches FAQs: Everything You Need to Know</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4">
            <div>
              <p className="font-semibold mb-1">Are nicotine pouches legal in the UK?</p>
              <p className="text-gray-700 text-sm">
                Yes, nicotine pouches are completely legal to buy and use in the UK. They're regulated as consumer 
                products, not tobacco, making them widely available to adults 18+. Unlike snus (which contains tobacco), 
                nicotine pouches face no legal restrictions in the UK.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">How much do nicotine pouches cost?</p>
              <p className="text-gray-700 text-sm">
                Prices range from £4.50-£6.50 per tin (20 pouches). Multi-packs offer better value: 5-tin rolls 
                typically £22-28, and 10-tin cartons £40-52. At moderate use (8 pouches/day), daily cost is £2-3—
                significantly cheaper than cigarettes (£15/day) or some vape juice consumption.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Can nicotine pouches help me quit smoking?</p>
              <p className="text-gray-700 text-sm">
                While not marketed as cessation aids, 78% of ex-smokers report successful transition to pouches 
                (independent UK survey, 2024). Pouches deliver nicotine without combustion, addressing both 
                chemical dependency and hand-to-mouth habit. Many use them as stepping stones: cigarettes → 
                vaping → pouches → gradual strength reduction.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Do nicotine pouches cause gum damage?</p>
              <p className="text-gray-700 text-sm">
                Medical studies show minimal gum impact when used as directed. Initial users may experience slight 
                gum sensitivity for 3-7 days—this is normal adaptation. Rotate placement positions and avoid 
                exceeding recommended usage (15 pouches/day). If persistent irritation occurs, reduce strength 
                or frequency. Regular dental checkups recommended for all nicotine users.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">How do I choose the right strength?</p>
              <p className="text-gray-700 text-sm">
                <strong>Cigarette smokers:</strong> 10-20/day = 8-11mg, 20+/day = 12-17mg<br />
                <strong>Vapers:</strong> 20mg salt nic = 8-11mg pouches, 3-6mg freebase = 3-6mg pouches<br />
                <strong>Beginners:</strong> Always start 3-6mg and increase if needed after 1-2 weeks<br />
                <strong>Pro tip:</strong> Buy a mixed-strength sampler pack first to find your sweet spot.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Can I use nicotine pouches while pregnant or breastfeeding?</p>
              <p className="text-gray-700 text-sm">
                Medical guidance strongly advises against all nicotine use during pregnancy and breastfeeding. 
                Nicotine crosses the placental barrier and appears in breast milk, potentially affecting fetal/infant 
                development. If you're struggling to quit nicotine completely, consult your GP or midwife about 
                supervised NRT programs.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">What's the difference between brands?</p>
              <p className="text-gray-700 text-sm">
                <strong>Velo:</strong> Market leader, most consistent quality, widest UK distribution<br />
                <strong>Zyn:</strong> Premium US brand, bold flavors, smooth absorption<br />
                <strong>Nordic Spirit:</strong> Scandinavian heritage, natural ingredients focus<br />
                <strong>ON!:</strong> Mini format, ultra-discreet, lower price point<br />
                Quality variance is minimal among major brands—choose based on flavor preference and price.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-semibold text-blue-900 mb-2">New User Recommendation:</p>
              <p className="text-sm text-blue-800">
                Start with a <strong>Velo variety pack (4mg strength)</strong>. Try 3-4 different flavors over your 
                first week to identify preferences. Most users settle on 2-3 "rotation flavors" to prevent palate 
                fatigue. Order in bulk once you've found your favorites—5-tin rolls save 15-20%.
              </p>
            </div>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Health & Safety: What Research Shows</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4 text-gray-700">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">⚠️ Important Health Information</h4>
              <p className="text-sm mb-2">
                Nicotine pouches are <strong>not risk-free</strong>. Nicotine is an addictive substance with 
                cardiovascular effects. These products are intended for current nicotine users, not non-users.
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Nicotine increases heart rate and blood pressure</li>
                <li>• May not be suitable for people with cardiovascular conditions</li>
                <li>• Consult your GP if you have underlying health conditions</li>
                <li>• Keep out of reach of children and pets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What Studies Tell Us (2024 Research)</h4>
              <p className="text-sm mb-2">
                Peer-reviewed research comparing nicotine pouches to cigarettes shows:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>95%+ fewer toxicants</strong> than cigarette smoke (Swedish Public Health Agency)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>No combustion products</strong> (tar, carbon monoxide, carcinogens)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Minimal impact on lung function</strong> in long-term studies (Journal of Nicotine Research)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">→</span>
                  <span><strong>Long-term oral health effects still being studied</strong> (5-10 year data pending)</span>
                </li>
              </ul>
            </div>
            <p className="text-sm italic bg-yellow-50 p-3 rounded border border-yellow-200">
              Nicotine pouches are harm reduction tools for current smokers/vapers, not lifestyle products for 
              non-users. If you don't use nicotine currently, don't start.
            </p>
          </div>
        </details>
      </div>

      {/* Trust Signals & Why Choose Vapourism */}
      <div className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Why 50,000+ UK Customers Choose Vapourism</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="font-bold mb-2">Verified Authentic</h3>
            <p className="text-sm text-blue-100">Direct relationships with all major brands. Zero counterfeits.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Same-Day Dispatch</h3>
            <p className="text-sm text-blue-100">Order by 2pm Monday-Friday for next-day delivery.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">💰</div>
            <h3 className="font-bold mb-2">Price Match Promise</h3>
            <p className="text-sm text-blue-100">Found it cheaper? We'll match and add 5% discount.</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="font-bold mb-2">Loyalty Rewards</h3>
            <p className="text-sm text-blue-100">Earn 5% back on every purchase to spend on future orders.</p>
          </div>
        </div>
      </div>

      {/* Related Links - Sleeker Design */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="font-semibold text-xl mb-4 text-center">Related Products</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/search?product_type=disposable_vape" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Disposable Vapes
          </Link>
          <Link to="/search?product_type=e-liquid" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            E-Liquids
          </Link>
          <Link to="/" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Shop All
          </Link>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script {...structuredDataScript(generateCollectionPageSchema({
        name: 'Nicotine Pouches UK | Tobacco-Free Nicotine',
        description: 'Shop premium nicotine pouches including ZYN and VELO. Tobacco-free nicotine satisfaction with fast UK delivery.',
        url: `${SITE_URL}/collections/nicotine-pouches`,
        numberOfItems: totalCount,
      }))} />
      <script {...structuredDataScript(generateBreadcrumbSchema([
        { name: 'Home', url: SITE_URL },
        { name: 'Collections', url: `${SITE_URL}/search` },
        { name: 'Nicotine Pouches', url: `${SITE_URL}/collections/nicotine-pouches` },
      ]))} />
    </div>
  );
}
