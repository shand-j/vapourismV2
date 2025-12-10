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
  {title: 'Guides & playbooks | Vapourism'},
  {
    name: 'description',
    content: 'Compliance, sustainability, and product education guides that ship with Vapourism V2.',
  },
];

export default function GuidesIndexRoute() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Guides</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Operational transparency</h1>
          <p className="mt-3 text-slate-600">
            These guides mirror what our customers and compliance teams rely on day-to-day. Each one links
            out to an individual route so there is never a dead nav item.
          </p>
        </div>

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
      </div>
    </div>
  );
}
