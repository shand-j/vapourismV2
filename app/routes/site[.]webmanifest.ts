// Serve the `site.webmanifest` as a raw asset. Using Vite's `?raw` import keeps
// this file compatible with Workers and avoids Node builtins.
// Note: this relies on Vite supporting `?raw` for the public asset path in the
// dev/preview environment.
import manifestRaw from '~/../public/site.webmanifest?raw';

export async function loader() {
  return new Response(manifestRaw, {
    status: 200,
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}

export default function SiteWebmanifest() {
  return null;
}
