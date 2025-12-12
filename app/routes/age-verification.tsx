import {useState, useEffect} from 'react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {useAgeVerif} from '~/preserved/useAgeVerification';

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

  // Defensive page-level listeners: if the hook isn't registering or the
  // checker emits events before the hook attaches, these will still catch
  // events and surface them in the console and a small debug panel.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const logEvent = (name: string) => (e: any) => {
      try {
        // eslint-disable-next-line no-console
        console.error(`[ageverif.page] ${name}`, e?.detail ?? e);
      } catch {}
      try {
        const elId = 'ageverif-debug-page';
        let panel = document.getElementById(elId) as HTMLPreElement | null;
        if (!panel) {
          panel = document.createElement('pre');
          panel.id = elId;
          panel.style.position = 'fixed';
          panel.style.left = '12px';
          panel.style.bottom = '12px';
          panel.style.zIndex = '2147483647';
          panel.style.maxWidth = '40%';
          panel.style.maxHeight = '40%';
          panel.style.overflow = 'auto';
          panel.style.background = 'rgba(0,0,0,0.85)';
          panel.style.color = '#ffdede';
          panel.style.fontSize = '12px';
          panel.style.padding = '8px';
          panel.style.borderRadius = '6px';
          panel.style.whiteSpace = 'pre-wrap';
          document.body.appendChild(panel);
        }
        panel.textContent = `${name}: ${JSON.stringify(e?.detail ?? e, null, 2)}`;
      } catch {}
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
      const panel = document.getElementById('ageverif-debug-page');
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
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

  const getCustomerNumber = (customerId?: string) => {
    if (!customerId) return null;
    // If the API returned a numeric id directly, return it.
    if (/^\d+$/.test(customerId)) return customerId;
    const match = /\/(\d+)$/.exec(customerId);
    return match ? match[1] : null;
  };

  if (verificationResult) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Verification Result</h1>
        <p className="mt-4 text-sm text-slate-600">
          {verificationResult.success ? 'Age verification successful.' : 'Age verification failed.'}
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-slate-500">Order</dt>
              <dd className="mt-1 text-sm text-slate-900">{order ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">Customer Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{getCustomerNumber(verificationResult.customerId) ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500">Status</dt>
              <dd className="mt-1 text-sm text-slate-900">{verificationResult.success ? 'Pass' : 'Fail'}</dd>
            </div>
          </dl>
        </div>
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
    </div>
  );
}
