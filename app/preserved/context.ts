import {
  createHydrogenContext,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';
import {AppSession} from './session';
import {CART_QUERY_FRAGMENT} from './fragments';
import {getLocaleFromRequest} from './i18n';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const i18n = getLocaleFromRequest(request);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
      // Ensure cart ID is managed via cookies with long expiry
      getId: cartGetIdDefault(request.headers),
      setId: cartSetIdDefault({
        maxage: 60 * 60 * 24 * 365, // 1 year expiry
      }),
    },
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}
