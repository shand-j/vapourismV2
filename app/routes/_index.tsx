import {useEffect, useMemo, useRef, useState} from 'react';
import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {ProductCard} from '~/components/ProductCard';
import type {ProductCardProduct} from '~/components/ProductCard';
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
  {title: 'Vapourism | Premium vaping essentials delivered fast'},
  {
    name: 'description',
    content: 'Shop authentic vape kits, nic salts, and accessories with trusted age verification and next-day UK delivery.',
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
    {label: 'UK compliant', icon: <ShieldIcon />},
    {label: 'Free shipping £50+', icon: <TruckIcon />},
    {label: 'Expert support', icon: <SupportIcon />},
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

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
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
                  <ArrowRightIcon />
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
                    {signal.icon}
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
            <ArrowRightIcon />
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
                  <ArrowRightIcon />
                </div>
              </div>
            </Link>
          ))}
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
                    <StarIcon key={`${review.name}-${position}`} />
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

function ArrowRightIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-5 w-5 text-[#5b2be0]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V7l8-4z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v10H3zM14 9h4l3 4v4h-7" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21a9 9 0 0118 0" />
    </svg>
  );
}

function getExperienceBackground(index: number) {
  return EXPERIENCE_BACKDROPS[index % EXPERIENCE_BACKDROPS.length];
}
