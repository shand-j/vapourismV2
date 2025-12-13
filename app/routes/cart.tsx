import {json, type LoaderFunctionArgs, type ActionFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT (tax calculated at checkout).
 * We add VAT to display prices for UK customers.
 */
const UK_VAT_RATE = 0.2;

export const meta: MetaFunction = () => [
  {title: 'Your cart | Vapourism'},
  {
    name: 'description',
    content: 'Secure Shopify checkout backed by Hydrogen cart APIs and preserved compliance tooling.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();
  return json({cart});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Error(`Unknown cart action: ${action}`);
  }

  return json({cart: result});
}

function formatMoney(amount?: {amount: string; currencyCode: string}, includeVat = true) {
  if (!amount) return null;
  let displayAmount = Number(amount.amount);
  // Add VAT for display (Shopify prices are ex-VAT)
  if (includeVat) {
    displayAmount = displayAmount * (1 + UK_VAT_RATE);
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: amount.currencyCode || 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayAmount);
}

export default function CartRoute() {
  const {cart} = useLoaderData<typeof loader>();
  const lines = cart?.lines?.edges ?? [];
  const hasItems = (cart?.totalQuantity ?? 0) > 0;
  const subtotal = formatMoney(cart?.cost?.subtotalAmount);

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Cart</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Review your selections</h1>
          <p className="mt-3 text-slate-600">
            This V2 surface uses the same Hydrogen cart API as the legacy storefront so analytics, discount codes,
            and compliance checks stay in sync. Checkout launches Shopify&apos;s hosted experience.
          </p>

          {!hasItems ? (
            <div className="mt-12 rounded-[32px] border border-slate-100 bg-white/80 p-10 text-center shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
              <p className="mt-2 text-sm text-slate-500">Browse our products by category and add items to get started.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  Browse All Products
                </Link>
                <Link
                  to="/search?q=disposable"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  Try predictive search
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                {lines.map((line) => {
                  if (!line?.node) return null;
                  const merchandise = line.node.merchandise as {
                    id?: string;
                    title?: string;
                    product?: {handle?: string; title?: string; vendor?: string} | null;
                    image?: {url?: string | null; altText?: string | null} | null;
                  };
                  const handle = merchandise.product?.handle;
                  const linePrice = formatMoney(line.node.cost?.totalAmount);
                  return (
                    <article
                      key={line.node.id}
                      className="flex items-center gap-6 rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
                    >
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                        {merchandise.image?.url ? (
                          <img src={merchandise.image.url} alt={merchandise.image.altText || merchandise.title || ''} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{merchandise.product?.vendor ?? 'Vapourism'}</p>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {handle ? (
                              <Link to={`/products/${handle}`} className="hover:underline">
                                {merchandise.product?.title || merchandise.title}
                              </Link>
                            ) : (
                              merchandise.product?.title || merchandise.title
                            )}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span>Qty {line.node.quantity}</span>
                          {linePrice && <span className="font-semibold text-slate-900">{linePrice}</span>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="rounded-[28px] border border-slate-100 bg-white/95 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal (inc. VAT)</span>
                    <span className="font-semibold text-slate-900">{subtotal ?? '—'}</span>
                  </div>
                  <p className="text-xs text-slate-500">Shipping calculated at checkout</p>
                </div>
                <Link
                  to={cart?.checkoutUrl ?? '/checkout'}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] px-6 py-4 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(91,43,224,0.35)]"
                >
                  Proceed to checkout
                </Link>
                <p className="mt-3 text-xs text-slate-500">
                  Age verification occurs automatically once you confirm payment.
                </p>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
