import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {
    title: 'Privacy Policy | Data Protection & GDPR | Vapourism'
  },
  {
    name: 'description',
    content: 'Vapourism privacy policy. Learn how we collect, use, and protect your personal data in compliance with UK GDPR. Transparent data handling for vaping customers.'
  },
  {
    name: 'keywords',
    content: 'privacy policy, GDPR, data protection, personal information, UK privacy law, customer data, vape shop privacy'
  },
  {
    property: 'og:title',
    content: 'Privacy Policy | Vapourism'
  },
  {
    property: 'og:description',
    content: 'How Vapourism protects your personal data in compliance with UK GDPR.'
  },
  {
    name: 'robots',
    content: 'index, follow'
  }
];

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query PrivacyPolicyHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query PrivacyPolicyFooter {
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

export default function PrivacyPolicy() {
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
            <h1>Privacy Policy</h1>

            <div className="space-y-8">
              <section>
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
              </section>

              <section>
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              </section>

              <section>
                <h2>3. Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
              </section>

              <section>
                <h2>4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </section>

              <section>
                <h2>5. Cookies</h2>
                <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
              </section>

              <section>
                <h2>6. Your Rights</h2>
                <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
              </section>

              <section>
                <h2>7. Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
              </section>

              <section>
                <h2>8. Contact Us</h2>
                <p>If you have any questions about this privacy policy, please contact us at privacy@vapourism.com</p>
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