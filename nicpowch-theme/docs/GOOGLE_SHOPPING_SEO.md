# Google Shopping & SEO Optimization Guide

## Overview

This document outlines the SEO and Google Shopping optimizations implemented in the NicPowch Shopify theme to maximize product visibility in search engines and Google Merchant Center.

## Product SEO Enhancements

### Meta Tags (snippets/meta-tags.liquid)

The theme includes comprehensive product meta tags optimized for Google Shopping and merchant feeds:

#### Standard Product Meta Tags
- `product:availability` - Stock status (in stock / out of stock)
- `product:condition` - Always "new"
- `product:brand` - Product vendor/manufacturer
- `product:retailer_item_id` - Unique product ID

#### Google Shopping Specific Tags
- `product:price:amount` - Price in decimal format (e.g., 4.99)
- `product:price:currency` - Currency code (GBP)
- `product:category` - Google product category
- `product:mfr_part_no` - Manufacturer part number (SKU)
- `product:upc` - Universal Product Code (barcode)
- `product:age_group` - Set to "adult" for age-restricted products
- `product:gender` - Set to "unisex"
- `product:shipping_weight` - Product weight in kilograms

### Structured Data (JSON-LD)

Enhanced Product schema with Google Shopping compliance:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Title",
  "description": "Product description...",
  "sku": "SKU123",
  "gtin": "Barcode/GTIN",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "category": "Health & Beauty > Tobacco Products > Nicotine Pouches",
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 18,
    "requiredMinAge": 18
  },
  "offers": {
    "@type": "Offer",
    "price": "4.99",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "GBP"
      },
      "deliveryTime": {
        "handlingTime": "0-1 days",
        "transitTime": "1-3 days"
      }
    }
  }
}
```

## Google Shopping Feed Requirements

### Required Fields (Already Implemented)

✅ **ID** - `product.id`  
✅ **Title** - `product.title`  
✅ **Description** - `product.description`  
✅ **Link** - `canonical_url`  
✅ **Image Link** - `product.featured_image`  
✅ **Availability** - Based on `product.available`  
✅ **Price** - `product.price`  
✅ **Brand** - `product.vendor`  
✅ **GTIN** - `product.selected_or_first_available_variant.barcode`  
✅ **MPN** - `product.selected_or_first_available_variant.sku`  
✅ **Condition** - Always "new"  
✅ **Adult** - Implied through age restriction  
✅ **Shipping** - UK shipping details in structured data

### Product Category Mapping

Google Product Category: **Health & Beauty > Tobacco Products > Nicotine Pouches**

This is the most appropriate category for nicotine pouches in Google's taxonomy.

### Age Verification

Products are marked as adult-only through:
1. `audience.requiredMinAge: 18` in structured data
2. Age verification modal on site
3. Proper age gate implementation

## Image Optimization for Google Shopping

### Current Implementation
- **Alt text**: Automatically uses `product_image.alt` or falls back to `product_title`
- **Responsive images**: Multiple sizes via `srcset` (250w, 500w, 750w)
- **Lazy loading**: Enabled for performance
- **Dimensions**: Explicit width/height attributes

### Best Practices
- Images should be at least 800×800 pixels
- Use high-quality product images on white or transparent backgrounds
- First image should show the product clearly
- Additional images can show lifestyle or usage

## Shipping Information

Structured data includes:
- **Free shipping**: £0 shipping rate for orders over £30
- **Handling time**: 0-1 days (same-day dispatch)
- **Transit time**: 1-3 days
- **Region**: United Kingdom (GB)

## Product Data Optimization Checklist

When adding products to Shopify, ensure:

- [ ] Product title is descriptive and includes brand name
- [ ] Description is detailed (at least 160 characters)
- [ ] Vendor/Brand is set correctly
- [ ] SKU is unique and meaningful
- [ ] Barcode (GTIN/UPC/EAN) is provided if available
- [ ] High-quality images (minimum 800×800px)
- [ ] Image alt text is descriptive
- [ ] Product is assigned to correct collections
- [ ] Price is set correctly
- [ ] Stock levels are accurate
- [ ] Product tags include relevant keywords

## Google Merchant Center Setup

### 1. Create Product Feed

Shopify automatically generates a product feed at:
```
https://your-store.myshopify.com/products.xml
```

### 2. Add Feed to Google Merchant Center

1. Sign in to Google Merchant Center
2. Go to "Products" > "Feeds"
3. Click the plus button to create a new feed
4. Select "Scheduled fetch"
5. Enter feed URL: `https://nicpowch.myshopify.com/products.xml`
6. Set fetch schedule (daily recommended)

### 3. Link to Google Ads

Once products are approved in Merchant Center:
1. Link Merchant Center to Google Ads account
2. Create Shopping campaigns in Google Ads
3. Set up product groups and bids

## SEO Best Practices Implemented

### Title Tags
- Format: `Product Title | Brand | NicPowch`
- Length: Under 60 characters when possible
- Includes primary keywords

### Meta Descriptions
- Length: 155-160 characters
- Includes product benefits and CTA
- Auto-generated from product description

### Open Graph Tags
- Complete OG implementation for social sharing
- Optimized images (1200×630px recommended)
- Proper product pricing and availability

### Twitter Cards
- Summary large image cards
- Optimized for product sharing
- Includes pricing information

### Breadcrumb Navigation
- Structured data for breadcrumbs
- Helps search engines understand site structure
- Improves click-through rates in SERPs

## Monitoring & Maintenance

### Regular Checks

1. **Google Search Console**
   - Monitor product page indexing
   - Check for mobile usability issues
   - Review search performance

2. **Google Merchant Center**
   - Monitor product approval status
   - Fix any feed errors or warnings
   - Update product data as needed

3. **Structured Data Testing**
   - Use Google's Rich Results Test
   - Validate product markup
   - Check for warnings or errors

### Common Issues & Fixes

**Issue**: Product not showing in Google Shopping  
**Fix**: Check Merchant Center for disapprovals, ensure all required fields are present

**Issue**: Price mismatch error  
**Fix**: Verify product price in Shopify matches what's on product page

**Issue**: Missing GTIN  
**Fix**: Add barcode to product variants in Shopify admin

**Issue**: Image quality warning  
**Fix**: Replace with higher resolution images (min 800×800px)

## Additional Resources

- [Google Merchant Center Help](https://support.google.com/merchants/)
- [Product Data Specification](https://support.google.com/merchants/answer/7052112)
- [Shopify Product Feed](https://help.shopify.com/en/manual/products/product-feeds)
- [Schema.org Product Spec](https://schema.org/Product)
- [Google Product Categories](https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt)

## Support

For technical issues with the theme's SEO implementation, refer to the main README.md or contact the development team.
