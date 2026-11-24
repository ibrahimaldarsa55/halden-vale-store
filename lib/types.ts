export type CategoryId = "lighting" | "objects" | "furniture";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
}

export interface VariantOption {
  id: string;
  label: string;
  /** Added to the product's base price. */
  priceDelta?: number;
  /** CSS colour used for finish swatches. */
  swatch?: string;
}

export interface VariantGroup {
  id: "finish" | "size";
  label: string;
  options: VariantOption[];
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  price: number;
  tagline: string;
  description: string;
  images: [primary: string, alternate: string, ...rest: string[]];
  variants: VariantGroup[];
  details: {
    materials: string;
    dimensions: string;
    care: string;
  };
  leadTime: string;
  badge?: "New" | "Limited" | "Bestseller";
  /** Higher is more featured — used by the default sort. */
  featured: number;
  addedAt: string;
}

export type SelectedVariants = Partial<Record<VariantGroup["id"], string>>;

export interface CartLine {
  /** Unique key: slug + chosen variants. */
  key: string;
  slug: string;
  variants: SelectedVariants;
  quantity: number;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  product: string;
}
