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
        "item": "https://www.vapourism.co.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": "https://www.vapourism.co.uk/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Sustainability",
        "item": "https://www.vapourism.co.uk/guides/sustainability"
      }
    ]
  };

  return [
    {title: 'Sustainability & Environmental Commitment | Eco-Friendly Vaping | Vapourism'},
    {
      name: 'description',
      content:
        'Vapourism\'s sustainability commitment: eco-friendly packaging, responsible recycling, and environmental initiatives. Learn how we reduce waste and promote sustainable vaping practices in the UK.',
    },
    {
      name: 'keywords',
      content: 'sustainable vaping, eco-friendly packaging, vape recycling, environmental initiatives, responsible vaping, green practices, waste reduction, sustainability UK',
    },
    {
      property: 'og:title',
      content: 'Sustainability & Environmental Commitment | Vapourism',
    },
    {
      property: 'og:description',
      content:
        'Vapourism\'s commitment to sustainability, responsible packaging, and environmental initiatives in the UK vaping industry.',
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:url',
      content: 'https://www.vapourism.co.uk/guides/sustainability',
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

export default function GuideSustainability() {
  const {showcaseProducts} = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero */}
      <section className="container-custom py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
            Our commitment
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Sustainability at Vapourism
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            We believe responsible vaping includes responsible business practices.
            Here's how we're working to reduce our environmental footprint.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="container-custom pb-16 lg:pb-24">
        <div className="mx-auto max-w-3xl space-y-16">
          {/* Packaging */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                📦
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Responsible Packaging
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                All Vapourism orders ship in recyclable cardboard packaging. We've
                eliminated plastic void fill and bubble wrap from our dispatch process,
                replacing them with paper-based alternatives.
              </p>
              <ul>
                <li>100% recyclable outer boxes</li>
                <li>Paper tape instead of plastic tape</li>
                <li>Biodegradable packing peanuts for fragile items</li>
                <li>Minimal packaging—right-sized boxes to reduce waste</li>
              </ul>
            </div>
          </div>

          {/* Disposable recycling */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                ♻️
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Disposable Vape Recycling
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Disposable vapes contain lithium batteries and electronic components
                that shouldn't go in household waste. We're working on solutions to
                make recycling accessible for our customers.
              </p>
              <p>
                <strong>How to dispose of disposables responsibly:</strong>
              </p>
              <ul>
                <li>
                  Take used disposables to your local recycling centre's WEEE
                  (Waste Electrical and Electronic Equipment) collection point
                </li>
                <li>
                  Many supermarkets and retailers have battery recycling bins that
                  accept small electronics
                </li>
                <li>Never put disposable vapes in general household waste or recycling bins</li>
              </ul>
              <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                <strong>Coming soon:</strong> We're developing a mail-back recycling
                programme for Vapourism customers. Sign up to our newsletter to be
                notified when it launches.
              </p>
            </div>
          </div>

          {/* Carbon footprint */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🌱
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Reducing Our Carbon Footprint
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Our Sussex distribution hub is strategically located to minimise
                delivery distances across the UK. We consolidate shipments and work
                with carriers committed to fleet electrification.
              </p>
              <ul>
                <li>Consolidated daily dispatch runs to reduce vehicle journeys</li>
                <li>LED lighting and energy-efficient equipment in our warehouse</li>
                <li>Digital-first customer communications to reduce paper use</li>
                <li>Partnership with Royal Mail's carbon-neutral delivery programme</li>
              </ul>
            </div>
          </div>

          {/* Supplier standards */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                🤝
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Supplier Standards
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                We partner with brands that share our values. When onboarding new
                suppliers, we assess their environmental and ethical practices
                alongside product quality.
              </p>
              <ul>
                <li>Preference for UK and EU manufacturers to reduce shipping distances</li>
                <li>Assessment of supplier packaging practices</li>
                <li>Support for brands with take-back or recycling schemes</li>
              </ul>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Questions about our sustainability efforts?
            </h3>
            <p className="mt-2 text-slate-600">
              We're always looking for ways to improve. Get in touch with suggestions
              or to learn more about our initiatives.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Contact us
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
