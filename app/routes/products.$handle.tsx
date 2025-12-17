/**
 * Product Detail Page Route
 * 
 * Displays product information with brand assets
 * URL: /products/:handle
 */

import {useCallback, useEffect, useMemo, useState} from 'react';
import {json, type ActionFunctionArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useFetcher} from '@remix-run/react';
import {getBrandAssets} from '../lib/brand-assets';
import {BrandSection} from '../components/brand/BrandSection';
import {SEOAutomationService} from '../preserved/seo-automation';
import {cn} from '../lib/utils';
import {trackViewItem, trackAddToCart, shopifyProductToGA4Item} from '../lib/analytics';

/**
 * UK VAT rate (20%)
 * Shopify prices are stored ex-VAT (tax calculated at checkout).
 * We add VAT to display prices for UK customers.
 */
const UK_VAT_RATE = 0.2;

// GraphQL query for product data
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      description
      descriptionHtml
      productType
      tags
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            image {
              url
              altText
              width
              height
            }
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
` as const;

const VARIANT_PILL_THRESHOLD = 10;

type ImageSource = {
  url?: string | null;
  altText?: string | null;
};

type ImageLike = {
  url: string;
  altText?: string | null;
};

function normalizeImage(image?: ImageSource | null): ImageLike | null {
  if (image?.url) {
    return {
      url: image.url,
      altText: image.altText ?? null,
    };
  }
  return null;
}

type VariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  selectedOptions: {name: string; value: string}[];
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Response('Not Found', {status: 404});
  }

  try {
    // Fetch product data
    const {product} = await context.storefront.query(PRODUCT_QUERY, {
      variables: {handle},
      cache: context.storefront.CacheShort(), // Cache for 1 minute
    });

    if (!product) {
      throw new Response('Product Not Found', {status: 404});
    }

    // Get brand assets if available
    const brandAssets = await getBrandAssets(product.vendor);

    // Generate SEO metadata
    const seoData = {
      title: product.title,
      vendor: product.vendor,
      productType: product.productType,
      description: product.description,
      tags: product.tags,
      price: product.priceRange.minVariantPrice,
      handle: product.handle,
      availableForSale: product.availableForSale,
    };

    const metaDescription = SEOAutomationService.generateProductMetaDescription(seoData);
    const keywords = SEOAutomationService.generateProductKeywords(seoData);
    const imageAltText = SEOAutomationService.generateImageAltText(seoData, 'main');

    return json({
      product,
      brandAssets,
      metaDescription,
      keywords,
      imageAltText,
    });
  } catch (error) {
    console.error(`Product fetch error for "${handle}":`, error);
    throw new Response('Error loading product', {status: 500});
  }
}

export default function ProductPage() {
  const {product, brandAssets} = useLoaderData<typeof loader>();
  const cartFetcher = useFetcher<{status?: string; message?: string; lineId?: string | null; quantity?: number}>();
  
  const firstVariant = product.variants.edges[0]?.node;
  const hasMultipleVariants = product.variants.edges.length > 1;
  const variantNodes: VariantNode[] = product.variants.edges.map(({node}: {node: VariantNode}) => node);
  const shouldUseVariantDropdown = hasMultipleVariants && variantNodes.length > VARIANT_PILL_THRESHOLD;
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [debouncedQuantity, setDebouncedQuantity] = useState(1);
  const [syncedQuantity, setSyncedQuantity] = useState(1);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<'added' | 'updated' | 'error' | null>(null);
  const selectedVariant = useMemo(
    () => variantNodes.find((variant) => variant.id === selectedVariantId) ?? firstVariant,
    [variantNodes, selectedVariantId, firstVariant],
  );
  
  // GA4: Track product view on page load
  useEffect(() => {
    const price = Number.parseFloat(product.priceRange.minVariantPrice.amount);
    trackViewItem({
      currency: product.priceRange.minVariantPrice.currencyCode || 'GBP',
      value: price,
      items: [shopifyProductToGA4Item({
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        productType: product.productType,
        price: product.priceRange.minVariantPrice,
      })],
    });
  }, [product.id, product.title, product.vendor, product.productType, product.priceRange.minVariantPrice]);
  
  const normalizedFeaturedImage = normalizeImage(product.featuredImage);
  const galleryImages = useMemo(
    () => product.images.edges.map(({node}: (typeof product.images.edges)[number]) => normalizeImage(node)).filter(Boolean) as ImageLike[],
    [product],
  );
  const uniqueImages = useMemo<ImageLike[]>(() => {
    const map = new Map<string, ImageLike>();
    const addImage = (image?: ImageSource | null) => {
      const normalized = normalizeImage(image);
      if (normalized && !map.has(normalized.url)) {
        map.set(normalized.url, normalized);
      }
    };

    addImage(product.featuredImage);
    galleryImages.forEach((image) => addImage(image));
    variantNodes.forEach((variant) => addImage(variant.image));

    return Array.from(map.values());
  }, [galleryImages, product.featuredImage, variantNodes]);
  const [activeImage, setActiveImage] = useState<ImageLike | null>(uniqueImages[0] ?? normalizedFeaturedImage ?? null);
  useEffect(() => {
    if (!activeImage) {
      setActiveImage(uniqueImages[0] ?? normalizedFeaturedImage ?? null);
    }
  }, [activeImage, normalizedFeaturedImage, uniqueImages]);
  useEffect(() => {
    const nextImage = normalizeImage(selectedVariant?.image);
    if (nextImage) {
      setActiveImage(nextImage);
    }
  }, [selectedVariant?.image]);
  const primaryImage = activeImage ?? normalizedFeaturedImage ?? null;
  const specHighlights = [
    {label: 'Product type', value: product.productType || 'Vaping'},
    {label: 'Vendor', value: product.vendor},
    {label: 'Availability', value: product.availableForSale ? 'Ready to ship' : 'Back-order'},
    {label: 'Price inc. VAT', value: 'Displayed price includes UK VAT'},
  ];
  const assurancePills = [
    'Free next-day delivery £50+',
    'Age verification at checkout',
    'Shopify checkout secured',
  ];
  const currencyCode = selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode || 'GBP';
  const formatPrice = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currencyCode],
  );
  // Add VAT to displayed prices (Shopify prices are ex-VAT)
  const formattedPrice = useMemo(() => {
    const amount = selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
    const amountWithVat = Number(amount ?? 0) * (1 + UK_VAT_RATE);
    return formatPrice.format(amountWithVat);
  }, [selectedVariant?.price.amount, product.priceRange.minVariantPrice.amount, formatPrice]);
  const formattedComparePrice = useMemo(() => {
    const compareAmount = product.compareAtPriceRange.minVariantPrice?.amount;
    if (!compareAmount) return null;
    const compareWithVat = Number(compareAmount) * (1 + UK_VAT_RATE);
    return formatPrice.format(compareWithVat);
  }, [product.compareAtPriceRange.minVariantPrice, formatPrice]);

  const handleVariantSelection = useCallback(
    (variant: (typeof variantNodes)[number]) => {
      setSelectedVariantId(variant.id);
      if (variant.image) {
        setActiveImage(variant.image);
      }
    },
    [],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuantity(quantity);
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [quantity]);

  useEffect(() => {
    if (!hasAddedToCart || !activeLineId) return;
    if (debouncedQuantity < 1) {
      setQuantity(1);
      setDebouncedQuantity(1);
      return;
    }
    if (debouncedQuantity === syncedQuantity) {
      return;
    }
    const formData = new FormData();
    formData.append('intent', 'update-line');
    formData.append('lineId', activeLineId);
    formData.append('quantity', String(debouncedQuantity));
    cartFetcher.submit(formData, {method: 'post'});
    setSyncedQuantity(debouncedQuantity);
    setConfirmationStatus('updated');
  }, [debouncedQuantity, hasAddedToCart, activeLineId, syncedQuantity, cartFetcher]);

  useEffect(() => {
    if (cartFetcher.state !== 'idle' || !cartFetcher.data) return;
    const {status, lineId, quantity: serverQuantity} = cartFetcher.data;
    if (status === 'added') {
      setHasAddedToCart(true);
      if (lineId) {
        setActiveLineId(lineId);
      }
      if (typeof serverQuantity === 'number') {
        setQuantity(serverQuantity);
        setDebouncedQuantity(serverQuantity);
        setSyncedQuantity(serverQuantity);
      } else {
        setSyncedQuantity(quantity);
      }
      setConfirmationStatus('added');
      
      // GA4: Track add to cart event
      const price = Number.parseFloat(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount);
      trackAddToCart({
        currency: selectedVariant?.price.currencyCode ?? 'GBP',
        value: price * (serverQuantity ?? quantity),
        items: [shopifyProductToGA4Item({
          id: selectedVariant?.id ?? product.id,
          title: product.title,
          vendor: product.vendor,
          productType: product.productType,
          price: selectedVariant?.price ?? product.priceRange.minVariantPrice,
          variantTitle: selectedVariant?.title,
          quantity: serverQuantity ?? quantity,
        })],
      });
    } else if (status === 'updated') {
      if (typeof serverQuantity === 'number') {
        setSyncedQuantity(serverQuantity);
      }
      setConfirmationStatus('updated');
    } else if (status === 'error') {
      setConfirmationStatus('error');
    }
  }, [cartFetcher.state, cartFetcher.data, quantity, selectedVariant, product]);

  const isSubmittingToCart = cartFetcher.state !== 'idle';
  const confirmationCopy = confirmationStatus === 'added'
    ? 'Added to cart'
    : confirmationStatus === 'updated'
    ? 'Quantity synced'
    : confirmationStatus === 'error'
    ? 'Cart error — please retry'
    : null;

  // Generate JSON-LD structured data for the product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: {
      '@type': 'Brand',
      name: product.vendor,
    },
    sku: selectedVariant?.id?.replace('gid://shopify/ProductVariant/', '') ?? product.id.replace('gid://shopify/Product/', ''),
    offers: {
      '@type': 'Offer',
      url: `https://vapourism.co.uk/products/${product.handle}`,
      priceCurrency: selectedVariant?.price.currencyCode ?? 'GBP',
      price: selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Vapourism',
      },
    },
    category: product.productType || 'Vaping Products',
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://vapourism.co.uk',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://vapourism.co.uk/search',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://vapourism.co.uk/products/${product.handle}`,
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />
      
      <div className="container-custom py-10 lg:py-16">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/search" className="hover:text-slate-900">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-slate-900">{product.title}</li>
          </ol>
        </nav>

        {/* Product Main Section */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px]">
        {/* Product Images */}
        <div className="space-y-6">
          {(primaryImage || normalizedFeaturedImage) && (
            <div className="rounded-[32px] border border-slate-200 bg-white/80 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <div className="overflow-hidden rounded-3xl bg-slate-100">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                    Image coming soon
                  </div>
                )}
              </div>
            </div>
          )}

          {uniqueImages.length > 1 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {uniqueImages.slice(0, 8).map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-white/70 p-2 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2be0]/70',
                    activeImage?.url === image.url ? 'border-[#5b2be0]' : 'border-slate-200',
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.altText || product.title}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{product.vendor}</p>
            <h1 className="text-4xl font-semibold text-slate-900">{product.title}</h1>
            <p className="text-sm text-slate-500">{product.productType || 'Premium vape hardware'}</p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-[#5b2be0]">
              {formattedPrice}
            </span>
            {formattedComparePrice && (
              <span className="text-lg text-slate-400 line-through">
                {formattedComparePrice}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {selectedVariant?.availableForSale ? 'In stock' : 'Waitlist'}
            </span>
          </div>

          {hasMultipleVariants && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Options
              </p>
              {shouldUseVariantDropdown ? (
                <div className="relative">
                  <label className="sr-only" htmlFor="variant-selector">
                    Select a product option
                  </label>
                  <select
                    id="variant-selector"
                    value={selectedVariant?.id ?? ''}
                    onChange={(event) => {
                      const nextVariant = variantNodes.find((variant) => variant.id === event.target.value);
                      if (nextVariant) {
                        handleVariantSelection(nextVariant);
                      }
                    }}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#5b2be0] focus:outline-none focus:ring-2 focus:ring-[#5b2be0]/50"
                  >
                    {variantNodes.map((variant) => (
                      <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                        {variant.title}
                        {!variant.availableForSale ? ' (Waitlist)' : ''}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                    </svg>
                  </span>
                  <p className="mt-2 text-xs text-slate-500">
                    Showing dropdown for {variantNodes.length} options. Pills display when there are 10 or fewer choices.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {variantNodes.map((variant) => {
                    const isSelected = variant.id === selectedVariant?.id;
                    const isDisabled = !variant.availableForSale;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleVariantSelection(variant)}
                        disabled={isDisabled}
                        className={cn(
                          'rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b2be0]/70',
                          isSelected
                            ? 'border-[#5b2be0] bg-[#5b2be0] text-white shadow-lg'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400',
                          isDisabled && 'cursor-not-allowed text-slate-400 line-through'
                        )}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-10 w-10 rounded-xl bg-slate-50 text-xl"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    if (Number.isNaN(nextValue)) return;
                    setQuantity(Math.min(Math.max(nextValue, 1), 99));
                  }}
                  className="w-16 border-none bg-transparent text-center text-lg font-semibold focus:outline-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                  className="h-10 w-10 rounded-xl bg-slate-50 text-xl"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {confirmationCopy && (
                <span className="text-sm font-semibold text-slate-600" aria-live="polite">
                  {confirmationCopy}
                </span>
              )}
            </div>

            <cartFetcher.Form method="post" className="block">
              <input type="hidden" name="intent" value="add-to-cart" />
              <input type="hidden" name="variantId" value={selectedVariant?.id ?? ''} />
              <input type="hidden" name="quantity" value={quantity} />
              <button
                type="submit"
                disabled={!product.availableForSale || !selectedVariant?.availableForSale || isSubmittingToCart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5b2be0] to-[#1fb2ff] px-6 py-4 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(91,43,224,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {product.availableForSale ? (isSubmittingToCart ? 'Processing…' : 'Add to cart') : 'Join waitlist'}
              </button>
            </cartFetcher.Form>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            {assurancePills.map((pill) => (
              <div key={pill} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                {pill}
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-sm text-slate-600">
            {specHighlights.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-slate-600">
            {product.descriptionHtml ? (
              <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
            ) : (
              <p>{product.description}</p>
            )}
          </div>

          {product.tags.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.slice(0, 12).map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>

        <div className="mt-16 grid gap-6 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_rgba(15,23,42,0.08)] lg:grid-cols-3">
          {uniqueImages.slice(0, 3).map((image, index) => (
          <div key={image.url} className="rounded-2xl bg-slate-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Focus {index + 1}</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">Curated imagery</p>
            <p className="mt-2 text-sm text-slate-500">
              Responsive assets ready for PDP storytelling and social snippets.
            </p>
          </div>
        ))}
        </div>

        {/* Brand Section (if brand has media pack) */}
        {brandAssets && (
          <BrandSection brand={brandAssets} productHandle={product.handle} />
        )}

        {/* Age Verification Notice */}
        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Age Verification Required:</strong> This product is only suitable for adults aged 18 and over.
            {' '}Age verification is required at checkout and upon delivery.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const {cart} = context;

  if (intent === 'add-to-cart') {
    const variantId = formData.get('variantId');
    const quantity = Number(formData.get('quantity')) || 1;

    if (!variantId || typeof variantId !== 'string') {
      return json({status: 'error', message: 'Missing variant selection'}, {status: 400});
    }

    const result = await cart.addLines([
      {
        merchandiseId: variantId,
        quantity,
      },
    ]);

    const headers = result.cart?.id ? cart.setCartId(result.cart.id) : new Headers();
    const lineMatch = result.cart?.lines?.edges?.find((edge) => edge?.node?.merchandise?.id === variantId)?.node;

    return json(
      {
        status: 'added',
        lineId: lineMatch?.id ?? null,
        quantity: lineMatch?.quantity ?? quantity,
      },
      {headers},
    );
  }

  if (intent === 'update-line') {
    const lineId = formData.get('lineId');
    const quantity = Number(formData.get('quantity')) || 1;

    if (!lineId || typeof lineId !== 'string') {
      return json({status: 'error', message: 'Missing cart line reference'}, {status: 400});
    }

    const result = await cart.updateLines([
      {
        id: lineId,
        quantity,
      },
    ]);

    const headers = result.cart?.id ? cart.setCartId(result.cart.id) : new Headers();

    return json(
      {
        status: 'updated',
        lineId,
        quantity,
      },
      {headers},
    );
  }

  return json({status: 'error', message: 'Unsupported intent'}, {status: 400});
}

// SEO Meta Tags
export const meta = ({data}: {data: {product: typeof import('storefrontapi.generated').ProductFragment; metaDescription: string; keywords: string[]} | null}) => {
  if (!data || !data.product) {
    return [
      {title: 'Product Not Found | Vapourism'},
    ];
  }

  const {product, metaDescription, keywords} = data;
  const productUrl = `https://vapourism.co.uk/products/${product.handle}`;
  const price = product.priceRange.minVariantPrice;

  return [
    {
      title: SEOAutomationService.generateProductTitle(product.title, product.vendor, product.seo?.title, product.handle),
    },
    {
      name: 'description',
      content: product.seo?.description || metaDescription,
    },
    {
      name: 'keywords',
      content: keywords.join(', '),
    },
    // Open Graph tags
    {
      property: 'og:title',
      content: SEOAutomationService.generateOGTitle(product.title, product.vendor),
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      property: 'og:type',
      content: 'product',
    },
    {
      property: 'og:url',
      content: productUrl,
    },
    {
      property: 'og:site_name',
      content: 'Vapourism',
    },
    {
      property: 'og:locale',
      content: 'en_GB',
    },
    ...(product.featuredImage ? [
      {
        property: 'og:image',
        content: product.featuredImage.url,
      },
      {
        property: 'og:image:width',
        content: product.featuredImage.width?.toString(),
      },
      {
        property: 'og:image:height',
        content: product.featuredImage.height?.toString(),
      },
      {
        property: 'og:image:alt',
        content: product.featuredImage.altText || product.title,
      },
    ] : []),
    {
      property: 'product:price:amount',
      content: price.amount,
    },
    {
      property: 'product:price:currency',
      content: price.currencyCode,
    },
    {
      property: 'product:availability',
      content: product.availableForSale ? 'in stock' : 'out of stock',
    },
    {
      property: 'product:condition',
      content: 'new',
    },
    {
      property: 'product:brand',
      content: product.vendor,
    },
    // Twitter Card tags
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@vapourismuk',
    },
    {
      name: 'twitter:title',
      content: product.title,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
    ...(product.featuredImage ? [
      {
        name: 'twitter:image',
        content: product.featuredImage.url,
      },
      {
        name: 'twitter:image:alt',
        content: product.featuredImage.altText || product.title,
      },
    ] : []),
  ];
};
