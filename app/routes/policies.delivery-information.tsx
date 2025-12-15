import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Delivery Information | Vapourism Shipping Policy'},
  {
    name: 'description',
    content: 'Vapourism delivery information and shipping options. Free UK delivery over £20, next-day options available. Standard delivery 1-3 working days.',
  },
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
            <h1>Delivery Information</h1>

            <div className="space-y-8">
              <section>
                <h2>1. Delivery Options</h2>
                <p>We offer several delivery options to suit your needs:</p>
                <ul>
                  <li><strong>Standard Delivery:</strong> 3-5 working days - £3.99</li>
                  <li><strong>Express Delivery:</strong> 1-2 working days - £7.99</li>
                  <li><strong>Next Day Delivery:</strong> Next working day - £9.99 (orders before 2pm)</li>
                  <li><strong>Free Delivery:</strong> Orders over £25 - 3-5 working days</li>
                </ul>
              </section>

              <section>
                <h2>2. Order Processing</h2>
                <p>Orders are typically processed within 1-2 working days. You will receive an email confirmation with tracking information once your order has been dispatched.</p>
              </section>

              <section>
                <h2>3. International Shipping</h2>
                <p>We currently ship to the UK only. International shipping may be available in the future.</p>
              </section>

              <section>
                <h2>4. Delivery Restrictions</h2>
                <p>Due to regulatory requirements, we are unable to ship vaping products to certain countries or regions. Please check our shipping restrictions page for more information.</p>
              </section>

              <section>
                <h2>5. Tracking Your Order</h2>
                <p>Once your order has been dispatched, you will receive a tracking number via email. You can use this to track your package on the carrier&apos;s website.</p>
              </section>

              <section>
                <h2>6. Failed Delivery</h2>
                <p>If delivery fails due to an incorrect address or if you&apos;re not available to receive the package, additional charges may apply for redelivery.</p>
              </section>

              <section>
                <h2>7. Contact Us</h2>
                <p>If you have any questions about delivery, please contact our customer service team at delivery@vapourism.com</p>
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