// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Provided by the Remix compiler at build time
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from './app/preserved/context';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const response = await handleRequest(request);

      // Set CSP for AgeVerif routes (/age-verification and subpaths).
      // Keep policy strict in production — do not add 'unsafe-inline'.
      const url = new URL(request.url);
      if (url.pathname.startsWith('/age-verification')) {
        // Relax CSP for AgeVerif pages to allow checker scripts, frames and stats endpoints.
        // Also allow Google Tag Manager for analytics.
        const defaultSrc = `default-src 'self' https://cdn.shopify.com https://shopify.com https://*.shopify.com https://accounts.shopify.com https://cdn.ageverif.com https://www.ageverif.com 'unsafe-inline';`;
        const scriptSrc = `script-src 'self' https://cdn.shopify.com https://shopify.com https://cdn.ageverif.com https://www.ageverif.com https://www.googletagmanager.com;`;
        const scriptElem = `script-src-elem 'self' https://cdn.shopify.com https://shopify.com https://cdn.ageverif.com https://www.ageverif.com https://www.googletagmanager.com 'unsafe-inline';`;
        const styleSrc = `style-src 'self' https://cdn.shopify.com https://fonts.googleapis.com 'unsafe-inline';`;
        const fontSrc = `font-src 'self' https://fonts.gstatic.com;`;
        const imgSrc = `img-src 'self' https://cdn.shopify.com data: https:;`;
        // Include AgeVerif stats endpoint, checker iframe host, and Google Analytics (including regional endpoints)
        const connectSrc = `connect-src 'self' https://cdn.shopify.com https://shopify.com https://*.shopify.com https://cdn.ageverif.com https://www.ageverif.com https://wstats.ageverif.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com;`;
        const frameSrc = `frame-src https://checker.ageverif.com;`;

        // Note: the rendered page will also include a nonce-based header set by
        // the Remix server render (entry.server). That header can permit
        // inline scripts using a nonce; we do NOT insert 'unsafe-inline' here.
        response.headers.set('Content-Security-Policy', [
          defaultSrc,
          scriptSrc,
          scriptElem,
          styleSrc,
          fontSrc,
          imgSrc,
          connectSrc,
          frameSrc,
        ].join(' '));
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
