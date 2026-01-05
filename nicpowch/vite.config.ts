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

export default defineConfig({
  plugins: [
    hydrogen(),
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
    optimizeDeps: {
      include: [
        '@remix-run/dev/server-build',
        'use-sync-external-store/shim/index.js',
        'qs',
      ],
    },
  },
});
