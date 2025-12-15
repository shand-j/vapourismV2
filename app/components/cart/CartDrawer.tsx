import {useEffect, useMemo, useRef, useState} from 'react';
import {Link, useFetcher} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm, Image} from '@shopify/hydrogen';
import {cn} from '../../lib/utils';
import {trackViewCart, shopifyProductToGA4Item} from '../../lib/analytics';

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT (tax calculated at checkout).
 * We add VAT to display prices for UK customers.
 */
const UK_VAT_RATE = 0.2;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fallbackCart: CartApiQueryFragment | null;
  onCartUpdate?: (cart: CartApiQueryFragment | null) => void;
}

type CartFetcherData = {cart: CartApiQueryFragment | null};

// Free shipping threshold is VAT-inclusive (£50 inc VAT)
const FREE_SHIPPING_THRESHOLD = 50;

export function CartDrawer({isOpen, onClose, fallbackCart, onCartUpdate}: CartDrawerProps) {
  const fetcher = useFetcher<CartFetcherData>();
  const previousOverflow = useRef<string>('');
  const hasRequestedCart = useRef(false);

  const cart = (fetcher.data?.cart ?? fallbackCart) ?? null;
  const lines = cart?.lines?.nodes ?? [];
  const isLoading = fetcher.state !== 'idle';
  // Subtotal from Shopify is ex-VAT, add 20% for display
  const subtotalExVat = cart?.cost?.subtotalAmount?.amount ? Number(cart.cost.subtotalAmount.amount) : 0;
  const subtotalIncVat = subtotalExVat * (1 + UK_VAT_RATE);
  const cartCount = cart?.totalQuantity ?? 0;

  const freeShipping = useMemo(() => {
    // Compare VAT-inclusive subtotal against threshold
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalIncVat);
    const progress = Math.min(1, subtotalIncVat / FREE_SHIPPING_THRESHOLD);
    const qualifies = remaining === 0;
    return {remaining, progress, qualifies};
  }, [subtotalIncVat]);

  useEffect(() => {
    if (isOpen && !hasRequestedCart.current) {
      fetcher.load('/cart');
      hasRequestedCart.current = true;
    }

    if (!isOpen) {
      hasRequestedCart.current = false;
    }
  }, [isOpen, fetcher]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [isOpen]);

  useEffect(() => {
    onCartUpdate?.(cart ?? null);
  }, [cart, onCartUpdate]);

  // Track cart view when drawer opens with items
  useEffect(() => {
    if (isOpen && cart && lines.length > 0) {
      const ga4Items = lines.map(line => {
        const merchandise = line.merchandise;
        return shopifyProductToGA4Item({
          id: merchandise.id,
          title: merchandise.product?.title || merchandise.title,
          vendor: merchandise.product?.vendor,
          price: merchandise.price,
          variantTitle: merchandise.title,
          quantity: line.quantity,
        });
      });

      trackViewCart({
        currency: cart.cost?.subtotalAmount?.currencyCode || 'GBP',
        value: subtotalIncVat,
        items: ga4Items,
      });
    }
  }, [isOpen, cart, lines, subtotalIncVat]);

  if (!isOpen) {
    return null;
  }

  const subtotalLabel = formatMoney(cart?.cost?.subtotalAmount);
  const checkoutUrl = cart?.checkoutUrl ?? '/cart';

  return (
    <div className="fixed inset-0 z-[140] flex">
      <button
        type="button"
        className="absolute inset-0 z-[5] bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close cart"
      />

      <aside
        className={cn(
          'relative z-[10] ml-auto flex h-full w-full max-w-lg flex-col bg-white shadow-[0_25px_90px_rgba(15,23,42,0.35)]',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Cart</p>
            <p className="text-lg font-semibold text-slate-900">
              {cartCount > 0 ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Start shopping'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
            aria-label="Close cart drawer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="space-y-4 border-b border-slate-100 px-6 py-4">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600/10 via-sky-500/10 to-emerald-400/10 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Order by 1pm for next-day dispatch</p>
            <p className="text-xs text-slate-500">We pick, pack, and ship from Sussex every weekday.</p>
          </div>
          {cartCount > 0 && (
            <FreeDeliveryProgress
              qualifies={freeShipping.qualifies}
              progress={freeShipping.progress}
              remaining={freeShipping.remaining}
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartCount === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
              <p className="text-base font-semibold text-slate-900">Your cart is empty</p>
              <p className="mt-2 text-sm">Use search to find your next setup.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/search?q=vape"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
                  onClick={onClose}
                >
                  Search products
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                if (!line) return null;
                return <CartDrawerLine key={line.id} line={line} />;
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-slate-200 px-6 py-5">
          {cartCount > 0 && (
            <div className="space-y-3 text-sm text-slate-600">
              <LineItem label="Subtotal (inc. VAT)" value={subtotalLabel} emphasize />
              <p className="text-xs text-slate-500">Shipping calculated at checkout</p>
            </div>
          )}

          {cartCount > 0 ? (
            <div className="mt-5 space-y-3">
              <Link
                to="/cart"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                onClick={onClose}
              >
                View detailed cart
              </Link>
              <a
                href={checkoutUrl}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] px-4 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(91,43,224,0.35)]"
              >
                Proceed to checkout
              </a>
              <p className="text-xs text-slate-500">Age verification finalises automatically once payment is confirmed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/search?tag=disposable"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                onClick={onClose}
              >
                Shop reusables
              </Link>
              <Link
                to="/search?tag=device"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                onClick={onClose}
              >
                Browse vape kits
              </Link>
            </div>
          )}
        </footer>

        {isLoading && (
          <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-2 bg-white/90 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Refreshing cart
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" aria-hidden />
          </div>
        )}
      </aside>
    </div>
  );
}

/**
 * Format money with VAT included.
 * Shopify prices are ex-VAT, so we add 20% for UK display.
 */
function formatMoney(amount?: {amount: string; currencyCode: string} | null, includeVat = true) {
  if (!amount?.amount) return '—';
  let displayAmount = Number(amount.amount);
  if (includeVat) {
    displayAmount = displayAmount * (1 + UK_VAT_RATE);
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: amount.currencyCode || 'GBP',
    minimumFractionDigits: 2,
  }).format(displayAmount);
}

function LineItem({label, value, emphasize}: {label: string; value: string; emphasize?: boolean}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={cn('font-semibold', emphasize ? 'text-slate-900 text-base' : 'text-slate-900')}>{value}</span>
    </div>
  );
}

type CartLineNode = NonNullable<CartApiQueryFragment['lines']>['nodes'][number];

function CartDrawerLine({line}: {line: CartLineNode}) {
  const [quantity, setQuantity] = useState(line.quantity);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const merchandise = line.merchandise as {
    product?: {handle?: string; title?: string; vendor?: string} | null;
    title?: string | null;
    image?: {url?: string | null; altText?: string | null} | null;
  };
  const imageUrl = merchandise.image?.url;
  const vendor = merchandise.product?.vendor ?? 'Vapourism';
  const title = merchandise.product?.title ?? merchandise.title ?? 'Product';
  const handle = merchandise.product?.handle;
  const linePrice = formatMoney(line.cost?.totalAmount);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-50">
        {imageUrl ? (
          <img src={imageUrl} alt={merchandise.image?.altText || title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">{vendor}</p>
            {handle ? (
              <Link to={`/products/${handle}`} className="text-sm font-semibold text-slate-900 hover:underline" prefetch="intent">
                {title}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-slate-900">{title}</p>
            )}
          </div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="ml-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Remove item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="ml-2 flex gap-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <CartForm
                fetcherKey={`remove-${line.id}`}
                route="/cart"
                action={CartForm.ACTIONS.LinesRemove}
                inputs={{lineIds: [line.id]}}
              >
                <button
                  type="submit"
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </CartForm>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <CartForm
            fetcherKey={`update-${line.id}`}
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{lines: [{id: line.id, quantity}]}}
          >
            <div className="flex items-center gap-2">
              <label htmlFor={`quantity-${line.id}`} className="text-xs text-slate-500">Qty:</label>
              <input
                id={`quantity-${line.id}`}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 rounded border border-slate-200 px-2 py-1 text-sm text-center focus:border-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={quantity === line.quantity}
                className="rounded bg-slate-600 px-2 py-1 text-xs text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </CartForm>
          <span className="text-sm font-semibold text-slate-900">{linePrice}</span>
        </div>
      </div>
    </li>
  );
}

function FreeDeliveryProgress({
  qualifies,
  progress,
  remaining,
}: {
  qualifies: boolean;
  progress: number;
  remaining: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        <span>Free delivery £50+</span>
        <span className={qualifies ? 'text-emerald-600' : 'text-slate-500'}>
          {qualifies ? 'Unlocked' : `£${remaining.toFixed(2)} to go`}
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full rounded-full bg-slate-100">
        <div
          className={cn(
            'h-2.5 rounded-full transition-all duration-300',
            qualifies ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-sky-400',
          )}
          style={{width: `${Math.max(progress * 100, 4)}%`}}
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {qualifies ? 'Nice one! Shipping is on us.' : 'Add another item or two to skip the delivery fee.'}
      </p>
    </div>
  );
}
