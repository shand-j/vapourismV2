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
      {/* Success Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="mt-6 text-center text-2xl font-semibold text-emerald-600">Age Verification Complete</h1>
      
      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-center text-slate-700">
          Thank you! Your age has been successfully verified for order <strong className="text-slate-900">#{order}</strong>.
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          Your order is now being processed and will be dispatched shortly.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">What happens next?</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>Your order will be packed and dispatched within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>You&apos;ll receive a shipping confirmation email with tracking details</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>Future orders on this account won&apos;t require re-verification</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Continue Shopping
        </a>
        <a 
          href="/account/orders" 
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View My Orders
        </a>
      </div>
    </div>
  );
}
