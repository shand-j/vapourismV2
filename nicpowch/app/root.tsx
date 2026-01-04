import {useEffect, useState, type ReactNode, lazy, Suspense} from 'react';
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
  Link,
  useLocation,
} from '@remix-run/react';
import {useNonce} from '@shopify/hydrogen';
import {BRAND_CONFIG} from './brand-config';
import {NicPowchMegaMenu, NicPowchMobileMenu} from './components/navigation/NicPowchMegaMenu';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import './styles/globals.css';

const SHOP_INFO_QUERY = `#graphql
  query ShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
` as const;

export const links: LinksFunction = () => [
  {rel: 'preconnect', href: 'https://cdn.shopify.com'},
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
  {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  {rel: 'dns-prefetch', href: 'https://www.googletagmanager.com'},
  {rel: 'dns-prefetch', href: 'https://www.google-analytics.com'},
  {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
  {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
  {rel: 'manifest', href: '/site.webmanifest'},
];

export const meta: MetaFunction = () => [
  {title: `${BRAND_CONFIG.name} | ${BRAND_CONFIG.tagline}`},
  {name: 'description', content: BRAND_CONFIG.description},
  {name: 'keywords', content: BRAND_CONFIG.keywords.join(', ')},
  {name: 'theme-color', content: BRAND_CONFIG.colors.themeColor},
  {name: 'msapplication-TileColor', content: BRAND_CONFIG.colors.themeColor},
  // Open Graph
  {property: 'og:type', content: 'website'},
  {property: 'og:site_name', content: BRAND_CONFIG.name},
  {property: 'og:locale', content: 'en_GB'},
  // Twitter
  {name: 'twitter:card', content: 'summary_large_image'},
  {name: 'twitter:site', content: BRAND_CONFIG.twitter},
];

interface LoaderData {
  shop: {
    name: string;
    description?: string | null;
    primaryDomain?: {
      url: string;
    } | null;
  } | null;
  env: Record<string, string | undefined>;
  cart: CartApiQueryFragment | null;
}

/**
 * Safely get environment variable from Env object
 */
function getEnvVar(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  return typeof value === 'string' ? value : undefined;
}

export async function loader({context}: LoaderFunctionArgs) {
  const storefront = context?.storefront ?? null;
  const env = ((context?.env ?? process.env) as unknown) as Record<string, unknown>;
  const hydrogenCart = context?.cart ?? {get: async () => null};

  let shop = null;
  let cart = null;

  if (storefront) {
    const result = await Promise.all([
      storefront.query(SHOP_INFO_QUERY, {
        cache: storefront.CacheLong(),
      }),
      hydrogenCart.get(),
    ]);

    shop = result[0]?.shop ?? null;
    cart = result[1] ?? null;
  }

  return json<LoaderData>({
    shop: shop ?? null,
    env: {
      PUBLIC_STORE_DOMAIN: getEnvVar(env, 'PUBLIC_STORE_DOMAIN'),
      PRODUCTION_DOMAIN: getEnvVar(env, 'PRODUCTION_DOMAIN'),
      PUBLIC_AGEVERIF_KEY: getEnvVar(env, 'PUBLIC_AGEVERIF_KEY') || getEnvVar(env, 'AGEVERIF_PUBLIC_KEY'),
      GA4_MEASUREMENT_ID: getEnvVar(env, 'GA4_MEASUREMENT_ID'),
    },
    cart: cart ?? null,
  });
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartSnapshot, setCartSnapshot] = useState(data.cart ?? null);

  useEffect(() => {
    setCartSnapshot(data.cart ?? null);
  }, [data.cart]);

  const siteUrl = BRAND_CONFIG.domain;
  const cleanPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}${cleanPath}`;

  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <Meta />
        <Links />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: BRAND_CONFIG.name,
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              description: BRAND_CONFIG.description,
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'GB',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: BRAND_CONFIG.email,
                areaServed: 'GB',
                availableLanguage: 'English',
              },
              sameAs: [`https://twitter.com/${BRAND_CONFIG.twitter.replace('@', '')}`],
            }),
          }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased">
        <div className="relative flex min-h-screen flex-col">
          <NicPowchHeader
            isMobileNavOpen={isMobileNavOpen}
            onToggleMobileNav={(open) => setIsMobileNavOpen(open)}
            onCartToggle={() => setIsCartDrawerOpen(true)}
            cartCount={cartSnapshot?.totalQuantity ?? 0}
          />

          <NicPowchMobileMenu isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

          <main className="relative flex-1 bg-slate-50">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden
              style={{
                backgroundImage:
                  'radial-gradient(circle at top, rgba(13, 148, 136, 0.15), transparent 55%), radial-gradient(circle at bottom, rgba(16, 185, 129, 0.12), transparent 50%)',
              }}
            />
            <div className="relative">
              <Outlet />
            </div>
          </main>

          <GlobalPerksRail />

          <NicPowchFooter />
        </div>

        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.env ?? {})};`,
          }}
        />
        <ScrollRestoration />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function NicPowchHeader({
  isMobileNavOpen,
  onToggleMobileNav,
  onCartToggle,
  cartCount,
}: {
  isMobileNavOpen: boolean;
  onToggleMobileNav: (open: boolean) => void;
  onCartToggle: () => void;
  cartCount: number;
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-white/30 bg-white/85 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      {/* Top bar */}
      <div className="bg-teal-700 text-xs text-white">
        <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-center gap-3 px-6 py-2 text-center">
          <span className="flex items-center gap-1 text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
            Free UK delivery £{BRAND_CONFIG.freeShippingThreshold}+
          </span>
          <span className="hidden text-white/60 sm:inline">•</span>
          <span className="font-semibold uppercase tracking-[0.35em] text-white/90">
            Tobacco-Free Nicotine Pouches
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1920px] overflow-visible px-6">
        <div className="flex flex-wrap items-center gap-4 overflow-visible py-4 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              onClick={() => onToggleMobileNav(!isMobileNavOpen)}
              aria-label="Toggle navigation"
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
              <span className="text-gradient">{BRAND_CONFIG.name}</span>
            </Link>
          </div>

          {/* Desktop Mega Menu */}
          <div className="hidden flex-1 overflow-visible lg:block">
            <NicPowchMegaMenu />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Desktop search */}
            <div className="hidden min-w-[240px] max-w-sm lg:block">
              <Link
                to="/search?tag=nicotine_pouches"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 transition hover:border-teal-300 hover:bg-white"
              >
                <SearchIcon />
                <span>Search pouches...</span>
              </Link>
            </div>

            {/* Mobile search toggle */}
            <HeaderIconButton
              label="Toggle search"
              className="lg:hidden"
              onClick={() => setIsMobileSearchOpen((open) => !open)}
            >
              <SearchIcon />
            </HeaderIconButton>

            {/* Account */}
            <HeaderIconButton to="/account" label="Account">
              <UserIcon />
            </HeaderIconButton>

            {/* Cart */}
            <HeaderIconButton label="Cart" onClick={onCartToggle}>
              <span className="relative inline-flex">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 rounded-full bg-teal-500 px-1.5 text-[10px] font-semibold leading-4 text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
            </HeaderIconButton>
          </div>
        </div>

        {/* Mobile search expanded */}
        {isMobileSearchOpen && (
          <div className="pb-4 lg:hidden">
            <Link
              to="/search?tag=nicotine_pouches"
              className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            >
              <SearchIcon />
              <span>Search nicotine pouches...</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function GlobalPerksRail() {
  const perks = [
    {
      title: 'Free next-day delivery',
      description: `On all orders over £${BRAND_CONFIG.freeShippingThreshold} across mainland UK.`,
      icon: 'truck',
    },
    {
      title: 'Discreet packaging',
      description: 'Plain packaging with no product references.',
      icon: 'package',
    },
    {
      title: 'Expert support',
      description: 'Real humans who know pouches—available 7 days.',
      icon: 'support',
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        {perks.map((perk) => (
          <div key={perk.title} className="flex flex-1 items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              {perk.icon === 'truck' && <TruckIcon />}
              {perk.icon === 'package' && <PackageIcon />}
              {perk.icon === 'support' && <SupportIcon />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{perk.title}</p>
              <p className="text-sm text-slate-600">{perk.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NicPowchFooter() {
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{BRAND_CONFIG.name}</h3>
            <p className="mb-4 text-gray-300">{BRAND_CONFIG.description}</p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop by Strength</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?tag=nicotine_pouches&tag=3mg" className="text-gray-300 transition-colors hover:text-white">
                  3mg - Light
                </Link>
              </li>
              <li>
                <Link to="/search?tag=nicotine_pouches&tag=6mg" className="text-gray-300 transition-colors hover:text-white">
                  6mg - Medium
                </Link>
              </li>
              <li>
                <Link to="/search?tag=nicotine_pouches&tag=10mg" className="text-gray-300 transition-colors hover:text-white">
                  10mg - Strong
                </Link>
              </li>
              <li>
                <Link to="/search?tag=nicotine_pouches&tag=20mg" className="text-gray-300 transition-colors hover:text-white">
                  20mg - Maximum
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Popular Brands</h3>
            <ul className="space-y-2">
              {BRAND_CONFIG.featuredBrands.slice(0, 6).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    to={`/search?tag=nicotine_pouches&vendor=${encodeURIComponent(brand.name)}`}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/policies/delivery-information" className="text-gray-300 transition-colors hover:text-white">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/policies/returns-policy" className="text-gray-300 transition-colors hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/age-verification" className="text-gray-300 transition-colors hover:text-white">
                  Age Verification
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery info */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-teal-400">FREE</div>
              <div className="mb-2 text-sm text-gray-300">Delivery on orders over £{BRAND_CONFIG.freeShippingThreshold}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-emerald-400">{BRAND_CONFIG.dispatchCutoff}</div>
              <div className="mb-2 text-sm text-gray-300">Same-day dispatch cutoff</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-cyan-400">18+</div>
              <div className="mb-2 text-sm text-gray-300">Age verification required</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <div className="mb-4 text-sm text-gray-400 md:mb-0">© 2025 {BRAND_CONFIG.name}. All rights reserved.</div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <Link to="/policies/terms-of-service" className="hover:text-white">
              Terms
            </Link>
            <span>•</span>
            <Link to="/policies/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface HeaderIconButtonProps {
  readonly to?: string;
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly onClick?: () => void;
}

function HeaderIconButton({to, label, children, className, onClick}: HeaderIconButtonProps) {
  const mergedClassName = [
    'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition hover:border-teal-300 hover:text-teal-600',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} aria-label={label} className={mergedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={mergedClassName}>
      {children}
    </button>
  );
}

// Icons
function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth={2} />
      <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Error | {BRAND_CONFIG.name}</title>
      </head>
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold">{isRouteError ? error.status : 'Unexpected error'}</h1>
          <p className="mt-4 text-gray-600">{isRouteError ? error.data : (error as Error)?.message ?? 'Something went wrong.'}</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-md px-6 py-3 font-semibold text-white"
            style={{backgroundColor: BRAND_CONFIG.colors.accent}}
          >
            Back to safety
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
