"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronRight, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { defaultVariants, getCategory, unitPrice } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product, SelectedVariants } from "@/lib/types";
import { QuantityControl } from "./cart-drawer";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import { Stars } from "./reviews";
import { useStore } from "./store-provider";
import { useCategoryNav } from "./use-category-nav";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addItem, setCartOpen } = useStore();
  const goToCategory = useCategoryNav();
  const [variants, setVariants] = useState<SelectedVariants>(() => defaultVariants(product));
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const category = getCategory(product.category);
  const price = unitPrice(product, variants);

  const add = () => {
    addItem(product.slug, variants, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setCartOpen(true);
    }, 650);
  };

  const accordion = [
    { id: "materials", title: "Materials & dimensions", body: `${product.details.materials}\n\n${product.details.dimensions}` },
    {
      id: "shipping",
      title: "Shipping & returns",
      body: `${product.leadTime}. Complimentary express shipping on orders over $250; white-glove delivery available at checkout for larger pieces.\n\nReturns are accepted within 30 days of delivery in original condition — we'll collect from your door at no cost.`,
    },
    { id: "care", title: "Care", body: product.details.care },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-stone">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <button type="button" onClick={() => goToCategory(product.category)} className="uppercase hover:text-ink">
            {category.name}
          </button>
          <ChevronRight className="size-3" />
          <span className="truncate text-ink" aria-current="page">
            {product.name}
          </span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pb-28">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product images">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={imageIndex === i}
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setImageIndex(i)}
                  className={`relative aspect-[4/5] w-20 overflow-hidden bg-bone transition-opacity md:w-24 ${
                    imageIndex === i ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-alabaster" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-bone">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={imageIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <Image
                    src={product.images[imageIndex]}
                    alt={`${product.name} — view ${imageIndex + 1}`}
                    fill
                    preload={imageIndex === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {product.badge && (
                <span className="absolute left-4 top-4 bg-alabaster/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-brass-dark">{category.name}</p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            <p className="mt-2 text-sm text-stone">{product.tagline}</p>
            <div className="mt-5 flex items-center justify-between">
              <motion.p key={price} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-2xl tabular-nums">
                {formatPrice(price)}
              </motion.p>
              <Link href="/#reviews" className="flex items-center gap-2 text-xs text-stone hover:text-ink">
                <Stars rating={5} /> Sample reviews
              </Link>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink/75">{product.description}</p>

            <div className="mt-8 space-y-7 border-t border-line pt-7">
              {product.variants.map((group) => {
                const selected = group.options.find((o) => o.id === variants[group.id]);
                const isSwatch = group.options.every((o) => o.swatch);
                return (
                  <fieldset key={group.id}>
                    <legend className="mb-3 flex w-full justify-between text-xs">
                      <span className="uppercase tracking-[0.16em] text-stone">{group.label}</span>
                      <span>{selected?.label}</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((o) => {
                        const active = variants[group.id] === o.id;
                        return isSwatch ? (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setVariants((v) => ({ ...v, [group.id]: o.id }))}
                            aria-pressed={active}
                            aria-label={`${o.label}${o.priceDelta ? `, +${formatPrice(o.priceDelta)}` : ""}`}
                            title={o.label}
                            className={`relative flex size-11 items-center justify-center rounded-full transition-shadow ${
                              active ? "ring-1 ring-ink ring-offset-[3px] ring-offset-alabaster" : "hover:ring-1 hover:ring-stone hover:ring-offset-[3px] hover:ring-offset-alabaster"
                            }`}
                          >
                            <span className="size-9 rounded-full border border-ink/10" style={{ background: o.swatch }} />
                          </button>
                        ) : (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => setVariants((v) => ({ ...v, [group.id]: o.id }))}
                            aria-pressed={active}
                            className={`min-w-[88px] border px-4 py-3 text-xs transition-colors ${
                              active ? "border-ink bg-ink text-alabaster" : "border-line hover:border-ink"
                            }`}
                          >
                            {o.label}
                            {o.priceDelta ? <span className={active ? "text-alabaster/60" : "text-stone"}> +{formatPrice(o.priceDelta)}</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <QuantityControl value={quantity} onChange={setQuantity} label={product.name} size="lg" />
              <motion.button
                type="button"
                onClick={add}
                whileTap={{ scale: 0.98 }}
                className="btn-primary h-14 flex-1 overflow-hidden px-4"
                disabled={justAdded}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {justAdded ? (
                    <motion.span key="added" className="flex items-center gap-2" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                      <Check className="size-4" /> Added
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                      <ShoppingBag className="size-4" strokeWidth={1.5} /> Add to bag · {formatPrice(price * quantity)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <p className="mt-3 text-xs text-stone">{product.leadTime}</p>

            <ul className="mt-8 grid grid-cols-3 gap-2 border-y border-line py-5 text-center text-[11px] leading-tight text-stone">
              <li className="flex flex-col items-center gap-2">
                <Truck className="size-4 text-brass-dark" strokeWidth={1.4} /> Express shipping over $250
              </li>
              <li className="flex flex-col items-center gap-2">
                <RotateCcw className="size-4 text-brass-dark" strokeWidth={1.4} /> 30-day returns
              </li>
              <li className="flex flex-col items-center gap-2">
                <ShieldCheck className="size-4 text-brass-dark" strokeWidth={1.4} /> Signed by its maker
              </li>
            </ul>

            <Accordion items={accordion} />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bone/50">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 md:py-24 lg:px-10">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl md:text-5xl">Complete the room</h2>
            <button type="button" onClick={() => goToCategory("all")} className="eyebrow link-underline shrink-0">
              View all
            </button>
          </Reveal>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 0.08}>
                  <ProductCard product={p} index={i} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Accordion({ items }: { items: { id: string; title: string; body: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-line border-b border-line">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between py-5 text-left text-[12px] font-medium uppercase tracking-[0.16em]"
                aria-expanded={isOpen}
                aria-controls={`acc-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
              >
                {item.title}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.35, ease }}>
                  <ChevronDown className="size-4" strokeWidth={1.4} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-6 text-sm leading-relaxed text-ink/70">
                    {item.body.split("\n\n").map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
