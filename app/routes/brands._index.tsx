/**
 * Brands Index Page
 * 
 * Lists all available product brands with SEO-optimized content.
 * Dynamically generates brand list from Shopify product vendors.
 * 
 * URL: /brands
 */

import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {normalizeVendorSlug} from '~/lib/brand-assets';
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  structuredDataScript,
  SITE_URL,
} from '~/lib/structured-data';

interface BrandInfo {
  name: string;
  slug: string;
  productCount: number;
}

/**
 * GraphQL query to get all vendors with product counts
 */
const ALL_VENDORS_QUERY = `#graphql
  query AllVendors($first: Int, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        vendor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
` as const;

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Fetch all products to extract unique vendors
  const vendorCounts = new Map<string, number>();
  let hasNextPage = true;
  let endCursor: string | null = null;

  while (hasNextPage) {
    const response = await storefront.query(ALL_VENDORS_QUERY, {
      variables: {
        first: 250,
        after: endCursor,
      },
      cache: storefront.CacheLong(),
    }) as {
      products: {
        nodes: Array<{vendor: string}>;
        pageInfo: {hasNextPage: boolean; endCursor: string | null};
      };
    };

    response.products.nodes.forEach((product) => {
      if (product.vendor) {
        const count = vendorCounts.get(product.vendor) || 0;
        vendorCounts.set(product.vendor, count + 1);
      }
    });

    hasNextPage = response.products.pageInfo.hasNextPage;
    endCursor = response.products.pageInfo.endCursor;
  }

  // Convert to array and sort by product count
  const brands: BrandInfo[] = Array.from(vendorCounts.entries())
    .map(([name, count]) => ({
      name,
      slug: normalizeVendorSlug(name),
      productCount: count,
    }))
    .filter(brand => brand.productCount >= 1) // Only show brands with products
    .sort((a, b) => b.productCount - a.productCount);

  return json({
    brands,
    totalBrands: brands.length,
    totalProducts: Array.from(vendorCounts.values()).reduce((sum, count) => sum + count, 0),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const year = new Date().getFullYear();
  const brandCount = data?.totalBrands || 0;
  
  const title = `Vape Brands UK | ${brandCount}+ Official Brand Stockists | Vapourism ${year}`;
  const description = `Browse all vape brands at Vapourism UK. Official stockist of ${brandCount}+ brands including disposables, e-liquids & kits. ✓ Authentic products ✓ Fast UK delivery ✓ Best prices.`;

  return [
    {title},
    {name: 'description', content: description},
    {name: 'keywords', content: 'vape brands uk, vape brand stockist, disposable vape brands, e-liquid brands, vaping brands uk, official vape retailer'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: `${SITE_URL}/brands`},
    {property: 'og:site_name', content: 'Vapourism'},
    {property: 'og:locale', content: 'en_GB'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {tagName: 'link', rel: 'canonical', href: `${SITE_URL}/brands`},
  ];
};

export default function BrandsIndexPage() {
  const {brands, totalBrands, totalProducts} = useLoaderData<typeof loader>();

  // Group brands alphabetically
  const brandsByLetter = brands.reduce((acc, brand) => {
    const letter = brand.name.charAt(0).toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(brand);
    return acc;
  }, {} as Record<string, BrandInfo[]>);

  const sortedLetters = Object.keys(brandsByLetter).sort();

  // Get top brands (by product count)
  const topBrands = brands.slice(0, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Vape Brands UK | Official Stockist
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Discover {totalBrands}+ vaping brands at Vapourism. As an official UK stockist, 
          we bring you authentic products from the world&apos;s leading vape manufacturers.
        </p>
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{totalBrands}+</div>
            <div className="text-sm text-gray-600">Brands</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{totalProducts}+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">UK</div>
            <div className="text-sm text-gray-600">Fast Delivery</div>
          </div>
        </div>
      </div>

      {/* Top Brands */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Most Popular Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {topBrands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/brands/${brand.slug}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center group"
            >
              <div className="font-semibold group-hover:text-blue-600 transition">
                {brand.name}
              </div>
              <div className="text-sm text-gray-500">
                {brand.productCount} products
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Shop Brands at Vapourism</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">100% Authentic</h3>
            <p className="text-sm text-gray-600">
              Genuine products from authorized distributors
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-semibold mb-2">Fast UK Delivery</h3>
            <p className="text-sm text-gray-600">
              Next day delivery on orders before 2pm
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold mb-2">Best Prices</h3>
            <p className="text-sm text-gray-600">
              Competitive pricing across all brands
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-semibold mb-2">Free Delivery</h3>
            <p className="text-sm text-gray-600">
              On orders over £30
            </p>
          </div>
        </div>
      </div>

      {/* Alphabetical Brand Listing */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All Brands A-Z</h2>
        
        {/* Letter Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#brand-${letter}`}
              className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-semibold"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Brand List by Letter */}
        <div className="space-y-8">
          {sortedLetters.map((letter) => (
            <div key={letter} id={`brand-${letter}`} className="scroll-mt-20">
              <h3 className="text-xl font-bold mb-4 text-blue-600 border-b pb-2">
                {letter}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brandsByLetter[letter].map((brand) => (
                  <Link
                    key={brand.slug}
                    to={`/brands/${brand.slug}`}
                    className="hover:text-blue-600 transition"
                  >
                    <span className="font-medium">{brand.name}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({brand.productCount})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">UK&apos;s Largest Vape Brand Selection</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            Vapourism is proud to be an official stockist of {totalBrands}+ vaping brands, 
            offering one of the UK&apos;s largest selections of authentic vaping products. 
            From industry-leading disposable vape brands like Elf Bar, Lost Mary, and Hayati, 
            to premium e-liquid manufacturers and advanced vaping device brands—we stock 
            them all.
          </p>
          <p className="mb-4">
            Every product in our range is sourced directly from authorized UK distributors, 
            ensuring you receive 100% genuine products with full manufacturer warranty. 
            We work closely with brands to bring you the latest releases and best-selling 
            products at competitive prices.
          </p>
          <p>
            Browse our comprehensive brand directory to find your favorite vaping products, 
            or discover new brands that match your vaping style. With fast UK delivery and 
            expert customer support, Vapourism is your trusted destination for authentic 
            vaping brands.
          </p>
        </div>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Disposable Vapes
          </Link>
          <Link to="/search?tag=e-liquid" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            E-Liquids
          </Link>
          <Link to="/search?tag=pod" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Pod Systems
          </Link>
          <Link to="/search?tag=nicotine_pouches" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Nicotine Pouches
          </Link>
          <Link to="/search" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Products
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script {...structuredDataScript(generateCollectionPageSchema({
        name: 'Vape Brands UK | Official Stockist | Vapourism',
        description: `Browse ${totalBrands}+ vaping brands at Vapourism UK. Official stockist with authentic products and fast delivery.`,
        url: `${SITE_URL}/brands`,
        numberOfItems: totalBrands,
      }))} />
      <script {...structuredDataScript(generateBreadcrumbSchema([
        {name: 'Home', url: SITE_URL},
        {name: 'Brands', url: `${SITE_URL}/brands`},
      ]))} />
    </div>
  );
}
