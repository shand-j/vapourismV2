import {Link} from '@remix-run/react';
import type {MetaFunction} from '@shopify/remix-oxygen';
import {generateAboutPageSchema, generateOrganizationSchema, structuredDataScript, SITE_URL, SITE_NAME, SITE_LOGO, SITE_EMAIL} from '~/lib/structured-data';

export const meta: MetaFunction = () => [
  {title: 'About Vapourism | Premium UK Vape Shop | Est. 2015'},
  {
    name: 'description',
    content: 'Vapourism: Your trusted UK vape shop since 2015. We offer authentic products, rigorous age verification, and fast UK delivery.',
  },
  {
    name: 'keywords',
    content: 'about vapourism, UK vape shop, vaping retailer, authentic vape products, age verification, compliance, premium vaping UK',
  },
  {
    property: 'og:title',
    content: 'About Vapourism | Premium UK Vape Shop',
  },
  {
    property: 'og:description',
    content: 'UK premium vape shop since 2015. Compliance-first retail with authentic products and fast delivery.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/about',
  },
  {
    name: 'twitter:card',
    content: 'summary',
  },
  {
    name: 'twitter:title',
    content: 'About Vapourism | Premium UK Vape Shop',
  },
  {
    name: 'twitter:description',
    content: 'UK premium vape shop since 2015. Compliance-first retail with authentic products.',
  },
];

export default function AboutRoute() {
  const milestones = [
    {year: '2015', detail: 'Opened our first UK retail experience focused on compliance and education.'},
    {year: '2020', detail: 'Launched a headless storefront to support rapid catalogue expansion.'},
    {year: '2025', detail: 'Rebuilt on Hydrogen 2025.1.4 with Shopify predictive search and tag-based navigation.'},
  ];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">About</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Built for responsible growth</h1>
          <p className="mt-3 text-slate-600">
            Vapourism blends rigorous <Link to="/guides/age-verification" className="text-[#5b2be0] hover:underline">age verification</Link>, transparent shipping rules, and Shopify-native UX so
            customers always know exactly what they are buying and how it ships. <Link to="/search" className="text-[#5b2be0] hover:underline">Browse our products</Link> or <Link to="/guides" className="text-[#5b2be0] hover:underline">read our compliance guides</Link> to learn more.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-[28px] border border-slate-100 bg-white/90 p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{milestone.year}</p>
              <p className="mt-3 text-sm text-slate-600">{milestone.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-8 mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Our commitment to responsible retail</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Since our founding in 2015, Vapourism has operated with a single guiding principle: vaping products should be accessible to adult consumers while maintaining the highest standards of <Link to="/guides/certifications" className="text-[#5b2be0] hover:underline">regulatory compliance</Link> and customer safety. We serve the UK vaping community with integrity, transparency, and unwavering attention to legal requirements. Learn more about our <Link to="/guides/sustainability" className="text-[#5b2be0] hover:underline">sustainability commitments</Link> and operational standards.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our retail philosophy combines the convenience of e-commerce with the accountability standards expected of traditional tobacco retailers. Every aspect of our operation—from product sourcing to age verification—reflects our commitment to being a responsible participant in the UK nicotine marketplace.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We believe informed consumers make better choices. That's why we invest heavily in product information, transparent labelling, and <Link to="/blog" className="text-[#5b2be0] hover:underline">educational resources</Link> that help customers understand what they're purchasing, how products work, and the regulatory landscape governing vaping in the United Kingdom. Visit our <Link to="/faq" className="text-[#5b2be0] hover:underline">FAQ section</Link> for answers to common questions.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">What stays non‑negotiable</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Two-stage age verification</h3>
                <p className="text-slate-700 leading-relaxed">
                  Our <Link to="/guides/age-verification" className="text-[#5b2be0] hover:underline">age verification process</Link> mirrors our brick-and-mortar standards. All customers must verify they're 18+ before browsing, with additional verification required before checkout. We partner with certified third-party age verification providers to ensure compliance with UK regulations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Shipping restrictions enforcement</h3>
                <p className="text-slate-700 leading-relaxed">
                  Our system automatically references comprehensive shipping restriction databases covering 49 countries for vaping products and 100+ territories for CBD-containing items. We prevent prohibited shipments at the cart level, ensuring regulatory compliance across international borders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Shopify-native checkout</h3>
                <p className="text-slate-700 leading-relaxed">
                  We use Shopify's secure, PCI-compliant checkout system without modifications. This ensures customers benefit from Shopify's fraud detection, payment security, and order management infrastructure while we maintain focus on product quality and compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Product quality standards</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                Every product in our catalogue undergoes rigorous vetting before earning a place in our inventory. We source exclusively from authorized UK distributors and manufacturers who provide complete compliance documentation, including TPD notification numbers, batch testing certificates, and ingredient disclosure statements.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our buying team evaluates products across multiple criteria: <Link to="/guides/certifications" className="text-[#5b2be0] hover:underline">regulatory compliance</Link>, brand reputation, customer feedback, and market demand. We refuse to stock products that don't meet UK Tobacco and Related Products Regulations (TRPR) requirements, regardless of profit margins or customer requests.
              </p>
              <p className="text-slate-700 leading-relaxed">
                This selective approach means our catalogue may be smaller than competitors who prioritize quantity over quality. We accept that trade-off because we're building a business for the long term—one that earns customer trust through consistent reliability rather than overwhelming choice.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Looking ahead</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                The UK vaping landscape continues evolving as regulations adapt and consumer preferences shift. We're investing in technology that helps us scale responsibly—better product data management, enhanced age verification systems, and improved customer education resources.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Our recent migration to Shopify Hydrogen represents a significant technical advancement, enabling faster page loads, better mobile experiences, and more sophisticated <Link to="/search" className="text-[#5b2be0] hover:underline">product discovery features</Link>. These improvements serve a single goal: making it easier for adult consumers to find quality vaping products that meet their needs.
              </p>
            </div>
          </div>

          {/* Related Resources */}
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Related resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/guides" className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#5b2be0] hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-[#5b2be0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Compliance Guides</h3>
                  <p className="text-sm text-slate-600 mt-1">Learn about our age verification, certifications, and sustainability practices</p>
                </div>
              </Link>
              <Link to="/faq" className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#5b2be0] hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-[#5b2be0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-sm text-slate-600 mt-1">Get answers to common questions about ordering, delivery, and products</p>
                </div>
              </Link>
              <Link to="/contact" className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#5b2be0] hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-[#5b2be0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Contact Us</h3>
                  <p className="text-sm text-slate-600 mt-1">Get in touch with our customer support team for assistance</p>
                </div>
              </Link>
              <Link to="/blog" className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#5b2be0] hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-[#5b2be0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Vaping Education Blog</h3>
                  <p className="text-sm text-slate-600 mt-1">Read expert guides on vaping products, regulations, and best practices</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script {...structuredDataScript(generateAboutPageSchema({
          name: SITE_NAME,
          description: 'UK premium vape shop since 2015. Compliance-first retail with authentic products, rigorous age verification, and fast delivery.',
          url: `${SITE_URL}/about`,
          foundingDate: '2015',
        }))} />
        <script {...structuredDataScript(generateOrganizationSchema({
          name: SITE_NAME,
          url: SITE_URL,
          logo: SITE_LOGO,
          description: 'Premium UK vape shop established in 2015, offering authentic vaping products with rigorous age verification and compliance-first retail approach.',
          addressCountry: 'GB',
          addressRegion: 'England',
          email: SITE_EMAIL,
        }))} />
      </div>
    </div>
  );
}
