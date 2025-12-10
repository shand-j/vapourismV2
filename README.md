# Vapourism V2 — Onboarding & Local Dev

Welcome to Vapourism V2 — the Shopify-native Hydrogen refactor of the Vapourism storefront. This repo was created by copying the previous `/v2` folder, so Hydrogen may not be fully initialised on a fresh checkout. This README explains the developer setup, local Hydrogen initialization, and test workflows.

## Quick summary
- Framework: Shopify Hydrogen (Hydrogen 2025.1.4)
- Runtime target: Shopify Oxygen (Cloudflare Workers)
- Language: TypeScript + React (Remix)

## Requirements
- Node.js >= 18 (matching the repo `engines`)
- npm or pnpm/yarn (commands below use npm)
- Shopify CLI (for Hydrogen commands) — see https://shopify.dev/docs/cli for installation

## First-time setup (recommended)
1. Install dependencies:

```bash
# from the vapourismV2 folder
npm ci
```

2. Create a local environment file and fill in required values (see `.env.example` in repo):

```bash
cp .env.example .env
# edit .env with a text editor; required keys are listed inside .env.example
```

3. (Optional, recommended) Install Playwright browsers for e2e tests:

```bash
npx playwright install
```

4. Generate Storefront types / GraphQL codegen if you plan to change queries:

```bash
npm run codegen
```

5. Hydrogen-specific: this repository was created from an existing `/v2` snapshot, so Hydrogen scaffolding (CLI metadata / login) may not be connected in your environment. You can continue without running a full `shopify hydrogen init`, but to enable richer local development (CLI-auth, preview, deployments) run:

```bash
# login to Shopify via the CLI
shopify login
# run hydrogen dev — this will attempt normal Hydrogen development behaviour
npm run dev
```

Note: if Hydrogen's CLI commands fail because your local environment does not have Shopify CLI or hydrogen is not initialised, install the Shopify CLI (see https://shopify.dev/docs/cli). You will also need to provide a development store for preview flows.

## Available scripts
- npm run dev — start Hydrogen dev server with codegen
- npm run build — build for production
- npm run preview — preview the build
- npm run codegen — regenerate GraphQL types
- npm run lint — lint the codebase
- npm run typecheck — run TypeScript checks
- npm run test — run unit tests (Vitest)
- npm run test:watch — watch mode for tests
- npm run test:e2e — Playwright tests

## Environment variables
Important variables are defined and used across the V2 project. A minimal list appears in `.env.example` below; copy to `.env` and provide real values as needed for local development and CI.

Key variables you may want to set locally:
- SESSION_SECRET — session encryption for the app
- PUBLIC_ALGOLIA_APP_ID / PUBLIC_ALGOLIA_SEARCH_API_KEY / PUBLIC_ALGOLIA_INDEX_NAME — only used if legacy Algolia features are enabled
- USE_SHOPIFY_SEARCH, SHOPIFY_SEARCH_ROLLOUT — control the V2 Shopify-native predictive search rollout
- COLLECTIONS_NAV_ROLLOUT — config for collections-based navigation rollout
- ENABLE_BRAND_ASSETS — toggle brand media packs
 - AGEVERIF_CREATE_CUSTOMER — if `true` the server may create a Shopify Customer from a guest order email when a customer resource is missing (use with caution)

Admin client adapter
- The V2 codebase includes a small admin client adapter at `app/lib/admin-client.ts`. It will try to use the official `@shopify/shopify-api` SDK when available in a Node environment (helpful for local scripts or non-edge backends) and will automatically fall back to a lightweight fetch-based implementation when the SDK is not present (edge-compatible for Oxygen). Install the SDK locally only when you need it:

```bash
cd v2
npm install @shopify/shopify-api
```

See `env.d.ts` for other environment type hints.

## Testing
- Unit tests: powered by Vitest — run `npm run test` or `npm run test:watch`.
- E2E: Playwright tests live in `tests/e2e/` — run `npm run test:e2e`.

## Running in production/Oxygen
Deployment to Oxygen is expected for V2 — follow your existing CI/deployment pipeline. The project is built with a Hydrogen/Oxygen-compatible configuration.

## Developer notes / gotchas
- This project preserves critical compliance logic (age verification, shipping restrictions and SEO automation). These lives in `app/preserved/`.
- When modifying GraphQL fragments/queries, run `npm run codegen` to regenerate types under `storefrontapi.generated.d.ts`.
- Use Hydrogen APIs via `context.storefront` for all Shopify interactions — do not call Shopify Admin or Storefront directly from server code.

If you need further onboarding or to bootstrap hydrogen CLI metadata for this copied snapshot, tell me the shop you want to target and I can add documented steps to attach this repo to a dev store.

---
_Short-form troubleshooting_

- Hydrogen fails to start: make sure `shopify` CLI is installed and you are logged in (shopify login), and you have Node >= 18.
- Codegen errors: run `npm run codegen` and ensure `@shopify/hydrogen-codegen` is installed.

## Testing troubleshooting

- If unit tests fail with messages like `React is not defined` (JSX runtime issues), ensure your Node / dev environment matches the repo `engines` and you ran `npm ci` after cloning. Some test setups require the automatic JSX runtime or explicit `import React from 'react'` depending on your local toolchain.
- Certain unit tests may require admin tokens or environment flags for order lookups (e.g. `SHOPIFY_ADMIN_TOKEN` or `PRIVATE_SHOPIFY_ADMIN_TOKEN`). Add these to your local `.env` when needed to run tests that expect authenticated flows.

Developer note: Age verification evidence in V2 is persisted to the Shopify Customer (preferred). When a customer resource is available the server writes an `age_verification` JSON metafield and adds the `age_verified` tag. If no customer exists and `AGEVERIF_CREATE_CUSTOMER=true` the server will attempt to create a customer from order email (this behavior is configurable and must be considered by the legal/privacy team before enabling in production).


Happy hacking — next steps: run the dev server with `npm run dev` or `npm run test` to validate the test suite locally.

