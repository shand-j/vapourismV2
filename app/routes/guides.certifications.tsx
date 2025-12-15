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
        "name": "Certifications & Compliance",
        "item": "https://vapourism.co.uk/guides/certifications"
      }
    ]
  };

  return [
    {title: 'Certifications & Compliance | UK & EU Vaping Regulations | Vapourism'},
    {
      name: 'description',
      content:
        'Vapourism\'s UK and EU regulatory certifications, MHRA registration, TPD compliance, and product safety standards. Learn how we ensure all vaping products meet strict quality and legal requirements.',
    },
    {
      name: 'keywords',
      content: 'TPD compliance, MHRA registration, UK vaping regulations, EU vaping laws, product safety, vaping certifications, regulatory compliance, quality standards',
    },
    {
      property: 'og:title',
      content: 'Certifications & Compliance | Vapourism',
    },
    {
      property: 'og:description',
      content:
        'UK and EU regulatory certifications, MHRA registration, TPD compliance, and product safety standards for vaping products.',
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:url',
      content: 'https://vapourism.co.uk/guides/certifications',
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

export default function GuideCertifications() {
  const {showcaseProducts} = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero */}
      <section className="container-custom py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">
            Regulatory compliance
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Certifications & Compliance
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Every product we sell meets UK regulatory standards. Here's how we
            ensure compliance and product safety.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="container-custom pb-16 lg:pb-24">
        <div className="mx-auto max-w-3xl space-y-16">
          {/* MHRA Registration */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🏛️
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                MHRA Registration
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                The Medicines and Healthcare products Regulatory Agency (MHRA)
                maintains the UK's register of notified e-cigarette and refill
                container products. All vaping products sold by Vapourism are
                registered on this database.
              </p>
              <p>
                MHRA registration ensures that each product has been formally
                notified to UK authorities with complete ingredient listings,
                emission data, and toxicological information.
              </p>
              <div className="rounded-xl bg-blue-50 p-4 text-sm">
                <strong>Verification:</strong> You can check product registrations
                on the{' '}
                <a
                  href="https://www.gov.uk/government/collections/mhra-e-cigarette-and-vape-products-guidance-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  MHRA website
                </a>
                .
              </div>
            </div>
          </div>

          {/* TPD Compliance */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                📋
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                TPD Compliance
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                The Tobacco Products Directive (TPD) sets EU-wide standards for
                vaping products. Although the UK has left the EU, TPD requirements
                remain part of UK law through the Tobacco and Related Products
                Regulations 2016 (TRPR).
              </p>
              <h3 className="text-lg font-semibold">Key TPD Requirements</h3>
              <ul>
                <li>
                  <strong>Tank capacity:</strong> Maximum 2ml for refillable tanks
                </li>
                <li>
                  <strong>E-liquid bottles:</strong> Maximum 10ml for
                  nicotine-containing e-liquids
                </li>
                <li>
                  <strong>Nicotine strength:</strong> Maximum 20mg/ml
                </li>
                <li>
                  <strong>Packaging:</strong> Child-resistant, tamper-evident
                  containers
                </li>
                <li>
                  <strong>Labelling:</strong> Health warnings covering 30% of
                  packaging
                </li>
              </ul>
              <p>
                <strong>Note on shortfills:</strong> Shortfill e-liquids (typically
                50ml or 100ml bottles) are sold nicotine-free and are compliant
                with regulations. Customers add their own nicotine shots if desired.
              </p>
            </div>
          </div>

          {/* Product Safety */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                ✅
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Product Safety Standards
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Beyond regulatory requirements, we work with suppliers who meet
                recognised safety and quality standards:
              </p>
              <ul>
                <li>
                  <strong>CE/UKCA marking:</strong> Electrical safety compliance
                  for devices
                </li>
                <li>
                  <strong>Battery certifications:</strong> UN38.3 transport
                  certification for lithium batteries
                </li>
                <li>
                  <strong>ISO manufacturing:</strong> Many of our suppliers hold
                  ISO 9001 quality management certification
                </li>
                <li>
                  <strong>Lab testing:</strong> E-liquid ingredients tested for
                  purity and contaminants
                </li>
              </ul>
            </div>
          </div>

          {/* Supplier Vetting */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                🔍
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Supplier Vetting
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                We only work with established UK and EU distributors who can
                provide documentation of regulatory compliance. Our onboarding
                process includes:
              </p>
              <ul>
                <li>Verification of MHRA notification numbers</li>
                <li>Review of product information files</li>
                <li>Confirmation of UK-registered responsible persons</li>
                <li>Assessment of quality control processes</li>
              </ul>
            </div>
          </div>

          {/* Certificates section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                📄
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Certificate Downloads
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p>
                Downloadable copies of our key certifications and compliance
                documents will be available here soon.
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  Certificate downloads coming soon
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Contact us if you need specific documentation for business purposes
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Questions about product compliance?
            </h3>
            <p className="mt-2 text-slate-600">
              Our team can provide documentation and answer questions about
              specific products or regulatory requirements.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
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
