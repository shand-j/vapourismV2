import {useEffect, useMemo, useRef, useState} from 'react';
import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {BRAND_CONFIG, getSearchTagFilter} from '../brand-config';
import type {ProductFilter} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => [
  {title: `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`},
  {name: 'description', content: BRAND_CONFIG.description},
  {name: 'keywords', content: BRAND_CONFIG.keywords.join(', ')},
  {property: 'og:title', content: `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`},
  {property: 'og:description', content: BRAND_CONFIG.description},
  {property: 'og:type', content: 'website'},
  {property: 'og:url', content: BRAND_CONFIG.domain},
  {property: 'og:site_name', content: BRAND_CONFIG.name},
  {property: 'og:locale', content: 'en_GB'},
  {name: 'twitter:card', content: 'summary_large_image'},
  {name: 'twitter:site', content: BRAND_CONFIG.twitter},
  {name: 'twitter:title', content: `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`},
  {name: 'twitter:description', content: BRAND_CONFIG.description},
];

interface FeaturedProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
}

interface SearchEdge {
  node?: FeaturedProduct;
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedNicotinePouches($first: Int!, $query: String!) {
    search(
      query: $query
      first: $first
      types: PRODUCT
      unavailableProducts: HIDE
    ) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url(transform: {maxWidth: 500})
              altText
            }
          }
        }
      }
    }
  }
` as const;

export async function loader({context}: LoaderFunctionArgs) {
  const storefront = context?.storefront ?? null;

  if (!storefront) {
    return {
      featuredProducts: [] as FeaturedProduct[],
    };
  }

  // Query for nicotine pouch products using tag filter
  const searchQuery = getSearchTagFilter();

  const response = await storefront.query(FEATURED_PRODUCTS_QUERY, {
    variables: {
      first: 12,
      query: searchQuery,
    },
    cache: storefront.CacheShort(),
  });

  const products = (response?.search?.edges ?? [])
    .map((edge: SearchEdge) => edge?.node)
    .filter((node: FeaturedProduct | undefined): node is FeaturedProduct => node !== undefined);

  return {
    featuredProducts: products,
  };
}

export default function IndexRoute() {
  const {featuredProducts} = useLoaderData<typeof loader>();
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frame: number | null = null;
    const handleScroll = () => {
      frame = requestAnimationFrame(() => {
        setHeroOffset(window.scrollY * 0.25);
      });
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const credibilitySignals = [
    {label: 'UK compliant', icon: 'shield'},
    {label: `Free shipping £${BRAND_CONFIG.freeShippingThreshold}+`, icon: 'truck'},
    {label: 'Discreet packaging', icon: 'package'},
  ];

  const strengthCategories = [
    {strength: '3mg', label: 'Light', description: 'Perfect for beginners', color: '#22c55e'},
    {strength: '6mg', label: 'Medium', description: 'Balanced satisfaction', color: '#0ea5e9'},
    {strength: '10mg', label: 'Strong', description: 'Experienced users', color: '#f59e0b'},
    {strength: '15mg', label: 'Extra Strong', description: 'Heavy nicotine users', color: '#ef4444'},
    {strength: '20mg', label: 'Maximum', description: 'UK legal maximum', color: '#7c3aed'},
  ];

  const whyChooseUs = [
    {
      title: 'Tobacco-Free Alternative',
      description:
        'Nicotine pouches offer a clean, smoke-free way to enjoy nicotine. No tobacco, no vapour, no odour—just discreet satisfaction anytime, anywhere.',
    },
    {
      title: 'Premium Brand Selection',
      description:
        'We stock only authentic products from trusted brands like Velo, Zyn, Nordic Spirit, and On!. Every pouch is sourced directly from authorized UK distributors.',
    },
    {
      title: 'Fast UK Delivery',
      description: `Orders placed before ${BRAND_CONFIG.dispatchCutoff} ship same day. Free delivery on orders over £${BRAND_CONFIG.freeShippingThreshold} to mainland UK addresses.`,
    },
    {
      title: 'Discreet & Convenient',
      description:
        'Plain packaging with no product references. Perfect for the office, travelling, or anywhere smoking and vaping aren\'t an option.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-teal-50 text-slate-900">
        <div className="container-custom py-12 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-xs uppercase tracking-[0.4em] text-teal-700">
                <span>Tobacco-free nicotine</span>
                <span aria-hidden="true" className="text-teal-400">•</span>
                <span>18+ verified</span>
              </div>
              <div>
                <h1 className="mb-4">
                  Premium <span className="text-gradient">nicotine pouches</span>
                </h1>
                <p className="text-lg text-slate-600">
                  Discover tobacco-free nicotine satisfaction. Discreet, smoke-free pouches from Velo, Zyn, Nordic Spirit, and more—delivered next-day to your door.
                </p>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link
                  to="/search?tag=nicotine_pouches"
                  className="btn-primary"
                >
                  Shop all pouches
                  <ArrowRightIcon />
                </Link>
                <Link
                  to="/search?tag=nicotine_pouches&vendor=Velo"
                  className="btn-secondary"
                >
                  Shop Velo
                </Link>
                <Link
                  to="/search?tag=nicotine_pouches&vendor=Zyn"
                  className="btn-secondary"
                >
                  Shop Zyn
                </Link>
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="relative h-[380px] md:h-[480px]">
              <div
                className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl"
                style={{transform: `translateY(${heroOffset * 0.3}px)`}}
              >
                <div className="h-full w-full bg-gradient-to-br from-teal-500 via-emerald-400 to-cyan-400">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                    UK's #1 Pouch Specialist
                  </span>
                  <h3 className="mt-2 text-2xl font-bold">{BRAND_CONFIG.name}</h3>
                  <p className="text-sm text-white/80">{BRAND_CONFIG.tagline}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="absolute right-4 top-4 w-48 rounded-2xl border border-white/20 bg-white/90 p-3 text-sm text-slate-800 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Quick stats</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center justify-between text-slate-600">
                    <span className="text-xs">Free delivery</span>
                    <span className="text-xs font-semibold text-slate-900">£{BRAND_CONFIG.freeShippingThreshold}+</span>
                  </li>
                  <li className="flex items-center justify-between text-slate-600">
                    <span className="text-xs">Same-day dispatch</span>
                    <span className="text-xs font-semibold text-slate-900">{BRAND_CONFIG.dispatchCutoff}</span>
                  </li>
                  <li className="flex items-center justify-between text-slate-600">
                    <span className="text-xs">Top brands</span>
                    <span className="text-xs font-semibold text-slate-900">{BRAND_CONFIG.featuredBrands.length}+</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Credibility signals */}
        <div className="border-t border-slate-200 bg-white/80">
          <div className="container-custom py-4">
            <div className="grid gap-4 text-center sm:grid-cols-3">
              {credibilitySignals.map((signal) => (
                <div key={signal.label} className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    {signal.icon === 'shield' && <ShieldIcon />}
                    {signal.icon === 'truck' && <TruckIcon />}
                    {signal.icon === 'package' && <PackageIcon />}
                  </span>
                  <span>{signal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container-custom py-16 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Featured products</p>
            <h2 className="mb-4 mt-3">Popular nicotine pouches</h2>
            <p className="text-slate-600">Top-selling pouches from trusted brands, in stock and ready for next-day delivery.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.slice(0, 8).map((product: FeaturedProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/search?tag=nicotine_pouches"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
            >
              Browse all pouches
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      )}

      {/* Shop by Strength */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Shop by strength</p>
            <h2 className="mb-4 mt-3">Find your perfect level</h2>
            <p className="text-slate-600">From light 3mg to UK maximum 20mg, we have every strength covered.</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {strengthCategories.map((cat) => (
              <Link
                key={cat.strength}
                to={`/search?tag=nicotine_pouches&tag=${cat.strength}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:shadow-lg"
              >
                <div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-bold"
                  style={{backgroundColor: cat.color}}
                >
                  {cat.strength}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{cat.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="container-custom py-16 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Shop by brand</p>
          <h2 className="mb-4 mt-3">Premium brands we stock</h2>
          <p className="text-slate-600">Only authentic products from the world's leading nicotine pouch manufacturers.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {BRAND_CONFIG.featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/search?tag=nicotine_pouches&vendor=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-2xl font-bold text-teal-600 transition group-hover:bg-teal-100">
                {brand.name.charAt(0)}
              </div>
              <span className="mt-3 text-sm font-semibold text-slate-700 group-hover:text-teal-600">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Why choose {BRAND_CONFIG.name}</p>
            <h2 className="mb-4 mt-3">Your trusted UK pouch specialist</h2>
            <p className="text-slate-600">Quality products, expert guidance, and uncompromising compliance standards</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="glass-morphism rounded-2xl border border-slate-100 p-8">
                <h3 className="mb-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nicotine Pouch Education */}
      <section className="container-custom py-16 lg:py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">New to nicotine pouches?</p>
          <h2 className="mb-4 mt-3">What are nicotine pouches?</h2>
          <p className="text-slate-600">Everything you need to know about this tobacco-free alternative</p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">How do nicotine pouches work?</h3>
            <p className="mb-4 leading-relaxed text-slate-600">
              Nicotine pouches are small, white pouches containing nicotine, plant fibres, and flavourings—but no tobacco. You place a pouch between your upper lip and gum, where nicotine is absorbed through the oral mucosa. Each pouch provides 20-60 minutes of nicotine satisfaction.
            </p>
            <p className="leading-relaxed text-slate-600">
              Unlike snus (which contains tobacco), nicotine pouches are completely tobacco-free. This means no staining, no tobacco odour, and a cleaner experience. They're also vapour-free and smoke-free, making them ideal for use anywhere.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">Choosing your strength</h3>
            <p className="leading-relaxed text-slate-600">
              Nicotine strength ranges from 3mg (light) to 20mg (UK maximum). If you're new to pouches, we recommend starting with a lower strength (3-6mg) and adjusting based on your preference. Experienced users or those transitioning from heavy smoking may prefer stronger options (10-20mg).
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">Popular flavours</h3>
            <p className="leading-relaxed text-slate-600">
              Mint and menthol flavours dominate the market, offering a fresh, cooling sensation. However, you'll also find fruity options (berry, citrus, tropical), traditional tobacco flavours, and unique blends like coffee or liquorice. We recommend trying a variety pack to discover your favourites.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: BRAND_CONFIG.name,
            url: BRAND_CONFIG.domain,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BRAND_CONFIG.domain}/search?tag=nicotine_pouches&q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: FeaturedProduct;
}

function ProductCard({product}: ProductCardProps) {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price);

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group block rounded-2xl border border-slate-100 bg-white/90 shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_35px_80px_rgba(13,148,136,0.12)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-brand-subtle">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
          {product.vendor}
        </span>
      </div>
      <div className="space-y-3 p-6">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-teal-600">{product.title}</h3>
        <p className="text-2xl font-semibold text-teal-600">{formattedPrice}</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600">
          View product
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

// Icons
function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
