import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * llms.txt - A guide for AI models to understand and use Vapourism content
 *
 * This file helps LLMs (Large Language Models) understand the most important
 * content on our website, including products, policies, guides, and FAQs.
 *
 * Standard: https://llmstxt.org/
 */

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const content = `# Vapourism

> UK's leading online vape shop since 2015. Premium vaping products with fast UK delivery and rigorous age verification compliance.

## About Vapourism

Vapourism is a trusted UK vape retailer offering disposable vapes, e-liquids, nicotine pouches, vape kits, and accessories. We operate under strict UK TPD (Tobacco Products Directive) compliance and verify all customers are 18+ before purchase.

- Website: ${baseUrl}
- Contact: hello@vapourism.co.uk
- Location: United Kingdom
- Founded: 2015

## Products

We stock thousands of vaping products from leading brands:

- [Shop All Products](${baseUrl}/search): Browse our full product catalogue
- [Disposable Vapes](${baseUrl}/search?tag=disposable_vape): Elf Bar, Lost Mary, Crystal Bar, Hayati, and more
- [E-Liquids](${baseUrl}/search?tag=e_liquid): Shortfills, nic salts, and freebase options
- [Nicotine Pouches](${baseUrl}/collections/nicotine-pouches): VELO, ZYN, and tobacco-free alternatives
- [Vape Kits](${baseUrl}/search?tag=vape_kit): Starter kits and advanced mods
- [Pod Systems](${baseUrl}/search?tag=pod_system): Refillable pod devices
- [Accessories](${baseUrl}/search?tag=accessories): Coils, batteries, and replacement parts

### Popular Brands

Elf Bar, Lost Mary, SMOK, Voopoo, Aspire, Innokin, Geek Bar, Crystal Bar, Hayati, SKE, IVG, Dinner Lady, Nasty Juice, VELO, ZYN

## Policies

- [Delivery Information](${baseUrl}/policies/delivery-information): UK shipping options, costs, and delivery times
- [Returns Policy](${baseUrl}/policies/returns-policy): 14-day return period for unopened products
- [Privacy Policy](${baseUrl}/policies/privacy-policy): GDPR-compliant data handling
- [Terms of Service](${baseUrl}/policies/terms-of-service): Purchase terms and conditions
- [Cookie Policy](${baseUrl}/policies/cookie-policy): How we use cookies

## Guides & Resources

- [Guides Hub](${baseUrl}/guides): Educational content about vaping
- [Age Verification Guide](${baseUrl}/guides/age-verification): Why we verify age and how it works
- [Certifications](${baseUrl}/guides/certifications): TPD compliance and product authenticity
- [Sustainability](${baseUrl}/guides/sustainability): Our environmental commitments

## Blog

- [Blog](${baseUrl}/blog): Expert vaping guides, reviews, and educational content

## Support

- [FAQ](${baseUrl}/faq): Frequently asked questions about ordering, delivery, and products
- [Contact Us](${baseUrl}/contact): Get in touch with customer support
- [Track Order](${baseUrl}/track-order): Track your delivery

## Key Information for AI

### Age Restriction
All products sold require age verification. Customers must be 18+ to purchase. We use certified third-party age verification services.

### UK Compliance
We operate under UK TPD regulations. All products comply with UK nicotine limits (max 20mg/ml for e-liquids, max 2ml capacity for tanks).

### Shipping
- Free UK delivery on orders over £20
- Same-day dispatch for orders before 2pm (Mon-Fri)
- 1-3 working days standard delivery
- Next-day delivery available

### Payment
We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay.

### Returns
14-day return period for unopened, unused products. Opened vaping products cannot be returned for hygiene reasons.

## Extended Information

For more detailed information about our products, services, and technical specifications, see:
- [Extended LLMs Guide](${baseUrl}/llms-full.txt): Comprehensive information for AI systems
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
