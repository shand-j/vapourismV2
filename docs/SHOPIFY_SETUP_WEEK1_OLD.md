# Shopify Setup Guide - Week 1 Collections

**Implementation Date**: December 2025  
**Pages Deployed**: 6 SEO-optimized collection pages  
**Expected Impact**: 10k-20k monthly visits

---

## Overview

This guide provides step-by-step instructions for configuring Shopify collections and products to make the Week 1 SEO collection pages functional.

---

## 📋 Quick Setup Checklist

- [ ] Create 6 Smart Collections in Shopify Admin
- [ ] Tag existing products with appropriate tags
- [ ] Upload new products for each brand/collection
- [ ] Verify collection rules are working
- [ ] Test collection pages display products correctly
- [ ] Add navigation menu links (optional)

---

## 🏪 Smart Collections Setup

### Step-by-Step: Creating Smart Collections

1. **Navigate to Shopify Admin**
   - Go to `Products` → `Collections`
   - Click `Create collection`

2. **Choose Collection Type**
   - Select `Smart collection` (automated)
   - This will automatically include products based on conditions

3. **Configure Collection Details**
   - Follow the specific settings for each collection below

---

## 1️⃣ Hayati Pro Ultra Collection

### Collection Settings

**Title**: `Hayati Pro Ultra`

**Handle**: `hayati-pro-ultra` (auto-generated, matches route)

**Description**:
```
Shop the Hayati Pro Ultra 25000 range - premium disposable vapes with up to 25,000 puffs. Rechargeable battery, LED display, and exceptional flavor. Fast UK delivery.
```

**Collection Conditions** (Automated):
- **Condition 1**: Product tag contains `hayati` AND Product tag contains `pro_ultra`
- **OR Condition 2**: Product vendor equals `Hayati` AND Product title contains `Pro Ultra`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Hayati Pro Ultra 25000 | Premium Disposable Vapes UK`
- **Meta description**: `Shop Hayati Pro Ultra 25000 puff disposable vapes. ✓ 25,000 puffs ✓ Fast UK delivery ✓ Best prices. Browse the complete range.`

**Products to Include**:
- Hayati Pro Ultra 25000 (all flavors)
- Hayati Pro Ultra Plus 25000 (all flavors)

---

## 2️⃣ Hayati Pro Max Collection

### Collection Settings

**Title**: `Hayati Pro Max`

**Handle**: `hayati-pro-max`

**Description**:
```
Discover Hayati Pro Max disposable vapes with extended battery life and premium flavor delivery. Perfect for vapers seeking reliable, long-lasting devices.
```

**Collection Conditions**:
- **Condition 1**: Product tag contains `hayati` AND Product tag contains `pro_max`
- **OR Condition 2**: Product vendor equals `Hayati` AND Product title contains `Pro Max`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Hayati Pro Max | Long-Lasting Vapes UK`
- **Meta description**: `Shop Hayati Pro Max disposable vapes. ✓ Extended capacity ✓ Rechargeable ✓ Premium build ✓ Fast UK delivery. Browse the range.`

**Products to Include**:
- Hayati Pro Max 6000 (all flavors)
- Hayati Pro Max Plus (all flavors)

---

## 3️⃣ Lost Mary BM6000 Collection

### Collection Settings

**Title**: `Lost Mary BM6000`

**Handle**: `lost-mary-bm6000`

**Description**:
```
Experience the Lost Mary BM6000 range with 6000 puffs, rechargeable battery, and exceptional flavor quality. The perfect choice for UK vapers.
```

**Collection Conditions**:
- **Condition 1**: Product tag contains `lost_mary` AND Product tag contains `bm6000`
- **OR Condition 2**: Product vendor equals `Lost Mary` AND Product title contains `BM6000`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Lost Mary BM6000 | 6000 Puff Vape Pods UK`
- **Meta description**: `Shop Lost Mary BM6000 disposable vape pods. ✓ 6000 puffs ✓ Rechargeable ✓ Premium flavors ✓ Fast UK delivery. Best prices.`

**Products to Include**:
- Lost Mary BM6000 (all flavors)
- Lost Mary BM6000 Rechargeable (all flavors)

---

## 4️⃣ Crystal Bar Collection

### Collection Settings

**Title**: `Crystal Bar`

**Handle**: `crystal-bar`

**Description**:
```
Experience crystal-clear flavor with Crystal Bar premium disposable vapes. Smooth vapor production and exceptional taste in every puff.
```

**Collection Conditions**:
- **Condition 1**: Product tag contains `crystal` AND Product type equals `Disposable Vape`
- **OR Condition 2**: Product vendor equals `Crystal` OR Product vendor equals `Crystal Bar`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Crystal Bar | Premium Disposable Vapes UK`
- **Meta description**: `Shop Crystal Bar disposable vapes. ✓ Crystal clear flavor ✓ Smooth vapor ✓ Fast UK delivery ✓ Authentic products. Browse the range.`

**Products to Include**:
- Crystal Bar 600 (all flavors)
- Crystal Bar 3500 (all flavors)
- Crystal Prime (all flavors)

---

## 5️⃣ Elux Legend Collection

### Collection Settings

**Title**: `Elux Legend`

**Handle**: `elux-legend`

**Description**:
```
Discover the legendary Elux range of disposable vapes, known for exceptional flavor delivery and reliable performance.
```

**Collection Conditions**:
- **Condition 1**: Product tag contains `elux` AND Product tag contains `legend`
- **OR Condition 2**: Product vendor equals `Elux` AND Product title contains `Legend`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Elux Legend | Premium Disposable Vapes UK`
- **Meta description**: `Shop Elux Legend disposable vapes. ✓ Long-lasting ✓ Premium flavors ✓ Fast UK delivery ✓ Authentic Elux. Browse the range.`

**Products to Include**:
- Elux Legend 3500 (all flavors)
- Elux Legend Mini 600 (all flavors)

---

## 6️⃣ Riot Squad Collection

### Collection Settings

**Title**: `Riot Squad`

**Handle**: `riot-squad`

**Description**:
```
Experience award-winning e-liquids from Riot Squad. Bold flavors, exceptional quality, both shortfills and nicotine salts available.
```

**Collection Conditions**:
- **Condition 1**: Product vendor equals `Riot Squad`
- **OR Condition 2**: Product tag contains `riot_squad`

**Sort Order**: Best selling

**SEO Settings**:
- **Page title**: `Riot Squad E-Liquids | Premium Vape Juice UK`
- **Meta description**: `Shop Riot Squad premium e-liquids. ✓ Award-winning flavors ✓ 50ml shortfills ✓ 10ml nic salts ✓ Fast UK delivery. Browse the range.`

**Products to Include**:
- Riot Squad Punx Series (50ml shortfills)
- Riot Squad Bar Edition (10ml nic salts)
- Riot Squad Fresh Series (all formats)

---

## 🏷️ Product Tagging Strategy

### Tag Naming Convention

Use underscores for multi-word tags (e.g., `lost_mary`, not `lost-mary`)

### Required Tags by Product Type

#### Disposable Vapes - General
- `disposable` - ALL disposable vapes must have this tag
- `rechargeable` - If device has USB-C charging
- `high_capacity` - For devices with 5000+ puffs

#### Disposable Vapes - Brand Specific

**Hayati Products:**
- `hayati` - All Hayati products
- `pro_ultra` - Pro Ultra 25000 models
- `pro_max` - Pro Max models
- `25000_puff` - Pro Ultra specifically
- `6000_puff` - Pro Max specifically

**Lost Mary Products:**
- `lost_mary` - All Lost Mary products
- `bm6000` - BM6000 model specifically
- `6000_puff` - For BM6000

**Crystal Products:**
- `crystal` - All Crystal products
- `crystal_bar` - Crystal Bar branded products
- `crystal_prime` - Crystal Prime models

**Elux Products:**
- `elux` - All Elux products
- `legend` - Legend series
- `3500_puff` - For 3500 models
- `600_puff` - For mini models

#### E-Liquids

**Riot Squad Products:**
- `riot_squad` - All Riot Squad products
- `e-liquid` - All e-liquids
- `shortfill` - For 50ml bottles
- `nic_salt` - For 10ml nicotine salt
- `50ml` - Shortfill size
- `10ml` - Nic salt size

**Flavor Tags:**
- `fruit` - Fruit flavors
- `menthol` - Menthol/ice flavors
- `dessert` - Dessert flavors
- `candy` - Candy/sweet flavors

---

## 📦 Product Upload Template

### Disposable Vape Product Example

**Title**: `Hayati Pro Ultra 25000 - Strawberry Ice`

**Vendor**: `Hayati`

**Product Type**: `Disposable Vape`

**Tags**: `disposable, hayati, pro_ultra, 25000_puff, rechargeable, fruit, strawberry`

**Description**:
```
Experience the Hayati Pro Ultra 25000 in Strawberry Ice flavor. This premium disposable vape offers an incredible 25,000 puffs with a rechargeable battery, LED display, and authentic strawberry ice taste.

Key Features:
• Up to 25,000 puffs
• Rechargeable battery (USB-C)
• 20ml e-liquid capacity
• 20mg (2%) nicotine salt
• LED battery and e-liquid indicators
• Compact and portable design
• TPD compliant

The Hayati Pro Ultra 25000 sets a new standard for disposable vapes with its exceptional puff count and rechargeable design, ensuring you get every last drop of premium e-liquid.
```

**Price**: Set competitive pricing (typically £9.99-£14.99)

**Inventory**: Set stock levels

**Images**: Upload high-quality product images (front, back, packaging)

---

### E-Liquid Product Example

**Title**: `Riot Squad Punx - Raspberry Grenade 50ml`

**Vendor**: `Riot Squad`

**Product Type**: `E-Liquid`

**Tags**: `e-liquid, riot_squad, shortfill, 50ml, fruit, raspberry`

**Description**:
```
Riot Squad Punx Raspberry Grenade is an explosive blend of sweet and tangy raspberries with a hint of sharp grenade. This 50ml shortfill delivers intense flavor for sub-ohm vapers.

Key Features:
• 50ml shortfill bottle (60ml capacity)
• 0mg nicotine (add nic shots)
• 70VG/30PG ratio
• Perfect for sub-ohm vaping
• UK made and TPD compliant
• Award-winning Punx range

Add a 10ml 18mg nic shot for 3mg nicotine strength (60ml total).
```

**Variants**:
- 0mg (50ml) - Base option

**Price**: Typically £9.99-£14.99

---

## 🔍 Verification Steps

### 1. Test Collection Rules

After creating collections:

1. Go to `Products` → `Collections`
2. Click each collection name
3. Verify products appear automatically
4. Check product count matches expectations

### 2. Test Collection Pages

Visit each URL to ensure pages load correctly:

- https://yourdomain.com/collections/hayati-pro-ultra
- https://yourdomain.com/collections/hayati-pro-max
- https://yourdomain.com/collections/lost-mary-bm6000
- https://yourdomain.com/collections/crystal-bar
- https://yourdomain.com/collections/elux-legend
- https://yourdomain.com/collections/riot-squad

### 3. Verify SEO Elements

For each page, check:
- [ ] Page title displays correctly in browser tab
- [ ] Meta description is present (view page source)
- [ ] H1 heading is visible and keyword-optimized
- [ ] Products display in grid format
- [ ] Images load properly
- [ ] Prices display correctly
- [ ] Links to product pages work

---

## 🎨 Optional: Add to Navigation Menu

### Create a "Brands" Menu Section

In Shopify Admin → `Online Store` → `Navigation`:

**Create new menu: "Popular Brands"**

Menu items:
- Hayati Pro Ultra → `/collections/hayati-pro-ultra`
- Hayati Pro Max → `/collections/hayati-pro-max`
- Lost Mary BM6000 → `/collections/lost-mary-bm6000`
- Crystal Bar → `/collections/crystal-bar`
- Elux Legend → `/collections/elux-legend`
- Riot Squad → `/collections/riot-squad`

Add this menu to your header or sidebar navigation.

---

## 📊 Performance Tracking

### Monitor These Metrics

**Weekly:**
- Organic traffic to each collection page (Google Analytics)
- Product impressions (Google Search Console)
- Conversion rates by collection

**Monthly:**
- Keyword rankings for target terms
- Total organic sessions
- Revenue from organic traffic

### Google Search Console Setup

Add these URLs to monitoring:
```
/collections/hayati-pro-ultra
/collections/hayati-pro-max
/collections/lost-mary-bm6000
/collections/crystal-bar
/collections/elux-legend
/collections/riot-squad
```

Track keywords:
- hayati pro ultra
- hayati pro max
- lost mary bm6000
- crystal bar
- elux legend
- riot squad

---

## 🚀 Launch Checklist

### Pre-Launch
- [ ] All 6 collections created in Shopify
- [ ] Collection rules tested and working
- [ ] At least 5-10 products per collection uploaded
- [ ] Product tags applied correctly
- [ ] Product descriptions optimized
- [ ] High-quality images uploaded
- [ ] Pricing set competitively
- [ ] Inventory levels configured

### Launch Day
- [ ] Deploy code to production (already done via PR)
- [ ] Test all 6 collection URLs
- [ ] Verify mobile responsiveness
- [ ] Check page load speed
- [ ] Submit URLs to Google Search Console
- [ ] Share on social media (optional)

### Post-Launch (Week 1)
- [ ] Monitor Google Analytics for traffic
- [ ] Check for any 404 errors
- [ ] Adjust collection rules if needed
- [ ] Add more products based on performance
- [ ] Respond to any customer feedback

---

## 🆘 Troubleshooting

### Products Not Showing on Collection Page

**Possible causes:**
1. Product doesn't have required tags
2. Product vendor name doesn't match collection rule
3. Product is not active/published
4. Collection conditions are too restrictive

**Solution:**
- Check product tags in Shopify admin
- Verify product vendor field
- Ensure product is set to "Active"
- Review and adjust collection conditions

### Collection Page Shows "Products Coming Soon"

**This is expected behavior when:**
- Collection is empty (no products match rules)
- Products are not yet uploaded

**Solution:**
- Upload products with appropriate tags
- Or wait for products to be added

### SEO Title/Description Not Showing

**Solution:**
- Edit collection in Shopify Admin
- Scroll to "Search engine listing preview"
- Click "Edit website SEO"
- Add custom page title and meta description

---

## 📞 Support

### Need Help?

- **Shopify Documentation**: https://help.shopify.com/en/manual/products/collections
- **Collection Conditions**: https://help.shopify.com/en/manual/products/collections/automated-collections
- **Product Tagging**: https://help.shopify.com/en/manual/products/details/tags

### Common Questions

**Q: Do I need to create Manual or Smart collections?**
A: Use Smart (automated) collections. They automatically include products based on rules.

**Q: Can products appear in multiple collections?**
A: Yes! Products can appear in as many collections as they match.

**Q: What if I don't have all these products yet?**
A: Create the collections anyway. Pages will show "Products coming soon" until you add items.

**Q: Should I use the same collection handle in Shopify?**
A: Yes! The handle must match the route (e.g., `hayati-pro-ultra`)

---

## ✅ Success Criteria

Week 1 implementation is successful when:

- [ ] All 6 collections are live and functional
- [ ] Each collection has at least 5 products
- [ ] Collection pages display correctly on desktop and mobile
- [ ] SEO titles and descriptions are optimized
- [ ] Products are properly tagged
- [ ] Internal links between collections work
- [ ] Pages are being crawled by Google (Search Console)

---

## 📈 Expected Results

**Week 2-4**: 
- Initial indexing by Google
- First organic impressions
- 10-50 clicks/day combined

**Month 2-3**:
- Ranking for brand keywords
- 100-500 clicks/day combined
- 5-10 conversions/week from organic

**Month 4-6**:
- Top 10 rankings for target keywords
- 1000+ clicks/day combined
- Significant organic revenue

---

## 🎯 Next Steps

After Week 1 setup is complete, prepare for:

**Week 2**: Nicotine Pouches category launch
- Collections needed: Velo, Zyn, general nicotine pouches
- Educational content pages
- 200k+ monthly search potential

**Week 3-4**: Core page optimization
- Homepage updates
- Payment methods page
- Delivery information page
- Local SEO setup

---

**Setup Guide Version**: 1.0  
**Last Updated**: December 2025  
**Maintained By**: SEO Implementation Team

Ready to capture competitor traffic and grow organic visitors! 🚀
