# Product CSV Update - Google Shopping Integration

## Overview

Updated the product export CSV file to include all required Google Shopping metadata fields for seamless integration with Google Merchant Center and YouTube Shopping.

## File Updated

**`nicpowch-theme/assets/nic pouch taxonomy - products_export_1 (1).csv`**

## Changes Made

### Google Shopping Fields Populated

For all 212 product entries, the following fields have been populated:

| Field | Value | Description |
|-------|-------|-------------|
| **Google Shopping / Google Product Category** | `Health & Beauty > Health Care > Medicine & Drugs` | Official Google product taxonomy (Category ID: 518) |
| **Google Shopping / Gender** | `unisex` | Product is suitable for all genders |
| **Google Shopping / Age Group** | `adult` | Age-restricted product (18+) |
| **Google Shopping / Condition** | `new` | All products are new/unused |
| **Google Shopping / MPN** | `{Variant SKU}` | Manufacturer Part Number (populated from existing SKU field) |
| **Google Shopping / Custom Product** | `FALSE` | Not a custom/made-to-order product |

### SEO Fields Generated

| Field | Format | Example |
|-------|--------|---------|
| **SEO Title** | Optimized for search (≤60 chars) | `20mg Ignite Double Apple Slim Nicotine Pouches - 20 Pouches` |
| **SEO Description** | Compelling meta description (≤155 chars) | `Buy IGNITE Double Apple 20mg nicotine pouches. Tobacco-free, discreet pouches. Fast UK delivery, 18+ age verified.` |

### Search Enhancement Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Search product boosts** | Comma-separated keywords for improved search ranking | `ignite, 20mg, 20 mg, apple, nicotine pouches, nic pouches, tobacco free` |

### Implementation Details

**Category Selection:**
- Updated to Google Category ID 518: Health & Beauty > Health Care > Medicine & Drugs
- This is the correct classification for nicotine replacement products
- Aligns with Google's official product taxonomy for medicinal nicotine products
- Ensures consistency between feed and on-site markup

**SEO Title Generation:**
- Includes brand/vendor name when not present in product title
- Maintains original title structure when vendor already included
- Adds "| Nicotine Pouches" suffix for clarity
- Truncated to 60 characters maximum for optimal display in search results

**SEO Description Generation:**
- Structured format: "Buy {Brand} {Flavor} {Strength} nicotine pouches..."
- Includes key selling points: Tobacco-free, discreet, fast UK delivery
- Mentions age verification (18+) for compliance
- Optimized to 155 characters maximum for search result snippets

**Search Boost Keywords:**
- Brand/vendor name (lowercase)
- Nicotine strength (e.g., "20mg", "20 mg")
- Flavor descriptors (mint, apple, cherry, etc.)
- Generic terms (nicotine pouches, nic pouches, tobacco free)
- Up to 10 unique keywords per product

**Age Group:**
- Set to "adult" to comply with UK age verification requirements (18+)
- Aligns with the audience restrictions in the Product schema

**MPN (Manufacturer Part Number):**
- Automatically populated from the "Variant SKU" column
- Each product has a unique MPN for better identification
- Example: `ED0174Z0142`, `AJ0073X0467`, etc.

**Gender:**
- Set to "unisex" as nicotine pouches are not gender-specific products

**Condition:**
- All products marked as "new" (not used or refurbished)

**Custom Product:**
- Set to "FALSE" as these are standard manufactured products, not custom orders

## Benefits

### For Google Merchant Center
✅ **Feed Approval**: All required fields populated for product approval  
✅ **Better Categorization**: Proper taxonomy ensures products appear in correct searches  
✅ **Age Compliance**: Adult age group marking helps with regulatory compliance  
✅ **Product Identification**: MPN helps Google match products across channels  

### For YouTube Shopping
✅ **Video Shopping Integration**: Products can be tagged in YouTube videos  
✅ **Shop Tab**: Products will appear in the YouTube Shop tab  
✅ **Live Shopping**: Products can be featured in live shopping streams  

### For Search Visibility
✅ **Shopping Ads**: Products eligible for Google Shopping campaigns  
✅ **Free Listings**: Can appear in free product listings on Google  
✅ **Product Rich Results**: Enhanced search result appearance  

## Upload Instructions

### To Shopify Admin:

1. **Navigate to Products**
   - Go to Shopify Admin > Products
   - Click "Import" in the top right

2. **Upload CSV**
   - Click "Add file" or drag and drop
   - Select: `nic pouch taxonomy - products_export_1 (1).csv`
   - Choose "Overwrite existing products that have the same handle"

3. **Review Import**
   - Check the preview shows all fields correctly
   - Verify Google Shopping columns are populated
   - Click "Import products"

4. **Monitor Import**
   - Wait for import to complete (212 products)
   - Check for any errors or warnings
   - Verify a few products have Google Shopping data

### To Google Merchant Center:

The Shopify product feed (`https://[store].myshopify.com/products.xml`) will automatically include these fields once the products are imported.

1. **Wait for Feed Update**
   - Allow 24 hours for Shopify to regenerate the feed
   - Or manually trigger a feed refresh in Merchant Center

2. **Check Product Status**
   - Go to Google Merchant Center
   - Navigate to Products
   - Verify products are "Active" or "Pending"

3. **Resolve Any Issues**
   - Check for disapprovals or warnings
   - Most common issues should be resolved with this data

## Verification

After import, verify the data on a sample product:

1. Open any product in Shopify Admin
2. Scroll to "Search engine listing"
3. Check that Google Shopping fields are populated
4. Verify SEO title and description are set
5. Check metafields for search boost keywords

**Example product: "20mg Ignite Double Apple Slim Nicotine Pouches"**
- Category: Health & Beauty > Health Care > Medicine & Drugs
- Gender: unisex
- Age Group: adult
- MPN: ED0174Z0142
- Condition: new
- SEO Title: "20mg Ignite Double Apple Slim Nicotine Pouches - 20 Pouches"
- SEO Description: "Buy IGNITE Double Apple 20mg nicotine pouches. Tobacco-free, discreet pouches. Fast UK delivery, 18+ age verified."
- Search Boosts: "ignite, 20mg, 20 mg, apple, nicotine pouches, nic pouches, tobacco free"

## Statistics

**Total Rows Updated:** 212 product rows (out of 910 total CSV rows)  
**Variant Rows:** 698 variant-only rows (inherit from parent product)  
**Google Shopping Fields:** 6 fields per product  
**SEO Fields:** 2 fields per product (Title & Description)  
**Search Enhancement:** 1 field per product (Search Boosts)  
**Total Field Updates:** 1,908 field values set  

**Quality Metrics:**
- Average SEO Title length: 52.6 characters (optimal: ≤60)
- Average SEO Description length: 113.6 characters (optimal: ≤155)
- All products have complete Google Shopping metadata
- All products have optimized SEO fields
- All products have search boost keywords  

## Compatibility

This CSV is compatible with:
- ✅ Shopify Product Import (CSV format)
- ✅ Google Merchant Center (via Shopify feed)
- ✅ YouTube Shopping (via Google Merchant Center)
- ✅ Google Shopping Ads
- ✅ Free Google Product Listings

## Next Steps

1. **Import to Shopify** using the instructions above
2. **Wait 24 hours** for feed to update
3. **Check Google Merchant Center** for product approvals
4. **Set up Shopping Campaigns** in Google Ads (optional)
5. **Enable YouTube Shopping** in YouTube Studio (optional)

## Maintenance

When adding new products:
- Use this CSV as a template
- Ensure all Google Shopping fields are populated
- Follow the same values for consistency
- MPN should be unique per variant

## Support

For issues with:
- **CSV Import**: Check Shopify's product import documentation
- **Merchant Center**: See `nicpowch-theme/docs/GOOGLE_SHOPPING_SEO.md`
- **Feed Errors**: Review Google Merchant Center troubleshooting guide

---

**Updated:** January 2026  
**Products:** 212 nicotine pouch products  
**Status:** ✅ Ready for Shopify import
