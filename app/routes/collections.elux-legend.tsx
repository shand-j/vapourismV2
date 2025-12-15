/**
 * Elux Legend Collection Page
 * 
 * SEO-optimized category page for Elux Legend disposable vapes
 * Target keywords: "elux legend"
 * Search volume: 12,100 monthly searches, difficulty: 9
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Elux Legend products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:elux tag:legend tag:disposable',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const seoTitle = 'Elux Legend | Premium Disposable Vapes UK | Vapourism 2025';
  const seoDescription = 'Shop Elux Legend disposable vapes. ✓ Long-lasting performance ✓ Premium flavors ✓ Fast UK delivery ✓ Authentic Elux products. Browse the complete range.';

  return json({
    products: searchResults.products,
    totalCount: searchResults.totalCount,
    seo: {title: seoTitle, description: seoDescription},
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [{title: 'Elux Legend | Vapourism'}, {name: 'robots', content: 'noindex'}];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'elux legend, elux disposable vape, elux vape uk, elux legend 3500'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
  ];
};

export default function EluxLegendCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_elux_legend',
    listName: 'Elux Legend Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Elux Legend | Premium Disposable Vapes UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover the legendary Elux range of disposable vapes, known for exceptional flavor delivery 
          and reliable performance. A favorite choice among UK vapers.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Legendary Performance</h3>
          <p className="text-gray-600">Consistent vapor and flavor throughout</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Extended Usage</h3>
          <p className="text-gray-600">High puff count for great value</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Wide Selection</h3>
          <p className="text-gray-600">Multiple models and flavors available</p>
        </div>
      </div>

      {/* Brand Story */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About Elux Legend Brand</h2>
        <p className="text-gray-700 mb-4">
          Elux Legend has established itself as a leading name in the UK disposable vape market through consistent 
          innovation and unwavering commitment to quality. The brand combines cutting-edge vaping technology with 
          sophisticated flavor development to create devices that exceed user expectations. Each Elux Legend product 
          undergoes extensive testing to ensure optimal performance, safety compliance, and satisfaction from the first 
          to the last puff.
        </p>
        <p className="text-gray-700 mb-4">
          What sets Elux Legend apart is their attention to detail across every aspect of the vaping experience. 
          From the ergonomic mouthpiece design that ensures comfortable draws to the precision-engineered coil systems 
          that deliver consistent vapor production, every element is carefully crafted. The brand's use of high-quality 
          mesh coils provides superior flavor accuracy compared to traditional coil systems found in many competing 
          disposables.
        </p>
        <p className="text-gray-700">
          Elux Legend's commitment to sustainability and regulatory compliance makes them a responsible choice for UK 
          vapers. All products meet stringent TPD (Tobacco Products Directive) requirements and undergo third-party 
          lab testing. The brand works exclusively with authorized UK distributors to ensure product authenticity 
          and maintain the highest quality standards throughout the supply chain.
        </p>
      </div>

      {/* Product Features Deep Dive */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Elux Legend Product Features Explained</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Advanced Mesh Coil Technology</h3>
            <p className="text-gray-700">
              Elux Legend devices utilize advanced mesh coil technology that heats e-liquid more evenly than traditional 
              wire coils. This results in enhanced flavor delivery, smoother vapor production, and consistent performance 
              throughout the device's lifespan. Mesh coils have larger surface area contact with e-liquid, producing 
              fuller, more satisfying vapor clouds with every puff.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Optimized Battery Performance</h3>
            <p className="text-gray-700">
              Each Elux Legend features a carefully calibrated battery designed to last the entire duration of the 
              e-liquid capacity. The intelligent power management system ensures consistent wattage output from first 
              to last puff, preventing the weak hits and flavor degradation common in lower-quality disposables. 
              You get reliable performance without battery anxiety or diminishing satisfaction.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Premium E-Liquid Formulations</h3>
            <p className="text-gray-700">
              Elux Legend e-liquids are crafted using pharmaceutical-grade nicotine salts, food-grade flavorings, 
              and high-purity base ingredients. The carefully balanced VG/PG ratios deliver smooth throat hits and 
              satisfying nicotine delivery without harshness. Each flavor profile is developed by experienced mixologists 
              who understand UK vaper preferences and create blends that remain enjoyable for extended use.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Ergonomic Design & Portability</h3>
            <p className="text-gray-700">
              The sleek, compact design of Elux Legend devices fits comfortably in hand or pocket. The rounded mouthpiece 
              provides comfortable draws without sharp edges, while the lightweight construction ensures easy portability. 
              Subtle LED indicators provide draw activation feedback, and the matte finish prevents fingerprints and 
              maintains a premium appearance throughout use.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Guide */}
      <div className="mb-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Elux Legend Range Comparison</h2>
        <p className="text-gray-700 mb-6">
          The Elux Legend family offers multiple options to suit different vaping needs and preferences. Whether you 
          prioritize maximum puff count, portability, or specific feature sets, there's an Elux model designed for you.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Model</th>
                <th className="px-4 py-2 border">Puff Count</th>
                <th className="px-4 py-2 border">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Elux Legend 3500</td>
                <td className="px-4 py-2 border">3500 puffs</td>
                <td className="px-4 py-2 border">Everyday use, portable, value-focused vapers</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Elux Legend Mini</td>
                <td className="px-4 py-2 border">600 puffs</td>
                <td className="px-4 py-2 border">Compact, travel-friendly, trying new flavors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Complete Elux Legend Range ({totalCount})
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
              Check back shortly for the complete Elux Legend range.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Elux */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Elux Legend?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Established Brand:</strong> Trusted by vapers across the UK</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Quality Assurance:</strong> Rigorous testing and quality control</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Great Value:</strong> Competitive pricing without compromising quality</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Diverse Flavors:</strong> From classic to innovative taste profiles</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> All products meet UK regulations</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">More Disposable Vapes</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-pro-ultra" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Pro Ultra
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
