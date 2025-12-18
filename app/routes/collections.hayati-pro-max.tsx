/**
 * Hayati Pro Max Collection Page
 * 
 * SEO-optimized category page for Hayati Pro Max e-liquids
 * Target keywords: "hayati pro max", "hayati pro max e-liquid"
 * Search volume: 22,200 monthly searches, difficulty: 16
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {SEOAutomationService} from '~/preserved/seo-automation';
import {searchProducts} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';
import {generateCollectionPageSchema, generateBreadcrumbSchema, structuredDataScript} from '~/lib/structured-data';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Search for Hayati Pro Max e-liquid products using tag-based query
  const searchResults = await searchProducts(
    storefront,
    'tag:hayati tag:pro_max tag:e-liquid',
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  const topBrands = [...new Set(searchResults.products.map(p => p.vendor))].slice(0, 5);
  const categoryTitle = 'Hayati Pro Max E-Liquids';
  const seoTitle = SEOAutomationService.generateCategoryTitle(categoryTitle, searchResults.totalCount);
  const seoDescription = SEOAutomationService.generateCategoryMetaDescription(
    categoryTitle,
    searchResults.totalCount,
    topBrands
  );

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
    return [
      {title: 'Hayati Pro Max | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  return [
    {title: data.seo.title},
    {name: 'description', content: data.seo.description},
    {name: 'keywords', content: 'hayati pro max, hayati pro max e-liquid, hayati vape juice, premium e-liquid uk'},
    {property: 'og:title', content: data.seo.title},
    {property: 'og:description', content: data.seo.description},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: data.seo.title},
    {name: 'twitter:description', content: data.seo.description},
  ];
};

export default function HayatiProMaxCollection() {
  const {products, totalCount} = useLoaderData<typeof loader>();

  useCollectionTracking({
    products,
    listId: 'collection_hayati_pro_max',
    listName: 'Hayati Pro Max Collection',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Hayati Pro Max E-Liquids | Premium Vape Juice UK
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Shop the complete Hayati Pro Max e-liquid range. Premium formulations with authentic 
          flavors and smooth nicotine salt delivery. Perfect for all-day vaping.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Premium Formulations</h3>
          <p className="text-gray-600">High-quality ingredients for authentic flavor</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Nicotine Salt</h3>
          <p className="text-gray-600">Smooth throat hit and rapid satisfaction</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">✓ Wide Flavor Range</h3>
          <p className="text-gray-600">Something for every taste preference</p>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mb-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Hayati Pro Max E-Liquid Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Feature</th>
                <th className="px-4 py-2 border">Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-semibold">Nicotine Type</td>
                <td className="px-4 py-2 border">Nicotine Salt</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Nicotine Strength</td>
                <td className="px-4 py-2 border">10mg or 20mg options</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Bottle Size</td>
                <td className="px-4 py-2 border">10ml TPD compliant</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">VG/PG Ratio</td>
                <td className="px-4 py-2 border">50/50 blend</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-semibold">Best For</td>
                <td className="px-4 py-2 border">Mouth-to-Lung (MTL) devices</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All Hayati Pro Max E-Liquids ({totalCount})
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
              Check back shortly for the complete Hayati Pro Max e-liquid range.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Hayati Pro Max E-Liquids?</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Authentic Flavors:</strong> Premium formulations for true taste</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Smooth Nicotine Salt:</strong> Rapid satisfaction with gentle throat hit</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>50/50 VG/PG Blend:</strong> Perfect balance for MTL devices</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>TPD Compliant:</strong> Meets all UK vaping regulations</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Compatible with Hayati Devices:</strong> Works perfectly with X4 and Remix</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Related Collections</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/collections/hayati-x4" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati X4 Device
          </Link>
          <Link to="/collections/hayati-remix" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Hayati Remix Device
          </Link>
          <Link to="/collections/riot-squad" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Riot Squad E-Liquids
          </Link>
          <Link to="/search?tag=e-liquid" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All E-Liquids
          </Link>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script {...structuredDataScript(generateCollectionPageSchema({
        name: 'Hayati Pro Max E-Liquids | Premium Vape Juice UK',
        description: 'Shop the complete Hayati Pro Max e-liquid range. Premium formulations with authentic flavors and smooth nicotine salt delivery.',
        url: 'https://www.vapourism.co.uk/collections/hayati-pro-max',
        numberOfItems: totalCount,
      }))} />
      <script {...structuredDataScript(generateBreadcrumbSchema([
        { name: 'Home', url: 'https://www.vapourism.co.uk' },
        { name: 'Collections', url: 'https://www.vapourism.co.uk/search' },
        { name: 'Hayati Pro Max', url: 'https://www.vapourism.co.uk/collections/hayati-pro-max' },
      ]))} />
    </div>
  );
}
