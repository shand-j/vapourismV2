/**
 * Dynamic Brand Landing Page
 * 
 * SEO-optimized landing pages for branded searches, generated dynamically
 * from product vendor data. This replaces the need for static brand collection pages.
 * 
 * URL: /brands/{brand-slug}
 * Example: /brands/hayati, /brands/elf-bar, /brands/crystal-bar
 */

import {json, redirect, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {searchProducts, type SearchProduct} from '~/lib/shopify-search';
import {useCollectionTracking} from '~/lib/hooks/useCollectionTracking';
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
  structuredDataScript,
  SITE_URL,
  type ItemListProduct,
} from '~/lib/structured-data';
import {
  getBrandKeywords,
  type DynamicKeywordResult,
} from '~/lib/dynamic-keywords';
import {normalizeVendorSlug} from '~/lib/brand-assets';

/**
 * Brand-specific content data for enhanced landing pages
 * This can be extended with brand media pack data in the future
 */
interface BrandContentData {
  tagline: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
}

/**
 * Get default brand content when no specific content exists
 */
function getDefaultBrandContent(brandName: string): BrandContentData {
  return {
    tagline: `Discover the complete ${brandName} range at Vapourism UK`,
    features: [
      {
        title: '✓ Authentic Products',
        description: 'Genuine products from official suppliers',
      },
      {
        title: '✓ Fast UK Delivery',
        description: 'Next day delivery available',
      },
      {
        title: '✓ Best Prices',
        description: 'Competitive prices guaranteed',
      },
    ],
    benefits: [
      'Official UK stockist',
      'Full product warranty',
      'Expert customer support',
      'Secure checkout',
      'Free delivery on orders over £30',
    ],
  };
}

/**
 * Convert URL slug to vendor name format for searching
 * Examples: "hayati-pro" -> "Hayati Pro", "elf-bar" -> "Elf Bar"
 */
function slugToVendorName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract unique product types from products
 */
function extractProductTypes(products: SearchProduct[]): string[] {
  const types = new Set<string>();
  products.forEach(product => {
    if (product.productType) {
      types.add(product.productType);
    }
  });
  return Array.from(types).slice(0, 10);
}

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const brandSlug = params.brand;

  if (!brandSlug) {
    throw new Response('Brand not found', {status: 404});
  }

  // Convert slug to vendor name for searching
  const vendorName = slugToVendorName(brandSlug);
  
  // Search for products by vendor
  const searchResults = await searchProducts(
    storefront,
    `vendor:"${vendorName}"`,
    {
      sortKey: 'RELEVANCE',
      reverse: false,
      first: 48,
    }
  );

  // If no products found, try alternative vendor name formats
  if (searchResults.products.length === 0) {
    // Try with the slug as-is (some vendors might use lowercase)
    const altSearchResults = await searchProducts(
      storefront,
      `vendor:"${brandSlug}"`,
      {
        sortKey: 'RELEVANCE',
        reverse: false,
        first: 48,
      }
    );

    if (altSearchResults.products.length === 0) {
      throw new Response('Brand not found', {status: 404});
    }

    // Use the actual vendor name from the products
    const actualVendor = altSearchResults.products[0].vendor;
    const productTypes = extractProductTypes(altSearchResults.products);

    // Generate SEO keywords
    const keywords = getBrandKeywords(
      actualVendor,
      altSearchResults.totalCount,
      productTypes
    );

    return json({
      products: altSearchResults.products,
      totalCount: altSearchResults.totalCount,
      brandSlug,
      brandName: actualVendor,
      productTypes,
      keywords,
      brandContent: getDefaultBrandContent(actualVendor),
    });
  }

  // Use the actual vendor name from the first product (preserves casing)
  const actualVendorName = searchResults.products[0]?.vendor || vendorName;
  const productTypes = extractProductTypes(searchResults.products);

  // Generate SEO keywords
  const keywords = getBrandKeywords(
    actualVendorName,
    searchResults.totalCount,
    productTypes
  );

  return json({
    products: searchResults.products,
    totalCount: searchResults.totalCount,
    brandSlug,
    brandName: actualVendorName,
    productTypes,
    keywords,
    brandContent: getDefaultBrandContent(actualVendorName),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data) {
    return [
      {title: 'Brand Not Found | Vapourism'},
      {name: 'robots', content: 'noindex'},
    ];
  }

  const {brandName, keywords, totalCount, productTypes} = data;
  const year = new Date().getFullYear();
  
  // Use dynamic keyword service output
  const title = keywords.title;
  const description = keywords.metaDescription;
  const keywordList = [
    ...keywords.primaryKeywords,
    ...keywords.secondaryKeywords.slice(0, 5),
    ...keywords.longTailKeywords.slice(0, 3),
  ].join(', ');

  return [
    {title},
    {name: 'description', content: description},
    {name: 'keywords', content: keywordList},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: `${SITE_URL}/brands/${data.brandSlug}`},
    {property: 'og:site_name', content: 'Vapourism'},
    {property: 'og:locale', content: 'en_GB'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    // Canonical URL
    {tagName: 'link', rel: 'canonical', href: `${SITE_URL}/brands/${data.brandSlug}`},
  ];
};

export default function BrandPage() {
  const {
    products,
    totalCount,
    brandSlug,
    brandName,
    productTypes,
    keywords,
    brandContent,
  } = useLoaderData<typeof loader>();

  // Track collection view with GA4
  useCollectionTracking({
    products,
    listId: `brand_${brandSlug}`,
    listName: `${brandName} Brand Page`,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Dynamic H1 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {keywords.h1}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {brandContent.tagline}
        </p>
        {totalCount > 0 && (
          <p className="mt-4 text-lg text-blue-600 font-medium">
            {totalCount} products available
          </p>
        )}
      </div>

      {/* Key Features / Trust Signals */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {brandContent.features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Brand Story / Content Section */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Shop {brandName} at Vapourism UK
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-4">
              Discover the complete range of <strong>{brandName}</strong> vaping products 
              at Vapourism, your trusted UK vape retailer. We stock only genuine, 
              authenticated products with full manufacturer warranty.
            </p>
            <p className="text-gray-700 mb-4">
              As an official {brandName} UK stockist, we ensure you receive authentic products 
              with competitive pricing and fast delivery across the United Kingdom.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">Why Buy {brandName} From Us</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {brandContent.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Product Type Stats */}
        {productTypes.length > 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">{totalCount}</div>
              <div className="text-sm text-gray-600">Products Available</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">{productTypes.length}</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1">UK</div>
              <div className="text-sm text-gray-600">Fast Delivery</div>
            </div>
          </div>
        )}
      </div>

      {/* Product Types Navigation */}
      {productTypes.length > 1 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{brandName} Product Categories</h2>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((type) => (
              <Link
                key={type}
                to={`/search?q=${encodeURIComponent(brandName + ' ' + type)}`}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                {type}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          All {brandName} Products ({totalCount})
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
                    loading="lazy"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-blue-600 transition line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{product.productType}</p>
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
              Check back shortly for the complete {brandName} range.
            </p>
          </div>
        )}
      </div>

      {/* Brand Benefits Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Buy {brandName} with Confidence</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>100% Authentic:</strong> All {brandName} products are sourced directly from authorized distributors</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Fast UK Delivery:</strong> Next day delivery available on orders placed before 2pm</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Expert Support:</strong> Our team is available to help you choose the right {brandName} product</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Secure Payment:</strong> Shop with confidence using our secure checkout</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span><strong>Full Warranty:</strong> All products come with manufacturer warranty</span>
          </li>
        </ul>
      </div>

      {/* Related Links */}
      <div className="border-t pt-8">
        <h3 className="font-semibold text-lg mb-4">Explore More Brands</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/brands" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            All Brands
          </Link>
          <Link to="/search" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Browse All Products
          </Link>
          <Link to="/search?tag=disposable" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Disposable Vapes
          </Link>
          <Link to="/search?tag=e-liquid" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            E-Liquids
          </Link>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script {...structuredDataScript(generateCollectionPageSchema({
        name: `${brandName} | Official UK Stockist | Vapourism`,
        description: `Shop the complete ${brandName} range at Vapourism UK. Authentic products, fast delivery, best prices.`,
        url: `${SITE_URL}/brands/${brandSlug}`,
        numberOfItems: totalCount,
      }))} />
      <script {...structuredDataScript(generateBreadcrumbSchema([
        {name: 'Home', url: SITE_URL},
        {name: 'Brands', url: `${SITE_URL}/brands`},
        {name: brandName, url: `${SITE_URL}/brands/${brandSlug}`},
      ]))} />
      {products.length > 0 && (
        <script {...structuredDataScript(generateItemListSchema({
          name: `${brandName} Products`,
          description: `${brandName} vaping products available at Vapourism UK`,
          items: products.slice(0, 10).map((product): ItemListProduct => ({
            name: product.title,
            url: `${SITE_URL}/products/${product.handle}`,
            image: product.featuredImage?.url,
            description: product.description || product.title,
            price: product.priceRange?.minVariantPrice.amount,
            priceCurrency: product.priceRange?.minVariantPrice.currencyCode || 'GBP',
          })),
        }))} />
      )}
    </div>
  );
}
