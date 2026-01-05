// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Provided by the Remix compiler at build time
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from './app/lib/context';

/**
 * Normalize URL by converting all percent-encoded hex digits to lowercase.
 */
function normalizeUrl(url: URL): URL {
  const normalizedPathname = url.pathname.replace(
    /%[0-9A-F]{2}/g,
    (match) => match.toLowerCase()
  );
  
  if (normalizedPathname !== url.pathname) {
    const normalizedUrl = new URL(url.toString());
    normalizedUrl.pathname = normalizedPathname;
    return normalizedUrl;
  }
  
  return url;
}

const STATIC_ASSET_EXTENSIONS = /\.(js|css|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/;
const USER_SPECIFIC_PAGES = /\/(cart|account|checkout|age-verification)/;

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const url = new URL(request.url);
      const normalizedUrl = normalizeUrl(url);
      
      if (normalizedUrl.toString() !== url.toString()) {
        return new Response(null, {
          status: 301,
          headers: {
            'Location': normalizedUrl.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
      
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

      const pathname = normalizedUrl.pathname;
      
      if (STATIC_ASSET_EXTENSIONS.test(pathname)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (response.headers.get('Content-Type')?.includes('text/html')) {
        if (!USER_SPECIFIC_PAGES.test(pathname)) {
          response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        }
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
