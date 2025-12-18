import type {MetaFunction} from '@shopify/remix-oxygen';
import {generateAboutPageSchema, generateOrganizationSchema, structuredDataScript} from '~/lib/structured-data';

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
            Vapourism blends rigorous age verification, transparent shipping rules, and Shopify-native UX so
            customers always know exactly what they are buying and how it ships.
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
                Since our founding in 2015, Vapourism has operated with a single guiding principle: vaping products should be accessible to adult consumers while maintaining the highest standards of regulatory compliance and customer safety. We serve the UK vaping community with integrity, transparency, and unwavering attention to legal requirements.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our retail philosophy combines the convenience of e-commerce with the accountability standards expected of traditional tobacco retailers. Every aspect of our operation—from product sourcing to age verification—reflects our commitment to being a responsible participant in the UK nicotine marketplace.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We believe informed consumers make better choices. That's why we invest heavily in product information, transparent labelling, and educational resources that help customers understand what they're purchasing, how products work, and the regulatory landscape governing vaping in the United Kingdom.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">What stays non‑negotiable</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Two-stage age verification</h3>
                <p className="text-slate-700 leading-relaxed">
                  Our age verification process mirrors our brick-and-mortar standards. All customers must verify they're 18+ before browsing, with additional verification required before checkout. We partner with certified third-party age verification providers to ensure compliance with UK regulations.
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
                Our buying team evaluates products across multiple criteria: regulatory compliance, brand reputation, customer feedback, and market demand. We refuse to stock products that don't meet UK Tobacco and Related Products Regulations (TRPR) requirements, regardless of profit margins or customer requests.
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
                Our recent migration to Shopify Hydrogen represents a significant technical advancement, enabling faster page loads, better mobile experiences, and more sophisticated product discovery features. These improvements serve a single goal: making it easier for adult consumers to find quality vaping products that meet their needs.
              </p>
            </div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script {...structuredDataScript(generateAboutPageSchema({
          name: 'Vapourism',
          description: 'UK premium vape shop since 2015. Compliance-first retail with authentic products, rigorous age verification, and fast delivery.',
          url: 'https://www.vapourism.co.uk/about',
          foundingDate: '2015',
        }))} />
        <script {...structuredDataScript(generateOrganizationSchema({
          name: 'Vapourism',
          url: 'https://www.vapourism.co.uk',
          logo: 'https://www.vapourism.co.uk/logo.png',
          description: 'Premium UK vape shop established in 2015, offering authentic vaping products with rigorous age verification and compliance-first retail approach.',
          addressCountry: 'GB',
          addressRegion: 'England',
          email: 'hello@vapourism.co.uk',
        }))} />
      </div>
    </div>
  );
}
