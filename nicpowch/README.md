# NicPowch - Premium Nicotine Pouches UK

A Shopify Hydrogen storefront specializing in nicotine pouches. Built on the same Shopify backend as Vapourism, but with a focused brand identity for nicotine pouch products.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Shopify Hydrogen CLI

### Installation

```bash
cd nicpowch
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deploying to Shopify Oxygen

### Setup

1. Link to your Shopify store:
```bash
npx shopify hydrogen link
```

2. Deploy to preview:
```bash
npx shopify hydrogen deploy
```

### Environment Variables

Required environment variables (configured in Shopify admin):

- `SESSION_SECRET` - Secret for session encryption
- `PUBLIC_STOREFRONT_API_TOKEN` - Shopify Storefront API token
- `PRIVATE_STOREFRONT_API_TOKEN` - Private API token (for server-side queries)
- `PUBLIC_STORE_DOMAIN` - Your Shopify store domain (e.g., `b2xxju-ui.myshopify.com`)

Optional:
- `PRODUCTION_DOMAIN` - Production domain (e.g., `https://www.nicpowch.co.uk`)
- `GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID

## Product Filtering

NicPowch automatically filters products to only show those tagged with:
- `nicotine_pouches`
- `snus`

All search and navigation links include these tag filters to ensure customers only see nicotine pouch products.

## Brand Configuration

Brand settings are centralized in `app/brand-config.ts`:

- Brand colors (teal/emerald theme)
- Featured brands (Velo, Zyn, Nordic Spirit, etc.)
- Free shipping threshold
- SEO keywords
- Social media handles

## Directory Structure

```
nicpowch/
├── app/
│   ├── brand-config.ts      # Brand configuration
│   ├── root.tsx             # Root layout with header/footer
│   ├── entry.client.tsx     # Client entry point
│   ├── entry.server.tsx     # Server entry point
│   ├── routes/
│   │   └── _index.tsx       # Homepage
│   ├── lib/
│   │   ├── context.ts       # Hydrogen context setup
│   │   ├── session.ts       # Session management
│   │   ├── fragments.ts     # GraphQL fragments
│   │   ├── i18n.ts          # Internationalization
│   │   └── menu-config.ts   # Navigation menu config
│   ├── components/
│   │   └── navigation/
│   │       └── NicPowchMegaMenu.tsx  # Navigation components
│   └── styles/
│       └── globals.css      # Global styles
├── public/                  # Static assets
├── server.ts               # Oxygen worker entry
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## Differences from Vapourism

| Aspect | Vapourism | NicPowch |
|--------|-----------|----------|
| Products | Full vape catalog | Nicotine pouches only |
| Colors | Purple/blue gradient | Teal/emerald gradient |
| Navigation | 7 categories | 4 categories (Strength, Flavour, Brand, Bundles) |
| SEO Focus | Vaping, e-liquids | Pouches, snus, tobacco-free |

## License

Private - All rights reserved.
