/**
 * Payment Methods Page
 * 
 * SEO-optimized informational page for payment options
 * Target keywords: "clearpay", "paypal uk", "buy now pay later"
 * Search volume: 411,000+ monthly searches (246k clearpay + 165k paypal)
 * Difficulty: 42-78 (medium-high but worth targeting)
 */

import {type MetaFunction} from '@shopify/remix-oxygen';
import {Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Payment Methods | Buy Now Pay Later | Clearpay & PayPal | Vapourism'},
  {
    name: 'description',
    content: 'Shop now, pay later with Clearpay, PayPal, and more. ✓ 0% interest ✓ Instant approval ✓ Flexible payments ✓ Secure checkout. Multiple payment options at Vapourism UK.',
  },
  {
    name: 'keywords',
    content: 'clearpay, paypal uk, buy now pay later, klarna, payment methods, vape shop payment, clearpay vape, paypal vaping',
  },
  {property: 'og:title', content: 'Payment Methods | Buy Now Pay Later | Vapourism'},
  {property: 'og:description', content: 'Shop now, pay later with Clearpay, PayPal, Klarna and more. Multiple secure payment options available.'},
  {property: 'og:type', content: 'website'},
];

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Payment Methods | Buy Now Pay Later</h1>
      
      <p className="text-lg text-gray-600 mb-8">
        At Vapourism, we offer a range of secure payment options to make your shopping experience 
        as convenient as possible. Choose from instant payment methods or spread the cost with 
        buy now, pay later services.
      </p>

      {/* Main Payment Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        
        {/* Clearpay */}
        <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              CP
            </div>
            <h2 className="text-2xl font-bold">Clearpay</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Split your purchase into 4 interest-free payments. Pay nothing today, and the rest 
            over 6 weeks.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>0% interest, no fees when you pay on time</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Instant approval in seconds</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Available on orders £10-£1,000</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Automatic payments every 2 weeks</span>
            </li>
          </ul>
          <div className="bg-white p-4 rounded">
            <p className="text-sm font-semibold mb-2">Example:</p>
            <p className="text-sm text-gray-700">
              £100 purchase = 4 payments of £25 over 6 weeks
            </p>
          </div>
        </div>

        {/* PayPal */}
        <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              PP
            </div>
            <h2 className="text-2xl font-bold">PayPal UK</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Pay securely with your PayPal account. Buyer protection included on all purchases.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Instant checkout - no card details needed</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>PayPal Buyer Protection included</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Pay with PayPal balance or linked card</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>PayPal Credit available (subject to approval)</span>
            </li>
          </ul>
          <div className="bg-white p-4 rounded">
            <p className="text-sm font-semibold mb-2">Why PayPal?</p>
            <p className="text-sm text-gray-700">
              Safe, secure, and trusted by millions of UK shoppers
            </p>
          </div>
        </div>

        {/* Klarna */}
        <div className="border-2 border-pink-200 rounded-lg p-6 bg-pink-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              K
            </div>
            <h2 className="text-2xl font-bold">Klarna</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Flexible payment options including Pay in 3 interest-free instalments.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Pay in 3 interest-free payments</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Pay in 30 days - try before you buy</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Instant decision at checkout</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Manage payments in the Klarna app</span>
            </li>
          </ul>
        </div>

        {/* Credit/Debit Cards */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
              💳
            </div>
            <h2 className="text-2xl font-bold">Credit & Debit Cards</h2>
          </div>
          <p className="text-gray-700 mb-4">
            We accept all major credit and debit cards for instant payment.
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Visa, Mastercard, American Express</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Maestro and Visa Debit</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>3D Secure authentication for safety</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>SSL encrypted checkout</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Security Section */}
      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">🔒 Your Payment Security</h2>
        <p className="text-gray-700 mb-4">
          All payments on Vapourism are processed through secure, encrypted connections. 
          We never store your full card details on our servers.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">SSL Encrypted</h3>
            <p className="text-sm text-gray-600">256-bit encryption for all transactions</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">PCI Compliant</h3>
            <p className="text-sm text-gray-600">Meeting highest security standards</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">3D Secure</h3>
            <p className="text-sm text-gray-600">Extra verification for card payments</p>
          </div>
        </div>
      </div>

      {/* How Buy Now Pay Later Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How Buy Now Pay Later Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
              1
            </div>
            <h3 className="font-semibold mb-2">Shop</h3>
            <p className="text-sm text-gray-600">Add items to cart as normal</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
              2
            </div>
            <h3 className="font-semibold mb-2">Choose</h3>
            <p className="text-sm text-gray-600">Select Clearpay, Klarna, or PayPal</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
              3
            </div>
            <h3 className="font-semibold mb-2">Approve</h3>
            <p className="text-sm text-gray-600">Get instant approval decision</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
              4
            </div>
            <h3 className="font-semibold mb-2">Enjoy</h3>
            <p className="text-sm text-gray-600">Receive your order, pay over time</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Payment FAQs</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Is there a minimum order for buy now pay later?</h3>
            <p className="text-gray-700">
              Most buy now pay later services require a minimum order of £10-£35. Clearpay works 
              on orders from £10, while Klarna typically requires £35 minimum.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Will I pay interest or fees?</h3>
            <p className="text-gray-700">
              No! Clearpay and Klarna are 0% interest when you pay on time. Late fees may apply 
              if you miss a payment, so set up automatic payments to avoid this.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How do I get approved for buy now pay later?</h3>
            <p className="text-gray-700">
              Approval is instant at checkout. You'll need to be 18+, have a UK debit/credit card, 
              and pass a soft credit check (which doesn't affect your credit score).
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I use PayPal Credit?</h3>
            <p className="text-gray-700">
              Yes! If you have PayPal Credit, you can select it as a payment option when checking 
              out via PayPal. Subject to your PayPal Credit approval and limits.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Are my card details safe?</h3>
            <p className="text-gray-700">
              Absolutely. We use industry-standard SSL encryption and never store your full card 
              details. All payments are processed through secure, PCI-compliant gateways.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Shop?</h2>
        <p className="mb-6">
          Browse our full range of vaping products and choose your preferred payment method at checkout.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Shopping
          </Link>
          <Link 
            to="/search?tag=disposable" 
            className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition border-2 border-white"
          >
            Disposable Vapes
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="font-semibold text-lg mb-4">Related Information</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/policies/delivery-information" className="text-blue-600 hover:text-blue-800">
            Delivery Information
          </Link>
          <span className="text-gray-400">|</span>
          <Link to="/policies/returns-policy" className="text-blue-600 hover:text-blue-800">
            Returns Policy
          </Link>
          <span className="text-gray-400">|</span>
          <Link to="/policies/terms-of-service" className="text-blue-600 hover:text-blue-800">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
