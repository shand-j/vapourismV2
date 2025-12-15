import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {Package, Truck, Clock, CheckCircle, Info, Mail} from 'lucide-react';

export const meta: MetaFunction = () => [
  {title: 'Track Your Order | Real-Time Delivery Status | Vapourism'},
  {
    name: 'description',
    content: 'Track your Vapourism order with real-time delivery updates. Check order status, estimated delivery times, and courier tracking information. Fast UK delivery with full transparency.',
  },
  {
    name: 'keywords',
    content: 'track order, order tracking, delivery status, courier tracking, order status UK, package tracking, vapourism delivery, tracking number, where is my order',
  },
  {
    property: 'og:title',
    content: 'Track Your Order | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Track your Vapourism order with real-time delivery updates and courier tracking information.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    name: 'twitter:card',
    content: 'summary',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  const shopDomain = context.env?.PUBLIC_STORE_DOMAIN || 'vapourism.co.uk';
  
  return json({
    shopDomain,
    trackingUrl: `https://${shopDomain}/account/orders`,
  });
}

export default function TrackOrder() {
  const {trackingUrl} = useLoaderData<typeof loader>();

  const trackingSteps = [
    {
      icon: Package,
      title: 'Order Confirmed',
      description: 'Your order has been received and is being prepared for dispatch',
      timing: 'Within 5 minutes',
    },
    {
      icon: CheckCircle,
      title: 'Processing',
      description: 'Your items are being picked, packed, and quality checked at our Sussex warehouse',
      timing: 'Within 1-2 hours',
    },
    {
      icon: Truck,
      title: 'Dispatched',
      description: 'Your order has left our warehouse and is with the courier for delivery',
      timing: 'Same day (before 1pm orders)',
    },
    {
      icon: Clock,
      title: 'Out for Delivery',
      description: 'Your package is on the delivery vehicle and will arrive today',
      timing: '1-3 working days',
    },
  ];

  const deliveryInfo = [
    {
      title: 'Standard Delivery',
      timeframe: '1-3 working days',
      description: 'Free on orders over £50. Orders placed before 1pm are typically dispatched same day Monday-Friday.',
    },
    {
      title: 'Next Day Delivery',
      timeframe: '1 working day',
      description: 'Available for £5.99. Orders placed before 1pm are dispatched same day for next working day delivery.',
    },
    {
      title: 'Courier Services',
      timeframe: 'Varies',
      description: 'We use trusted UK couriers including Royal Mail, DPD, and Evri. All parcels include tracking numbers.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Order Tracking</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Track your delivery</h1>
          <p className="mt-3 text-lg text-slate-600">
            Monitor your order in real-time from our warehouse to your doorstep. Enter your order details below to see the current status of your delivery.
          </p>
        </div>

        {/* Tracking CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="glass-morphism rounded-[28px] border border-slate-100 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-brand-subtle">
                <Package className="h-8 w-8 text-[#5b2be0]" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Track Your Order Status</h2>
            <p className="text-slate-600 mb-6">
              Click the button below to access our order tracking system. You'll need your order number and email address to view your delivery status.
            </p>
            <a
              href={trackingUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-8 py-4 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(91,43,224,0.35)] hover:shadow-[0_25px_60px_rgba(91,43,224,0.45)] transition-shadow"
            >
              Track My Order
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Tracking Process Steps */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Your order journey</h2>
            <p className="text-slate-600">
              Follow your package through each stage of our fulfillment and delivery process. We provide transparency at every step from warehouse to doorstep.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="glass-morphism rounded-2xl border border-slate-100 p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5b2be0]/10">
                      <Icon className="h-7 w-7 text-[#5b2be0]" />
                    </div>
                  </div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                  <p className="text-xs font-medium text-[#5b2be0]">{step.timing}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Delivery options explained</h2>
            <p className="text-slate-600">
              We offer flexible delivery services to meet your needs. All orders include tracking numbers and estimated delivery windows for complete peace of mind.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {deliveryInfo.map((option) => (
              <div
                key={option.title}
                className="glass-morphism rounded-2xl border border-slate-100 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{option.title}</h3>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#5b2be0]/10 px-3 py-1 text-xs font-semibold text-[#5b2be0]">
                  <Clock className="h-3 w-3" />
                  {option.timeframe}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-morphism rounded-2xl border border-slate-100 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Need help with your order?</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    If you haven't received a tracking email within 24 hours of placing your order, or if your tracking information shows an unexpected delay, our customer service team is here to help investigate and resolve the issue quickly.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Common delivery questions we can help with include missing tracking numbers, delivery address changes, estimated delivery time queries, courier contact information, and failed delivery attempt assistance.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-[#5b2be0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4a23b8] transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </Link>
                    <Link
                      to="/faq"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      View Delivery FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            All vaping product deliveries require age verification. Our couriers are instructed to verify that the recipient is 18 years or over before handing over packages. This is a legal requirement for vaping products in the United Kingdom and helps ensure responsible retail practices.
          </p>
        </div>
      </div>
    </div>
  );
}
