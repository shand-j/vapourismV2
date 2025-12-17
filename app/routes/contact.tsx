import type {ReactNode} from 'react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';
import {Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle} from 'lucide-react';

export const meta: MetaFunction = () => {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Vapourism",
    "description": "Contact Vapourism UK vape shop for customer support, product inquiries, and order assistance",
    "mainEntity": {
      "@type": "Organization",
      "name": "Vapourism",
      "url": "https://vapourism.co.uk",
      "logo": "https://vapourism.co.uk/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "hello@vapourism.co.uk",
        "areaServed": "GB",
        "availableLanguage": "English",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      }
    }
  };

  return [
    {
      title: 'Contact Us | Customer Support | Vapourism UK Vape Shop'
    },
    {
      name: 'description',
      content: 'Contact Vapourism for vaping product help, order support, and expert advice. Phone, email, and live chat available. Monday-Friday 9AM-6PM. Fast UK customer service.'
    },
    {
      name: 'keywords',
      content: 'vapourism contact, customer support, vaping products, e-liquids, delivery options, return policy, age verification, UK vaping retailer'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Contact Us | Vapourism Customer Support'
    },
    {
      property: 'og:description',
      content: 'Get in touch with Vapourism for product help, order support, and expert vaping advice. Multiple contact methods available.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://vapourism.co.uk/contact'
    },
    {
      property: 'og:site_name',
      content: 'Vapourism'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:site',
      content: '@vapourismuk'
    },
    {
      name: 'twitter:title',
      content: 'Contact Us | Vapourism Customer Support'
    },
    {
      name: 'twitter:description',
      content: 'Get in touch for vaping product help, order support, and expert advice.'
    },
    // JSON-LD Structured Data
    {
      "script:ld+json": contactSchema
    }
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query ContactHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query ContactFooter {
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

export default function Contact() {
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
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Contact Vapourism: UK Vaping Support & Order Help</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need help with your order or have questions about our products? Our friendly customer service team is here to help.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phone Support */}
            <div className="bg-purple-50 p-6 rounded-lg text-center border border-purple-200">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-purple-600 font-semibold text-lg mb-2">0123 456 7890</p>
              <p className="text-sm text-gray-600 mb-3">Monday-Friday: 9AM-6PM</p>
              <p className="text-xs text-gray-500">UK standard rates apply</p>
            </div>

            {/* Email Support */}
            <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-blue-600 font-semibold mb-2">hello@vapourism.co.uk</p>
              <p className="text-sm text-gray-600 mb-3">Response within 24 hours</p>
              <p className="text-xs text-gray-500">Detailed inquiries welcome</p>
            </div>

            {/* Live Chat */}
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-green-600 font-semibold mb-2">Chat Widget</p>
              <p className="text-sm text-gray-600 mb-3">Instant responses</p>
              <p className="text-xs text-gray-500">Available during business hours</p>
            </div>

            {/* FAQ */}
            <div className="bg-amber-50 p-6 rounded-lg text-center border border-amber-200">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">FAQ Section</h3>
              <p className="text-amber-600 font-semibold mb-2">Self-Help</p>
              <p className="text-sm text-gray-600 mb-3">Instant answers</p>
              <Link to="/faq" className="text-xs text-amber-600 hover:underline">Browse FAQ →</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Fill Out Our Contact Form for Fast Vaping Support</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g. #VP12345"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="order-inquiry">Order Status & Delivery</option>
                    <option value="returns-exchanges">Returns & Exchanges</option>
                    <option value="product-question">Product Questions</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="account-help">Account Help</option>
                    <option value="billing-payment">Billing & Payment</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Response Time:</strong> We aim to respond to all inquiries within 24 hours during business days.
                    For urgent order issues, please call us directly.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Business Information & Hours */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span className="text-red-600">Closed</span>
                  </div>
                  <div className="pt-2 border-t text-xs text-gray-500">
                    <p>Bank holidays may affect our hours. Check our website for updates.</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Vapourism</p>
                    <p className="text-gray-600">3 Hylton Drive</p>
                    <p className="text-gray-600">Cheadle Hulme, Stockport, SK8 7DH</p>
                    <p className="text-gray-600">United Kingdom</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p><strong>Company Reg:</strong> 15936898</p>
                    <p><strong>VAT Number:</strong> 04 6116 26</p>
                  </div>
                </div>
              </div>

              {/* Quick Help Topics */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-4">Quick Help Topics</h3>
                <div className="space-y-3">
                  <Link to="/track-order" className="block p-3 bg-white rounded border hover:border-purple-300 transition-colors">
                    <div className="font-medium text-purple-800">Track Your Order</div>
                    <div className="text-sm text-gray-600">Check delivery status and tracking information</div>
                  </Link>
                  <Link to="/policies/returns-policy" className="block p-3 bg-white rounded border hover:border-purple-300 transition-colors">
                    <div className="font-medium text-purple-800">Returns & Exchanges</div>
                    <div className="text-sm text-gray-600">Information about our return policy</div>
                  </Link>
                  <Link to="/policies/delivery-information" className="block p-3 bg-white rounded border hover:border-purple-300 transition-colors">
                    <div className="font-medium text-purple-800">Delivery Information</div>
                    <div className="text-sm text-gray-600">Shipping options and delivery times</div>
                  </Link>
                  <Link to="/faq" className="block p-3 bg-white rounded border hover:border-purple-300 transition-colors">
                    <div className="font-medium text-purple-800">Frequently Asked Questions</div>
                    <div className="text-sm text-gray-600">Common questions and instant answers</div>
                  </Link>
                </div>
              </div>

              {/* Age Verification Notice */}
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 mb-2">⚠️ Age Verification Required</h4>
                <p className="text-sm text-red-700">
                  All customers must be 18 or over to purchase vaping products. Age verification is a legal requirement in the UK.
                  If you need help with age verification, please contact our customer service team.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Support Section */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-lg mb-6 opacity-90">
              For urgent order issues, delivery problems, or account access troubles, our phone support team can help immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+447817689214"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: 0123 456 7890
              </a>
              <a
                href="mailto:hello@vapourism.co.uk"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
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