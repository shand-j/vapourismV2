import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

/**
 * llms-full.txt - Extended guide for AI models with comprehensive Vapourism information
 *
 * This file provides detailed information about products, categories, policies,
 * and business operations to help LLMs provide accurate information about Vapourism.
 *
 * Standard: https://llmstxt.org/
 */

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const content = `# Vapourism - Comprehensive Information for AI Systems

> UK's leading online vape shop since 2015. Premium vaping products with fast UK delivery and rigorous age verification compliance.

## Company Overview

**Vapourism** is a UK-based online vape retailer established in 2015, specializing in disposable vapes, e-liquids, nicotine pouches, vape kits, and accessories.

### Contact Information
- Website: ${baseUrl}
- Email: hello@vapourism.co.uk
- Customer Service: Monday-Friday, 9am-6pm GMT
- Location: United Kingdom

### Core Values
- **Compliance First**: Rigorous age verification and TPD compliance
- **Authenticity**: Only genuine products from authorized distributors
- **Quality**: Premium products from trusted brands
- **Fast Service**: Same-day dispatch, 1-3 day UK delivery

---

## Product Categories

### 1. Disposable Vapes
Pre-filled, single-use devices requiring no maintenance.

**Popular Products:**
- Elf Bar 600: 600 puffs, 20mg nicotine, 50+ flavours
- Lost Mary BM600: Mesh coil technology, smooth draw
- Crystal Bar: Crystal-finish design, various nicotine strengths
- Hayati Pro Max: 4000 puffs, larger capacity
- Geek Bar: Wide flavour selection

**Key Specifications (UK TPD Compliant):**
- Maximum 2ml e-liquid capacity
- Maximum 20mg/ml nicotine strength
- Disposable and recyclable (check local recycling)

**Price Range:** £4.99 - £12.99

### 2. E-Liquids
Refillable vape liquids in various formats.

**Types:**
- **Nic Salts (10ml)**: Smooth hit, 10-20mg strength, MTL vaping
- **Shortfills (50-100ml)**: 0mg, add nicotine shots, sub-ohm vaping
- **Freebase (10ml)**: Traditional nicotine, various strengths

**Popular Brands:**
IVG, Dinner Lady, Nasty Juice, Riot Squad, Bar Juice, Elfliq, Vampire Vape

**Flavour Categories:**
- Fruits (strawberry, mango, watermelon, berry blends)
- Menthol & Ice (mint, spearmint, menthol tobacco)
- Desserts (custard, vanilla, cake, bakery)
- Drinks (cola, energy drink, coffee)
- Tobacco (classic, virginia, american blend)

**Price Range:** £3.99 - £19.99

### 3. Nicotine Pouches
Tobacco-free nicotine alternatives, placed under the lip.

**Brands:**
- **VELO**: 6mg, 10mg, 17mg strengths
- **ZYN**: Tobacco-free, mini/regular pouches
- **White Fox**: Extra strong options

**Usage:** Discreet, smoke-free, no vaping required

**Price Range:** £4.99 - £6.99 per can

### 4. Vape Kits & Devices
Refillable devices for experienced vapers.

**Categories:**
- **Starter Kits**: Simple, beginner-friendly devices
- **Pod Systems**: Compact, refillable pods
- **Mod Kits**: Advanced, customizable options
- **All-in-One (AIO)**: Integrated tank and battery

**Popular Brands:**
SMOK, Voopoo, Aspire, Innokin, Vaporesso, GeekVape, Uwell

**Price Range:** £19.99 - £79.99

### 5. Accessories
Supporting products for vaping.

**Types:**
- Replacement coils
- Spare pods
- Batteries (18650, 21700)
- Chargers
- Drip tips
- Carry cases

---

## Policies in Detail

### Delivery Information
**Standard UK Delivery:**
- Orders over £20: FREE
- Orders under £20: £2.99
- Delivery time: 1-3 working days

**Express Delivery:**
- Next-day delivery available (order before 2pm)
- Additional cost: £4.99

**Dispatch:**
- Orders before 2pm (Mon-Fri): Same-day dispatch
- Weekend orders: Monday dispatch

**Carriers:** DPD Local, Royal Mail

**Restrictions:**
- UK mainland only for standard delivery
- Scottish Highlands, NI, Channel Islands may have extended times
- International shipping available to selected countries (subject to local laws)

### Returns & Refunds
**Return Period:** 14 days from delivery

**Eligible for Return:**
- Unopened, sealed products
- Faulty items (within 30 days)
- Incorrect items

**Not Eligible:**
- Opened e-liquids (hygiene reasons)
- Used disposable vapes
- Opened nicotine pouches
- Personalized items

**Refund Process:**
1. Contact customer service
2. Receive returns authorization
3. Ship items back (customer pays postage unless faulty)
4. Refund processed within 5-7 working days

### Age Verification
**Requirements:**
- All customers must be 18+
- Age verification required before first purchase
- Two-step verification process

**Verification Methods:**
1. Initial checkout: DOB confirmation
2. Secondary: Third-party ID verification service
3. Delivery: Age-restricted delivery may require ID on receipt

**Why We Verify:**
- UK legal requirement for tobacco/nicotine products
- Customer safety and compliance
- Responsible retail practice

### Privacy & Data (GDPR)
**Data We Collect:**
- Name, email, delivery address
- Payment information (processed securely by payment providers)
- Age verification data
- Order history

**How We Use Data:**
- Order processing and delivery
- Customer service
- Marketing (with consent)
- Legal compliance

**Your Rights:**
- Access your data
- Request correction or deletion
- Withdraw marketing consent
- Data portability

---

## Frequently Asked Questions

### Ordering
**Q: How do I place an order?**
A: Browse products, add to basket, proceed to checkout, complete age verification, enter delivery details, and pay securely.

**Q: Can I modify my order after placing it?**
A: Contact us within 30 minutes of ordering. Once dispatched, changes aren't possible.

**Q: Do you offer subscriptions?**
A: Yes, subscribe to eligible pod products for 20% savings on recurring deliveries.

### Products
**Q: Are all products authentic?**
A: Yes, we source exclusively from authorized UK distributors. All products are genuine.

**Q: What nicotine strength should I choose?**
A: 
- 3mg: Light smokers, occasional users
- 6mg: Moderate smokers
- 12mg: Regular smokers
- 18-20mg: Heavy smokers, new switchers

**Q: What's the difference between nic salts and freebase?**
A: Nic salts are smoother at higher strengths, absorbed faster. Freebase provides stronger throat hit, works at all strengths.

### Delivery
**Q: Can I track my order?**
A: Yes, tracking info is emailed once dispatched. Track at ${baseUrl}/track-order

**Q: Do you deliver internationally?**
A: Yes, to selected countries where vaping products are legal. Check at checkout.

### Vaping Advice
**Q: Is vaping safer than smoking?**
A: Public Health England states vaping is 95% less harmful than smoking. It's not risk-free but significantly reduces harm for smokers.

**Q: How do I maintain my device?**
A: Clean connections weekly, replace coils when taste degrades (usually 1-2 weeks), keep battery contacts clean.

---

## Technical Information

### UK TPD Regulations
**Vapourism complies with:**
- Maximum 10ml e-liquid bottles
- Maximum 2ml tank capacity
- Maximum 20mg/ml nicotine concentration
- Child-resistant packaging
- Health warnings on packaging
- Notification to MHRA

### Product Safety
- All products CE marked
- MSDS (Material Safety Data Sheets) available on request
- Lab tested for nicotine content
- Batch tracking for all products

### Website Technical
- Built on Shopify Hydrogen (React)
- Deployed on Shopify Oxygen (Edge runtime)
- Secure checkout (PCI DSS compliant)
- HTTPS encryption throughout

---

## Brand Directory

### Disposable Vape Brands
Elf Bar, Lost Mary, Crystal Bar, SKE Crystal, Hayati, Geek Bar, IVG Bar, Nasty Bar, Vaporesso XROS, RELX

### E-Liquid Brands
IVG, Dinner Lady, Nasty Juice, Riot Squad, Vampire Vape, Zeus Juice, Element, Doozy Vape, Bar Juice 5000, Elfliq

### Hardware Brands
SMOK, Voopoo, Aspire, Innokin, Vaporesso, GeekVape, Uwell, Lost Vape, Freemax, Horizontech

### Nicotine Pouch Brands
VELO, ZYN, White Fox, Nordic Spirit, LYFT, Pablo

---

## Important Notices

### Legal Disclaimer
- Vaping products contain nicotine, which is addictive
- Not for use by non-smokers or under 18s
- Pregnant women should not use nicotine products
- Consult a doctor if you have heart conditions

### Sustainability
- We use recyclable packaging where possible
- Battery recycling guidance provided
- Carbon-conscious shipping options
- Working towards net-zero operations

### Customer Support
For any questions not covered here:
- Email: hello@vapourism.co.uk
- Live chat: Available on website (Mon-Fri, 9am-6pm)
- Contact form: ${baseUrl}/contact
- FAQ: ${baseUrl}/faq

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
*For standard llms.txt, see: ${baseUrl}/llms.txt*
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
