import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {
    title: 'Delivery Information | Fast UK Delivery | DPD & Royal Mail | Vapourism'
  },
  {
    name: 'description',
    content: 'Fast UK delivery for vaping products via DPD Local and Royal Mail. ✓ Free delivery over £20 ✓ Next-day delivery ✓ DPD tracking ✓ 1-3 day shipping. Order tracking included.'
  },
  {
    name: 'keywords',
    content: 'dpd local, delivery information, UK shipping, vape delivery, free delivery, next day delivery, order tracking, dpd tracking, royal mail, shipping policy'
  },
  {
    property: 'og:title',
    content: 'Delivery Information | Fast UK Delivery | DPD | Vapourism'
  },
  {
    property: 'og:description',
    content: 'Fast UK delivery for vaping products via DPD Local. Free shipping over £20. Next-day delivery available with full tracking.'
  },
  {
    name: 'robots',
    content: 'index, follow'
  }
];

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query DeliveryInformationHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query DeliveryInformationFooter {
        shop {
          name
        }
      }
    `),
    cart: await context.cart.get(),
    isLoggedIn: await context.customerAccount.isLoggedIn(),
    publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN,
  });
}

export default function DeliveryInformation() {
  const {header, footer, cart, isLoggedIn, publicStoreDomain} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Vapourism
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Fast UK Delivery</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your vaping products delivered fast via <strong>DPD Local</strong> and <strong>Royal Mail</strong>
            </p>
          </div>

          {/* Delivery Options - Card Design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-lg transition">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-lg mb-2">Standard</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">£3.99</p>
              <p className="text-sm text-gray-600">3-5 working days</p>
              <p className="text-xs text-gray-500 mt-2">Royal Mail</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-lg transition">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Express</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">£7.99</p>
              <p className="text-sm text-gray-600">1-2 working days</p>
              <p className="text-xs text-gray-500 mt-2">DPD</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-lg transition">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-lg mb-2">Next Day</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">£9.99</p>
              <p className="text-sm text-gray-600">Next working day</p>
              <p className="text-xs text-gray-500 mt-2">DPD Local (orders before 2pm)</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 text-center hover:border-green-500 hover:shadow-lg transition">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-lg mb-2">Free!</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">£0.00</p>
              <p className="text-sm text-gray-700">Orders over £20</p>
              <p className="text-xs text-gray-600 mt-2">3-5 working days</p>
            </div>
          </div>

          <div className="space-y-6 mb-16">
            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>🚚 DPD Local Tracking</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50 space-y-3">
                <p className="text-gray-700 mb-4">When you choose DPD Local delivery, you get premium tracking features:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>SMS notifications</strong> - Updates when your parcel is on its way</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>1-hour delivery window</strong> - Know exactly when to expect delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>Real-time tracking</strong> - Follow your parcel via the DPD app</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>Delivery preferences</strong> - Choose safe places or neighbors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span><strong>Follow My Parcel</strong> - Live map tracking on delivery day</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>⏰ Order Processing & Cut-off Times</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50">
                <p className="text-gray-700 mb-4">Orders are typically processed within 1-2 working days. You'll receive tracking information once dispatched.</p>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold mb-3">Order Cut-off Times (Monday-Friday):</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Next Day Delivery:</span>
                      <span className="font-bold">2:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Express Delivery:</span>
                      <span className="font-bold">4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Standard Delivery:</span>
                      <span className="font-bold">5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>🗺️ UK Delivery Coverage</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50">
                <p className="text-gray-700 mb-4">We deliver to all UK addresses:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">📍</span>
                    <span>England, Scotland, Wales, and Northern Ireland</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⛰️</span>
                    <span>Scottish Highlands and Islands (may take 1-2 extra days)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🏝️</span>
                    <span>Channel Islands and Isle of Man (Royal Mail only)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🎖️</span>
                    <span>BFPO addresses for armed forces</span>
                  </li>
                </ul>
              </div>
            </details>

            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>📦 Tracking Your Order</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50 space-y-4">
                <p className="text-gray-700">Once dispatched, you'll receive:</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Email confirmation with tracking number</li>
                  <li>• DPD customers: SMS with delivery window</li>
                  <li>• Royal Mail customers: Track & Trace number</li>
                </ul>
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">Track DPD parcels:</p>
                    <a 
                      href="https://www.dpd.co.uk/tracking" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      www.dpd.co.uk/tracking →
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Track Royal Mail parcels:</p>
                    <a 
                      href="https://www.royalmail.com/track-your-item" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      www.royalmail.com/track-your-item →
                    </a>
                  </div>
                </div>
              </div>
            </details>

            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>📋 Delivery Restrictions & Age Verification</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50 space-y-3">
                <p className="text-gray-700">All deliveries require age verification upon receipt:</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Recipient must be 18+ years old</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>ID may be required on delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Signature required (cannot be left without recipient)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Note:</strong> We currently ship to the UK only due to varying international vaping regulations.
                </p>
              </div>
            </details>

            <details className="group border-2 border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer p-6 bg-white hover:bg-gray-50 transition font-semibold text-lg flex justify-between items-center">
                <span>❓ Delivery FAQs</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-6 bg-gray-50 space-y-4">
                <div>
                  <p className="font-semibold mb-1">What if I'm not home when DPD delivers?</p>
                  <p className="text-sm text-gray-700">
                    DPD will leave a card and you can rearrange via SMS or the DPD app. You can also choose a safe place or neighbor.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">How do I qualify for free delivery?</p>
                  <p className="text-sm text-gray-700">
                    Orders over £20 automatically qualify for free standard delivery via Royal Mail.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Can I change my delivery address?</p>
                  <p className="text-sm text-gray-700">
                    Contact us immediately. We can update it before dispatch, but not once it's with the carrier.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">What happens if delivery fails?</p>
                  <p className="text-sm text-gray-700">
                    <strong>DPD:</strong> Rearrange via app/SMS. <strong>Royal Mail:</strong> Held at sorting office for 18 days.
                  </p>
                </div>
              </div>
            </details>

            {/* Contact CTA */}
            <div className="bg-blue-600 text-white rounded-xl p-8 text-center mt-8">
              <h3 className="text-2xl font-bold mb-3">Need Help with Delivery?</h3>
              <p className="mb-4">Our customer service team is here to assist you</p>
              <div className="space-y-2 text-sm">
                <p>📧 Email: delivery@vapourism.com</p>
                <p>⏰ Response within 24 hours (working days)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            © 2024 Vapourism. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}