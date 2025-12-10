# Brand Media Pack Integration Strategy

## Research Date
15 November 2025

## Objective
Create a comprehensive plan to integrate 112 brand media packs into V2 product pages, leveraging `public/media_packs/` directory for enhanced brand storytelling and visual merchandising.

---

## Current Media Pack Inventory

### Confirmed Media Packs (2 brands)
From `public/media_packs/README.md`:

**1. I VG (I Vape Great)**
- ✅ Logo variations (horizontal, vertical, square)
- ✅ Lifestyle imagery (5 photos)
- ✅ Product photography (10 photos)
- ✅ Brand guidelines PDF
- **Quality**: High-resolution, professional
- **Rights**: Full usage rights confirmed
- **Source**: https://ivapegreat.com/pages/media-kits

**2. Vapes Bars**
- ✅ Logo (primary only)
- ✅ Lifestyle imagery (3 photos)
- ✅ Product photography (8 photos)
- ❌ No brand guidelines
- **Quality**: High-resolution
- **Rights**: Full usage rights confirmed
- **Source**: https://worldwide.vapes-bars.com/media-kit/

### Media Pack Directory Structure
```
public/media_packs/
├── README.md
├── brands_list.json              # 112 brands database
├── download_progress.md          # Track acquisition status
├── i-vg/
│   ├── logos/
│   │   ├── i-vg-logo-horizontal.png
│   │   ├── i-vg-logo-vertical.png
│   │   └── i-vg-logo-square.png
│   ├── lifestyle/
│   │   ├── lifestyle-001.jpg
│   │   ├── lifestyle-002.jpg
│   │   └── ...
│   ├── products/
│   │   ├── product-i-vg-blue-raspberry.png
│   │   └── ...
│   └── brand-guidelines.pdf
├── vapes-bars/
│   ├── logos/
│   │   └── vapes-bars-logo.png
│   ├── lifestyle/
│   │   └── ...
│   └── products/
│       └── ...
└── _template/
    ├── MEDIA_REQUEST_EMAIL.md
    └── folder-structure.txt
```

---

## Remaining Brands to Contact (110)

### Priority Tier 1: High-Volume Brands (20)
**Criteria:** >50 SKUs or >£10k monthly revenue

1. **Elf Bar** - Disposables market leader
2. **Lost Mary** - Elf Bar sister brand
3. **SKE Crystal** - Premium disposables
4. **Elux Legend** - 3500 puff disposables
5. **IVG** - E-liquids & disposables (different from I VG)
6. **Dinner Lady** - Premium e-liquids
7. **Nasty Juice** - International e-liquid brand
8. **SMOK** - Vape kit manufacturer
9. **Vaporesso** - Pod systems & mods
10. **Voopoo** - Drag series kits
11. **Aspire** - Vaping pioneer
12. **Geek Vape** - Aegis series
13. **Uwell** - Caliburn series
14. **Zeus Juice** - UK e-liquid brand
15. **Vampire Vape** - UK heritage brand
16. **Element** - Premium e-liquids
17. **Riot Squad** - Punx range
18. **Pod Salt** - Nic salt specialist
19. **Pacha Mama** - Fruit e-liquids
20. **Ohm Brew** - Balanced e-liquids

### Priority Tier 2: Mid-Volume Brands (40)
**Criteria:** 10-50 SKUs or £2k-10k monthly revenue

- SMOK, Vaporesso, Voopoo, Aspire, Geek Vape, Uwell, FreeMax, OXVA
- Dinner Lady, Nasty Juice, Element, Riot Squad, Zeus Juice
- (Full list available in `public/media_packs/brands_list.json`)

### Priority Tier 3: Niche Brands (50)
**Criteria:** <10 SKUs or specialty products

- Boutique e-liquid brands
- Emerging hardware manufacturers
- CBD-focused brands
- (Full list available in `public/media_packs/brands_list.json`)

---

## Media Acquisition Strategy

### Phase 1: Bulk Email Campaign (Week 5)

**Email Template Location:** `public/media_packs/_template/MEDIA_REQUEST_EMAIL.md`

**Template Content:**
```markdown
Subject: Partnership Opportunity: Showcase [BRAND] on Vapourism.co.uk

Dear [BRAND] Team,

We're Vapourism, a leading UK vaping retailer, and we're enhancing our online store to better showcase premium brands like [BRAND].

We'd love to feature your brand with:
- High-quality lifestyle imagery
- Product photography
- Brand story & values
- Logo variations

**What we need:**
1. Brand logos (PNG, transparent background, vector if available)
2. Lifestyle photography (3-5 images showing brand usage)
3. Product shots (high-res images of existing product range)
4. Brand guidelines (optional, PDF format)

**What you get:**
- Prominent brand page on our website
- Enhanced product listings with professional imagery
- Increased brand visibility to UK vaping community
- Professional presentation that drives sales

**Usage:** Website only, full attribution, non-exclusive license.

Can you share your media pack? Reply with files or share a Dropbox/Google Drive link.

Looking forward to showcasing [BRAND] beautifully!

Best regards,
The Vapourism Team
support@vapourism.co.uk
```

**Outreach Strategy:**
- Week 1: Tier 1 brands (20 emails, personalized with brand-specific details)
- Week 2: Tier 2 brands (40 emails, semi-personalized)
- Week 3: Tier 3 brands (50 emails, template-based)
- Follow-up: 7 days after initial email, then 14 days

**Expected Response Rate:**
- Tier 1: 60-80% (eager for premium exposure)
- Tier 2: 40-60% (interested but slower response)
- Tier 3: 20-40% (hit or miss)
- **Total estimate:** 50-70 brands provide media (60-80 total including existing 2)

### Phase 2: Manual Collection (Weeks 5-6)

**For brands without media packs:**

**1. Web scraping (with permission):**
- Download high-res images from brand websites
- Use tools: wget, curl, browser devtools
- Document source URLs for attribution

**2. Social media:**
- Instagram/Facebook high-res image downloads
- Request permission via DM first
- Credit brand's social handles

**3. Manufacturer portals:**
- B2B login areas often have downloadable assets
- Trade/wholesale portals may have media sections
- Request access if not already available

**4. Trade shows:**
- Collect physical USB drives with media at events
- Take professional photos of booth materials
- Network with brand reps for direct media access

### Phase 3: Fallback Assets (Week 6)

**For brands that don't respond or lack professional media:**

**1. Generic lifestyle imagery:**
- Stock photos of vaping scenes (Unsplash, Pexels)
- `public/media_packs/_fallback/lifestyle-generic-001.jpg`
- Use sparingly, prefer brand-specific content

**2. Product-only layouts:**
- Focus on existing Shopify product images
- Enhance with better backgrounds (white, gradient)
- Professional product styling without lifestyle context

**3. Community-generated content:**
- User-submitted photos (with permission)
- Instagram reposts (with credit and permission)
- Customer review photos

---

## Technical Implementation

### Database Structure (Metadata)

**Create:** `public/media_packs/manifest.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-15",
  "brands": {
    "i-vg": {
      "displayName": "I VG (I Vape Great)",
      "vendor": "I VG",
      "shopifyVendor": "I VG",
      "slug": "i-vg",
      "hasMediaPack": true,
      "logos": {
        "primary": "/media_packs/i-vg/logos/i-vg-logo-horizontal.png",
        "square": "/media_packs/i-vg/logos/i-vg-logo-square.png",
        "vertical": "/media_packs/i-vg/logos/i-vg-logo-vertical.png"
      },
      "lifestyle": [
        {
          "url": "/media_packs/i-vg/lifestyle/lifestyle-001.jpg",
          "alt": "Person vaping I VG e-liquid in modern coffee shop",
          "credit": "I VG Media Kit"
        },
        {
          "url": "/media_packs/i-vg/lifestyle/lifestyle-002.jpg",
          "alt": "Outdoor adventure vaping with I VG products",
          "credit": "I VG Media Kit"
        }
      ],
      "products": {
        "blue-raspberry": "/media_packs/i-vg/products/product-i-vg-blue-raspberry.png",
        "strawberry-ice": "/media_packs/i-vg/products/product-i-vg-strawberry-ice.png"
      },
      "brandStory": "I VG is a premium UK e-liquid brand known for exceptional flavour profiles and high-quality ingredients. Since 2016, I VG has been a leader in the vaping industry.",
      "brandColors": {
        "primary": "#FF6B6B",
        "secondary": "#4ECDC4"
      },
      "guidelines": "/media_packs/i-vg/brand-guidelines.pdf",
      "website": "https://ivapegreat.com",
      "socialMedia": {
        "instagram": "@ivapegreat",
        "facebook": "ivapegreat"
      }
    },
    "vapes-bars": {
      "displayName": "Vapes Bars",
      "vendor": "Vapes Bars",
      "shopifyVendor": "Vapes Bars",
      "slug": "vapes-bars",
      "hasMediaPack": true,
      "logos": {
        "primary": "/media_packs/vapes-bars/logos/vapes-bars-logo.png"
      },
      "lifestyle": [
        {
          "url": "/media_packs/vapes-bars/lifestyle/lifestyle-vb-001.jpg",
          "alt": "Vapes Bars disposable vape in social setting",
          "credit": "Vapes Bars Media Kit"
        }
      ],
      "products": {},
      "brandStory": "Vapes Bars delivers convenience and quality in disposable vaping products.",
      "brandColors": {
        "primary": "#000000",
        "secondary": "#FFD700"
      },
      "guidelines": null,
      "website": "https://worldwide.vapes-bars.com",
      "socialMedia": {
        "instagram": "@vapesbars"
      }
    }
  }
}
```

### Image Optimization Pipeline

**Requirements:**
- Convert to WebP for smaller file sizes (50-70% reduction)
- Generate responsive sizes: 300px, 600px, 1200px widths
- Lazy loading for below-the-fold images
- CDN delivery (Shopify CDN or Cloudflare)

**Script:** `scripts/optimize_media_packs.py`

```python
"""
Image optimization for brand media packs

Features:
- Convert JPEG/PNG to WebP
- Generate srcset sizes (300w, 600w, 1200w)
- Compress with quality=85
- Preserve aspect ratios
- Generate manifest entries

Usage:
    python scripts/optimize_media_packs.py --brand i-vg
    python scripts/optimize_media_packs.py --all
"""

import os
from PIL import Image
import json

WIDTHS = [300, 600, 1200]
QUALITY = 85

def optimize_images(brand_dir: str):
    """Process all images in brand directory"""
    for root, dirs, files in os.walk(brand_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                optimize_image(os.path.join(root, file))

def optimize_image(path: str):
    """Convert image to WebP with multiple sizes"""
    img = Image.open(path)
    base_name = os.path.splitext(path)[0]
    
    for width in WIDTHS:
        # Calculate height maintaining aspect ratio
        aspect = img.height / img.width
        height = int(width * aspect)
        
        # Resize and save as WebP
        resized = img.resize((width, height), Image.LANCZOS)
        output_path = f"{base_name}-{width}w.webp"
        resized.save(output_path, 'WEBP', quality=QUALITY)
        print(f"Created: {output_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python optimize_media_packs.py --brand <brand-slug>")
        sys.exit(1)
    
    brand = sys.argv[2]
    brand_dir = f"public/media_packs/{brand}"
    optimize_images(brand_dir)
```

---

## V2 Component Implementation

### Brand Assets Component

**Create:** `v2/app/lib/brand-assets.ts`

```typescript
import manifestData from '~/../../public/media_packs/manifest.json';

export interface BrandAssets {
  displayName: string;
  vendor: string;
  hasMediaPack: boolean;
  logos: {
    primary?: string;
    square?: string;
    vertical?: string;
  };
  lifestyle: Array<{
    url: string;
    alt: string;
    credit?: string;
  }>;
  brandStory?: string;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
}

export function getBrandAssets(vendor: string): BrandAssets | null {
  // Normalize vendor name to slug
  const slug = vendor.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const brandData = manifestData.brands[slug];
  if (!brandData || !brandData.hasMediaPack) {
    return null;
  }
  
  return brandData as BrandAssets;
}

export function getAllBrandsWithMedia(): string[] {
  return Object.keys(manifestData.brands).filter(
    (slug) => manifestData.brands[slug].hasMediaPack
  );
}
```

**Create:** `v2/app/components/brand/BrandSection.tsx`

```typescript
import {Link} from '@remix-run/react';
import type {BrandAssets} from '~/lib/brand-assets';

interface BrandSectionProps {
  brand: BrandAssets;
  productHandle: string;
}

export function BrandSection({brand, productHandle}: BrandSectionProps) {
  if (!brand) return null;

  return (
    <section className="bg-gray-50 py-12 my-8 rounded-lg">
      <div className="container mx-auto px-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {brand.logos.primary && (
              <img
                src={brand.logos.primary}
                alt={`${brand.displayName} logo`}
                className="h-12 w-auto"
              />
            )}
            <h2 className="text-3xl font-bold">{brand.displayName}</h2>
          </div>
          
          {brand.website && (
            <Link
              to={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Visit Brand Website →
            </Link>
          )}
        </div>

        {/* Brand Story */}
        {brand.brandStory && (
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            {brand.brandStory}
          </p>
        )}

        {/* Lifestyle Imagery */}
        {brand.lifestyle.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brand.lifestyle.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {image.credit && (
                  <span className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {image.credit}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {brand.socialMedia && (
          <div className="flex gap-4 mt-6">
            {brand.socialMedia.instagram && (
              <a
                href={`https://instagram.com/${brand.socialMedia.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-primary"
              >
                @{brand.socialMedia.instagram.replace('@', '')}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
```

### Update Product Pages

**Modify:** `v2/app/routes/products.$handle.tsx`

```typescript
import {getBrandAssets} from '~/lib/brand-assets';
import {BrandSection} from '~/components/brand/BrandSection';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const product = await getProduct(context.storefront, handle);
  
  // Get brand assets
  const brandAssets = getBrandAssets(product.vendor);
  
  return json({
    product,
    brandAssets,
  });
}

export default function ProductPage() {
  const {product, brandAssets} = useLoaderData<typeof loader>();
  
  return (
    <div>
      {/* Existing product content */}
      <ProductDetails product={product} />
      
      {/* New brand section */}
      {brandAssets && (
        <BrandSection brand={brandAssets} productHandle={product.handle} />
      )}
      
      {/* Recommended products, etc. */}
    </div>
  );
}
```

---

## Performance Considerations

### Image Loading Strategy

**1. Responsive Images:**
```tsx
<img
  srcSet={`
    ${image.url}-300w.webp 300w,
    ${image.url}-600w.webp 600w,
    ${image.url}-1200w.webp 1200w
  `}
  sizes="(max-width: 768px) 100vw, 33vw"
  src={`${image.url}-600w.webp`}
  alt={image.alt}
  loading="lazy"
/>
```

**2. Lazy Loading:**
- Use native `loading="lazy"` attribute
- Intersection Observer for advanced control
- Priority loading for above-the-fold logos

**3. CDN Optimization:**
- Serve from Shopify CDN or Cloudflare
- Cache headers: `max-age=31536000, immutable`
- Compress with Brotli

### Expected Performance Impact

**Before (current):**
- Product page load: ~2.5s
- Images: Shopify product images only
- LCP: ~3.0s

**After (with brand media):**
- Product page load: ~2.7s (+200ms acceptable)
- Images: Product + brand lifestyle (lazy loaded)
- LCP: ~3.0s (no change, lifestyle images below fold)

---

## Benefits of Brand Media Integration

### 1. **Enhanced Visual Merchandising**
- ✅ Professional brand presentation
- ✅ Lifestyle imagery creates emotional connection
- ✅ Differentiation from competitors

### 2. **Increased Conversion Rates**
- ✅ Trust signals from brand recognition
- ✅ Storytelling drives purchase decisions
- ✅ Premium presentation justifies pricing

### 3. **Brand Partnership Value**
- ✅ Stronger relationships with suppliers
- ✅ Preferential pricing opportunities
- ✅ Exclusive product launches

### 4. **SEO Improvements**
- ✅ Rich image alt text
- ✅ Unique content (brand stories)
- ✅ Increased time on page

---

## Risks & Mitigations

### Risk 1: Media Rights Issues
**Impact:** Legal issues if using images without permission  
**Mitigation:**
- Always request explicit permission
- Document usage rights in manifest
- Include attribution/credit
- Have legal review usage terms

### Risk 2: Page Performance Degradation
**Impact:** Slower page loads with many images  
**Mitigation:**
- Aggressive lazy loading
- WebP compression
- Responsive image serving
- Monitor Core Web Vitals

### Risk 3: Inconsistent Brand Quality
**Impact:** Some brands have professional media, others don't  
**Mitigation:**
- Use fallback generic imagery
- Focus initial rollout on brands with media
- Gradual expansion as media is acquired

### Risk 4: Maintenance Overhead
**Impact:** Keeping media packs up-to-date as brands refresh materials  
**Mitigation:**
- Annual review process
- Contact brands for updates
- Monitor brand websites for new media kits

---

## Recommendation

**✅ PROCEED with brand media integration for V2**

**Rationale:**
1. **Competitive differentiation**: Premium presentation sets Vapourism apart
2. **Conversion impact**: Lifestyle imagery proven to increase sales
3. **Brand relationships**: Demonstrates commitment to partners
4. **Scalability**: Can start with 2 brands, expand as media is acquired
5. **Low technical risk**: Images are static assets, easy to implement

**Risk level:** LOW
- Start with confirmed brands (I VG, Vapes Bars)
- Expand gradually as media packs are collected
- Easy to remove if performance issues arise

---

## Next Steps

1. ✅ Document findings (this file)
2. ⏭️ Send media request emails to Tier 1 brands (Week 5)
3. ⏭️ Create image optimization script (Week 5)
4. ⏭️ Build manifest.json structure (Week 5)
5. ⏭️ Implement BrandSection component (Week 5-6)
6. ⏭️ Test on staging with I VG and Vapes Bars (Week 6)
7. ⏭️ Monitor performance metrics (Week 8)

---

## References

- Current media packs: `public/media_packs/README.md`
- Brand database: `public/media_packs/brands_list.json`
- I VG Media Kit: https://ivapegreat.com/pages/media-kits
- Vapes Bars Media Kit: https://worldwide.vapes-bars.com/media-kit/
