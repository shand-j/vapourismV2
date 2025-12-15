import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Returns Policy | Vapourism'},
  {
    name: 'description',
    content: 'Vapourism returns and refunds policy. 14-day return period for unopened items. Learn about our hassle-free return process and warranty information.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query ReturnsPolicyHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query ReturnsPolicyFooter {
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

export default function ReturnsPolicy() {
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
            <h1>Returns Policy</h1>

            <div className="space-y-8">
              <section>
                <h2>1. Returns Period</h2>
                <p>You have 14 days from the date of delivery to return items for a refund or exchange.</p>
              </section>

              <section>
                <h2>2. Return Conditions</h2>
                <p>Items must be returned in their original packaging, unused, and in the same condition as received.</p>
              </section>

              <section>
                <h2>3. How to Return</h2>
                <p>Contact our customer service team to initiate a return. We&apos;ll provide a return label and instructions.</p>
              </section>

              <section>
                <h2>4. Refunds</h2>
                <p>Refunds will be processed within 5-7 business days of receiving your returned item. The refund will be issued to your original payment method.</p>
              </section>

              <section>
                <h2>5. Exchanges</h2>
                <p>If you wish to exchange an item, please contact us within 14 days of delivery. We&apos;ll arrange for the exchange at no additional cost.</p>
              </section>

              <section>
                <h2>6. Non-Returnable Items</h2>
                <p>Opened e-liquid bottles, used vaping devices, and personalized items are not eligible for return.</p>
              </section>

              <section>
                <h2>7. Damaged or Defective Items</h2>
                <p>If you receive a damaged or defective item, please contact us immediately. We&apos;ll arrange for a replacement or full refund.</p>
              </section>

              <section>
                <h2>8. Contact Us</h2>
                <p>For returns inquiries, please email returns@vapourism.com or call our customer service team.</p>
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