"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { unsplash } from "@/lib/format";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, sortProducts } from "@/lib/products";
import type { CategoryId, SortKey } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import { useStore } from "./store-provider";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const TABS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
];

export function Catalog() {
  const { category, setCategory } = useStore();
  const [sort, setSort] = useState<SortKey>("featured");

  const products = useMemo(() => {
    const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    return sortProducts(filtered, sort);
  }, [category, sort]);

  const active = CATEGORIES.find((c) => c.id === category);

  return (
    <section id="shop" aria-labelledby="shop-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-brass-dark">The Collection</p>
          <h2 id="shop-title" className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            {active ? active.name : "Curated pieces"}
          </h2>
          <p className="mt-3 max-w-md text-sm text-stone">
            {active ? active.tagline : "Ten signature pieces across lighting, objects and furniture — each made to order or in small batches."}
          </p>
        </div>
      </Reveal>

      <div className="sticky top-16 z-20 -mx-4 mt-10 border-y border-line bg-alabaster/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 md:top-20 lg:mx-0 lg:px-0">
        <div className="flex items-center justify-between gap-4">
          <div role="tablist" aria-label="Filter by category" className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8">
            {TABS.map((tab) => {
              const count = tab.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === tab.id).length;
              const selected = category === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setCategory(tab.id)}
                  className={`relative shrink-0 py-4 text-[12px] uppercase tracking-[0.18em] transition-colors ${
                    selected ? "text-ink" : "text-stone hover:text-ink"
                  }`}
                >
                  {tab.label}
                  <sup className="ml-1 text-[9px] tabular-nums">{count}</sup>
                  {selected && <motion.span layoutId="tab-underline" className="absolute inset-x-0 bottom-0 h-px bg-ink" />}
                </button>
              );
            })}
          </div>
          <label className="relative flex shrink-0 items-center gap-2 text-xs">
            <span className="hidden text-stone sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer appearance-none bg-transparent py-4 pr-6 text-[12px] uppercase tracking-[0.12em] focus:outline-none"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 size-4" strokeWidth={1.4} />
          </label>
        </div>
      </div>

      <motion.ul layout className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-14 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {products.flatMap((product, i) => {
            const card = (
            <motion.li
              key={product.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} index={i} />
            </motion.li>
            );
            return category === "all" && i === 6 ? [<EditorialTile key="editorial" />, card] : [card];
          })}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

function EditorialTile() {
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[420px] overflow-hidden bg-ink text-alabaster sm:col-span-2"
    >
      <Image
        src={unsplash("1600210492486-724fe5c67fb0", 1800)}
        alt="An open-plan living space with oak panelling and low furniture"
        fill
        sizes="(min-width: 1280px) 64vw, (min-width: 640px) 92vw, 100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div className="relative flex h-full max-w-md flex-col justify-end p-8 md:p-12">
        <p className="eyebrow text-brass">Trade & interiors</p>
        <p className="mt-4 font-serif text-3xl font-light leading-tight md:text-5xl">
          Furnishing a whole home? <span className="italic">Let us help.</span>
        </p>
        <p className="mt-4 text-sm text-alabaster/70">
          Complimentary design consultations, bespoke finishes and trade pricing for architects and interior designers.
        </p>
        <a href="#story" className="eyebrow mt-8 inline-flex items-center gap-2 text-brass">
          Discover the atelier <ArrowRight className="size-4" />
        </a>
      </div>
    </motion.li>
  );
}
