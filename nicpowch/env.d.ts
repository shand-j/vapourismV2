/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Env variable types injected by Vite during build
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    env: Env;
    storefront: Storefront;
    cart: HydrogenCart;
    session: HydrogenSession;
  }
}

// Cloudflare worker environment
interface Env {
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PRIVATE_STOREFRONT_API_TOKEN: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID: string;
  PUBLIC_CHECKOUT_DOMAIN: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_URL?: string;
  PRODUCTION_DOMAIN?: string;
  GA4_MEASUREMENT_ID?: string;
}

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: string}};

  /**
   * Declare expected Remix server build exports
   */
  interface Window {
    ENV: Env;
  }
}

// Hydrogen types
type Storefront = import('@shopify/hydrogen').Storefront;
type HydrogenCart = import('@shopify/hydrogen').HydrogenCart;
type HydrogenSession = import('@shopify/hydrogen').HydrogenSession;
