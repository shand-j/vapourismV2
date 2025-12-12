# VapourismV2 Copilot Instructions

## Project Overview
VapourismV2 is a **Shopify Hydrogen storefront** for a UK vaping products retailer built on **Remix**, **Hydrogen 2025.1.4**, and **Oxygen** (Shopify's edge runtime). The legacy app (project root) previously used Algolia for client-side search; Algolia is no longer used — the actively developed **V2** (in `/v2`) delivers Shopify-native replacements for search, navigation, and brand marketing.

> **⚠️ V2 Refactor In Flight**: `/v2` now contains a working Shopify-native architecture (47 Vitest specs passing) that replaces Algolia/category-mapping with Storefront predictive search, collections-driven navigation, and brand media packs. Use the "V2 Architecture Vision" and "V2 Implementation Snapshot" sections below as the source of truth when extending that refactor.

### Current Codebase Phases
- **Legacy (root)**: Production storefront that previously used Algolia, `category-mapping.ts`, and legacy header logic. Changes must preserve compliance systems and Hydrogen conventions.
- **V2 (`/v2`)**: Shopify-native implementation meant to replace legacy pieces. Key modules live in `v2/app/lib/shopify-search.ts`, `v2/app/lib/collections.ts`, `v2/app/lib/brand-assets.ts`, and the associated Remix routes/components. All new search/navigation/brand work should target this directory unless explicitly stated otherwise.

### Non-Negotiable Architecture Constraints
- **Hydrogen/Remix Framework (Storefront):** All client- and storefront-facing Shopify interactions MUST go through Hydrogen abstractions (e.g., `context.storefront`). Avoid direct Storefront API calls from browser code.
- **Admin / Backend:** Use the official `@shopify` admin libraries (server-side) for admin-level operations (tagging customers, writing customer metafields, app/admin tasks). Admin API calls belong on the server-side (loader/actions/functions) — do not call admin endpoints from client-side code.
- **Oxygen Deployment**: Must remain deployable to Shopify Oxygen (Cloudflare Workers runtime)
- **Shopify Checkout**: Uses Shopify's hosted checkout (not custom checkout)
- **Shopify Subscriptions**: Uses Shopify's basic subscription app for recurring orders

## AI Agent Guidelines

### Documentation Practices
- **NO extensive documentation after completing tasks** - update README.md only when truly necessary
- **NO creating one-off test scripts** - use existing test infrastructure or implement proper testing
- **Focus on code quality** over verbose explanations

### Problem-Solving Approach
- **Research-first**: Always consult official documentation (Shopify, Hydrogen, Remix) before proposing solutions
- **Evidence-based decisions**: Back up architectural choices with documentation links, best practices, or performance data
- **Use authoritative sources**:
  - Shopify Hydrogen docs: https://shopify.dev/docs/custom-storefronts/hydrogen
  - Remix docs: https://remix.run/docs
  - Shopify Storefront API: https://shopify.dev/docs/api/storefront
  - Oxygen runtime: https://shopify.dev/docs/custom-storefronts/oxygen

### Critical Thinking
- **Be the expert, not a yes-person** - challenge ideas with technical merit
- **Identify potential issues** before they become problems
- **Suggest better alternatives** when appropriate with reasoned justification
- **Question requirements** that conflict with best practices or architectural constraints
- **Provide trade-offs** rather than unconditional agreement

## Architecture & Key Patterns

### Hydrogen + Remix Framework
- **Entry points**: `app/entry.client.tsx`, `app/entry.server.tsx`, `server.ts`
- **Context creation**: All Hydrogen context (storefront client, session, i18n, cart) is initialized in `app/lib/context.ts` via `createAppLoadContext()`
- **Routes**: File-based routing via `@remix-run/fs-routes` in `app/routes/`
- **Loaders pattern**: Routes use `loader()` functions for server-side data fetching with Shopify Storefront API
- **Deferred data**: Critical data loads immediately, non-critical data uses `defer()` for streaming (see `app/routes/_index.tsx`)

### GraphQL Patterns
- **Fragments centralized**: All GraphQL fragments in `app/lib/fragments.ts` (CART_QUERY_FRAGMENT, HEADER_QUERY, FOOTER_QUERY)
- **Generated types**: Run `npm run codegen` after GraphQL changes - **never edit** `.generated.d.ts` files directly
- **Storefront API**: Access via `context.storefront.query()` in loaders/actions
- **⚠️ CRITICAL**: NEVER bypass Hydrogen to call Shopify APIs directly - all Shopify interactions MUST use Hydrogen's abstractions

### State Management & Data Flow
- **Cart**: Uses Hydrogen's `useOptimisticCart()` for instant UI updates with optimistic rendering
- **Session**: Custom `AppSession` class in `app/lib/session.ts` wraps Hydrogen's session management
- **Client-only components**: Use `<ClientOnly>` wrapper for browser-only features (age verification modals, third-party scripts). Avoid exposing admin credentials or admin API calls to client code.

## Critical Domain Logic

### Age Verification (Regulatory Compliance)
**Customer-level verification** model (preferred):
- Verification is tied to the *customer*, not a single order — once a customer is verified they can repeatedly place orders without re-verifying.
- Local caching: initial DOB/modal acceptance is stored in `localStorage` for convenience (30-day expiry) so returning customers don't need to re-enter DOB every visit.
- Permanent persistence: authoritative verification evidence must be persisted server-side in Shopify — add a customer tag (for example `age_verified`) and write an `age_verification` customer metafield/metadata entry so verification is permanent and centrally queryable.
- Hook/location: continue to use the preserved hook `app/lib/hooks/useAgeVerification.tsx` (it may include a dev/test simulation mode for local testing; remove simulation for production flows).
- Route: `/age-verification` remains the post-purchase or profile verification entrypoint for triggering the external AgeVerif flow and for presenting verification status.

### Shipping Restrictions
**Country-based product restrictions** defined in `app/lib/shipping-restrictions.ts`:
- `VAPING_RESTRICTED_COUNTRIES` - 49 countries where vape products cannot ship
- `CBD_RESTRICTED_COUNTRIES` - 100+ countries with CBD restrictions
- Component: `ShippingRestrictionsCheck.tsx` validates cart on checkout
- Functions: `canShipProductToCountry()`, `checkCartShippingRestrictions()`

### V2 Implementation Snapshot
- **Shopify Search Stack**: `v2/app/lib/shopify-search.ts` replaces Algolia with Storefront predictive + full search queries, includes `predictiveSearch()`, `searchProducts()`, `debounce()`, cache-key helpers, GA4 tracking, and feature flags. Remix routes (`v2/app/routes/search.tsx`, `v2/app/routes/api.search.predictive.tsx`) and components in `v2/app/components/search/` wire the UI.
- **Collections Navigation**: `v2/app/lib/collections.ts` fetches collections, builds nav hierarchies, and hosts `LEGACY_CATEGORY_REDIRECTS`. `v2/app/components/navigation/CollectionsNav.tsx` + `MobileNav` render the desktop mega-menu and mobile drawer.
- **Brand Media Packs**: `v2/app/lib/brand-assets.ts` + `v2/app/components/brand/BrandSection.tsx` load `public/media_packs/manifest.json`, normalize vendor slugs, provide responsive image helpers, and surface rich PDP sections with graceful fallbacks.
- **Testing Expectations**: `/v2` ships 47 passing Vitest specs under `v2/tests/unit/`. Any changes to `shopify-search.ts`, `collections.ts`, or `brand-assets.ts` must update/extend the matching tests and keep `npm test` (from `/v2`) green.

### Category Mapping & Navigation
- **Legacy**: `app/lib/category-mapping.ts` powers fuzzy category lookups that feed the classic header, product filters, and marketing pages.
- **V2**: `v2/app/lib/collections.ts` (with 100+ legacy redirect mappings) consumes Shopify collections for navigation, exposes `buildNavigationStructure()`, and ships desktop/mobile UI in `v2/app/components/navigation/CollectionsNav.tsx`. When building new nav experiences, prefer the V2 collections approach and ensure redirects stay in sync.

### Search Systems
- **Legacy**: Previously used Algolia for client-side search; Algolia is no longer used in V2 and related modules have been removed or deprecated.
- **V2**: Shopify Storefront predictive + full search implemented in `v2/app/lib/shopify-search.ts`, Remix routes (`v2/app/routes/search.tsx`, `v2/app/routes/api.search.predictive.tsx`), and UI components in `v2/app/components/search/`. Includes debounced autocomplete, feature flags (`USE_SHOPIFY_SEARCH`, `SHOPIFY_SEARCH_ROLLOUT`), GA4 tracking, and CacheLong/CacheShort hints.

### Brand Media Packs (V2)
`v2/app/lib/brand-assets.ts` + `v2/app/components/brand/BrandSection.tsx` integrate vendor media packs sourced from `public/media_packs/manifest.json`. Utilities normalize vendor slugs, load manifests, validate assets, and expose helpers like `generateImageSrcSet()` and `hasBrandAssetType()`. PDP implementations must gracefully fall back via `getFallbackBrandAssets()` when no pack exists.

### Preserved Compliance Systems in V2
`v2/app/preserved/` mirrors the mission-critical logic from the legacy app (`useAgeVerification`, `shipping-restrictions`, `seo-automation`, `context`, `fragments`). When wiring Hydrogen loaders/routes in `/v2`, import from these preserved modules instead of duplicating logic.

### SEO Automation
**Automated metadata generation** via `app/lib/seo-automation.ts`:
- `SEOAutomationService` class generates keywords, descriptions, schema.org markup
- Product pages: 25+ meta tags including OpenGraph, Twitter Cards, product schema
- Image alt text: Context-aware generation (main/thumbnail/gallery)
- Schema types: Product, Offer, AggregateRating, FAQ, ImageObject
- See: `app/routes/products.$handle.tsx` for comprehensive meta implementation

## Development Workflows

### Commands (from `package.json`)
```bash
npm run dev          # Start dev server with codegen
npm run build        # Production build + codegen
npm run preview      # Preview production build
npm run codegen      # Regenerate GraphQL types (run after schema changes)
npm run lint         # ESLint check
npm run typecheck    # TypeScript validation
```

### Codegen Workflow
**After modifying GraphQL queries/fragments**:
1. Update GraphQL in files (usually `app/lib/fragments.ts` or route loaders)
2. Run `npm run codegen` - generates types in `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`
3. Import generated types: `import type {ProductFragment} from 'storefrontapi.generated'`

### Environment Variables
**Required env vars** (see `env.d.ts`):
- `SESSION_SECRET` - Session encryption (checked in `createAppLoadContext()`)
- `USE_SHOPIFY_SEARCH`, `SHOPIFY_SEARCH_ROLLOUT` - Gate Shopify predictive search rollout (handled in `v2/app/lib/shopify-search.ts`)
- `COLLECTIONS_NAV_ROLLOUT` - Controls what percentage of traffic sees collections-based navigation
- `ENABLE_BRAND_ASSETS` - Toggles brand media pack rendering on PDPs

Note: Algolia environment variables and client keys are deprecated in V2 — Algolia is no longer used.

### Deployment
- **Platform**: Shopify Oxygen (Cloudflare Workers runtime)
- **CI/CD**: `.github/workflows/oxygen-deployment.yml`
- **Strategy**: `main` branch deploys to production, all other branches deploy to preview
- **Storefront ID**: 1000063397
- **Build**: Vite produces Oxygen-compatible worker bundle

## Component Patterns

### UI Components
- **shadcn/ui**: Located in `app/components/ui/` (Button, Card, Dialog, etc.)
- **Styling**: Tailwind CSS with custom config in `tailwind.config.js` (dark mode: 'class')
- **Utilities**: `cn()` helper in `app/lib/utils.ts` for conditional classes

### Common Components
- `PageLayout.tsx` - Wrapper with Header/Footer from context
- `ProductCard.tsx` - Product grid item with image, price, vendor
- `ProductForm.tsx` - Add-to-cart with variant selection
- `FreeShippingProgress.tsx` / `FreeShippingBanner` - Cart threshold indicators
- `AiAssistantPromo.tsx` - Placeholder for future AI shopping assistant feature

### Async Patterns
**Suspense boundaries** for deferred data:
```tsx
<Suspense fallback={<div>Loading...</div>}>
  <Await resolve={deferredData}>
    {(data) => <Component data={data} />}
  </Await>
</Suspense>
```

## Project-Specific Conventions

### File Organization
- **Routes**: One file per route in `app/routes/` (e.g., `products.$handle.tsx`)
- **Libs**: Reusable utilities in `app/lib/*.ts` (no React components)
- **Components**: Presentational in `app/components/*.tsx`, UI kit in `app/components/ui/`
- **Hooks**: Custom hooks in `app/lib/hooks/`

### Naming
- Components: PascalCase default exports (`export default function ProductCard()`)
- Utilities: camelCase named exports (`export function getCategoryUrl()`)
- Types: Interfaces/types co-located with implementation or in generated files

### Imports
- Path alias: `~` resolves to `app/` (configured in `tsconfig.json` and Vite)
- Example: `import {getCategoryUrl} from '~/lib/category-mapping'`

## Data Scripts
**Python tagging system** in `scripts/`:
- `optimize_product_tags_v2.py` - Enriches products with 5-30+ searchable tags
- `validate_optimized_tags_v2.py` - Quality control for tag data
- Config: `tagging_config.json` - Patterns for nicotine strength, volume, VG/PG ratio, etc.
- See: `scripts/README.md` for detailed documentation

## Testing & Quality
- **Legacy root**: No automated test framework yet (pre-GTM), `tests/` reserved for future use.
- **V2**: 47 Vitest unit specs live under `v2/tests/unit/` with setup in `v2/tests/setup.ts`. Run via `cd v2 && npm test`; keep all suites green when touching V2 libs/routes/components.
- **Type safety**: TypeScript strict mode enforced via `tsconfig.json`
- **Linting**: ESLint 9.x with TypeScript, React, JSX a11y plugins
- **Error handling**: Route errors caught by `useRouteError()` in `root.tsx`

## Integration Points

### Shopify APIs
- **Storefront API (Hydrogen)**: GraphQL via `context.storefront` (products, collections, cart) — use from loaders/actions and server-rendered code.
- **Admin API (server-side)**: Use the official `@shopify` admin libraries for backend/admin tasks (customer tagging, writing customer metafields, app admin operations). Always perform admin calls from server-side code (loaders/actions, or server-only functions) — never embed admin credentials in client bundles.
- **Customer Account API**: Mutations in `app/graphql/customer-account/` for customer-facing account actions.

### Third-Party Services
- **AgeVerif**: Third-party age verification API (integration in `useAgeVerification` hook)
- **Analytics**: Google Analytics 4 setup in SEO automation service

### Future Features (Not Yet Implemented)
- **AI Shopping Assistant**: Planned AI chat integration using Shopify Storefront MCP for guided shopping experiences (`app/routes/api.ai-assistant.tsx`, `AiAssistantPromo.tsx` are placeholders)
- **Subscriptions**: Planned recurring order functionality for consumables (vape juice, pods). Recipe available in `.cursor/rules/cookbook-recipe-subscriptions.mdc` for future implementation

## V2 Architecture Vision

### Planned Simplifications
The V2 refactor aims to reduce complexity while improving UX and maintainability:

#### 1. **Remove Algolia Search** → Shopify Native Search
- **Current**: Custom Algolia integration with client-side search, index syncing, SSR workarounds
- **V2**: Leverage Shopify's native Storefront Search API
- **Impact**: Remove `app/lib/algolia.ts`, `AlgoliaHeaderSearch.tsx`, `AlgoliaSearchProvider.tsx`, `SimpleAlgoliaSearch.tsx`
- **Benefits**: Simpler architecture, no external index sync, better SSR compatibility

#### 2. **Simplify Navigation** → Collections-Based
- **Current**: Complex category mapping system (`app/lib/category-mapping.ts`) with 100+ fuzzy-matched categories
- **V2**: Direct Shopify collections-based navigation
- **Impact**: Remove/simplify `category-mapping.ts`, reduce custom filtering logic in Header
- **Benefits**: Easier content management, less code to maintain, Shopify admin controls navigation

#### 3. **Brand Marketing Optimization** → Media Pack Integration
- **Current**: Basic product images
- **V2**: Rich brand marketing materials from `public/media_packs/`
- **Structure**: 112 brands with logos, lifestyle photos, product images, brand guidelines
- **Status**: 2 confirmed media kits (I VG, Vapes Bars), 110 to research (see `public/media_packs/README.md`)
- **Benefits**: Professional brand presentation, enhanced product pages, improved visual merchandising

### Migration Strategy
- V2 work should go in `/v2` directory (already populated with Shopify-native search/navigation/brand modules and Vitest coverage)
- Preserve core domain logic: age verification, shipping restrictions, SEO automation
- Keep shadcn/ui components and Tailwind styling approach
- Maintain Hydrogen/Remix/Oxygen foundation
- **NON-NEGOTIABLE**: Must use Hydrogen APIs (never direct Shopify API calls)
- **NON-NEGOTIABLE**: Must deploy to Oxygen (Cloudflare Workers runtime)
- **NON-NEGOTIABLE**: Use Shopify hosted checkout and basic subscriptions app
- Run `cd v2 && npm test` after modifying `v2/app/lib` or related Remix routes/components to ensure the 47-spec suite stays green.

### Files/Systems to Sunset in V2
```
❌ app/lib/algolia.ts
❌ app/lib/category-mapping.ts (or drastically simplify)
❌ app/components/AlgoliaHeaderSearch.tsx
❌ app/components/AlgoliaSearchProvider.tsx
❌ app/components/SimpleAlgoliaSearch.tsx
❌ Complex Header menu logic
❌ Vite Algolia SSR optimizations
```

### Files/Systems to Preserve in V2
```
✅ app/lib/hooks/useAgeVerification.tsx
✅ app/lib/shipping-restrictions.ts
✅ app/lib/seo-automation.ts
✅ app/lib/context.ts
✅ app/lib/fragments.ts
✅ app/components/ui/* (shadcn)
✅ Age verification components
✅ Shipping validation components
```

## Common Pitfalls

1. **SSR hydration errors**: Always use `<ClientOnly>` for browser APIs (localStorage, window, third-party scripts)
2. **GraphQL changes**: Must run `npm run codegen` - types won't update automatically
3. **Environment vars**: Client-side vars must be exposed via `window.ENV` in root loader
4. **Cart mutations**: Use Hydrogen's cart API, not direct Storefront API mutations
5. **Age verification**: Two separate systems - don't confuse initial modal with post-payment verification
6. **Shipping restrictions**: Always validate cart against `VAPING_RESTRICTED_COUNTRIES` before checkout

## Key Files Reference
- **Context setup**: `app/lib/context.ts`, `server.ts`
- **GraphQL**: `app/lib/fragments.ts` (fragments), `*.generated.d.ts` (types)
- **Routing**: `app/routes.ts` (config), `app/routes/` (pages)
-- **Search**: (Algolia has been removed in V2) Search logic now lives in `v2/app/lib/shopify-search.ts` and `v2/app/components/search/`
- **Compliance**: `app/lib/hooks/useAgeVerification.tsx`, `app/lib/shipping-restrictions.ts`
- **SEO**: `app/lib/seo-automation.ts`, meta exports in route files
- **Categories**: `app/lib/category-mapping.ts` (mappings), `app/components/Header.tsx` (navigation)
