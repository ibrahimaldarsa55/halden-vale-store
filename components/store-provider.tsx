"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING,
  getProduct,
  lineKey,
  unitPrice,
} from "@/lib/products";
import type { CartLine, CategoryId, Product, SelectedVariants } from "@/lib/types";

const STORAGE_KEY = "hv-demo-cart-v1";

export interface PricedLine extends CartLine {
  product: Product;
  unitPrice: number;
  lineTotal: number;
}

interface CartState {
  lines: CartLine[];
  promoCode: string | null;
}

type CartAction =
  | { type: "hydrate"; lines: CartLine[]; promoCode: string | null }
  | { type: "promo"; promoCode: string | null }
  | { type: "add"; slug: string; variants: SelectedVariants; quantity: number }
  | { type: "set-quantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

const MAX_QTY = 10;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, promoCode: action.promoCode };
    case "promo":
      return { ...state, promoCode: action.promoCode };
    case "clear":
      return { lines: [], promoCode: null };
    default:
      return { ...state, lines: linesReducer(state.lines, action) };
  }
}

function linesReducer(state: CartLine[], action: Exclude<CartAction, { type: "hydrate" | "promo" | "clear" }>): CartLine[] {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.slug, action.variants);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.quantity) } : l,
        );
      }
      return [
        ...state,
        { key, slug: action.slug, variants: action.variants, quantity: Math.min(MAX_QTY, action.quantity) },
      ];
    }
    case "set-quantity":
      if (action.quantity <= 0) return state.filter((l) => l.key !== action.key);
      return state.map((l) =>
        l.key === action.key ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l,
      );
    case "remove":
      return state.filter((l) => l.key !== action.key);
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.slug === "string" &&
    typeof v.quantity === "number" &&
    typeof v.variants === "object" &&
    getProduct(v.slug) !== undefined
  );
}

export interface PromoState {
  code: string;
  rate: number;
  label: string;
}

interface StoreContextValue {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  promo: PromoState | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  addItem: (slug: string, variants: SelectedVariants, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  category: CategoryId | "all";
  setCategory: (category: CategoryId | "all") => void;
  lastAdded: { name: string; at: number } | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [{ lines: rawLines, promoCode }, dispatch] = useReducer(cartReducer, { lines: [], promoCode: null });
  const promo = useMemo<PromoState | null>(
    () => (promoCode && PROMO_CODES[promoCode] ? { code: promoCode, ...PROMO_CODES[promoCode] } : null),
    [promoCode],
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [lastAdded, setLastAdded] = useState<StoreContextValue["lastAdded"]>(null);
  const hydrated = useRef(false);

  // Restore the bag after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          const { lines, promo: savedPromo } = parsed as { lines?: unknown; promo?: unknown };
          dispatch({
            type: "hydrate",
            lines: Array.isArray(lines) ? lines.filter(isCartLine) : [],
            promoCode: typeof savedPromo === "string" && PROMO_CODES[savedPromo] ? savedPromo : null,
          });
        }
      }
    } catch {
      // Storage unavailable (private mode etc.) — start with an empty bag.
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: rawLines, promo: promoCode }));
    } catch {
      // ignore
    }
  }, [rawLines, promoCode]);

  const lines = useMemo<PricedLine[]>(
    () =>
      rawLines.flatMap((line) => {
        const product = getProduct(line.slug);
        if (!product) return [];
        const price = unitPrice(product, line.variants);
        return [{ ...line, product, unitPrice: price, lineTotal: price * line.quantity }];
      }),
    [rawLines],
  );

  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const discount = promo ? Math.round(subtotal * promo.rate * 100) / 100 : 0;
  const qualifies = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = lines.length === 0 || qualifies ? 0 : STANDARD_SHIPPING;
  const total = Math.max(0, subtotal - discount + shipping);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const addItem = useCallback((slug: string, variants: SelectedVariants, quantity = 1) => {
    dispatch({ type: "add", slug, variants, quantity });
    const product = getProduct(slug);
    if (product) setLastAdded({ name: product.name, at: Date.now() });
  }, []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const match = PROMO_CODES[normalized];
    if (!match) return false;
    dispatch({ type: "promo", promoCode: normalized });
    return true;
  }, []);

  const value: StoreContextValue = {
    lines,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    freeShippingRemaining,
    promo,
    applyPromo,
    removePromo: () => dispatch({ type: "promo", promoCode: null }),
    addItem,
    setQuantity: (key, quantity) => dispatch({ type: "set-quantity", key, quantity }),
    removeItem: (key) => dispatch({ type: "remove", key }),
    clearCart: () => dispatch({ type: "clear" }),
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
    category,
    setCategory,
    lastAdded,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
