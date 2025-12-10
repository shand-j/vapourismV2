import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  return json({ order });
}

export default function Fail() {
  const { order } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl p-8 border rounded-xl shadow-sm text-center">
        <h1 className="text-3xl font-semibold mb-4">Verification failed</h1>
        <p className="text-muted-foreground">We couldn't verify your age for order <strong>{order}</strong>. You can try again or request a refund via support.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a className="inline-flex items-center px-4 py-2 border rounded" href={`/age-verification?order=${encodeURIComponent(order||'')}`}>Try again</a>
          <a className="inline-flex items-center px-4 py-2 border rounded" href="mailto:support@vapourism.co.uk">Request refund / Contact support</a>
        </div>
      </div>
    </div>
  );
}
