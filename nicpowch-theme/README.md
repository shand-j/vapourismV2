# NicPowch Shopify Theme

A custom Shopify theme for NicPowch - UK's specialist nicotine pouch retailer.

## 🆕 Recent Updates (v1.1.0)

**Google Shopping & SEO Optimization**
- ✅ Enhanced product meta tags for Google Merchant Center integration
- ✅ Improved structured data (JSON-LD) with age restrictions and GTIN support
- ✅ Added comprehensive Google Shopping documentation
- ✅ Fixed offers page schema to use modern blocks system

See [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) for detailed changes.

## Overview

NicPowch is a dedicated e-commerce storefront for nicotine pouches, built as a native Shopify theme using Liquid templates. This is a separate brand from Vapourism, focused exclusively on tobacco-free nicotine pouches.

## Brand Identity

- **Colors**: Teal (#0d9488) to Emerald (#10b981) gradient
- **Target Market**: UK adults 18+
- **Product Focus**: Nicotine pouches and snus only
- **Featured Brands**: Velo, Nordic Spirit, On!, Killa, Pablo, Loop

## Theme Structure

```
nicpowch-theme/
├── assets/              # CSS, JS, images
│   ├── base.css         # Foundation styles
│   ├── component-card.css # Product card styles
│   └── theme.js         # Main JavaScript
├── config/              # Theme settings
│   ├── settings_schema.json  # Theme customizer schema
│   └── settings_data.json    # Default settings
├── layout/              # Base layouts
│   └── theme.liquid     # Main layout wrapper
├── locales/             # i18n translations
│   └── en.default.json  # English (default)
├── sections/            # Page sections
│   ├── header.liquid    # Site header
│   ├── footer.liquid    # Site footer
│   ├── hero.liquid      # Hero banner
│   └── featured-products.liquid # Product grid
├── snippets/            # Reusable Liquid code
│   ├── product-card.liquid
│   ├── meta-tags.liquid
│   ├── age-verification-modal.liquid
│   └── icon-*.liquid    # SVG icons
└── templates/           # Page templates (JSON)
    ├── index.json       # Homepage
    ├── product.json     # Product page
    ├── collection.json  # Collection page
    └── cart.json        # Cart page
```

## Development

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- A Shopify development store

### Getting Started

1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Navigate to theme directory:
   ```bash
   cd nicpowch-theme
   ```

3. Connect to your store and start development:
   ```bash
   shopify theme dev --store=your-store.myshopify.com
   ```

### Commands

```bash
# Start development server
shopify theme dev --store=nicpowch.myshopify.com

# Push theme to Shopify
shopify theme push

# Pull theme from Shopify
shopify theme pull

# Check theme for issues
shopify theme check

# List themes on store
shopify theme list
```

## Features

### SEO Optimized ✨
- Meta tags snippet with Open Graph and Twitter Cards
- JSON-LD structured data for products (Google Shopping compatible)
- Semantic HTML5 structure
- Canonical URLs
- **NEW**: Enhanced product metadata for Google Merchant Center
- **NEW**: Age-restricted product markup (18+)
- **NEW**: GTIN/barcode support for better product identification

**[→ See Google Shopping & SEO Guide](./docs/GOOGLE_SHOPPING_SEO.md)**

### Age Verification
- Required modal for all visitors (UK regulation compliance)
- Configurable text and redirect URL
- Local storage for verified users (30-day expiry)

### Flexible Offers Page 🆕
- Block-based offer management in theme customizer
- Auto-detection of collections starting with "OFFER:"
- Unlimited offer collections with drag-and-drop ordering
- Individual offer customization

### Accessibility
- Skip to content link
- ARIA labels throughout
- Keyboard navigation support
- Color contrast compliant

### Performance
- Minimal JavaScript
- Critical CSS inlined
- Lazy loading images
- System font stack option

## Documentation

- **[Implementation Notes](./IMPLEMENTATION_NOTES.md)** - Detailed changes and version history
- **[Google Shopping & SEO Guide](./docs/GOOGLE_SHOPPING_SEO.md)** - Complete SEO optimization guide
- **[Testing Checklist](./TESTING_CHECKLIST.md)** - Comprehensive testing procedures

## Customization

### Theme Settings

The theme is fully customizable through the Shopify theme editor:

1. **Colors**: Primary, secondary, accent, background, text
2. **Typography**: Heading and body fonts with size controls
3. **Layout**: Page width, section spacing, border radius
4. **Age Verification**: Enable/disable, custom messaging
5. **Social Media**: Links to social profiles

### Adding Sections

Create new sections in `/sections/` using this template:

```liquid
{%- comment -%}
  Section Name
  Description
{%- endcomment -%}

{%- style -%}
  /* Section-specific styles */
{%- endstyle -%}

<section class="section-name">
  <!-- Section content -->
</section>

{% schema %}
{
  "name": "Section Name",
  "settings": [],
  "presets": [{ "name": "Section Name" }]
}
{% endschema %}
```

## Differences from Vapourism

| Aspect | Vapourism | NicPowch |
|--------|-----------|----------|
| Technology | Hydrogen (React/Remix) | Shopify Theme (Liquid) |
| Deployment | Oxygen (Cloudflare Workers) | Shopify CDN |
| Products | Full vape catalog | Nicotine pouches only |
| Customization | Code-first | Theme editor-first |

## Resources

- [Shopify Theme Documentation](https://shopify.dev/docs/themes)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Dawn Theme (reference)](https://github.com/Shopify/dawn)
- [Theme Check](https://shopify.dev/docs/themes/tools/theme-check)

## License

Proprietary - All rights reserved.
