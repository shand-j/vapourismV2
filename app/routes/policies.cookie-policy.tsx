import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Cookie Policy | Vapourism'},
  {
    name: 'description',
    content: 'Vapourism cookie policy explains how we use cookies and similar technologies to improve your browsing experience and provide essential website functionality.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query CookiePolicyHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query CookiePolicyFooter {
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

export default function CookiePolicy() {
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
            <h1>Cookie Policy</h1>

            <div className="space-y-8">
              <section>
                <h2>1. What Are Cookies</h2>
                <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website.</p>
              </section>

              <section>
                <h2>2. How We Use Cookies</h2>
                <p>We use cookies to improve your browsing experience, analyze site traffic, and personalize content and advertising.</p>
              </section>

              <section>
                <h2>3. Types of Cookies We Use</h2>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                </ul>
              </section>

              <section>
                <h2>4. Managing Cookies</h2>
                <p>You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.</p>
              </section>

              <section>
                <h2>5. Third-Party Cookies</h2>
                <p>Some cookies may be set by third-party services that appear on our pages, such as social media plugins or analytics services.</p>
              </section>

              <section>
                <h2>6. Updates to This Policy</h2>
                <p>We may update this cookie policy from time to time. Any changes will be posted on this page.</p>
              </section>

              <section>
                <h2>7. Contact Us</h2>
                <p>If you have any questions about our use of cookies, please contact us at support@vapourism.com</p>
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