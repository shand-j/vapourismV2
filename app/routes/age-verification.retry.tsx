import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Retry Age Verification | Vapourism'},
  {
    name: 'description',
    content: 'Retry age verification for your Vapourism order. If you experienced issues, you can attempt verification again.',
  },
];

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = url.searchParams.get('order');
  const error = url.searchParams.get('error');
  return json({order, error});
}

export default function RetryPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-rose-600">Verification failed</h1>
      <p className="mt-4 text-sm text-slate-700">We couldn't complete verification for order <strong>{data.order}</strong>. Please retry using the link in your email.</p>
      {data.error && <p className="mt-3 text-sm text-rose-600">Error: {data.error}</p>}
      <div className="mt-6 flex gap-3">
        <a href="/" className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Back to site</a>
        <button onClick={() => window.location.reload()} className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Retry</button>
      </div>
    </div>
  );
}
