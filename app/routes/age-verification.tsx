import {useState, useEffect} from 'react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {useAgeVerif} from '~/preserved/useAgeVerification';

export const meta: MetaFunction = () => [
  {title: 'Age Verification | Vapourism'},
  {
    name: 'description',
    content: 'Age verification required for vaping products. UK law requires customers to be 18+ to purchase e-cigarettes and e-liquids. Quick and secure verification process.',
  },
];

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  const confirmationCode = url.searchParams.get('confirmationCode') || url.searchParams.get('confirmation_code');

  return json({
    order,
    confirmationCode,
    ageverifClientUrl: context?.env?.PUBLIC_AGEVERIF_CLIENT_URL ?? process.env.PUBLIC_AGEVERIF_CLIENT_URL ?? null,
    debug: context?.env?.AGEVERIF_DEBUG ?? process.env.AGEVERIF_DEBUG ?? undefined,
  });
}

export default function AgeVerificationPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; customerId?: string } | null>(null);

  const {order, confirmationCode} = data ?? {};

  const { isLoaded, startVerification: startAgeVerif } = useAgeVerif({
    onSuccess: () => {},
    onError: () => {},
  });

  // Defensive page-level listeners for ageverif events (console logging only in dev)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const logEvent = (name: string) => (e: any) => {
      if (process.env.NODE_ENV === 'development') {
        try {
          // eslint-disable-next-line no-console
          console.log(`[ageverif.page] ${name}`, e?.detail ?? e);
        } catch {}
      }
    };

    const onLoaded = logEvent('loaded');
    const onReady = logEvent('ready');
    const onSuccess = logEvent('success');
    const onError = logEvent('error');

    window.addEventListener('ageverif:loaded', onLoaded as EventListener);
    window.addEventListener('ageverif:ready', onReady as EventListener);
    window.addEventListener('ageverif:success', onSuccess as EventListener);
    window.addEventListener('ageverif:error', onError as EventListener);

    return () => {
      window.removeEventListener('ageverif:loaded', onLoaded as EventListener);
      window.removeEventListener('ageverif:ready', onReady as EventListener);
      window.removeEventListener('ageverif:success', onSuccess as EventListener);
      window.removeEventListener('ageverif:error', onError as EventListener);
    };
  }, []);

  const startVerification = async () => {
    setLoading(true);
    try {
      // Call the hook to start the provider. It returns a result object (or throws on error).
      const result = await startAgeVerif({ order, confirmationCode });

      // Expect provider to return an object with at least { verified, token }
      if (!result?.verified) {
        navigate(`/age-verification/retry?order=${encodeURIComponent(order ?? '')}`);
        return;
      }

      const token = result.token ?? null;
      if (!token) {
        // If there's no token to send, still treat as failure to persist
        navigate(`/age-verification/retry?order=${encodeURIComponent(order ?? '')}`);
        return;
      }

      // Post token to server verify endpoint to persist evidence
      const verifyRes = await fetch('/api/age-verif/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, orderNumber: order, confirmationCode }),
      });

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text();
        console.error('Verify API returned error:', verifyRes.status, errorText);
        navigate(`/age-verification/retry?order=${encodeURIComponent(order ?? '')}&error=${encodeURIComponent(errorText)}`);
        return;
      }

      const verifyJson = await verifyRes.json();
      if (verifyJson?.ok) {
        // Redirect to success page with order context
        navigate(`/age-verification/success?order=${encodeURIComponent(order ?? '')}`);
      } else {
        setVerificationResult({ success: false });
      }
    } catch (err) {
      console.error('verification start failed', err);
      setVerificationResult({ success: false });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Starting…';
    if (isLoaded) return 'Start verification';
    return 'Loading…';
  };

  const helpEmailSubject = encodeURIComponent(`Age Verification Help - Order #${order ?? 'Unknown'}`);
  const helpEmailLink = `mailto:hello@vapourism.co.uk?subject=${helpEmailSubject}`;

  if (verificationResult) {
    const isFailure = !verificationResult.success;
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        {isFailure ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-6 text-center text-2xl font-semibold text-red-600">Verification Failed</h1>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-emerald-600">Verification Successful</h1>
        )}
        <p className="mt-4 text-center text-sm text-slate-600">
          {verificationResult.success ? 'Age verification successful.' : 'We were unable to verify your age automatically.'}
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-slate-500">Order</dt>
              <dd className="mt-1 text-sm text-slate-900">{order ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">Status</dt>
              <dd className="mt-1 text-sm text-slate-900">{verificationResult.success ? 'Pass' : 'Fail'}</dd>
            </div>
          </dl>
        </div>
        {isFailure && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-sm font-semibold text-amber-800">Need help?</h2>
            <p className="mt-2 text-sm text-amber-700">
              If you&apos;re having trouble with age verification, please contact our support team and we&apos;ll help you complete your order.
            </p>
            <a
              href={helpEmailLink}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Contact Support
            </a>
          </div>
        )}
      </div>
    );
  }

  const buttonText = getButtonText();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Verify your age</h1>
      <p className="mt-4 text-sm text-slate-600">
        To complete your order verification, open the link sent in your confirmation email. This page accepts an
        order number and confirmation code and starts the age verification widget when you click the button below.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold text-slate-500">Order</dt>
            <dd className="mt-1 text-sm text-slate-900">{order ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Confirmation code</dt>
            <dd className="mt-1 text-sm text-slate-900">{confirmationCode ?? '—'}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={startVerification}
            disabled={loading || !isLoaded}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {buttonText}
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-700">Having trouble?</h2>
        <p className="mt-2 text-sm text-slate-600">
          If you need assistance with age verification, our support team is here to help.
        </p>
        <a
          href={helpEmailLink}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Email hello@vapourism.co.uk for help
        </a>
      </div>
    </div>
  );
}
