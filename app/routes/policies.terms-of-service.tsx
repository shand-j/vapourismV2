import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {
    title: 'Terms of Service | Terms & Conditions | Vapourism'
  },
  {
    name: 'description',
    content: 'Vapourism terms of service and conditions. Read our terms for purchasing vaping products, user responsibilities, and legal agreements for UK customers.'
  },
  {
    name: 'keywords',
    content: 'terms of service, terms and conditions, user agreement, vape shop terms, UK legal terms, purchase conditions'
  },
  {
    property: 'og:title',
    content: 'Terms of Service | Vapourism'
  },
  {
    property: 'og:description',
    content: 'Read our terms of service and conditions for purchasing vaping products.'
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/policies/terms-of-service'
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
    content: 'Terms of Service | Vapourism'
  },
  {
    name: 'twitter:description',
    content: 'Understand Vapourism\'s terms of service for vaping products. Know your rights & responsibilities. #VapingRegulations'
  }
];

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
            <h1>Vapourism Terms of Service: UK Vaping Purchase Policies</h1>
            
            <p className="lead text-xl text-gray-600 mb-8">
              These Terms of Service govern your use of the Vapourism website and purchase of products. By accessing our website or placing an order, you agree to be bound by these terms. Please read them carefully before making a purchase. If you disagree with any part of these terms, you must not use our website or services.
            </p>

            <div className="space-y-8">
              <section>
                <h2>1. Introduction and Acceptance</h2>
                <p>Welcome to Vapourism, operated by Vapourism Ltd (Company Registration 15936898), a UK registered company specializing in vaping products and accessories. These terms and conditions outline the rules and regulations for the use of Vapourism&apos;s website located at vapourism.co.uk and the purchase of products through our online store.</p>
                <p>By accessing this website, creating an account, or placing an order, you accept these terms and conditions in full. Do not continue to use Vapourism if you do not agree to all of the terms and conditions stated on this page. These terms apply to all visitors, users, customers, and others who access or use our service.</p>
                <p>We reserve the right to update, change, or replace any part of these Terms of Service by posting updates on our website. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of any changes constitutes acceptance of those changes.</p>
              </section>

              <section>
                <h2>2. Age Restrictions and Verification</h2>
                <p>You must be at least 18 years old to purchase products from Vapourism. This is a legal requirement under UK law for the sale of nicotine-containing products and vaping devices. By using our website and placing an order, you confirm that you are over 18 years of age and legally able to enter into binding contracts.</p>
                <p>We operate a strict age verification process using certified third-party verification services. All customers must successfully complete age verification before their first purchase. Attempting to purchase products while under 18 years of age is illegal and will result in order cancellation, account suspension, and potential reporting to law enforcement authorities.</p>
                <p>We reserve the right to request additional proof of age at any time. Failure to provide satisfactory proof will result in order cancellation and refund. Couriers are instructed to verify age upon delivery and may refuse to hand over packages if the recipient cannot prove they are 18 or over.</p>
              </section>

              <section>
                <h2>3. Products and Services</h2>
                <p>Vapourism offers a comprehensive range of vaping products including disposable vapes, e-liquids, nicotine salts, shortfills, pod systems, box mods, tanks, coils, batteries, and accessories. All products are subject to availability and we reserve the right to discontinue any product at any time without notice.</p>
                <p>Product descriptions, images, and specifications are provided for information purposes and may not always reflect exact appearance or current stock. While we make every effort to ensure accuracy, we cannot guarantee that all product information is complete, accurate, or current. We reserve the right to correct errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</p>
                <p>All vaping products sold comply with UK Tobacco and Related Products Regulations (TRPR), including TPD requirements for maximum nicotine strength (20mg/ml), maximum e-liquid bottle size (10ml for nicotine-containing products), and childproof packaging. We source products exclusively from authorized UK distributors and manufacturers.</p>
              </section>

              <section>
                <h2>4. Pricing and Payment</h2>
                <p>All prices are displayed in British Pounds Sterling (GBP) and include Value Added Tax (VAT) at the current UK rate of 20% where applicable. Prices are subject to change without notice, though price changes will not affect orders already placed and confirmed.</p>
                <p>Payment is processed securely through Shopify's PCI DSS compliant payment gateway. We accept major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. Payment information is processed directly by payment providers and never stored on our servers.</p>
                <p>Promotional codes and discounts must be entered at checkout and cannot be applied retroactively to completed orders. Only one promotional code can be used per order unless explicitly stated. Promotional offers may be subject to specific terms and conditions including minimum order values, product restrictions, and expiration dates.</p>
                <p>In the event of pricing errors or technical glitches resulting in incorrect pricing, we reserve the right to cancel orders and refund any payments made. We'll notify you immediately if this occurs and offer the opportunity to purchase at the correct price.</p>
              </section>

              <section>
                <h2>5. Shipping and Delivery</h2>
                <p>We aim to dispatch orders within 1-2 working days from our Sussex warehouse. Orders placed before 1pm Monday-Friday are typically dispatched the same day, though this is not guaranteed during peak periods or due to circumstances beyond our control. Orders placed after 1pm or on weekends are processed the next working day.</p>
                <p>Delivery times vary by location and service selected. Standard UK delivery typically takes 1-3 working days. We offer free standard delivery on orders over £50. Express next-day delivery is available for £5.99 on orders placed before 1pm Monday-Thursday. Remote areas including Scottish Highlands and offshore islands may experience longer delivery times.</p>
                <p>We ship to UK mainland addresses and selected international destinations. Some products cannot be shipped to certain countries due to local regulations - our checkout system will notify you if your order contains restricted items. Customers are responsible for understanding and complying with import regulations in their country.</p>
                <p>Risk of loss and title for items purchased pass to you upon delivery to the carrier. We're not responsible for delays caused by couriers, weather conditions, customs clearance, or other circumstances beyond our control. Tracking information is provided for all orders where available.</p>
              </section>

              <section>
                <h2>6. Returns and Refunds</h2>
                <p>Items can be returned within 14 days of delivery for a full refund, provided they are in original condition, unopened, unused, and with all packaging intact. This complies with UK Consumer Rights Act 2015 and Distance Selling Regulations. For complete details about our returns process, conditions, and exceptions, please refer to our separate Returns Policy.</p>
                <p>E-liquid bottles cannot be returned once opened for hygiene and safety reasons. Vaping devices showing signs of use cannot be accepted for return. Customers are responsible for return shipping costs for change-of-mind returns. Faulty or defective items can be returned for full refund or replacement at our expense.</p>
              </section>

              <section>
                <h2>Vapourism Account Creation & Security: Your Responsibilities</h2>
                <p>You may need to create an account to complete purchases on our website. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must provide accurate, complete, and current information when creating your account and keep this information updated.</p>
                <p>You agree to immediately notify us of any unauthorized access to or use of your account. We cannot and will not be liable for any loss or damage arising from your failure to maintain account security. You may not use another person's account without permission or create false accounts.</p>
                <p>We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion, particularly if we believe your actions violate these terms or applicable laws, harm other customers, or damage our business reputation.</p>
              </section>

              <section>
                <h2>8. Product Use and Safety</h2>
                <p>Vaping products contain nicotine, which is highly addictive. Products are intended for adult smokers seeking alternatives to traditional cigarettes, not for non-smokers or persons under 18. Pregnant women, breastfeeding mothers, and persons with heart conditions should consult healthcare professionals before using nicotine products.</p>
                <p>Read all product documentation and safety warnings before use. Follow manufacturer instructions carefully. Never use damaged batteries or chargers. Store e-liquids safely away from children and pets. In case of accidental ingestion, seek immediate medical attention.</p>
                <p>You acknowledge that vaping products carry inherent risks and you assume all risks associated with their use. We are not liable for injury, illness, or damage resulting from misuse, improper storage, or failure to follow safety instructions.</p>
              </section>

              <section>
                <h2>9. Limitation of Liability</h2>
                <p>Vapourism shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses resulting from your access to or use of (or inability to access or use) our services, any conduct or content of third parties on our site, unauthorized access to or alteration of your transmissions or content, or any other matter relating to our services.</p>
                <p>Our total liability to you for all claims arising from or related to our services is limited to the amount you paid us in the twelve months prior to the event giving rise to liability. This limitation applies to all causes of action in the aggregate, including breach of contract, breach of warranty, negligence, strict liability, misrepresentation, and other torts.</p>
                <p>Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.</p>
              </section>

              <section>
                <h2>10. Intellectual Property</h2>
                <p>All content on this website, including text, graphics, logos, images, product photos, descriptions, and software, is the property of Vapourism or its content suppliers and is protected by UK and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content without our express written permission.</p>
                <p>Product names, brands, and trademarks are property of their respective owners. Use of these trademarks does not imply endorsement or affiliation with Vapourism.</p>
              </section>

              <section>
                <h2>11. Governing Law and Jurisdiction</h2>
                <p>These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the English courts. If you are a consumer, nothing in this clause affects your statutory rights.</p>
              </section>

              <section>
                <h2>12. Severability</h2>
                <p>If any provision of these Terms of Service is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.</p>
              </section>

              <section>
                <h2>13. Contact Information</h2>
                <p>For any questions regarding these terms, please contact us:</p>
                <ul>
                  <li><strong>Email:</strong> hello@vapourism.co.uk</li>
                  <li><strong>Address:</strong> Vapourism, 3 Hylton Drive, Cheadle Hulme, Stockport, SK8 7DH, United Kingdom</li>
                  <li><strong>Company Registration:</strong> 15936898</li>
                </ul>
              </section>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Last Updated:</strong> December 2024
              </p>
              <p className="text-sm text-gray-600">
                These Terms of Service should be read in conjunction with our <Link to="/policies/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>, <Link to="/policies/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>, and <Link to="/policies/returns-policy" className="text-blue-600 hover:underline">Returns Policy</Link>.
              </p>
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