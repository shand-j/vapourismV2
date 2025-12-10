import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/server-runtime' {
  interface Future {
    v3_singleFetch: true;
  }
}

const hydrogenPlugins = hydrogen({
  // Keep CSP generation enabled so dev renders are production-like
  // (the Hydrogen plugin will still produce nonce-based policies).
  disableCsp: false,
});

export default defineConfig({
  plugins: [
    ...hydrogenPlugins,
    // Enable the Oxygen (mini-oxygen) plugin so the dev server runs the
    // same fetch handler (server.ts) as production. This ensures
    // createAppLoadContext() is executed for all requests in dev too.
    oxygen(),
    remix({
      presets: [hydrogen.v3preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    // Use a node SSR target during local development for faster, consistent
    // dev workflows that resolve Node built-ins correctly.
    target: 'node18',
    optimizeDeps: {
      include: [
        '@remix-run/dev/server-build',
        'use-sync-external-store/shim/index.js',
        'qs',
      ],
    },
    // Note: reduce the number of blanket externalizations so dev builds expose
    // genuine dependency compatibility problems instead of silently masking
    // them. Keep only the heavier modules that we know are worker/Node
    // specific and will not run in the Oxygen runtime.
    external: [
      // Ensure common node built-ins and known server-only modules are
      // externalized for the SSR build so Vite doesn't try to resolve them
      // as workspace files. This reduces noisy resolution errors while
      // the dev environment proxies to mini-oxygen.
      'node:crypto',
      'node:stream',
      'node:fs',
      'node:path',
      'node:buffer',
      'node:util',
      'node:events',
      'node:url',
      'node:http',
      'node:net',
      'node:tls',
      'node:zlib',
      'node:async_hooks',
      'node:worker_threads',
      'node:perf_hooks',
      'node:diagnostics_channel',
      'node:console',
      'node:dns',
      'node:querystring',
      'node:assert',
      'node:http2',
      'node:fs/promises',
      '@remix-run/node',
      'undici',
      'cookie-signature',
      'stream-slice',
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Use browser platform for client-side dependency optimization so
      // esbuild doesn't inject Node-specific helpers (like createRequire)
      // into pre-bundled client deps. SSR builds still externalize Node
      // built-ins via the `environments.ssr.external` config below.
      platform: 'browser',
    },
    // Exclude heavier server-side modules from pre-bundling so the dev
    // optimizer doesn't attempt to resolve Node built-ins from the
    // dependency sources. This keeps the dev server from trying to read
    // node:crypto / node:stream files as workspace paths.
    exclude: [
      '@remix-run/node',
      'undici',
      'cookie-signature',
      'stream-slice',
      'app/lib/ageverif.server.ts',
      'crypto',
      'node:crypto',
    ],
  },
  // New Vite 6 environments config can be used to mark builtins external
  environments: {
    ssr: {
      external: [
        'crypto',
        'node:crypto',
        'fs',
        'node:fs',
        'path',
        'node:path',
        'stream',
        'node:stream',
        'buffer',
        'node:buffer',
        'util',
        'node:util',
        'events',
        'node:events',
        'url',
        'node:url',
        'http',
        'node:http',
        'net',
        'node:net',
        'tls',
        'node:tls',
        'zlib',
        'node:zlib',
        'async_hooks',
        'node:async_hooks',
        'worker_threads',
        'node:worker_threads',
        'perf_hooks',
        'node:perf_hooks',
        'diagnostics_channel',
        'node:diagnostics_channel',
        'console',
        'node:console',
        'dns',
        'node:dns',
        'querystring',
        'node:querystring',
        'assert',
        'node:assert',
        'http2',
        'node:http2',
      ],
    },
  },
});
