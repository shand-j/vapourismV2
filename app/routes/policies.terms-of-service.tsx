import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query TermsOfServiceHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query TermsOfServiceFooter {
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

export default function TermsOfService() {
  const {header, footer, cart, isLoggedIn, publicStoreDomain} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header would go here - simplified for now */}
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
            <h1>Terms of Service</h1>

            <div className="space-y-8">
              <section>
                <h2>1. Introduction</h2>
                <p>Welcome to Vapourism. These terms and conditions outline the rules and regulations for the use of Vapourism&apos;s Website, located at [website URL].</p>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Vapourism if you do not agree to take all of the terms and conditions stated on this page.</p>
              </section>

              <section>
                <h2>2. Age Restrictions</h2>
                <p>You must be at least 18 years old to purchase products from Vapourism. By using our website and placing an order, you confirm that you are over 18 years of age.</p>
              </section>

              <section>
                <h2>3. Products and Services</h2>
                <p>Vapourism offers a range of vaping products including e-liquids, devices, and accessories. All products are subject to availability.</p>
              </section>

              <section>
                <h2>4. Pricing and Payment</h2>
                <p>All prices are displayed in GBP and include VAT where applicable. Payment is processed securely through our payment partners.</p>
              </section>

              <section>
                <h2>5. Shipping and Delivery</h2>
                <p>We aim to dispatch orders within 1-2 working days. Delivery times vary by location and service selected.</p>
              </section>

              <section>
                <h2>6. Returns and Refunds</h2>
                <p>Items can be returned within 14 days of delivery for a full refund, provided they are in original condition.</p>
              </section>

              <section>
                <h2>7. Limitation of Liability</h2>
                <p>Vapourism shall not be liable for any indirect, incidental, special, or consequential damages.</p>
              </section>

              <section>
                <h2>8. Governing Law</h2>
                <p>These terms are governed by English law and subject to the exclusive jurisdiction of the English courts.</p>
              </section>

              <section>
                <h2>9. Contact Information</h2>
                <p>For any questions regarding these terms, please contact us at support@vapourism.com</p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer would go here - simplified for now */}
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