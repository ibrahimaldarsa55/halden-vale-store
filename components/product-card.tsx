"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { defaultVariants } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useStore } from "./store-provider";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useStore();
  const [added, setAdded] = useState(false);
  const hasRange = product.variants.some((g) => g.options.some((o) => o.priceDelta));
  const finishes = product.variants.find((g) => g.id === "finish")?.options.filter((o) => o.swatch) ?? [];

  const quickAdd = () => {
    addItem(product.slug, defaultVariants(product), 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="absolute inset-0 block">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
            loading={index < 3 ? "eager" : "lazy"}
            className="object-cover transition-[transform,opacity] duration-[1.1s] ease-luxe group-hover:scale-[1.04] [@media(hover:hover)]:group-hover:opacity-0"
          />
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="hidden scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-[1.1s] ease-luxe group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)]:block"
          />
        </Link>
        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-alabaster/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]">
            {product.badge}
          </span>
        )}
        <motion.button
          type="button"
          onClick={quickAdd}
          whileTap={{ scale: 0.96 }}
          className="absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 bg-alabaster/95 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink opacity-0 backdrop-blur transition-all duration-500 ease-luxe hover:bg-ink hover:text-alabaster group-hover:translate-y-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:hover)]:flex [@media(hover:hover)]:translate-y-2"
          aria-label={`Quick add ${product.name} to bag`}
        >
          {added ? (
            <>
              <Check className="size-3.5" /> Added to bag
            </>
          ) : (
            <>
              <Plus className="size-3.5" /> Quick add
            </>
          )}
        </motion.button>
        {/* Touch devices: compact add button */}
        <button
          type="button"
          onClick={quickAdd}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-alabaster/95 shadow-sm [@media(hover:hover)]:hidden"
          aria-label={`Add ${product.name} to bag`}
        >
          {added ? <Check className="size-4 text-brass-dark" /> : <Plus className="size-4" />}
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-tight">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-brass-dark">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-stone">{product.tagline}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">
          {hasRange && <span className="mr-1 text-xs text-stone">from</span>}
          {formatPrice(product.price)}
        </p>
      </div>
      {finishes.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5" aria-label={`${finishes.length} finishes available`}>
          {finishes.map((o) => (
            <span
              key={o.id}
              title={o.label}
              className="size-3 rounded-full ring-1 ring-ink/10 ring-offset-1 ring-offset-alabaster"
              style={{ background: o.swatch }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
