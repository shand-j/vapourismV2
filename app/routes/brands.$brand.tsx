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
  brandStory: {
    title: string;
    paragraphs: string[];
    highlights: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  productHighlights: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  usageGuide: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    proTip: string;
  };
}

/**
 * Get default brand content when no specific content exists
 */
function getDefaultBrandContent(brandName: string): BrandContentData {
  const year = new Date().getFullYear();
  
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
    brandStory: {
      title: `${brandName}: Quality You Can Trust`,
      paragraphs: [
        `${brandName} has established itself as a trusted name in the UK vaping industry, known for delivering consistent quality and innovative products. Whether you're new to vaping or an experienced user, ${brandName} offers products designed to meet diverse preferences and needs. The brand's commitment to quality control ensures every product meets strict UK standards and TPD compliance regulations.`,
        `At Vapourism, we're proud to be an official ${brandName} UK stockist, bringing you the complete range of authentic ${brandName} products. Our partnership with ${brandName} means you receive genuine products with full manufacturer backing, competitive pricing, and the peace of mind that comes with buying from an authorized retailer. Every ${brandName} product in our inventory is sourced directly from verified suppliers and stored in optimal conditions to maintain freshness and quality.`,
        `The ${brandName} lineup features carefully crafted products that cater to different vaping styles and preferences. From smooth, satisfying flavours to reliable performance, ${brandName} consistently delivers experiences that keep vapers coming back. Their dedication to using premium ingredients and advanced manufacturing processes sets them apart in the competitive UK vape market.`,
      ],
      highlights: [
        {
          icon: '🔬',
          title: 'Quality Tested',
          description: `Every ${brandName} product undergoes rigorous quality testing before reaching our shelves`,
        },
        {
          icon: '🇬🇧',
          title: 'UK Compliant',
          description: 'Full TPD compliance and MHRA registration for peace of mind',
        },
        {
          icon: '⭐',
          title: 'Customer Favourite',
          description: `${brandName} products consistently receive excellent customer reviews`,
        },
      ],
    },
    productHighlights: [
      {
        title: 'Premium Quality Construction',
        description: `${brandName} products feature high-quality materials and precision engineering for reliable performance`,
      },
      {
        title: 'Authentic Flavour Profiles',
        description: 'Carefully developed flavours that deliver consistent, enjoyable taste experiences',
      },
      {
        title: 'User-Friendly Design',
        description: 'Intuitive designs suitable for beginners and experienced vapers alike',
      },
      {
        title: 'UK Safety Standards',
        description: 'Full compliance with UK TPD regulations and safety requirements',
      },
      {
        title: 'Consistent Performance',
        description: 'Reliable performance from first use to last, with quality you can depend on',
      },
      {
        title: 'Wide Selection',
        description: `Explore the full ${brandName} range to find products that match your preferences`,
      },
    ],
    faqs: [
      {
        question: `Are ${brandName} products genuine and authentic?`,
        answer: `Yes, all ${brandName} products sold at Vapourism are 100% genuine and sourced directly from authorized distributors. We are an official UK stockist, which means every product comes with full manufacturer warranty and authenticity guarantee. Look for verification codes on packaging to confirm authenticity.`,
      },
      {
        question: `How quickly can I receive my ${brandName} order?`,
        answer: `We offer fast UK delivery on all ${brandName} products. Orders placed before 2pm on working days are typically dispatched the same day. Standard delivery takes 1-3 business days, and we offer next-day delivery options for urgent orders. Free delivery is available on orders over £30.`,
      },
      {
        question: `What nicotine strengths are available in ${brandName} products?`,
        answer: `${brandName} products are available in various nicotine strengths to suit different preferences. Most products comply with UK TPD regulations with maximum 20mg/ml nicotine. Check individual product listings for specific strength options. If you're unsure which strength is right for you, our customer service team is happy to help.`,
      },
      {
        question: `Can I return ${brandName} products if I'm not satisfied?`,
        answer: `Due to hygiene regulations, opened vaping products cannot be returned. However, we accept returns of sealed, unused products within 14 days of delivery. If you receive a faulty ${brandName} product, please contact us immediately for a replacement or refund. All products are covered by manufacturer warranty.`,
      },
      {
        question: `How should I store my ${brandName} products?`,
        answer: `Store ${brandName} products in a cool, dry place away from direct sunlight and extreme temperatures. Room temperature (15-25°C) is ideal. Keep products upright when possible and away from children and pets. Proper storage helps maintain product quality and extends shelf life.`,
      },
      {
        question: `Are ${brandName} products suitable for beginners?`,
        answer: `Many ${brandName} products are designed with user-friendliness in mind, making them suitable for beginners. Look for products with simple operation and moderate nicotine strengths. If you're new to vaping, consider starting with lower nicotine options. Our product descriptions include guidance on suitability for different experience levels.`,
      },
    ],
    usageGuide: {
      title: `Getting the Best from Your ${brandName} Products`,
      sections: [
        {
          heading: 'Before First Use',
          content: `When you receive your ${brandName} product, inspect the packaging for any damage and verify authenticity using any provided verification codes. Remove all protective packaging and seals before use. For disposable devices, remove any silicone caps or stickers from the mouthpiece and airflow areas. Allow the product to reach room temperature if it was stored in cold conditions.`,
        },
        {
          heading: 'Optimal Usage Tips',
          content: `For the best experience with ${brandName} products, take slow, steady draws rather than quick, aggressive puffs. This helps prevent flooding and ensures optimal flavor delivery. If using a rechargeable device, charge fully before first use using only the provided cable. Allow a few seconds between puffs to prevent overheating and maintain flavor quality.`,
        },
        {
          heading: 'Maintenance & Care',
          content: `Keep your ${brandName} products clean and free from debris. For rechargeable devices, clean the connection points regularly with a dry cloth. Store products upright when possible to prevent leaking. Avoid exposing products to extreme temperatures or moisture. Replace coils or pods according to manufacturer guidelines for best performance.`,
        },
      ],
      proTip: `To maximize the lifespan and performance of your ${brandName} products, avoid chain vaping (taking puffs in rapid succession). Give 5-10 seconds between draws to allow the wick to re-saturate. This simple technique can significantly extend product life and maintain consistent flavor quality throughout use.`,
    },
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

      {/* Brand Story Section - Enhanced with more text */}
      <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          {brandContent.brandStory.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {brandContent.brandStory.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
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
        
        {/* Brand Highlights */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {brandContent.brandStory.highlights.map((highlight, index) => (
            <div key={index} className="bg-white p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl mb-2">{highlight.icon}</div>
              <div className="font-bold text-gray-900 mb-1">{highlight.title}</div>
              <div className="text-sm text-gray-600">{highlight.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Highlights Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">{brandName} Product Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandContent.productHighlights.map((highlight, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition">
              <h3 className="font-bold text-lg mb-2 text-gray-900">{highlight.title}</h3>
              <p className="text-gray-600 text-sm">{highlight.description}</p>
            </div>
          ))}
        </div>
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
      <div className="mb-12">
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
                  {product.priceRange?.minVariantPrice?.amount && (
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

      {/* Usage Guide Section - Expandable */}
      <div className="mb-12 space-y-4">
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>{brandContent.usageGuide.title}</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-6 text-gray-700">
            {brandContent.usageGuide.sections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2 text-gray-900">{section.heading}</h4>
                <p className="text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 Pro Tip</p>
              <p className="text-sm text-blue-800">{brandContent.usageGuide.proTip}</p>
            </div>
          </div>
        </details>

        {/* FAQs Section - Expandable */}
        <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
          <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
            <span>{brandName} FAQs: Your Questions Answered</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-6 bg-gray-50 space-y-6 text-gray-700">
            {brandContent.faqs.map((faq, index) => (
              <div key={index}>
                <p className="font-semibold mb-2 text-gray-900">Q: {faq.question}</p>
                <p className="text-sm leading-relaxed">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Authenticity Guarantee Banner */}
      <div className="mb-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Authentic {brandName} Guarantee</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🔒</div>
            <h3 className="font-bold mb-2">100% Genuine</h3>
            <p className="text-sm text-purple-100">
              Official {brandName} stockist. Every product authenticated and verified.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-bold mb-2">Fresh Stock</h3>
            <p className="text-sm text-purple-100">
              Regular deliveries ensure you always receive fresh, quality products.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎁</div>
            <h3 className="font-bold mb-2">Great Deals</h3>
            <p className="text-sm text-purple-100">
              Competitive prices and multi-buy discounts available.
            </p>
          </div>
        </div>
      </div>

      {/* Additional SEO Content Section */}
      <div className="mb-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Buy {brandName} with Confidence at Vapourism UK</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            When you shop for {brandName} products at Vapourism, you&apos;re choosing a trusted UK retailer 
            with a proven track record of excellent customer service and authentic products. We understand 
            that quality and authenticity matter, which is why we source all {brandName} products directly 
            from authorized UK distributors.
          </p>
          <p className="mb-4">
            Our commitment to customer satisfaction extends beyond just selling products. We provide 
            comprehensive product information, expert advice, and responsive customer support to help 
            you make informed purchasing decisions. Whether you&apos;re new to {brandName} or a long-time 
            fan, our team is here to assist you.
          </p>
          <p>
            Join thousands of satisfied customers who trust Vapourism for their {brandName} purchases. 
            With fast UK delivery, secure payment options, and a satisfaction guarantee, shopping for 
            {brandName} has never been easier or more convenient.
          </p>
        </div>
      </div>

      {/* Product Stats & Confidence Section */}
      <div className="mb-12 grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{totalCount}+</div>
          <div className="text-sm text-gray-600">{brandName} Products</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">UK</div>
          <div className="text-sm text-gray-600">Fast Delivery</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
          <div className="text-sm text-gray-600">Authentic Products</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">£30+</div>
          <div className="text-sm text-gray-600">Free Delivery</div>
        </div>
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
            price: product.priceRange?.minVariantPrice?.amount,
            priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || 'GBP',
          })),
        }))} />
      )}
    </div>
  );
}
