import React from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {ContinueShoppingShowcase} from '~/components/ProductShowcase';
import type {ProductCardProduct} from '~/components/ProductCard';
import {FALLBACK_FEATURED_PRODUCTS_QUERY} from '~/lib/product-showcases';
import {SEOAutomationService} from '~/preserved/seo-automation';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const policyTitle = data?.policy.title ?? '';
  const fullTitle = `Vapourism | ${policyTitle}`;
  const metaTags = [
    {title: SEOAutomationService.truncateTitle(fullTitle)}
  ];
  
  // Generate a relevant description for policy pages
  const policyDescriptions: Record<string, string> = {
    'privacy-policy': 'Read our privacy policy to understand how Vapourism collects, uses, and protects your personal data. GDPR compliant data protection.',
    'refund-policy': 'View our refund policy for returns and exchanges. 14-day money back guarantee on eligible products.',
    'shipping-policy': 'Learn about our shipping policy, delivery times, and shipping costs. Fast UK delivery with DPD and Royal Mail.',
    'terms-of-service': 'Read our terms of service covering purchases, age restrictions, and legal information for shopping at Vapourism.',
  };
  
  // Try to get description from policy handle or fallback to a generic one
  const handle = data?.policy?.handle || policyTitle.toLowerCase().replace(/\s+/g, '-');
  const description = policyDescriptions[handle] || `Read ${policyTitle} at Vapourism. Important legal and policy information for UK vape shop customers.`;
  
  metaTags.push({
    name: 'description',
    content: description
  });
  
  return metaTags;
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.split('-').map((part, index) => 
    index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
  ).join('') as SelectedPolicies;

  const [policyData, productsData] = await Promise.all([
    context.storefront.query(POLICY_CONTENT_QUERY, {
      variables: {
        privacyPolicy: false,
        shippingPolicy: false,
        termsOfService: false,
        refundPolicy: false,
        [policyName]: true,
        language: context.storefront.i18n?.language,
      },
    }),
    context.storefront.query(FALLBACK_FEATURED_PRODUCTS_QUERY, {
      variables: {first: 4},
      cache: context.storefront.CacheLong(),
    }),
  ]);

  const policy = policyData.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {
    policy,
    showcaseProducts: productsData.products.nodes as ProductCardProduct[],
  };
}

export default function Policy() {
  const {policy, showcaseProducts} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link
            to="/policies"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back to Policies
          </Link>
        </div>
        <h1 className="mb-8 text-3xl font-bold text-slate-900">{policy.title}</h1>
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{__html: policy.body}}
        />
      </div>

      {/* Continue Shopping Section */}
      {showcaseProducts.length > 0 && (
        <ContinueShoppingShowcase products={showcaseProducts} />
      )}
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
