/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import '@total-typescript/ts-reset';

import type {
  HydrogenContext,
  HydrogenSessionData,
  HydrogenEnv,
} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/preserved/context';

declare global {
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  interface Window {
    ENV: Record<string, unknown>;
  }

  interface Env extends HydrogenEnv {
    SESSION_SECRET: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    // Admin tokens (private) — allow spaces to access them via context.env in Oxygen/MiniOxygen
    PRIVATE_SHOPIFY_ADMIN_TOKEN?: string;
    SHOPIFY_ADMIN_TOKEN?: string;
    USE_SHOPIFY_SEARCH?: string;
    SHOPIFY_SEARCH_ROLLOUT?: string;
    COLLECTIONS_NAV_ROLLOUT?: string;
    ENABLE_BRAND_ASSETS?: string;
    AGEVERIF_PUBLIC_KEY?: string;
    AGE_VERIF_METAFIELD_NAMESPACE?: string;
    AGE_VERIF_METAFIELD_KEY?: string;
    // Analytics
    GA4_MEASUREMENT_ID?: string;
  }
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {}

  interface SessionData extends HydrogenSessionData {}
}
