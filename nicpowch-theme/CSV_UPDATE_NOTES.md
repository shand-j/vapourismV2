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
| **Google Shopping / Google Product Category** | `Health & Beauty > Tobacco Products > Nicotine Pouches` | Official Google product taxonomy category |
| **Google Shopping / Gender** | `unisex` | Product is suitable for all genders |
| **Google Shopping / Age Group** | `adult` | Age-restricted product (18+) |
| **Google Shopping / Condition** | `new` | All products are new/unused |
| **Google Shopping / MPN** | `{Variant SKU}` | Manufacturer Part Number (populated from existing SKU field) |
| **Google Shopping / Custom Product** | `FALSE` | Not a custom/made-to-order product |

### Implementation Details

**Category Selection:**
- Used the same category implemented in the theme's structured data
- Matches Google's official product taxonomy for nicotine pouches
- Ensures consistency between feed and on-site markup

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
4. Example product: "20mg Ignite Double Apple Slim Nicotine Pouches"
   - Category: Health & Beauty > Tobacco Products > Nicotine Pouches
   - Gender: unisex
   - Age Group: adult
   - MPN: ED0174Z0142
   - Condition: new

## Statistics

**Total Rows Updated:** 212 product rows (out of 910 total CSV rows)  
**Variant Rows:** 698 variant-only rows (inherit from parent product)  
**Fields Populated:** 6 Google Shopping fields per product  
**Total Updates:** 1,272 field values set  

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
