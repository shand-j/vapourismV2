import {json, type LoaderFunctionArgs, type MetaFunction} from '@remix-run/server-runtime';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {
    title: 'Returns & Refunds Policy | 14-Day Returns | Vapourism'
  },
  {
    name: 'description',
    content: 'Vapourism returns policy. 14-day return period for unopened items. Learn about our refund process, return conditions, and how to return vaping products.'
  },
  {
    name: 'keywords',
    content: 'returns policy, refunds, vape returns, product returns UK, 14 day returns, exchange policy, return conditions'
  },
  {
    property: 'og:title',
    content: 'Returns & Refunds Policy | Vapourism'
  },
  {
    property: 'og:description',
    content: '14-day return period for unopened vaping products. Learn about our hassle-free returns process.'
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/policies/returns-policy'
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
    content: 'Returns Policy | Vapourism'
  },
  {
    name: 'twitter:description',
    content: 'Return vaping products within 14 days! Know your rights and our refund process #VapingReturns'
  }
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
            <h1>Returns & Refunds Policy</h1>
            
            <p className="lead text-xl text-gray-600 mb-8">
              We want you to be completely satisfied with your Vapourism purchase. If you're not happy with your order, we offer a straightforward 14-day returns process in accordance with UK Consumer Rights Act 2015. This policy explains how to return items, what items qualify for returns, and how refunds are processed.
            </p>

            <div className="space-y-8">
              <section>
                <h2>14-Day Returns Period: UK Cooling-Off Rights Explained</h2>
                <p>You have 14 days from the date of delivery to return items for a refund. This cooling-off period is your legal right under UK Distance Selling Regulations. The 14-day period begins the day after you receive your order, not the day you place it. To qualify for a return, you must notify us of your intention to return within this 14-day window.</p>
                <p>We recommend initiating returns as soon as possible to ensure you don't miss the deadline. Returns initiated on the 14th day are accepted, but items must be shipped back to us within a reasonable timeframe (typically within 14 days of notifying us). Keep proof of postage as evidence of return date if any disputes arise.</p>
              </section>

              <section>
                <h2>2. Return Conditions</h2>
                <p>Items must be returned in their original packaging, unused, and in the same condition as received. Products should have all original tags, labels, and protective seals intact. Returned items must be in resaleable condition - this means unopened, undamaged, and showing no signs of use or tampering.</p>
                <p>For hygiene and safety reasons, e-liquids cannot be returned once the seal has been broken. Vaping devices must not have been activated, used, or installed with coils/pods. Batteries must not show signs of charging or discharge cycles. Accessories like drip tips, tanks, and coils that have been in contact with e-liquid cannot be accepted for return.</p>
                <p>Returns that don't meet these conditions will be refused, and items will be returned to you at your expense. We understand mistakes happen - if you're unsure whether your item qualifies for return, contact our customer service team before shipping to avoid unnecessary return costs.</p>
              </section>

              <section>
                <h2>3. How to Return Items</h2>
                <p>Contact our customer service team at returns@vapourism.co.uk or call us during business hours to initiate a return. We&apos;ll provide a Return Merchandise Authorization (RMA) number and detailed return instructions. You must include this RMA number with your return shipment for proper processing - returns without RMA numbers may be delayed or refused.</p>
                <p>Package items securely in their original packaging if possible. Use adequate cushioning material to prevent damage during transit. We recommend using a tracked shipping service and retaining proof of postage until your refund is processed. While we provide return labels for faulty items, customers are responsible for return shipping costs for change-of-mind returns unless the error was ours.</p>
                <p>Send returns to the address provided in your RMA email. Do not send returns to our customer service address or warehouse without authorization, as unsolicited returns may not be processed correctly.</p>
              </section>

              <section>
                <h2>4. Refunds</h2>
                <p>Refunds will be processed within 5-7 business days of receiving your returned item at our warehouse. Once we receive and inspect your return, we'll send you an email confirming receipt and approval or rejection of your refund. Approved refunds are issued to your original payment method automatically.</p>
                <p>The time it takes for refunded funds to appear in your account depends on your payment provider. Credit card refunds typically take 5-10 business days to process through banking systems. PayPal refunds are usually instant. If you used a promotional code or discount, the refund amount reflects what you actually paid, not the original product price.</p>
                <p>Shipping costs are non-refundable unless the return is due to our error (wrong item sent, defective product, etc.). If you received free shipping because your order exceeded the free shipping threshold, we'll deduct the standard shipping cost from your refund if the return reduces your order below that threshold.</p>
                <p>If you haven't received your refund within 10 business days of our approval email, first check with your bank or credit card company - processing delays sometimes occur. If the refund still hasn't appeared, contact us at returns@vapourism.co.uk with your RMA number and we'll investigate.</p>
              </section>

              <section>
                <h2>5. Exchanges</h2>
                <p>If you wish to exchange an item for a different product, nicotine strength, or flavor, please contact us within 14 days of delivery. We&apos;ll arrange for the exchange at no additional cost, provided the item meets return conditions and the replacement item is in stock and of equal value.</p>
                <p>For exchanges of equal value, we'll send the replacement once we receive your return. For exchanges where the new item costs more, you'll need to pay the difference before we ship. If the new item costs less, we'll refund the difference to your original payment method.</p>
                <p>Exchanges are subject to stock availability. If your desired replacement is out of stock, we'll notify you and offer alternatives or a full refund. We don't offer direct exchanges for returns initiated after 14 days - these must be processed as returns with new orders placed separately.</p>
              </section>

              <section>
                <h2>6. Non-Returnable Items</h2>
                <p>For health, safety, and regulatory reasons, the following items cannot be returned once opened or used:</p>
                <ul>
                  <li>Opened e-liquid bottles - liquid nicotine products cannot be accepted back once the seal is broken</li>
                  <li>Used vaping devices, mods, or tanks that show signs of use or have been filled with e-liquid</li>
                  <li>Replacement coils or pods that have been installed or used in devices</li>
                  <li>Drip tips, mouthpieces, or any components that have come into contact with e-liquid or saliva</li>
                  <li>Batteries that show signs of charging, discharge, or physical damage</li>
                  <li>Custom-made, personalized, or specially ordered items</li>
                  <li>Sale items marked as final sale or clearance (where explicitly stated)</li>
                  <li>Digital products, gift cards, or promotional items</li>
                </ul>
                <p>These restrictions protect customer health and ensure we can't resell items that may have been contaminated or compromised. We encourage careful product selection before purchase and offer pre-sale advice through our customer service team.</p>
              </section>

              <section>
                <h2>7. Damaged or Defective Items</h2>
                <p>If you receive a damaged or defective item, please contact us immediately with photos showing the damage or defect. We&apos;ll arrange for a replacement or full refund including return shipping costs. Manufacturers' warranties may apply to certain products - we'll help you determine the best resolution path.</p>
                <p>For items damaged in transit, retain all packaging and contact us within 48 hours of delivery. We'll liaise with the courier and arrange a replacement without requiring you to return the damaged item (if the damage makes it unsafe to ship).</p>
                <p>Manufacturing defects discovered within 30 days of purchase are covered by our guarantee. After 30 days, manufacturer warranties apply. We'll provide warranty claim assistance and may be able to expedite warranty replacements through our distributor relationships.</p>
              </section>

              <section>
                <h2>8. Late or Missing Refunds</h2>
                <p>If you haven't received your refund after the stated timeframe, please take the following steps:</p>
                <ul>
                  <li>Check your bank account again - processing times vary between financial institutions</li>
                  <li>Contact your credit card company or PayPal - it may take additional time before refunds post to accounts</li>
                  <li>Check your bank's pending transactions - refunds sometimes show as pending before clearing</li>
                  <li>If you've completed these steps and still haven't received your refund, contact us at returns@vapourism.co.uk with your RMA number</li>
                </ul>
              </section>

              <section>
                <h2>9. Return Shipping Costs</h2>
                <p>Customers are responsible for return shipping costs for change-of-mind returns. We recommend using tracked shipping services and retaining proof of postage. Returns for faulty, damaged, or incorrect items are our responsibility - we'll provide a prepaid return label or reimburse return shipping costs.</p>
                <p>If you're returning a heavy or high-value item, consider purchasing insurance. We're not responsible for items lost or damaged during return transit unless we provided the shipping label.</p>
              </section>

              <section>
                <h2>10. Contact Us</h2>
                <p>For returns inquiries, please email returns@vapourism.co.uk or contact our customer service team at hello@vapourism.co.uk. Our team is available Monday-Friday, 9AM-6PM GMT. We aim to respond to all return requests within 24 hours during business days.</p>
              </section>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Last Updated:</strong> December 2024
              </p>
              <p className="text-sm text-gray-600">
                This Returns Policy complies with the UK Consumer Rights Act 2015 and Distance Selling Regulations. For additional information about your rights, visit the Citizens Advice website or contact Trading Standards.
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