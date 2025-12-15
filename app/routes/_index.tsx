import {useEffect, useMemo, useRef, useState} from 'react';
import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {ProductCard} from '~/components/ProductCard';
import type {ProductCardProduct} from '~/components/ProductCard';
import {Icon} from '~/components/ui/Icon';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  structuredDataScript,
} from '~/lib/structured-data';
import {
  fetchAllShowcases,
  FALLBACK_FEATURED_PRODUCTS_QUERY,
  type FallbackFeaturedResponse,
} from '~/lib/product-showcases';

const STAR_POSITIONS = ['first', 'second', 'third', 'fourth', 'fifth'] as const;
const EXPERIENCE_BACKDROPS = [
  'https://images.unsplash.com/photo-1662726624550-b6ec48911a42?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1748723594319-142e211b46a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1661188473544-2776118cadcd?auto=format&fit=crop&w=1200&q=80',
];

export const meta: MetaFunction = () => [
  {title: 'Vapourism | Premium UK Vape Shop | E-Liquids, Vape Kits & Accessories'},
  {
    name: 'description',
    content: 'Shop authentic vape kits, premium e-liquids, nic salts, and vaping accessories at Vapourism UK. ✓ Age verified ✓ Next-day delivery ✓ Free shipping over £20 ✓ Genuine products only.',
  },
  {
    name: 'keywords',
    content: 'vape shop UK, e-liquid, vape kits, nic salts, vaping accessories, premium vaping, UK vape delivery, authentic vape products, disposable vapes, pod systems',
  },
  {
    property: 'og:title',
    content: 'Vapourism | Premium UK Vape Shop',
  },
  {
    property: 'og:description',
    content: 'Shop authentic vape kits, premium e-liquids, and accessories. Age verified, next-day UK delivery available.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://vapourism.co.uk',
  },
  {
    property: 'og:site_name',
    content: 'Vapourism',
  },
  {
    property: 'og:locale',
    content: 'en_GB',
  },
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:site',
    content: '@vapourismuk',
  },
  {
    name: 'twitter:title',
    content: 'Vapourism | Premium UK Vape Shop',
  },
  {
    name: 'twitter:description',
    content: 'Shop authentic vape kits, premium e-liquids, and accessories with next-day UK delivery.',
  },
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

export async function loader({context}: LoaderFunctionArgs) {
  const storefront = context?.storefront ?? null;

  if (!storefront) {
    // During some SSR dev runs the Hydrogen context may not be available.
    // Return safe empty defaults to avoid throwing and allow hot reloads.
    return {
      featuredProducts: [] as ProductCardProduct[],
      showcaseProducts: {
        featured: [] as ProductCardProduct[],
        newArrivals: [] as ProductCardProduct[],
        bestSellers: [] as ProductCardProduct[],
      },
    };
  }

  // Fetch showcase products from boolean metafields in parallel with fallback
  const [showcases, fallbackData] = await Promise.all([
    fetchAllShowcases(storefront, {
      featured: 12,
      newArrivals: 8,
      bestSellers: 8,
    }),
    storefront.query<FallbackFeaturedResponse>(FALLBACK_FEATURED_PRODUCTS_QUERY, {
      variables: {first: 12},
      cache: storefront.CacheShort(),
    }),
  ]);

  const fallbackProducts = fallbackData?.products?.nodes ?? [];

  // Use metafield products if available, otherwise fall back to best-selling
  const showcaseProducts = {
    featured: showcases.featured.length > 0 ? showcases.featured : fallbackProducts.slice(0, 8),
    newArrivals: showcases.newArrivals,
    bestSellers: showcases.bestSellers,
  };

  return {
    featuredProducts: fallbackProducts,
    showcaseProducts,
  };
}

export default function IndexRoute() {
  const {featuredProducts, showcaseProducts} = useLoaderData<typeof loader>();
  const [heroOffset, setHeroOffset] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero carousel slides - each with unique link and image
  const heroSlides = useMemo(() => [
    {
      image: featuredProducts[0]?.featuredImage?.url ?? 'https://images.unsplash.com/photo-1739784804205-cf898153b09b?auto=format&fit=crop&w=1080&q=80',
      alt: featuredProducts[0]?.title || 'Premium vaping products',
      badge: 'Featured',
      title: 'Premium Selection',
      subtitle: 'Hand-picked devices and e-liquids',
      href: '/search?sort=featured',
    },
    {
      image: featuredProducts[1]?.featuredImage?.url ?? 'https://images.unsplash.com/photo-1661188473544-2776118cadcd?auto=format&fit=crop&w=1080&q=80',
      alt: featuredProducts[1]?.title || 'Quality vape gear',
      badge: 'Popular',
      title: 'Best Sellers',
      subtitle: 'What UK vapers are buying',
      href: '/search?sort=best-selling',
    },
    {
      // Colourful gradient background for Flavour Lab - vibrant e-liquid colours
      gradient: 'from-pink-500 via-orange-400 to-amber-300',
      image: null,
      alt: 'Flavour Lab - discover your perfect e-liquid',
      badge: 'Guided Discovery',
      title: 'Flavour Lab',
      subtitle: 'Take our taste quiz to find e-liquids matched to your preferences',
      href: '/flavour-lab',
    },
    {
      // Tech-inspired gradient for Device Studio - modern hardware feel
      gradient: 'from-[#5b2be0] via-[#1fb2ff] to-cyan-400',
      image: null,
      alt: 'Device Studio - find your ideal vape',
      badge: 'Hardware Finder',
      title: 'Device Studio',
      subtitle: 'Answer a few questions and we\'ll recommend your perfect device',
      href: '/device-studio',
    },
  ], [featuredProducts]);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    let frame: number | null = null;
    const handleScroll = () => {
      frame = globalThis.requestAnimationFrame(() => {
        setHeroOffset(globalThis.scrollY * 0.25);
      });
    };

    globalThis.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
      if (frame) globalThis.cancelAnimationFrame(frame);
    };
  }, []);

  // heroImages removed - now using heroSlides carousel

  const credibilitySignals = [
    {label: 'UK compliant', icon: 'shield' as const},
    {label: 'Free shipping £50+', icon: 'truck' as const},
    {label: 'Expert support', icon: 'support' as const},
  ];

  // Use showcase products from metafields, or fall back to fetched products
  const highlightedProducts = showcaseProducts.featured.length > 0 
    ? showcaseProducts.featured.slice(0, 8) 
    : featuredProducts.slice(0, 8);
  
  // Static curated categories for homepage (replaces dynamic collections)
  const curatedCategories = [
    {
      id: 'reusables',
      title: 'Reusable Vapes',
      description: 'Ready-to-use devices with pre-filled e-liquid. No charging, no refilling.',
      href: '/search?tag=disposable',
      productCount: 500,
    },
    {
      id: 'e-liquids',
      title: 'E-Liquids',
      description: 'Premium vape juice in every flavour and strength. From nic salts to shortfills.',
      href: '/search?tag=e-liquid',
      productCount: 1200,
    },
    {
      id: 'devices',
      title: 'Vape Devices',
      description: 'Pod systems, box mods, and starter kits for every vaping style.',
      href: '/search?tag=device',
      productCount: 300,
    },
  ];
  
  const statusHighlights = [
    {label: 'Free delivery threshold', value: '£50'},
  {label: 'Dispatch cut-off', value: '1pm'},
    {label: 'Brands stocked', value: '112'},
  ];

  const reviews = [
    {
      name: 'Sarah M.',
      text: 'Outstanding quality and service. The selection is incredible and delivery is always fast!',
    },
    {
      name: 'James T.',
      text: "Best vape shop I've used. Products are authentic and customer support is excellent.",
    },
    {
      name: 'Emma R.',
      text: 'Love the range of products. The website is easy to use and checkout is seamless.',
    },
  ];

  const brandPlaceholders = [1, 2, 3];

  // Generate structured data for SEO
  const organizationSchema = generateOrganizationSchema({
    name: 'Vapourism',
    url: 'https://www.vapourism.co.uk',
    logo: 'https://www.vapourism.co.uk/vapourism-logo.png',
    description: 'Premium vaping essentials with trusted age verification and next-day UK delivery.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressRegion: 'West Sussex',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@vapourism.co.uk',
    },
  });

  const websiteSchema = generateWebsiteSchema({
    name: 'Vapourism',
    url: 'https://www.vapourism.co.uk',
    searchUrlTemplate: 'https://www.vapourism.co.uk/search?q={search_term_string}',
  });

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Organization and WebSite structured data for SEO */}
      <script {...structuredDataScript(organizationSchema)} />
      <script {...structuredDataScript(websiteSchema)} />

      {/* Hero Section with integrated Flavour Lab / Device Studio */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900">
        <div className="container-custom py-12 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-600">
                <span>Trusted UK retailer</span>
                <span aria-hidden="true" className="text-slate-400">•</span>
                <span>18+ verified</span>
              </div>
              <div>
                <h1 className="mb-4">
                  Elevate your <span className="text-gradient">vaping ritual</span>
                </h1>
                <p className="text-lg text-slate-600">
                  Premium devices, nic salts, and shortfills — batch-tested, clearly labelled, and shipped next-day from our Sussex warehouse.
                </p>
              </div>
              
              {/* Primary CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-8 py-4 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(91,43,224,0.35)]"
                >
                  Explore products
                  <Icon name="arrowRight" />
                </Link>
                <Link
                  to="/search?tag=device"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm"
                >
                  Shop devices
                </Link>
                <Link
                  to="/search?tag=e-liquid"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm"
                >
                  Shop e-liquids
                </Link>
              </div>

            </div>

            <div ref={heroRef} className="relative h-[380px] md:h-[480px]">
              {/* Scrolling hero carousel */}
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
                {heroSlides.map((slide, index) => {
                  const isActive = index === activeSlide;
                  const getSlideClass = () => {
                    if (isActive) return 'opacity-100 translate-x-0 pointer-events-auto';
                    if (index < activeSlide) return 'opacity-0 -translate-x-full pointer-events-none';
                    return 'opacity-0 translate-x-full pointer-events-none';
                  };
                  return (
                  <div
                    key={slide.title}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${getSlideClass()}`}
                    style={{transform: `translateY(${heroOffset * 0.3}px)`}}
                  >
                    <Link to={slide.href} className="block h-full w-full">
                      {/* Background: either image or gradient */}
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="h-full w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className={`h-full w-full bg-gradient-to-br ${slide.gradient}`}>
                          {/* Decorative elements for gradient slides */}
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                          {slide.badge}
                        </span>
                        <h3 className="mt-2 text-2xl font-bold">{slide.title}</h3>
                        <p className="text-sm text-white/80">{slide.subtitle}</p>
                      </div>
                    </Link>
                  </div>
                  );
                })}
              </div>

              {/* Carousel indicators */}
              <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide ? 'w-8 bg-[#5b2be0]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                  />
                ))}
              </div>

              {/* Quick stats overlay */}
              <div className="absolute top-4 right-4 w-48 rounded-2xl border border-white/20 bg-white/90 p-3 text-sm text-slate-800 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Quick stats</p>
                <ul className="mt-2 space-y-1">
                  {statusHighlights.map((item) => (
                    <li key={item.label} className="flex items-center justify-between text-slate-600">
                      <span className="text-xs">{item.label}</span>
                      <span className="text-slate-900 font-semibold text-xs">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white/80">
          <div className="container-custom py-4">
            <div className="grid gap-4 text-center sm:grid-cols-3">
              {credibilitySignals.map((signal) => (
                <div key={signal.label} className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Icon name={signal.icon} />
                  </span>
                  <span>{signal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - immediately after hero for better conversion */}
      <section className="container-custom py-16 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Featured products</p>
          <h2 className="mt-3 mb-4">Hand-picked selections</h2>
          <p className="text-slate-600">Community favourites that are in stock now and ready for tracked next-day delivery.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {highlightedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
          >
            Browse all products
            <Icon name="arrowRight" />
          </Link>
        </div>
      </section>

      {/* New Arrivals Section - only show if metafield products exist */}
      {showcaseProducts.newArrivals.length > 0 && (
        <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Just landed</p>
              <h2 className="mt-3 mb-4">New arrivals</h2>
              <p className="text-slate-600">The latest products to hit our shelves, fresh from the best UK and EU brands.</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {showcaseProducts.newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} showRating={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section - only show if metafield products exist */}
      {showcaseProducts.bestSellers.length > 0 && (
        <section className="container-custom py-16 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Top picks</p>
            <h2 className="mt-3 mb-4">Best sellers</h2>
            <p className="text-slate-600">What other UK vapers are buying right now.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseProducts.bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="container-custom py-16 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Shop by category</p>
          <h2 className="mt-3 mb-4">Curated for UK vapers</h2>
          <p className="text-slate-600">Jump straight to the flavours or hardware you love with our curated categories.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curatedCategories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative overflow-hidden rounded-[32px] border border-transparent bg-gradient-to-br from-[#5b2be0]/85 to-[#1fb2ff]/85 p-[1px]"
            >
              <div className="relative flex h-full flex-col justify-between rounded-[30px] bg-slate-950/70 p-8 text-white">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{backgroundImage: `url(${getExperienceBackground(index)})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 to-slate-900/50" aria-hidden />
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                    {category.productCount}+ products
                  </p>
                  <h3 className="text-2xl font-semibold text-white">{category.title}</h3>
                  <p className="text-sm text-white/80">{category.description}</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                  Browse category
                  <Icon name="arrowRight" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Vapourism - Educational Content */}
      <section className="container-custom py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Why choose us</p>
          <h2 className="mt-3 mb-4">Your trusted UK vaping partner</h2>
          <p className="text-slate-600">Quality products, expert guidance, and uncompromising compliance standards</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Authentic Products Only</h3>
            <p className="text-slate-600 leading-relaxed">
              Every product in our catalogue is sourced directly from authorized UK distributors and manufacturers. We verify authenticity certificates, batch numbers, and compliance documentation for complete peace of mind. Our quality control process ensures you receive genuine products that meet UK safety standards.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Regulatory Compliance</h3>
            <p className="text-slate-600 leading-relaxed">
              We adhere strictly to UK Tobacco and Related Products Regulations (TRPR). All our e-liquids contain maximum 20mg/ml nicotine strength, comply with TPD notification requirements, and feature childproof packaging. Our two-stage age verification process ensures responsible retail practices.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Product Knowledge</h3>
            <p className="text-slate-600 leading-relaxed">
              Our team comprises experienced vapers who understand the nuances of different devices, e-liquid compositions, and vaping styles. Whether you're transitioning from smoking or seeking advanced equipment, we provide honest recommendations tailored to your preferences and experience level.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Extensive Product Range</h3>
            <p className="text-slate-600 leading-relaxed">
              From convenient disposables and starter kits to advanced mods and premium shortfills, our curated selection represents over 112 trusted brands. We stock thousands of flavours including nic salts, freebase e-liquids, and high-VG options for cloud chasers and flavour enthusiasts alike.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Fast UK Delivery</h3>
            <p className="text-slate-600 leading-relaxed">
              Orders placed before 1pm are dispatched the same day from our Sussex warehouse. We offer free next-day delivery on orders over £50, with tracked courier services to mainland UK addresses. Express delivery options available for urgent orders.
            </p>
          </div>

          <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Customer-First Service</h3>
            <p className="text-slate-600 leading-relaxed">
              Our support team is available seven days a week to assist with product queries, order tracking, and technical advice. We maintain transparent policies on returns, warranty claims, and product troubleshooting to ensure complete customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Vaping Information Section */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">New to vaping?</p>
            <h2 className="mt-3 mb-4">Understanding vaping essentials</h2>
            <p className="text-slate-600">A beginner's guide to devices, e-liquids, and making informed choices</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 text-slate-700">
            <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">What is vaping?</h3>
              <p className="leading-relaxed mb-4">
                Vaping involves inhaling vapour produced by an electronic device that heats e-liquid. Unlike traditional cigarettes that burn tobacco, vape devices use battery-powered coils to create an inhalable aerosol. This fundamental difference eliminates many harmful combustion byproducts found in cigarette smoke.
              </p>
              <p className="leading-relaxed">
                Modern vaping devices range from simple disposable units to sophisticated customizable systems. The technology has evolved significantly since early e-cigarettes, now offering improved flavour delivery, battery life, and user control over nicotine intake and vapour production.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Choosing your device</h3>
              <p className="leading-relaxed mb-4">
                Starter kits and pod systems provide the easiest entry point for new vapers. These devices feature simple operation, minimal maintenance, and often include everything needed to begin vaping immediately. Popular options include refillable pod kits from brands like SMOK, Vaporesso, and Voopoo.
              </p>
              <p className="leading-relaxed">
                Disposable vapes offer maximum convenience for trying vaping without commitment. These single-use devices require no charging or refilling, making them ideal for testing different flavours and nicotine strengths before investing in a reusable system.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl border border-slate-100 p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Understanding e-liquids</h3>
              <p className="leading-relaxed mb-4">
                E-liquids (also called vape juice) contain four primary ingredients: propylene glycol (PG), vegetable glycerin (VG), flavourings, and optional nicotine. The PG/VG ratio affects throat hit, flavour intensity, and vapour production. Higher PG provides stronger throat hit and flavour clarity, while higher VG produces denser vapour clouds.
              </p>
              <p className="leading-relaxed">
                Nicotine salts deliver smoother throat hit at higher concentrations, making them suitable for mouth-to-lung devices and satisfying nicotine cravings efficiently. Freebase nicotine offers traditional throat sensation preferred by many transitioning smokers. UK regulations limit nicotine strength to maximum 20mg/ml in 10ml bottles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="container-custom py-16 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Featured brands</p>
          <h2 className="mt-3 mb-4">Brand stories on the way</h2>
          <p className="text-slate-600">Our creative team is photographing every vendor so you can shop with richer imagery and origin stories.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {brandPlaceholders.map((placeholder) => (
            <div
              key={placeholder}
              className="glass-morphism flex aspect-video flex-col items-center justify-center rounded-2xl border border-slate-100 p-8 text-center"
            >
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full gradient-brand-subtle text-4xl">
                ✨
              </div>
              <p className="text-sm font-semibold text-slate-500">Brand story coming soon</p>
              <p className="text-xs text-slate-400">1200 × 675 reserved</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Social proof</p>
            <h2 className="mt-3 mb-4">Trusted by thousands</h2>
            <p className="text-slate-600">Real shoppers share why Vapourism is their go-to for authentic gear and fast delivery.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="glass-morphism rounded-2xl border border-slate-100 p-8">
                <div className="mb-4 flex items-center gap-1">
                  {STAR_POSITIONS.map((position) => (
                    <Icon key={`${review.name}-${position}`} name="star" />
                  ))}
                </div>
                <p className="text-slate-700">“{review.text}”</p>
                <p className="mt-4 text-sm text-slate-500">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getExperienceBackground(index: number) {
  return EXPERIENCE_BACKDROPS[index % EXPERIENCE_BACKDROPS.length];
}
