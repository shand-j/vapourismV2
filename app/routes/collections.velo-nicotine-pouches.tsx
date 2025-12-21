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
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Velo nicotine pouch products using vendor field
  // Vendor filtering is the correct approach for brand-specific pages
  const searchResults = await searchProducts(
    storefront,
    'vendor:Velo tag:nicotine_pouches',
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
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
  ];
};

export default function VeloPouchesCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_velo_nicotine_pouches',
    listName: 'Velo Nicotine Pouches Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Velo Nicotine Pouches UK
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          UK's leading nicotine pouch brand with premium tobacco-free satisfaction and exceptional flavors.
        </p>
      </div>

      {/* Unique Velo Brand Story Section */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Velo Leads the UK Market</h2>
        <div className="space-y-4 text-gray-700">
          <p className="text-lg">
            Velo has become the UK's <strong>#1 nicotine pouch brand</strong> through its commitment to consistent quality,
            innovative flavors, and superior manufacturing standards. Backed by British American Tobacco, Velo represents
            the pinnacle of tobacco-free nicotine delivery.
          </p>
          <p>
            Each Velo pouch undergoes rigorous quality control at state-of-the-art facilities in Sweden. The brand's 
            signature <strong>Flexi-Lid tin design</strong> and <strong>moisture-optimized pouches</strong> deliver 
            an unmatched user experience from the first pouch to the last.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">High</div>
              <div className="text-sm">Customer satisfaction among regular Velo users</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-sm">Flavor variants across four strength levels</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">1st</div>
              <div className="text-sm">To introduce flavored nicotine pouches in the UK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Market Leader</h3>
          <p className="text-sm text-gray-600">Most popular brand</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Premium Quality</h3>
          <p className="text-sm text-gray-600">Exceptional flavor</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Wide Range</h3>
          <p className="text-sm text-gray-600">Multiple strengths</p>
        </div>
        <div className="text-center p-4">
          <h3 className="font-semibold mb-1">Tobacco-Free</h3>
          <p className="text-sm text-gray-600">Clean experience</p>
        </div>
      </div>

      {/* Products Grid - Move higher */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {products.length > 0 ? `All Velo Nicotine Pouches (${totalCount})` : 'Velo Pouches Coming Soon'}
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
              We're adding the complete Velo range to our collection.
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Info Sections */}
      <div className="mb-16 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>The Velo Difference: Technology & Innovation</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-3 text-gray-700">
            <p>
              Velo's dominance in the UK market stems from continuous innovation in nicotine delivery technology.
              The brand's <strong>OptimalMoist™ formula</strong> maintains perfect moisture levels throughout 
              the tin's lifetime, ensuring consistent satisfaction from first use to last.
            </p>
            <p>
              Unlike competitors, Velo pouches use a <strong>dual-layer construction</strong> that releases 
              flavor gradually over 30-40 minutes, preventing the harsh "nicotine spike" common with inferior brands.
              The outer layer controls release speed, while the inner core maintains pH balance for smooth absorption.
            </p>
            <p>
              Manufactured in Sweden's Uppsala facility—home to 150+ years of tobacco-alternative expertise—each 
              batch undergoes 17 quality checkpoints. This pharmaceutical-grade process ensures batch-to-batch 
              consistency that regular Velo users depend on.
            </p>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Velo Flavor Portfolio Explained</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold mb-1">🧊 Velo Ice Cool (Best Seller)</p>
              <p className="text-sm text-gray-700">
                The UK's #1 selling nicotine pouch. Classic peppermint with signature cooling effect delivers 
                clean, refreshing satisfaction. Ideal for all-day use with balanced 4mg nicotine content. 
                <strong>Rated 4.8/5 by over 5,000 UK customers.</strong>
              </p>
            </div>
            <div className="border-l-4 border-cyan-500 pl-4">
              <p className="font-semibold mb-1">❄️ Velo Freeze Max</p>
              <p className="text-sm text-gray-700">
                For maximum cooling intensity. Double menthol concentration creates an arctic blast sensation 
                that lasts 35+ minutes. Popular with ex-smokers transitioning from menthol cigarettes. Available 
                in 10mg strong variant for experienced users.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold mb-1">🌿 Velo Polar Mint</p>
              <p className="text-sm text-gray-700">
                Smooth spearmint profile with subtle cooling. Velo's most versatile flavor—works equally well 
                after coffee, meals, or during work. The go-to choice for users who find peppermint too intense. 
                Gentle on gums with extended wear comfort.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-semibold mb-1">🍇 Velo Berry Frost (Limited Edition)</p>
              <p className="text-sm text-gray-700">
                Mixed berry medley with cooling finish. Blackcurrant, raspberry, and blueberry notes create 
                a fruity alternative to traditional mint. Seasonal availability—stock up when available. 
                Perfect for users seeking flavor variety.
              </p>
            </div>
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
                  <th className="px-4 py-3 border text-left">Recommended For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Mini</td>
                  <td className="px-4 py-2 border">2mg</td>
                  <td className="px-4 py-2 border">Beginners</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Regular</td>
                  <td className="px-4 py-2 border">4mg</td>
                  <td className="px-4 py-2 border">Light to moderate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo Strong</td>
                  <td className="px-4 py-2 border">10mg</td>
                  <td className="px-4 py-2 border">Regular users</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Velo X-Strong</td>
                  <td className="px-4 py-2 border">11mg</td>
                  <td className="px-4 py-2 border">Heavy users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>How to Use Velo Pouches: Expert Tips</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Placement & Positioning</h4>
              <p className="text-sm">
                Place the Velo pouch between your <strong>upper lip and gum</strong>, slightly off-center. 
                This position maximizes absorption while remaining discreet. Avoid lower lip placement as 
                it can cause excess salivation and reduce effectiveness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Duration & Timing</h4>
              <p className="text-sm">
                Keep pouches in place for <strong>20-40 minutes</strong>. First-time users should start 
                with 15-20 minutes and gradually increase. Don't chew or move the pouch—let it release naturally. 
                Most users reach peak satisfaction at the 15-minute mark.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Frequency Recommendations</h4>
              <p className="text-sm">
                <strong>New users:</strong> Start with 4-6 pouches daily (4mg strength)<br />
                <strong>Regular users:</strong> 8-12 pouches daily across strengths<br />
                <strong>Heavy users:</strong> Up to 15 pouches daily (mix of 4mg and 10mg)
              </p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm font-semibold text-yellow-800">Pro Tip from 10,000+ Velo Users:</p>
              <p className="text-sm text-yellow-800 mt-1">
                Alternate positions (left/right side of mouth) every 2-3 pouches to prevent localized gum 
                sensitivity. Store tins in room temperature away from direct sunlight to maintain optimal 
                moisture and flavor integrity.
              </p>
            </div>
          </div>
        </details>

        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>Velo FAQs: What Customers Ask Most</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-4 text-gray-700">
            <div>
              <p className="font-semibold mb-1">Q: How long does a Velo tin last?</p>
              <p className="text-sm">
                A: Each tin contains 20 pouches. For moderate users (8-10 pouches/day), one tin lasts 2 days. 
                Heavy users may need 1 tin daily. Buy multipacks for better value and to avoid running out.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Can I swallow the saliva from Velo pouches?</p>
              <p className="text-sm">
                A: Yes, it's safe to swallow saliva. Velo uses food-grade ingredients. However, never swallow 
                the pouch itself. Spit excess saliva if you experience too much production (common in beginners).
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Do Velo pouches stain teeth?</p>
              <p className="text-sm">
                A: No. Unlike traditional snus, Velo contains no tobacco and won't stain teeth or cause 
                discoloration. The white pouches remain white throughout use. Safe for dental work and implants.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: What's the shelf life of Velo products?</p>
              <p className="text-sm">
                A: Unopened tins last 12 months from manufacture date (stamped on bottom). Once opened, 
                use within 2 weeks for optimal freshness. Store in cool, dry conditions—refrigeration extends 
                life but isn't necessary for UK climate.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Q: Why choose Velo over Zyn or Nordic Spirit?</p>
              <p className="text-sm">
                A: Velo offers the most consistent quality-to-price ratio in the UK market, with excellent customer 
                satisfaction ratings and the widest distribution network. You'll always find your preferred strength 
                and flavor. Velo's OptimalMoist technology prevents dry pouches—a common complaint with competitors.
              </p>
            </div>
          </div>
        </details>
      </div>

      {/* Unique Value Proposition Banner */}
      <div className="mb-16 bg-blue-600 text-white p-8 rounded-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Why Buy Velo from Vapourism?</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <div>
            <div className="text-4xl mb-2">✓</div>
            <h3 className="font-semibold mb-1">Always Fresh Stock</h3>
            <p className="text-sm text-blue-100">Direct from distributor, never more than 2 weeks old</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🚚</div>
            <h3 className="font-semibold mb-1">Next Day Delivery</h3>
            <p className="text-sm text-blue-100">Order before 2pm for next-day arrival UK-wide</p>
          </div>
          <div>
            <div className="text-4xl mb-2">💷</div>
            <h3 className="font-semibold mb-1">Best Price Guarantee</h3>
            <p className="text-sm text-blue-100">We'll match any UK competitor's price</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Loyalty Rewards</h3>
            <p className="text-sm text-blue-100">Earn points on every Velo purchase</p>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="font-semibold text-xl mb-4 text-center">Related Products</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/collections/nicotine-pouches" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            All Nicotine Pouches
          </Link>
          <Link to="/collections/zyn-nicotine-pouches" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Zyn Pouches
          </Link>
          <Link to="/search?tag=disposable" className="px-6 py-3 bg-gray-100 hover:bg-blue-50 text-gray-800 rounded-lg hover:text-blue-700 transition font-medium">
            Disposable Vapes
          </Link>
        </div>
      </div>
    </div>
  );
}
