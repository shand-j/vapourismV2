import React from 'react';
import {type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {ContinueShoppingShowcase} from '~/components/ProductShowcase';
import type {ProductCardProduct} from '~/components/ProductCard';
import {FALLBACK_FEATURED_PRODUCTS_QUERY} from '~/lib/product-showcases';

export const meta: MetaFunction = () => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://vapourism.co.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": "https://vapourism.co.uk/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Age Verification",
        "item": "https://vapourism.co.uk/guides/age-verification"
      }
    ]
  };

  return [
    {title: 'Age Verification Guide | UK Legal Requirements | Vapourism'},
    {
      name: 'description',
      content:
        'How Vapourism verifies customer age to comply with UK law. Learn about our two-stage age verification process for vaping products. Must be 18+ to purchase.',
    },
    {
      name: 'keywords',
      content: 'age verification, UK vaping law, 18+ requirement, age check, legal compliance, customer verification, vaping regulations, ID verification',
    },
    {
      property: 'og:title',
      content: 'Age Verification Guide | Vapourism',
    },
    {
      property: 'og:description',
      content:
        'How Vapourism verifies customer age to comply with UK law. Two-stage verification process explained.',
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:url',
      content: 'https://vapourism.co.uk/guides/age-verification',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      "script:ld+json": breadcrumbSchema
    }
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {products} = await context.storefront.query(FALLBACK_FEATURED_PRODUCTS_QUERY, {
    variables: {first: 4},
    cache: context.storefront.CacheLong(),
  });

  return {
    showcaseProducts: products.nodes as ProductCardProduct[],
  };
}

export default function GuideAgeVerification() {
  const {showcaseProducts} = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero */}
      <section className="container-custom py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-600">
            Legal requirement
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Age Verification
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            UK law prohibits the sale of vaping products to anyone under 18.
            Here's how we ensure all our customers are of legal age.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="container-custom pb-16 lg:pb-24">
        <div className="mx-auto max-w-3xl space-y-16">
          {/* Legal requirements */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                ⚖️
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Legal Requirements
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Under the Nicotine Inhaling Products (Age of Sale and Proxy
                Purchasing) Regulations 2015 and subsequent amendments, it is
                illegal to sell vaping products to anyone under 18 years of age
                in the UK.
              </p>
              <p>
                This applies to all nicotine-containing products including:
              </p>
              <ul>
                <li>E-cigarettes and vape devices</li>
                <li>E-liquids containing nicotine</li>
                <li>Nicotine pouches</li>
                <li>Nicotine shots and boosters</li>
              </ul>
              <p>
                Online retailers have a legal duty to take reasonable steps to
                verify customer age before completing sales.
              </p>
            </div>
          </div>

          {/* Our process */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                🔐
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Our Two-Stage Process
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Vapourism uses a robust two-stage age verification process to
                ensure compliance:
              </p>

              <h3 className="text-lg font-semibold">Stage 1: Site Entry</h3>
              <p>
                When you first visit our store, you'll be asked to confirm your
                date of birth. This initial check prevents underage visitors from
                browsing age-restricted products.
              </p>

              <h3 className="text-lg font-semibold">Stage 2: Order Verification</h3>
              <p>
                After placing an order, your identity and age are verified through
                our trusted verification partner. This typically happens automatically
                using public records databases.
              </p>
              <p>
                If automatic verification isn't possible, you may be asked to
                provide additional documentation such as:
              </p>
              <ul>
                <li>Photo ID (passport, driving licence)</li>
                <li>Utility bill or bank statement for address verification</li>
              </ul>
            </div>
          </div>

          {/* Verification partner */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🤝
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Our Verification Partner
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                We partner with AgeVerif, a UK-based age verification service
                that specialises in compliance for age-restricted online retail.
              </p>
              <p>
                AgeVerif uses a combination of:
              </p>
              <ul>
                <li>Electoral roll data</li>
                <li>Credit reference agency records</li>
                <li>Mobile phone network data</li>
                <li>Document verification when needed</li>
              </ul>
              <p>
                This multi-source approach allows most customers to be verified
                instantly without manual document submission.
              </p>
            </div>
          </div>

          {/* Data privacy */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                🛡️
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Your Privacy
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Age verification data is processed securely and in accordance
                with UK GDPR requirements:
              </p>
              <ul>
                <li>
                  Verification checks are performed by our partner, not stored
                  by Vapourism
                </li>
                <li>
                  Only the verification result (pass/fail) is shared with us
                </li>
                <li>
                  Document uploads are encrypted and deleted after verification
                </li>
                <li>
                  Your verification status is linked to your customer account
                  so you don't need to re-verify for future orders
                </li>
              </ul>
              <p>
                For full details, see our{' '}
                <Link to="/policies/privacy-policy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                ❓
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Common Questions
              </h2>
            </div>
            <div className="space-y-4">
              <details className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900">
                  Why was my verification unsuccessful?
                </summary>
                <div className="px-6 pb-4 text-slate-600">
                  <p>
                    Automatic verification may fail if your details don't match
                    public records exactly (e.g., different address format, recent
                    house move, or name change). In these cases, you'll be asked
                    to upload ID documentation.
                  </p>
                </div>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900">
                  Do I need to verify for every order?
                </summary>
                <div className="px-6 pb-4 text-slate-600">
                  <p>
                    No. Once your age has been verified and linked to your
                    customer account, you won't need to verify again for future
                    orders.
                  </p>
                </div>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900">
                  What happens if I fail verification?
                </summary>
                <div className="px-6 pb-4 text-slate-600">
                  <p>
                    If automatic verification fails and you cannot provide valid
                    documentation proving you are 18 or over, your order will be
                    cancelled and refunded in full.
                  </p>
                </div>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900">
                  Is my personal data safe?
                </summary>
                <div className="px-6 pb-4 text-slate-600">
                  <p>
                    Yes. Our verification partner is fully GDPR compliant. They
                    process verification checks but don't share your personal
                    details with us beyond the pass/fail result. Any documents
                    you upload are encrypted and automatically deleted after
                    review.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Having trouble with verification?
            </h3>
            <p className="mt-2 text-slate-600">
              Our support team can help resolve verification issues and answer
              any questions about the process.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>

      {/* Continue Shopping Section */}
      {showcaseProducts.length > 0 && (
        <ContinueShoppingShowcase products={showcaseProducts} />
      )}
    </div>
  );
}
