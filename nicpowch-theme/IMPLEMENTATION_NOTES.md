# NicPowch Theme - Implementation Notes

## Overview

This document summarizes the SEO and functionality improvements made to the NicPowch Shopify theme for better Google Shopping integration, enhanced search visibility, and improved user experience.

## Changes Implemented

### 1. Google Shopping SEO Optimization ✅

**File Modified**: `snippets/meta-tags.liquid`

#### Enhanced Product Meta Tags
Added Google Shopping specific meta tags to all product pages:

```liquid
<meta property="product:price:amount" content="{{ product.price | divided_by: 100.0 }}">
<meta property="product:price:currency" content="{{ cart.currency.iso_code }}">
<meta property="product:category" content="Health & Beauty > Tobacco Products > Nicotine Pouches">
<meta name="product:mfr_part_no" content="{{ product.selected_or_first_available_variant.sku | default: product.id }}">
<meta name="product:upc" content="{{ product.selected_or_first_available_variant.barcode }}">
<meta name="product:age_group" content="adult">
<meta name="product:gender" content="unisex">
<meta name="product:condition" content="new">
<meta name="product:availability" content="{% if product.available %}in stock{% else %}out of stock{% endif %}">
<meta name="product:shipping_weight" content="{{ product.selected_or_first_available_variant.weight | divided_by: 1000.0 }} kg">
```

#### Enhanced Product Structured Data (JSON-LD)
Upgraded the Product schema with:

- **GTIN Support**: Added barcode/GTIN field for Google Shopping compliance
- **Age Restrictions**: Added audience restrictions (18+ only) with PeopleAudience type
- **Product Properties**: Added additional properties for product type and age restriction
- **Shipping Details**: Enhanced with shipping rate (£0 for free shipping) and proper time units
- **Category**: Updated to full Google taxonomy path
- **Price Format**: Changed to decimal format (divided by 100) for better compatibility

**Key Improvements**:
```json
{
  "gtin": "barcode value",
  "category": "Health & Beauty > Tobacco Products > Nicotine Pouches",
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 18,
    "requiredMinAge": 18
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Product Type",
      "value": "Nicotine Pouches"
    },
    {
      "@type": "PropertyValue",
      "name": "Age Restricted",
      "value": "18+"
    }
  ],
  "shippingRate": {
    "@type": "MonetaryAmount",
    "value": "0",
    "currency": "GBP"
  }
}
```

### 2. Offers Page Schema Fix ✅

**File Modified**: `sections/main-offers.liquid`

#### Problem
The offers page was using an old schema format with fixed settings (collection_1, collection_2, etc.) instead of using Shopify's more flexible blocks system.

#### Solution
Refactored the schema to use blocks, allowing:
- **Dynamic offer collections**: Add/remove/reorder offers via theme customizer
- **Auto-detection**: Optional automatic detection of collections starting with "OFFER:"
- **Better user experience**: Easier to manage offers without editing code

**New Schema**:
```json
{
  "blocks": [
    {
      "type": "offer_collection",
      "name": "Offer Collection",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Collection"
        },
        {
          "type": "text",
          "id": "offer_name",
          "label": "Offer name"
        }
      ]
    }
  ]
}
```

**Benefits**:
- No limit on number of offers
- Drag-and-drop reordering in theme editor
- Individual offer customization
- Preserves existing auto-detection functionality

### 3. Documentation Created ✅

**New File**: `docs/GOOGLE_SHOPPING_SEO.md`

Comprehensive guide covering:
- Product meta tags explanation
- Structured data implementation
- Google Shopping feed requirements
- Product data optimization checklist
- Google Merchant Center setup instructions
- SEO best practices
- Monitoring and maintenance procedures
- Troubleshooting common issues

## Already Implemented Features (Verified)

### Navigation ✅
The header navigation is well-structured with:
- **Shop Pouches** dropdown with:
  - Shop by Brand (Velo, Nordic Spirit, Killa, Pablo, On!, Loop)
  - Shop by Strength (Low, Medium, Strong, Extra Strong)
  - View All Brands link
- **Offers** link
- **News** (blog) link
- **Contact** link
- All navigation URLs are configurable via theme settings

### Cart Counter ✅
The cart icon in the header includes:
- Visual count badge showing `cart.item_count`
- Hidden when cart is empty
- Animated bounce effect when items are added
- Exposed `updateCartCount()` function for dynamic updates
- Event listener for 'cart:updated' events

### Mobile Navigation ✅
Fully functional mobile menu with:
- Hamburger toggle button
- Slide-in drawer navigation
- Accordion for Shop Pouches section
- All same links as desktop
- Proper accessibility attributes

### Image Optimization ✅
Product images include:
- Proper alt text (uses `product_image.alt` or falls back to `product_title`)
- Responsive srcset with multiple sizes (250w, 500w, 750w)
- Lazy loading enabled
- Explicit width/height attributes
- Optimized sizes attribute

## Validation & Testing

### JSON Schema Validation
All template JSON files use valid Shopify Online Store 2.0 format:
- ✅ `templates/index.json` - Valid
- ✅ `templates/product.json` - Valid
- ✅ `templates/collection.json` - Valid
- ✅ `templates/page.offers.json` - Valid
- ✅ `sections/main-offers.liquid` - Schema updated and valid
- ✅ `sections/header.liquid` - Schema valid

### Structured Data Validation
To validate the enhanced structured data:

1. Visit a product page on the live site
2. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Enter the product URL
4. Verify the Product schema is detected without errors
5. Check that all fields are populated correctly

Expected fields to validate:
- ✅ name
- ✅ description
- ✅ image
- ✅ sku
- ✅ gtin (if barcode is set)
- ✅ brand
- ✅ offers (with price, currency, availability)
- ✅ category
- ✅ audience (age restrictions)

### Google Shopping Feed
Shopify's native product feed is available at:
```
https://your-store.myshopify.com/products.xml
```

This feed automatically includes:
- All published products
- Product variants
- Images
- Pricing
- Availability
- Custom fields

## Next Steps & Recommendations

### Immediate Actions
1. **Test Offers Page**: Create a test collection with "OFFER:" prefix or add collections via theme customizer blocks
2. **Validate Structured Data**: Run product pages through Google's Rich Results Test
3. **Setup Google Merchant Center**: Connect the Shopify product feed
4. **Add Product Barcodes**: Ensure all products have GTIN/UPC/EAN barcodes for better Google Shopping performance

### Product Data Quality
For optimal Google Shopping results, ensure products have:
- [ ] Descriptive titles with brand names
- [ ] Detailed descriptions (minimum 160 characters)
- [ ] High-quality images (minimum 800×800 pixels)
- [ ] Accurate SKUs
- [ ] Barcodes/GTINs where available
- [ ] Correct vendor/brand assignment
- [ ] Appropriate product tags
- [ ] Accurate pricing and stock levels

### Optional Enhancements
Consider adding in future iterations:
- Product review schema (when reviews are available)
- FAQ schema for common questions
- Video schema if product videos are added
- Additional product attributes (flavor, strength, etc.) in structured data

## Support & Troubleshooting

### Common Issues

**Issue**: Products not appearing in Google Shopping  
**Solution**: 
1. Check Merchant Center for disapprovals
2. Verify all required fields are present
3. Ensure products meet Google's policies
4. Check that feed is fetching successfully

**Issue**: Price mismatch errors  
**Solution**: Verify that Shopify product price matches the displayed price (including currency format)

**Issue**: Missing GTIN warnings  
**Solution**: Add barcodes to product variants in Shopify admin (Products > Edit Product > Variants)

**Issue**: Image quality warnings  
**Solution**: Replace product images with higher resolution versions (minimum 800×800px)

### Resources
- Theme documentation: `README.md`
- Google Shopping guide: `docs/GOOGLE_SHOPPING_SEO.md`
- Shopify documentation: https://help.shopify.com/
- Google Merchant Center: https://merchants.google.com/

## Deployment Notes

### Files Changed
```
nicpowch-theme/
├── snippets/meta-tags.liquid (modified - SEO enhancements)
├── sections/main-offers.liquid (modified - schema updated)
└── docs/
    └── GOOGLE_SHOPPING_SEO.md (new - documentation)
```

### No Breaking Changes
All changes are backward compatible:
- Existing meta tags remain functional
- Offers page continues to work with new schema
- No changes to templates or layouts
- No JavaScript modifications required

### Theme Editor Impact
The offers page now uses blocks in the theme customizer:
1. Navigate to "Online Store" > "Themes" > "Customize"
2. Go to the offers page
3. Click the "Offers Page" section
4. Use "Add block" to add offer collections
5. Drag blocks to reorder
6. Enable/disable auto-detection as needed

## Compliance Notes

### Age Verification
Products are marked as age-restricted (18+) through:
- Structured data `audience.requiredMinAge: 18`
- Meta tags `product:age_group: adult`
- Site-wide age verification modal (existing)

### UK Regulations
The theme is optimized for UK nicotine pouch regulations:
- Age verification required
- Proper product categorization
- Shipping restrictions supported
- Terms and conditions accessible

### Google Policies
Structured data complies with:
- Google Merchant Center product data requirements
- Google Shopping policies for age-restricted products
- Schema.org Product specification
- Open Graph Protocol standards

## Version History

### v1.1.0 (Current)
- Added Google Shopping specific meta tags
- Enhanced Product structured data with GTIN, audience, and additional properties
- Fixed offers page schema to use blocks
- Created Google Shopping documentation
- Improved shipping details in structured data

### v1.0.0 (Previous)
- Initial theme with basic SEO meta tags
- Product and collection structured data
- Navigation with brand and strength filters
- Responsive design and mobile menu
- Cart counter functionality

---

**Last Updated**: January 2026  
**Theme Version**: 1.1.0  
**Shopify API Version**: Online Store 2.0  
**Status**: Production Ready
