/**
 * Structured Data Utilities
 * Extracts JSON-LD schema generation to reduce inline script bloat in components
 */

/**
 * Site-wide constants for structured data
 */
export const SITE_URL = 'https://www.vapourism.co.uk';
export const SITE_NAME = 'Vapourism';
export const SITE_LOGO = `${SITE_URL}/logo.png`;
export const SITE_EMAIL = 'hello@vapourism.co.uk';
export const SOCIAL_LINKS = [
  'https://twitter.com/vapourismuk',
  'https://www.facebook.com/vapourism',
  'https://www.instagram.com/vapourismuk',
];

export interface OrganizationSchemaParams {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  addressCountry?: string;
  addressRegion?: string;
  email?: string;
  socialLinks?: string[];
}

export function generateOrganizationSchema(params: OrganizationSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name,
    url: params.url,
    ...(params.logo && { logo: params.logo }),
    ...(params.description && { description: params.description }),
    ...(params.addressCountry && {
      address: {
        '@type': 'PostalAddress',
        addressCountry: params.addressCountry,
        ...(params.addressRegion && { addressRegion: params.addressRegion }),
      },
    }),
    ...(params.email && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: params.email,
      },
    }),
    ...(params.socialLinks && params.socialLinks.length > 0 && {
      sameAs: params.socialLinks,
    }),
  };
}

export interface WebsiteSchemaParams {
  name: string;
  url: string;
  searchUrlTemplate?: string;
}

export function generateWebsiteSchema(params: WebsiteSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: params.name,
    url: params.url,
    ...(params.searchUrlTemplate && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: params.searchUrlTemplate,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

export interface ProductSchemaParams {
  name: string;
  description: string;
  image: string[];
  brand: string;
  sku?: string;
  gtin?: string;
  price: string;
  priceCurrency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function generateProductSchema(params: ProductSchemaParams) {
  // Ensure price is a number as required by Google
  const priceValue = typeof params.price === 'string' ? parseFloat(params.price) : params.price;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    description: params.description,
    image: params.image,
    brand: {
      '@type': 'Brand',
      name: params.brand,
    },
    ...(params.sku && { sku: params.sku }),
    ...(params.gtin && { gtin: params.gtin }),
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: params.priceCurrency,
      availability: `https://schema.org/${params.availability}`,
      url: params.url,
    },
    ...(params.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: params.rating.ratingValue,
        reviewCount: params.rating.reviewCount,
      },
    }),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to create a script tag for structured data
 * Usage: <script {...structuredDataScript(schema)} />
 */
export function structuredDataScript(schema: Record<string, unknown>) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
  };
}

/**
 * Generate FAQ Page Schema
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate ItemList Schema for Collection Pages
 */
export interface ItemListProduct {
  name: string;
  url: string;
  image?: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
}

export function generateItemListSchema(params: {
  name: string;
  description?: string;
  items: ItemListProduct[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: params.name,
    ...(params.description && { description: params.description }),
    numberOfItems: params.items.length,
    itemListElement: params.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description }),
        ...(item.price && item.priceCurrency && {
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: item.priceCurrency,
          },
        }),
      },
    })),
  };
}

/**
 * Generate CollectionPage Schema
 */
export function generateCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: params.url,
    mainEntity: {
      '@type': 'ItemList',
      name: params.name,
      description: params.description,
      numberOfItems: params.numberOfItems,
    },
  };
}

/**
 * Generate AboutPage Schema
 */
export function generateAboutPageSchema(params: {
  name: string;
  description: string;
  url: string;
  foundingDate?: string;
  founders?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: params.name,
    description: params.description,
    url: params.url,
    mainEntity: {
      '@type': 'Organization',
      name: params.name,
      ...(params.foundingDate && { foundingDate: params.foundingDate }),
      ...(params.founders && params.founders.length > 0 && {
        founders: params.founders.map(founder => ({
          '@type': 'Person',
          name: founder,
        })),
      }),
    },
  };
}
