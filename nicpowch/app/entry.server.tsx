import * as React from 'react';
import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {EntryContext} from '@remix-run/server-runtime';
import {RemixServer} from '@remix-run/react';
import * as ReactDOMServer from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import {isbot} from 'isbot';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
): Promise<Response> {
  const isDev = (process.env.NODE_ENV || '').toLowerCase() !== 'production';
  let envVars: Record<string, string | undefined>;
  
  if (context?.env) {
    envVars = (context.env as unknown) as Record<string, string | undefined>;
  } else if (isDev) {
    throw new TypeError('Hydrogen AppLoadContext missing in dev — ensure the dev server is running the worker fetch handler (server.ts)');
  } else {
    throw new TypeError('Missing Hydrogen AppLoadContext or context.env — ensure createAppLoadContext() runs for every request');
  }
  
  const checkoutDomain = envVars?.PUBLIC_CHECKOUT_DOMAIN ?? envVars?.PUBLIC_STORE_DOMAIN ?? '';
  const storeDomain = envVars?.PUBLIC_STORE_DOMAIN ?? '';

  const scriptSrcDirectives = [
    "'self'",
    'https://cdn.shopify.com',
    'https://www.googletagmanager.com',
    "'unsafe-inline'",
    'data:',
  ];

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain,
      storeDomain,
    },
    scriptSrc: scriptSrcDirectives,
    scriptSrcElem: scriptSrcDirectives,
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://accounts.shopify.com',
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://analytics.google.com',
      'https://monorail-edge.shopifysvc.com',
    ],
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://images.unsplash.com',
      'https://*.unsplash.com',
      'https:',
      'data:',
    ],
    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://accounts.shopify.com',
    ],
  });

  let body: any;

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
    const rtp = (ReactDOMServer as any).renderToPipeableStream ?? (ReactDOMServer as any).default?.renderToPipeableStream;
    if (typeof rtp === 'function') {
      const {PassThrough, Readable} = require('node:stream');
      const nodeStream = new PassThrough();
      const {pipe} = rtp(
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
      pipe(nodeStream);
      body = Readable.toWeb(nodeStream);
    } else {
      throw new TypeError('No compatible React server rendering API found');
    }
  }

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
