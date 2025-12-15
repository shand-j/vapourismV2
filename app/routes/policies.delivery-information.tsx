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
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1>Delivery Information | Fast UK Delivery via DPD</h1>

            <p className="lead">
              Get your vaping products delivered fast with our reliable UK delivery service. 
              We use <strong>DPD Local</strong> and <strong>Royal Mail</strong> to ensure your 
              order arrives quickly and safely.
            </p>

            <div className="space-y-8">
              <section>
                <h2>1. Delivery Options</h2>
                <p>We offer several delivery options to suit your needs:</p>
                <ul>
                  <li><strong>Standard Delivery (Royal Mail):</strong> 3-5 working days - £3.99</li>
                  <li><strong>Express Delivery (DPD):</strong> 1-2 working days - £7.99</li>
                  <li><strong>Next Day Delivery (DPD Local):</strong> Next working day - £9.99 (orders before 2pm)</li>
                  <li><strong>Free Delivery:</strong> Orders over £20 - 3-5 working days via Royal Mail</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Note:</strong> Next day delivery is only available for orders placed before 2pm 
                  on working days (Monday-Friday). Orders placed after 2pm or on weekends will be dispatched 
                  the next working day.
                </p>
              </section>

              <section>
                <h2>2. DPD Local Tracking</h2>
                <p>
                  When you choose DPD Local delivery, you'll receive:
                </p>
                <ul>
                  <li><strong>SMS notifications:</strong> Get updates when your parcel is on its way</li>
                  <li><strong>1-hour delivery window:</strong> Know exactly when your order will arrive</li>
                  <li><strong>Real-time tracking:</strong> Follow your parcel's journey via the DPD app</li>
                  <li><strong>Delivery preferences:</strong> Choose safe places or neighbors for delivery</li>
                  <li><strong>Follow My Parcel:</strong> Live map tracking on delivery day</li>
                </ul>
              </section>

              <section>
                <h2>3. Order Processing</h2>
                <p>
                  Orders are typically processed within 1-2 working days. You will receive an email 
                  confirmation with tracking information once your order has been dispatched.
                </p>
                <p>
                  <strong>Order Cut-off Times:</strong>
                </p>
                <ul>
                  <li>Next Day Delivery: 2pm (Monday-Friday)</li>
                  <li>Express Delivery: 4pm (Monday-Friday)</li>
                  <li>Standard Delivery: 5pm (Monday-Friday)</li>
                </ul>
              </section>

              <section>
                <h2>4. UK Delivery Coverage</h2>
                <p>
                  We deliver to all UK addresses including:
                </p>
                <ul>
                  <li>England, Scotland, Wales, and Northern Ireland</li>
                  <li>Scottish Highlands and Islands (may take 1-2 extra days)</li>
                  <li>Channel Islands and Isle of Man (Royal Mail only)</li>
                  <li>BFPO addresses for armed forces</li>
                </ul>
                <p>
                  <strong>Note:</strong> Remote areas may require additional delivery time. DPD Local 
                  coverage may vary in some Scottish Highland and Island locations.
                </p>
              </section>

              <section>
                <h2>5. Tracking Your Order</h2>
                <p>
                  Once your order has been dispatched, you will receive:
                </p>
                <ul>
                  <li>Email confirmation with tracking number</li>
                  <li>DPD Local customers: SMS with delivery window (for express/next day)</li>
                  <li>Royal Mail customers: Track &amp; Trace number</li>
                  <li>Link to track your parcel on the carrier's website</li>
                </ul>
                <p>
                  <strong>Track your DPD parcel:</strong> Visit{' '}
                  <a href="https://www.dpd.co.uk/tracking" target="_blank" rel="noopener noreferrer">
                    www.dpd.co.uk/tracking
                  </a>
                </p>
                <p>
                  <strong>Track your Royal Mail parcel:</strong> Visit{' '}
                  <a href="https://www.royalmail.com/track-your-item" target="_blank" rel="noopener noreferrer">
                    www.royalmail.com/track-your-item
                  </a>
                </p>
              </section>

              <section>
                <h2>6. International Shipping</h2>
                <p>We currently ship to the UK only. International shipping is not available at this time 
                due to varying vaping regulations in different countries.</p>
              </section>

              <section>
                <h2>7. Delivery Restrictions</h2>
                <p>
                  Due to regulatory requirements, we are unable to ship vaping products to certain 
                  countries or regions. All deliveries require age verification upon receipt.
                </p>
                <ul>
                  <li>Recipient must be 18+ years old</li>
                  <li>ID may be required on delivery</li>
                  <li>Deliveries cannot be left without a signature for age-restricted items</li>
                </ul>
              </section>

              <section>
                <h2>8. Failed Delivery</h2>
                <p>
                  If delivery fails due to an incorrect address or if you're not available to receive 
                  the package:
                </p>
                <ul>
                  <li><strong>DPD Local:</strong> You can rearrange delivery via SMS or the DPD app</li>
                  <li><strong>Royal Mail:</strong> Parcel will be held at local sorting office for 18 days</li>
                  <li>Additional charges may apply for redelivery to a different address</li>
                  <li>Please ensure your contact details are correct when ordering</li>
                </ul>
              </section>

              <section>
                <h2>9. Delivery FAQs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">What if I'm not home when DPD delivers?</h3>
                    <p>
                      DPD will leave a card and attempt redelivery. You can also use the DPD app to 
                      choose a safe place or neighboring address for delivery.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">How do I qualify for free delivery?</h3>
                    <p>
                      Orders over £20 automatically qualify for free standard delivery via Royal Mail.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Can I change my delivery address?</h3>
                    <p>
                      Contact us immediately if you need to change your address. We can update it before 
                      dispatch, but changes may not be possible once the order is with the carrier.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2>10. Contact Us</h2>
                <p>
                  If you have any questions about delivery, please contact our customer service team:
                </p>
                <ul>
                  <li>Email: delivery@vapourism.com</li>
                  <li>Phone: Available during business hours</li>
                  <li>Response time: Within 24 hours on working days</li>
                </ul>
              </section>
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