import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => {
  const title = 'Cookie Policy | How We Use Cookies | Vapourism';
  const description = 'Vapourism cookie policy. Learn how we use cookies to improve your shopping experience, analytics, and site functionality. Manage your cookie preferences.';
  
  return [
    {title},
    {
      name: 'description',
      content: description
    },
    {
      name: 'keywords',
      content: 'cookie policy, cookies, website cookies, cookie consent, privacy, tracking, analytics cookies'
    },
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:description',
      content: description
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:site', content: '@vapourismuk'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

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
            
            <p className="lead text-xl text-gray-600 mb-8">
              This Cookie Policy explains how Vapourism uses cookies and similar tracking technologies when you visit our website. We're committed to transparency about how we collect and use data to improve your shopping experience while respecting your privacy choices.
            </p>

            <div className="space-y-8">
              <section>
                <h2>1. What Are Cookies</h2>
                <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website. They serve various purposes including remembering your preferences, understanding how you use our site, and providing you with a personalized shopping experience. Cookies can be "persistent" (remaining on your device until you delete them or they expire) or "session" cookies (deleted when you close your browser).</p>
                <p>Modern websites rely on cookies to function effectively and provide the features users expect. Without cookies, e-commerce sites like Vapourism couldn't maintain shopping carts, remember login credentials, or provide personalized product recommendations. Understanding how we use cookies helps you make informed decisions about your online privacy.</p>
              </section>

              <section>
                <h2>2. How We Use Cookies</h2>
                <p>We use cookies to improve your browsing experience, analyze site traffic, personalize content and advertising, and ensure our website functions properly. Cookies help us understand which products interest you, remember items in your cart between sessions, and provide relevant product suggestions based on your browsing history.</p>
                <p>Additionally, cookies enable important security features like age verification compliance and fraud prevention. As a UK vaping retailer, we must verify customer age, and cookies help us remember your verification status so you don't need to re-verify with every visit. Cookies also help us track performance metrics that inform improvements to site speed, navigation, and overall user experience.</p>
              </section>

              <section>
                <h2>3. Types of Cookies We Use</h2>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly. These cookies enable core functionality like shopping cart operations, secure checkout, age verification status, and account authentication. Without essential cookies, you wouldn't be able to add products to your cart, complete purchases, or access your account. These cookies don't collect personal data and cannot be disabled without severely impacting site functionality.</li>
                  
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information about page visits, time spent on site, navigation paths, and clicked links. We use Google Analytics and similar services to identify popular products, optimize site structure, and improve user experience. Analytics data is aggregated and anonymized, meaning we can't identify individual users from this information.</li>
                  
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track ad campaign effectiveness. These cookies remember products you've viewed, help us show you relevant ads on other websites, and measure whether you returned to complete a purchase after seeing our advertising. Marketing cookies enable more efficient advertising spend by targeting users who have shown interest in vaping products.</li>
                  
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings to provide enhanced features and personalized content. These cookies store information like your preferred language, region, product filters, and sorting preferences. Functional cookies improve usability by remembering your choices across browsing sessions, reducing the need to re-enter information.</li>
                </ul>
              </section>

              <section>
                <h2>4. Managing Cookies</h2>
                <p>You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or receive warnings before cookies are stored. Please note that disabling cookies may affect the functionality of our website and prevent you from accessing certain features like shopping cart persistence and personalized recommendations.</p>
                <p>To manage cookies, access your browser's settings menu (usually found under "Privacy" or "Security"). Different browsers have different cookie management interfaces, but all major browsers (Chrome, Firefox, Safari, Edge) provide options to view, delete, and block cookies. Be aware that completely blocking cookies will prevent you from completing purchases on our site, as essential cookies are required for checkout functionality.</p>
                <p>For more information about managing cookies in specific browsers, visit your browser manufacturer's help section or consult resources like aboutcookies.org or allaboutcookies.org which provide detailed guidance for all major browsers and devices.</p>
              </section>

              <section>
                <h2>5. Third-Party Cookies</h2>
                <p>Some cookies may be set by third-party services that appear on our pages, such as social media plugins, payment processors, or analytics services. These third-party cookies are governed by the respective third party's privacy policy, not this Cookie Policy. Common third-party cookies on our site include Google Analytics for traffic analysis, Shopify for e-commerce functionality, and payment gateway cookies for secure transaction processing.</p>
                <p>We carefully vet all third-party services to ensure they meet high privacy and security standards. However, we recommend reviewing the privacy policies of these third-party services to understand how they collect and use data. We don't control third-party cookies and can't access data they collect, as this information is managed directly by the third-party service providers.</p>
              </section>

              <section>
                <h2>6. Updates to This Policy</h2>
                <p>We may update this cookie policy from time to time to reflect changes in technology, legislation, or our business practices. Any changes will be posted on this page with an updated "Last Modified" date. We encourage you to review this policy periodically to stay informed about how we use cookies. Continued use of our website after policy changes constitutes acceptance of the updated terms.</p>
                <p>If we make significant changes that materially affect how we collect or use data, we'll provide more prominent notice, such as email notifications to registered customers or banner notifications on the website. Your rights regarding cookie data remain unchanged regardless of policy updates, and you can always manage cookie preferences through your browser settings.</p>
              </section>

              <section>
                <h2>7. Contact Us</h2>
                <p>If you have any questions about our use of cookies, would like more information about specific cookies we use, or need assistance managing your cookie preferences, please contact us at support@vapourism.co.uk. Our customer service team can provide detailed information about cookie types, data collection practices, and privacy controls available to you.</p>
              </section>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Last Updated:</strong> December 2024
              </p>
              <p className="text-sm text-gray-600">
                This Cookie Policy should be read in conjunction with our <Link to="/policies/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> and <Link to="/policies/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link> for complete information about how we protect and use your data.
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