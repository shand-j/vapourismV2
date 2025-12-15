import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {
    title: 'Age Verification Complete | Vapourism'
  },
  {
    name: 'description',
    content: 'Your age verification is complete. Your order is now being processed and will be dispatched shortly.'
  },
  {
    name: 'robots',
    content: 'noindex, nofollow'
  }
];

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  return json({order});
}

export default function AgeVerificationSuccess() {
  const {order} = useLoaderData<typeof loader>();

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
          Thank you! Your age has been successfully verified{order ? <> for order <strong className="text-slate-900">#{order}</strong></> : ''}.
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
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/account/orders" 
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View My Orders
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Questions?{' '}
        <a
          href={`mailto:hello@vapourism.co.uk?subject=${encodeURIComponent(`Order #${order || ''} Query`)}`}
          className="text-emerald-600 hover:underline"
        >
          Contact support
        </a>
      </p>
    </div>
  );
}
