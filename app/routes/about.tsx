import type {MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'About Vapourism'},
  {
    name: 'description',
    content: 'Learn how Vapourism pairs compliance-first retail with Shopify-native architecture.',
  },
];

export default function AboutRoute() {
  const milestones = [
    {year: '2015', detail: 'Opened our first UK retail experience focused on compliance and education.'},
    {year: '2020', detail: 'Launched a headless storefront to support rapid catalogue expansion.'},
    {year: '2025', detail: 'Rebuilt on Hydrogen 2025.1.4 with Shopify predictive search and tag-based navigation.'},
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">About</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Built for responsible growth</h1>
          <p className="mt-3 text-slate-600">
            Vapourism blends rigorous age verification, transparent shipping rules, and Shopify-native UX so
            customers always know exactly what they are buying and how it ships.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-[28px] border border-slate-100 bg-white/90 p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{milestone.year}</p>
              <p className="mt-3 text-sm text-slate-600">{milestone.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[28px] border border-slate-200 bg-white/90 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">What stays non‑negotiable</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Two-stage age verification mirrors our brick-and-mortar flow.</li>
            <li>• Shipping restrictions automatically reference our preserved compliance map.</li>
            <li>• Shopify Checkout handles every transaction—no custom forks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
