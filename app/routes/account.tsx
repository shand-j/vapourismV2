import type {MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => [
  {title: 'Vapourism Account: Manage Your Account & More'},
  {
    name: 'description',
    content: 'Customer account management is moving to Shopify’s native experience.',
  },
  {
    name: 'keywords',
    content: 'customer account management, Shopify integration, order history, subscriptions management, age verification, delivery policies, returns process, user experience',
  },
];

export default function AccountRoute() {
  const steps = [
    'Shopify-native login replaces bespoke auth to keep PCI compliance effortless.',
    'Order history, subscriptions, and saved addresses will land here shortly.',
    'Support can still locate any order using your email while this ships.',
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Accounts</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Customer portal in progress</h1>
          <p className="mt-3 text-slate-600">
            We are wiring Shopify’s Customer Account API directly into the Hydrogen experience so
            logins, subscriptions, and loyalty perks feel seamless across channels.
          </p>
        </div>

        <div className="mt-12 space-y-4 rounded-[28px] border border-dashed border-slate-200 bg-white/90 p-8 text-sm text-slate-600">
          {steps.map((step, index) => (
            <div key={step} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/10 text-xs font-semibold text-slate-700">
                {index + 1}
              </span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
