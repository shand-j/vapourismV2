import {Link} from '@remix-run/react';
import type {MetaFunction} from '@shopify/remix-oxygen';

const GUIDES = [
  {
    slug: 'sustainability',
    title: 'Sustainability commitments',
    summary: 'How Vapourism approaches recycling, courier selection, and carbon tracking for UK fulfilment.',
  },
  {
    slug: 'certifications',
    title: 'Certifications & lab reports',
    summary: 'A living index of TPD compliance, MSDS files, and third-party lab data for stocked brands.',
  },
  {
    slug: 'age-verification',
    title: 'Age verification playbook',
    summary: 'Why we run two-step checks and how they integrate with Shopify checkout + courier scans.',
  },
];

export const meta: MetaFunction = () => [
  {title: 'Vaping Guides & Resources | Expert Advice | Vapourism'},
  {
    name: 'description',
    content: 'Vapourism provides expert vaping guides covering UK regulations, compliance, and sustainability. Stay informed about responsible vaping practices.',
  },
  {
    name: 'keywords',
    content: 'vaping guides, vaping advice, UK vaping regulations, age verification guide, vaping compliance, sustainability, product education, vaping resources',
  },
  {
    property: 'og:title',
    content: 'Vaping Guides & Resources | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Expert vaping guides covering compliance, sustainability, and product education.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/guides',
  },
  {
    name: 'twitter:card',
    content: 'summary',
  },
];

export default function GuidesIndexRoute() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Guides</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Vaping education and compliance resources</h1>
          <p className="mt-3 text-lg text-slate-600">
            Comprehensive guides covering UK vaping regulations, compliance standards, sustainability practices, and age verification procedures. Essential reading for customers and industry professionals seeking to understand responsible vaping retail.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="glass-morphism rounded-2xl border border-slate-100 p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why we publish operational guides</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Transparency is fundamental to responsible vaping retail. These comprehensive guides document our operational procedures, compliance frameworks, and sustainability commitments. They serve multiple purposes: educating customers about industry regulations, demonstrating our accountability to regulatory bodies, and providing clear documentation for our internal compliance teams.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Each guide addresses a specific aspect of our operations, from age verification protocols that ensure legal compliance to sustainability initiatives that minimize environmental impact. We maintain these as living documents, updating them as regulations evolve and our practices improve.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Whether you're a customer curious about how we verify age, a compliance officer reviewing our procedures, or an industry peer seeking best practices, these guides offer detailed insights into how Vapourism operates as a UK vaping retailer committed to regulatory compliance and customer safety.
              </p>
            </div>
          </div>
        </div>

        {/* Guide Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="rounded-[28px] border border-slate-100 bg-white/90 p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Playbook</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{guide.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b2be0]">
                Read guide
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Key Topics Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">What our guides cover</h2>
            <p className="text-slate-600">
              Detailed documentation across critical operational areas including regulatory compliance, environmental responsibility, and customer safety protocols.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-morphism rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Regulatory Compliance</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our compliance guides detail how we adhere to UK Tobacco and Related Products Regulations (TRPR), including TPD notification requirements, nicotine strength limitations, packaging standards, and product labelling mandates. We document every compliance checkpoint from product sourcing to customer delivery.
              </p>
              <p className="text-sm text-slate-600">
                Topics include: TPD compliance, MHRA notifications, Trading Standards requirements, ingredient disclosure, batch testing protocols, and quality assurance procedures.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Age Verification</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our age verification guide explains our two-stage verification process that ensures all customers are 18 or over as required by UK law. We detail the technology providers we use, the verification steps customers experience, and how we integrate age checks with courier delivery protocols.
              </p>
              <p className="text-sm text-slate-600">
                Topics include: Two-stage verification process, third-party verification partners, Shopify checkout integration, courier age verification, failed verification procedures, and customer data protection.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Sustainability Practices</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Environmental responsibility guides document our recycling programs, courier carbon offset initiatives, packaging material choices, and waste reduction strategies. We explain how we balance fast delivery commitments with environmental sustainability goals in UK fulfillment operations.
              </p>
              <p className="text-sm text-slate-600">
                Topics include: Recycling schemes, carbon-neutral delivery options, sustainable packaging materials, battery disposal programs, e-liquid bottle recycling, and carbon footprint tracking.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Product Certifications</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our certification guide provides a comprehensive index of product testing documentation, including TPD compliance certificates, MSDS files, third-party lab reports, and batch testing results. We explain how we verify authenticity of manufacturer claims and maintain up-to-date certification records.
              </p>
              <p className="text-sm text-slate-600">
                Topics include: TPD notification numbers, lab testing certificates, MSDS documentation, ingredient verification, authenticity checks, manufacturer authorization, and compliance databases.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Callout */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Have questions about our practices?</h3>
            <p className="text-slate-700 mb-6">
              If you can't find the information you need in our guides, our customer service team can answer specific questions about our compliance procedures, verification processes, or sustainability initiatives.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#5b2be0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4a23b8] transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
