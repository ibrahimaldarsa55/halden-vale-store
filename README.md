# Halden & Vale — luxury storefront demo

An **Aurum North demo concept**: a fictional architectural home-goods brand built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, Framer Motion and Lucide React. No real orders or payments are processed.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (all product pages are statically prerendered)
```

## Structure

- `lib/products.ts`: catalog (10 products, 3 categories), promo codes, shipping threshold, pricing helpers
- `lib/types.ts`: shared types
- `components/store-provider.tsx`: cart, promo, drawer/checkout state and category filter (persisted to localStorage)
- `components/header.tsx`: sticky header, mega menu, live search, mobile menu, bag counter
- `components/cart-drawer.tsx`: slide-out bag with quantity, removal, free-shipping progress and promo
- `components/checkout.tsx`: 3-step demo checkout (information → delivery → payment) and confirmation
- `components/product-detail.tsx`: gallery, variant selectors, quantity, accordion, related products
- `app/products/[slug]/page.tsx`: product route (`generateStaticParams`)

Demo promo code: **AURUM10** (10% off). Free express shipping applies to orders over $250.
