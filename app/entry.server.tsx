import * as React from 'react';
import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
// `react-dom/server` ships as a CommonJS bundle in this environment; importing
// the default and extracting named exports avoids ESM/CJS default interop
// problems during Vite SSR evaluation.
import * as ReactDOMServer from 'react-dom/server';
const { renderToReadableStream } = (ReactDOMServer as any) || ({} as any);
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import {isbot} from 'isbot';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
): Promise<Response> {
  // Use the Hydrogen app load context environment only. Dev-time fallbacks
  // to process.env were added temporarily and are not production-like.
  // Keep the behavior strict: if the server-side context is missing we should
  // surface an error so the dev-server configuration is fixed instead of
  // masking the issue with fallbacks.
  // If the Hydrogen app load context is missing, allow dev-mode to fall
  // back to using process.env so the Vite dev plugin can still render simple
  // dev-time requests. This is a temporary fallback only used in
  // non-production modes; for production we require the full context.
  const isDev = (process.env.NODE_ENV || '').toLowerCase() !== 'production';
  let envVars: Record<string, string | undefined>;
  if (context?.env) {
    envVars = (context.env as unknown) as Record<string, string | undefined>;
  } else if (isDev) {
    // During development we expect the dev server to attach a Hydrogen
    // AppLoadContext (via our worker-like server handler). If the context is
    // missing here it's an indication the dev server didn't use the worker
    // fetch handler; surface a helpful error so we fix the dev server rather
    // than silently falling back.
    throw new TypeError('Hydrogen AppLoadContext missing in dev — ensure the dev server is running the worker fetch handler (server.ts)');
  } else {
    throw new TypeError('Missing Hydrogen AppLoadContext or context.env — ensure createAppLoadContext() runs for every request');
  }
  const checkoutDomain = envVars?.PUBLIC_CHECKOUT_DOMAIN ?? envVars?.PUBLIC_STORE_DOMAIN ?? '';
  const storeDomain = envVars?.PUBLIC_STORE_DOMAIN ?? '';

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain,
      storeDomain,
    },
  });

  let body: any;

  // Prefer the modern Web Streams API (renderToReadableStream) in
  // production-like environments (Oxygen / mini-oxygen). Falling back to
  // renderToPipeableStream and converting Node streams was a temporary
  // dev-only compatibility hack — remove it to keep behavior aligned with
  // production.
  const rtrs = (ReactDOMServer as any).renderToReadableStream ?? (ReactDOMServer as any).default?.renderToReadableStream;

  if (typeof rtrs === 'function') {
    body = await rtrs(
      <NonceProvider>
        <RemixServer context={remixContext} url={request.url} nonce={nonce} />
      </NonceProvider>,
      {
        nonce,
        signal: request.signal,
        onError(error: any) {
          console.error(error);
          responseStatusCode = typeof responseStatusCode === 'number' ? responseStatusCode : 500;
        },
      },
    );
  } else {
    // Some environments (older React versions / Node SSR dev setups) may
    // only expose renderToPipeableStream. Support that path in dev and
    // dev-like environments to keep the dev server usable — convert the
    // Node stream into a Web ReadableStream so Remix can respond with
    // a proper streaming Response.
    const rtp = (ReactDOMServer as any).renderToPipeableStream ?? (ReactDOMServer as any).default?.renderToPipeableStream;
    if (typeof rtp === 'function') {
      const { PassThrough, Readable } = require('node:stream');
      const nodeStream = new PassThrough();
      const { pipe } = rtp(
        <NonceProvider>
          <RemixServer context={remixContext} url={request.url} nonce={nonce} />
        </NonceProvider>,
        {
          onShellError(err: any) {
            console.error('SSR onShellError', err);
            responseStatusCode = 500;
          },
          onError(err: any) {
            console.error('SSR error', err);
            responseStatusCode = 500;
          },
        },
      );

      // Immediately pipe the render into the PassThrough and convert to
      // a Web ReadableStream so the outer response can be sent correctly.
      pipe(nodeStream);
      body = Readable.toWeb(nodeStream);
    } else {
      throw new TypeError('No compatible React server rendering API found (renderToReadableStream or renderToPipeableStream missing)');
    }
  }

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // The createContentSecurityPolicy header is intentionally strict by default.
  // For a small set of verification-only routes we need to relax script-src so
  // partner widgets (e.g. AgeVerif) that create runtime inline scripts are
  // allowed to execute. Browsers combine multiple CSP headers so a loader-level
  // header cannot widen the global policy. To avoid weakening global policy we
  // only relax the header for the verify route path.
  let effectiveHeader = header;

  // Keep the default CSP strict. Development-only relaxations (unsafe-inline,
  // and permissive img-src for unsplash) were masking issues. For partner
  // routes like AgeVerif we will only add trusted hostnames (no 'unsafe-inline')
  // and rely on the per-request `nonce` produced by createContentSecurityPolicy
  // to allow legitimate inline scripts when required.

  // Add Google Tag Manager and SearchAtlas OTTO Pixel domains to CSP
  // Google Tag Manager: Required for GA4 analytics
  // SearchAtlas: SEO optimization (currently disabled due to data: URL violation)
  if (/script-src/.test(effectiveHeader)) {
    effectiveHeader = effectiveHeader.replace(/script-src([^;]*)/, (match, v = '') => {
      let existing = v;
      // Add Google Tag Manager for analytics
      if (!existing.includes('https://www.googletagmanager.com')) existing += ' https://www.googletagmanager.com';
      // SearchAtlas domains (if re-enabling the script)
      if (!existing.includes('https://dashboard.searchatlas.com')) existing += ' https://dashboard.searchatlas.com';
      // Note: data: URLs disabled for security - SearchAtlas script commented out in root.tsx
      // if (!existing.includes('data:')) existing += ' data:';
      return `script-src${existing}`;
    });
  }
  if (/connect-src/.test(effectiveHeader)) {
    effectiveHeader = effectiveHeader.replace(/connect-src([^;]*)/, (match, v = '') => {
      let existing = v;
      // Allow connections to Google Analytics and Tag Manager
      if (!existing.includes('https://www.google-analytics.com')) existing += ' https://www.google-analytics.com';
      if (!existing.includes('https://www.googletagmanager.com')) existing += ' https://www.googletagmanager.com';
      if (!existing.includes('https://analytics.google.com')) existing += ' https://analytics.google.com';
      // SearchAtlas connections (if re-enabling)
      if (!existing.includes('https://dashboard.searchatlas.com')) existing += ' https://dashboard.searchatlas.com';
      return `connect-src${existing}`;
    });
  }

  try {
    const url = new URL(request.url);
    if (url.pathname === '/age-verification/verify') {
      // Ensure our global policy does not block inline scripts for this route
      // by additionally allowing inline execution in default-src. Browsers
      // will combine multiple CSP headers; to permit runtime-created scripts
      // we must ensure no header prohibits inline execution.
      if (/default-src/.test(effectiveHeader)) {
        effectiveHeader = effectiveHeader.replace(/default-src([^;]*)/, (match, v = '') => {
          let existing = v;
          // Do not permit 'unsafe-inline'. Instead we only allow the partner
          // hosts; inline execution will be permitted by the nonce provided
          // in the page's CSP header.
          if (!existing.includes("https://www.ageverif.com")) existing += ' https://www.ageverif.com';
          return `default-src${existing}`;
        });
      }
      // Safely append allowed sources and 'unsafe-inline' to script-src if not present
      // We keep the existing header structure and only add tokens to script-src.
      if (/script-src/.test(effectiveHeader)) {
        effectiveHeader = effectiveHeader.replace(/script-src([^;]*)/, (match, v = '') => {
          let existing = v;
          if (!existing.includes("https://www.ageverif.com")) existing += ' https://www.ageverif.com';
          return `script-src${existing}`;
        });
      }
    }
  } catch (err) {
    console.error('CSP header adjustment error', err);
  }

  responseHeaders.set('Content-Security-Policy', effectiveHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
