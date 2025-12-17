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
    content: 'Vapourism: Protecting your personal data in line with UK GDPR.'
  },
  {
    name: 'twitter:card',
    content: 'summary'
  },
  {
    name: 'twitter:title',
    content: 'Privacy Policy | Vapourism'
  },
  {
    name: 'twitter:description',
    content: 'How Vapourism protects your personal data in compliance with UK GDPR.'
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/policies/privacy-policy'
  },
  {
    name: 'robots',
    content: 'index, follow'
  },
  {
    name: 'twitter:card',
    content: 'summary'
  },
  {
    name: 'twitter:title',
    content: 'Privacy Policy | Vapourism'
  },
  {
    name: 'twitter:description',
    content: 'Learn how Vapourism handles your data & our UK GDPR compliance practices. #DataProtection'
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
            <h1>Vapourism UK GDPR Privacy Policy: Data Collection, Use & Rights</h1>
            
            <p className="lead text-xl text-gray-600 mb-8">
              At Vapourism, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information in compliance with UK GDPR and Data Protection Act 2018. We are committed to transparency about our data practices and your privacy rights.
            </p>

            <div className="space-y-8">
              <section>
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, delivery address, billing information, and age verification details. We also collect information about your product preferences, order history, and communication preferences to provide personalized service.</p>
                <p>Additionally, we automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages viewed, time spent on pages, and referring websites. This technical data helps us understand how customers use our site and identify areas for improvement. We collect this information through cookies and similar tracking technologies as detailed in our Cookie Policy.</p>
                <p>For age verification purposes, we collect date of birth and government-issued identification details through certified third-party verification services. This is a legal requirement for selling vaping products in the UK, and we only collect the minimum information necessary to verify you are 18 or over.</p>
              </section>

              <section>
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you about orders, products, and promotional offers. Your personal data enables us to fulfill orders accurately, provide customer support, and ensure legal compliance with UK vaping regulations including mandatory age verification.</p>
                <p>We analyze aggregated customer data to understand shopping patterns, popular products, and seasonal trends. This helps us maintain optimal inventory levels, develop relevant marketing campaigns, and improve product recommendations. We may use your email address to send order confirmations, shipping notifications, and occasional promotional emails (which you can opt out of at any time).</p>
                <p>Your data also supports fraud prevention and security measures. We monitor transactions for suspicious activity, verify customer identities to prevent account takeovers, and maintain records as required by UK financial regulations. Age verification data is retained to comply with legal obligations regarding the sale of restricted products.</p>
              </section>

              <section>
                <h2>3. Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We share limited information with trusted service providers who assist in operating our website, conducting business, and serving customers. These third parties include payment processors, shipping carriers, email service providers, and age verification services.</p>
                <p>All third-party service providers are contractually obligated to maintain confidentiality and can only use your information to perform specific services on our behalf. They cannot use your data for their own purposes or share it with other organizations. We carefully vet all service providers to ensure they meet GDPR compliance standards and implement appropriate security measures.</p>
                <p>We may disclose your information when required by law, such as responding to court orders, legal processes, or law enforcement requests. We may also share information to protect our rights, property, and safety, or the rights and safety of our customers and the public, as permitted by law. In the event of a business sale or merger, customer data may be transferred to the acquiring entity.</p>
              </section>

              <section>
                <h2>How We Secure Your Personal Data at Vapourism</h2>
                <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security practices include SSL encryption for data transmission, secure servers with firewall protection, regular security audits, and restricted access to personal data on a need-to-know basis.</p>
                <p>Payment information is processed through PCI DSS compliant payment gateways and never stored on our servers. Age verification data is encrypted both in transit and at rest, with access limited to authorized personnel for compliance verification purposes. We maintain comprehensive backup systems and incident response procedures to protect against data loss and security breaches.</p>
                <p>While we implement industry-standard security measures, no method of internet transmission or electronic storage is completely secure. We cannot guarantee absolute security but continually update our security practices to align with current best practices and regulatory requirements.</p>
              </section>

              <section>
                <h2>5. Cookies and Tracking Technologies</h2>
                <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small text files stored on your device that help us remember your preferences, maintain your shopping cart between sessions, and understand how you interact with our website. For detailed information about the specific cookies we use and how to manage them, please refer to our separate Cookie Policy.</p>
              </section>

              <section>
                <h2>6. Your Rights Under UK GDPR</h2>
                <p>You have the right to access, update, or delete your personal information. You can exercise these rights by logging into your account, contacting our customer service team, or emailing privacy@vapourism.co.uk. Specific rights include the right to know what personal data we hold, the right to rectification of inaccurate data, the right to erasure (subject to legal retention requirements), and the right to restrict or object to processing.</p>
                <p>You have the right to data portability, meaning you can request a copy of your personal data in a structured, machine-readable format. You can withdraw consent for marketing communications at any time by clicking unsubscribe links in emails or updating your account preferences. These rights are subject to certain legal exceptions, such as our obligation to retain records for tax purposes or age verification compliance.</p>
                <p>If you believe we have not handled your data properly, you have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's data protection supervisory authority. We encourage you to contact us first so we can address your concerns directly.</p>
              </section>

              <section>
                <h2>7. Data Retention</h2>
                <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Account information is retained while your account remains active and for a period afterward to comply with legal obligations, resolve disputes, and enforce agreements.</p>
                <p>Order and payment data is retained for seven years in accordance with UK tax law requirements. Age verification records are maintained indefinitely to demonstrate compliance with legal obligations regarding age-restricted product sales. Marketing data is retained until you withdraw consent or request deletion.</p>
              </section>

              <section>
                <h2>8. Changes to This Policy</h2>
                <p>We may update this privacy policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. We will notify you of any material changes by posting the new policy on this page with an updated effective date. For significant changes, we may provide additional notice through email or prominent website banners.</p>
                <p>We encourage you to review this privacy policy periodically to stay informed about how we protect your information. Continued use of our services after policy changes constitutes acceptance of the updated terms.</p>
              </section>

              <section>
                <h2>9. Contact Us</h2>
                <p>If you have any questions about this privacy policy, want to exercise your data protection rights, or need assistance with privacy-related matters, please contact us at privacy@vapourism.co.uk or write to us at our registered address: Vapourism, 3 Hylton Drive, Cheadle Hulme, Stockport, SK8 7DH, United Kingdom.</p>
              </section>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Data Controller:</strong> Vapourism (Company Reg: 15936898)
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Last Updated:</strong> December 2024
              </p>
              <p className="text-sm text-gray-600">
                This Privacy Policy should be read in conjunction with our <Link to="/policies/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link> and <Link to="/policies/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>.
              </p>
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