import {useEffect} from 'react';
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  const publicKey = context?.env?.AGEVERIF_PUBLIC_KEY ?? process.env.AGEVERIF_PUBLIC_KEY ?? null;
  const clientUrl = context?.env?.PUBLIC_AGEVERIF_CLIENT_URL ?? process.env.PUBLIC_AGEVERIF_CLIENT_URL ?? null;
  return json({order, publicKey, clientUrl});
}

export default function SuccessPage() {
  const data = useLoaderData<typeof loader>();
  const { order, publicKey, clientUrl } = data ?? {};

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Setup the lightweight global shims that the checker may call. They will
    // dispatch CustomEvents which the preserved hook listens for.
    (window as any).ageverifLoaded = (args: any) => window.dispatchEvent(new CustomEvent('ageverif:loaded', { detail: args }));
    (window as any).ageverifReady = (args: any) => window.dispatchEvent(new CustomEvent('ageverif:ready', { detail: args }));
    (window as any).ageverifSuccess = (args: any) => window.dispatchEvent(new CustomEvent('ageverif:success', { detail: args }));
    (window as any).ageverifError = (err: any) => window.dispatchEvent(new CustomEvent('ageverif:error', { detail: err }));

    // Construct script URL. Prefer explicit clientUrl if set, otherwise build from publicKey.
    const src = clientUrl || (publicKey ? `https://www.ageverif.com/checker.js?key=${encodeURIComponent(publicKey)}&nostart` : null);
    if (!src) return;

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      try {
        // notify loader/ready
        (window as any).ageverifLoaded?.({ verified: false });
        (window as any).ageverifReady?.();
      } catch (e) {
        // ignore
      }
    };
    s.onerror = () => {
      (window as any).ageverifError?.({ message: 'checker load failed' });
    };
    document.head.appendChild(s);

    return () => {
      delete (window as any).ageverifLoaded;
      delete (window as any).ageverifReady;
      delete (window as any).ageverifSuccess;
      delete (window as any).ageverifError;
      const el = document.querySelector(`script[src="${src}"]`);
      if (el) el.remove();
    };
  }, [order, publicKey, clientUrl]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-emerald-600">Verification complete</h1>
      <p className="mt-4 text-sm text-slate-700">Thank you. We have successfully verified the age for order <strong>{order}</strong>.</p>
      <div className="mt-6">
        <a href="/" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Return to site</a>
      </div>
    </div>
  );
}
