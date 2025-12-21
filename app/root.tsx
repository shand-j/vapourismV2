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
import {ClientOnly} from './components/ClientOnly';
import {MegaMenu, MobileMenu} from './components/navigation/MegaMenu';
import {ShopifySearch} from './components/search/ShopifySearch';
import {CookieConsent} from './components/CookieConsent';
import {GoogleAnalytics} from './components/Analytics';
import {trackPageView} from './lib/analytics';
import {Icon} from './components/ui/Icon';

// Lazy load components that might use Headless UI
const LazyCartDrawer = lazy(() => import('./components/cart/CartDrawer').then(m => ({default: m.CartDrawer})));
const LazyInitialAgeVerificationModal = lazy(() => import('./components/compliance/InitialAgeVerificationModal').then(m => ({default: m.InitialAgeVerificationModal})));
import {cn} from './lib/utils';
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
  {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
  {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
  {rel: 'manifest', href: '/site.webmanifest'},
];

export const meta: MetaFunction = () => [
  {title: 'Vapourism | Premium Vaping Products & E-Liquids UK'},
  {
    name: 'description',
    content:
      'Shop premium vaping products, e-liquids, and accessories at Vapourism. Fast UK delivery, expert curation, and unbeatable prices on reusables, kits, and flavours.',
  },
  {name: 'theme-color', content: '#8b5cf6'},
  {name: 'msapplication-TileColor', content: '#8b5cf6'},
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

export async function loader({context}: LoaderFunctionArgs) {
  // Some dev SSR paths may call loaders before Hydrogen's context is attached.
  // Be defensive: if `context` or `context.storefront` is missing, return
  // sensible defaults so the app can render in dev without blowing up.
  const storefront = context?.storefront ?? null;
  const env = context?.env ?? (process.env as Record<string, string | undefined>);
  const hydrogenCart = context?.cart ?? { get: async () => null };

  let shop = null;
  let cart = null;

  if (storefront) {
    const result = await Promise.all([
      // SHOP_INFO_QUERY may fail when storefront is unavailable; only call when present
      storefront.query(SHOP_INFO_QUERY),
      hydrogenCart.get(),
    ]);

    shop = result[0]?.shop ?? null;
    cart = result[1] ?? null;
  }

  return json<LoaderData>({
    shop: shop ?? null,
    env: {
      PUBLIC_STORE_DOMAIN: env?.PUBLIC_STORE_DOMAIN,
      PRODUCTION_DOMAIN: env?.PRODUCTION_DOMAIN,
      USE_SHOPIFY_SEARCH: env.USE_SHOPIFY_SEARCH,
      SHOPIFY_SEARCH_ROLLOUT: env.SHOPIFY_SEARCH_ROLLOUT,
      // Expose AgeVerif public keys to the client via window.ENV
      AGEVERIF_PUBLIC_KEY: env?.['AGEVERIF_PUBLIC_KEY'] || env?.['PUBLIC_AGEVERIF_KEY'],
      PUBLIC_AGEVERIF_KEY: env?.['PUBLIC_AGEVERIF_KEY'] || env?.['AGEVERIF_PUBLIC_KEY'],
      // GA4 Measurement ID for analytics
      GA4_MEASUREMENT_ID: env?.GA4_MEASUREMENT_ID,
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
  const [isAgeGateActive, setIsAgeGateActive] = useState(false);

  useEffect(() => {
    setCartSnapshot(data.cart ?? null);
  }, [data.cart]);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      // Get page title from document
      const pageTitle = document.title || 'Vapourism';
      trackPageView(location.pathname + location.search, pageTitle);
    }
  }, [location.pathname, location.search]);

  const shopName = data.shop?.name ?? 'Vapourism';
  
  // Build canonical URL from current path (without query params for cleaner canonicals)
  // ALWAYS use production domain from env for canonical URLs, never use myshopify.com domain
  const productionDomain = data.env?.PRODUCTION_DOMAIN || 'https://www.vapourism.co.uk';
  const siteUrl = productionDomain;
  // Strip trailing slashes for consistent canonicals (except for homepage)
  const cleanPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}${cleanPath}`;
  
  // GA4 Measurement ID
  const ga4MeasurementId = data.env?.GA4_MEASUREMENT_ID;

  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <Meta />
        <Links />
        
        {/* Organization Schema for SEO - nonce required for CSP compliance */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vapourism",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.png`,
              "description": data.shop?.description || "Premium UK vape shop offering authentic vaping products, e-liquids, and accessories with fast delivery",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "GB"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "hello@vapourism.co.uk",
                "areaServed": "GB",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://twitter.com/vapourismuk"
              ]
            })
          }}
        />
        
        {/* Google Analytics 4 */}
        {ga4MeasurementId && <GoogleAnalytics measurementId={ga4MeasurementId} nonce={nonce} />}
        
        {/* SearchAtlas OTTO Pixel - SEO optimization 
            NOTE: Disabled due to CSP violations with data: URLs
            The base64 data URL violates Content Security Policy.
            To re-enable, either:
            1. Load the script from https://dashboard.searchatlas.com directly with nonce
            2. Add 'data:' to CSP script-src (not recommended for security)
            3. Convert to regular script tag with proper nonce attribute
        */}
        {/* <script
          type="text/javascript"
          id="sa-dynamic-optimization"
          data-uuid="d709ea19-b642-442c-ab07-012003668401"
          src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gImQ3MDllYTE5LWI2NDItNDQyYy1hYjA3LTAxMjAwMzY2ODQwMSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="
        /> */}
      </head>
      <body className="bg-white text-slate-900 antialiased">
        {isAgeGateActive && (
          <div className="pointer-events-none fixed inset-0 z-[30] bg-white/40 backdrop-blur-[3px]" aria-hidden />
        )}
        <div className={cn('relative flex min-h-screen flex-col transition duration-300 ease-out')}>
          <SiteHeader
            shopName={shopName}
            isMobileNavOpen={isMobileNavOpen}
            onToggleMobileNav={(open) => setIsMobileNavOpen(open)}
            onCartToggle={() => setIsCartDrawerOpen(true)}
            cartCount={cartSnapshot?.totalQuantity ?? 0}
          />

          <ClientOnly fallback={null}>
            {() => (
              <MobileMenu
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
              />
            )}
          </ClientOnly>

          <main className="relative flex-1 bg-slate-50">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden
              style={{
                backgroundImage:
                  'radial-gradient(circle at top, rgba(167, 139, 250, 0.18), transparent 55%), radial-gradient(circle at bottom, rgba(56, 189, 248, 0.15), transparent 50%)',
              }}
            />
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>

          <GlobalPerksRail />

          <SiteFooter shopName={shopName} description={data.shop?.description} />
        </div>

        <ClientOnly fallback={null}>
          {() => (
            <Suspense fallback={null}>
              <LazyCartDrawer
                isOpen={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                fallbackCart={cartSnapshot}
                onCartUpdate={setCartSnapshot}
              />
            </Suspense>
          )}
        </ClientOnly>

        <ClientOnly fallback={null}>
          {() => (
            <Suspense fallback={null}>
              <LazyInitialAgeVerificationModal onVisibilityChange={setIsAgeGateActive} />
            </Suspense>
          )}
        </ClientOnly>

        {/* Cookie Consent Banner - GDPR compliance */}
        <ClientOnly fallback={null}>
          {() => <CookieConsent />}
        </ClientOnly>

        {/* Inline window.ENV assignment — DO NOT add nonce here. Some HMR / client-side
            scripts are injected without nonce and React warns about mismatches when
            the server includes a nonce attribute on a script node. To avoid noisy
            hydration warnings in dev, keep this script without nonce. */}
        <script
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

function SiteHeader({
  shopName,
  isMobileNavOpen,
  onToggleMobileNav,
  onCartToggle,
  cartCount,
}: {
  shopName: string;
  isMobileNavOpen: boolean;
  onToggleMobileNav: (open: boolean) => void;
  onCartToggle: () => void;
  cartCount: number;
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/85 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="bg-slate-950 text-xs text-white">
        <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-center gap-3 px-6 py-2 text-center">
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden /> Free UK delivery £50+
          </span>
          <span className="hidden text-white/60 sm:inline">•</span>
          <span className="font-semibold uppercase tracking-[0.35em] text-white/80">Order by 1pm for same-day dispatch</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1920px] px-6">
        <div className="flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
              onClick={() => onToggleMobileNav(!isMobileNavOpen)}
              aria-label="Toggle navigation"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
              <span className="text-gradient">{shopName}</span>
            </Link>
          </div>

          {/* Desktop Mega Menu */}
          <div className="hidden flex-1 lg:block">
            <MegaMenu />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden min-w-[240px] max-w-sm lg:block">
              <ShopifySearch placeholder="Search flavours, kits, or brands" showQuickQueries={false} />
            </div>
            <HeaderIconButton
              label="Toggle search"
              className="lg:hidden"
              onClick={() => setIsMobileSearchOpen((open) => !open)}
            >
              <Icon name="search" />
            </HeaderIconButton>
            <HeaderIconButton to="/account" label="Account">
              <Icon name="user" />
            </HeaderIconButton>
            <HeaderIconButton label="Cart" onClick={onCartToggle}>
              <span className="relative inline-flex">
                <Icon name="cart" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold leading-4 text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
            </HeaderIconButton>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="pb-4 lg:hidden">
            <ShopifySearch placeholder="Search flavours, kits, or brands" showQuickQueries={false} />
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
      description: 'On all orders over £50 across mainland UK.',
      icon: 'truck' as const,
    },
    {
      title: '30-day returns',
      description: 'Hassle-free exchanges on unopened products.',
      icon: 'returns' as const,
    },
    {
      title: 'Expert support',
      description: 'Real humans who vape—available 7 days a week.',
      icon: 'support' as const,
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        {perks.map((perk) => (
          <div key={perk.title} className="flex flex-1 items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Icon name={perk.icon} />
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

interface HeaderIconButtonProps {
  readonly to?: string;
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly onClick?: () => void;
}

function HeaderIconButton({to, label, children, className, onClick}: HeaderIconButtonProps) {
  const mergedClassName = [
    'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900',
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

function SiteFooter({
  shopName,
  description,
}: {
  shopName: string;
  description?: string | null;
}) {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{shopName}</h3>
            <p className="text-gray-300 mb-4">
              {description || 'Your trusted UK vaping retailer offering premium e-liquids, devices, and accessories.'}
            </p>
            {/* Social media links removed - to be added when official accounts are confirmed */}
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?tag=disposable" className="text-gray-300 hover:text-white transition-colors">
                  Disposable Vapes
                </Link>
              </li>
              <li>
                <Link to="/search?tag=e-liquid" className="text-gray-300 hover:text-white transition-colors">
                  E-Liquids
                </Link>
              </li>
              <li>
                <Link to="/search?tag=pod_system" className="text-gray-300 hover:text-white transition-colors">
                  Pod Systems
                </Link>
              </li>
              <li>
                <Link to="/search?tag=coil" className="text-gray-300 hover:text-white transition-colors">
                  Coils & Pods
                </Link>
              </li>
              <li>
                <Link to="/search?tag=CBD" className="text-gray-300 hover:text-white transition-colors">
                  CBD Products
                </Link>
              </li>
              <li>
                <Link to="/search?tag=nicotine_pouches" className="text-gray-300 hover:text-white transition-colors">
                  Nicotine Pouches
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Brands - New column for internal linking */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Brands</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?vendor=Lost+Mary" className="text-gray-300 hover:text-white transition-colors">
                  Lost Mary
                </Link>
              </li>
              <li>
                <Link to="/search?vendor=Elf+Bar" className="text-gray-300 hover:text-white transition-colors">
                  Elf Bar
                </Link>
              </li>
              <li>
                <Link to="/search?vendor=IVG" className="text-gray-300 hover:text-white transition-colors">
                  IVG
                </Link>
              </li>
              <li>
                <Link to="/search?vendor=Hayati" className="text-gray-300 hover:text-white transition-colors">
                  Hayati
                </Link>
              </li>
              <li>
                <Link to="/search?vendor=Vaporesso" className="text-gray-300 hover:text-white transition-colors">
                  Vaporesso
                </Link>
              </li>
              <li>
                <Link to="/search?vendor=Aspire" className="text-gray-300 hover:text-white transition-colors">
                  Aspire
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/policies/delivery-information" className="text-gray-300 hover:text-white transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/policies/returns-policy" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/policies/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/age-verification" className="text-gray-300 hover:text-white transition-colors">
                  Age Verification
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery Information Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">FREE</div>
              <div className="text-sm text-gray-300 mb-2">Delivery on orders over £50</div>
              <p className="text-xs text-gray-400 px-4">Standard tracked delivery to mainland UK addresses at no extra cost</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">1PM</div>
              <div className="text-sm text-gray-300 mb-2">Same-day dispatch cutoff</div>
              <p className="text-xs text-gray-400 px-4">Orders placed before 1pm Monday-Friday ship the same working day</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">30 Days</div>
              <div className="text-sm text-gray-300 mb-2">Returns on unopened items</div>
              <p className="text-xs text-gray-400 px-4">Hassle-free returns policy for sealed products in original condition</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center max-w-3xl mx-auto">
            We ship authentic vaping products exclusively to addresses within the United Kingdom. All orders require age verification before dispatch. Restricted products cannot be shipped to certain territories—our system automatically validates shipping eligibility during checkout.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest products and offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {shopName}. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            {/* TODO: Company registration details - update as necessary */}
            <span>Company Number: </span>
            <span>•</span>
            <span>VAT Number: GB 504 6116 26</span>
          </div>
        </div>
      </div>
    </footer>
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
        <title>Error | Vapourism</title>
      </head>
      <body className="flex min-h-screen flex-col bg-white text-gray-900">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold">
            {isRouteError ? error.status : 'Unexpected error'}
          </h1>
          <p className="mt-4 text-gray-600">
            {isRouteError ? error.data : (error as Error)?.message ?? 'Something went wrong.'}
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-md bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Back to safety
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
