"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BRAND, CATEGORIES, PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { CategoryId } from "@/lib/types";
import { useStore } from "./store-provider";
import { useCategoryNav } from "./use-category-nav";
import { useOverlay } from "./use-overlay";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { itemCount, setCartOpen, lastAdded } = useStore();
  const goToCategory = useCategoryNav();
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  const pickCategory = (id: CategoryId | "all") => {
    setMegaOpen(false);
    setMobileOpen(false);
    goToCategory(id);
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useOverlay(mobileOpen, closeMobile);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || megaOpen || searchOpen
          ? "border-line bg-alabaster/90 backdrop-blur-xl"
          : "border-transparent bg-alabaster"
      }`}
      onMouseLeave={closeMega}
    >
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:h-20 lg:px-10">
        {/* Left: nav */}
        <nav aria-label="Primary" className="flex items-center gap-1">
          <button
            type="button"
            className="-ml-2 p-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.4} />
          </button>
          <ul className="hidden items-center gap-8 lg:flex">
            <li onMouseEnter={openMega}>
              <button
                type="button"
                className="eyebrow link-underline py-2"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
                onFocus={openMega}
              >
                Shop
              </button>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id} onMouseEnter={closeMega}>
                <button type="button" className="eyebrow link-underline py-2" onClick={() => pickCategory(c.id)}>
                  {c.name}
                </button>
              </li>
            ))}
            <li onMouseEnter={closeMega}>
              <Link href="/#story" className="eyebrow link-underline py-2">
                Atelier
              </Link>
            </li>
          </ul>
        </nav>

        {/* Centre: wordmark */}
        <Link href="/" className="group flex flex-col items-center leading-none" aria-label={`${BRAND.name} home`}>
          <span className="font-serif text-2xl tracking-[0.08em] md:text-[28px]">
            Halden <span className="italic text-brass-dark transition-colors group-hover:text-brass">&amp;</span> Vale
          </span>
          <span className="mt-1 hidden text-[9px] uppercase tracking-[0.42em] text-stone sm:block">Est. Porto · 2011</span>
        </Link>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              setMegaOpen(false);
            }}
            className="flex items-center gap-2 p-2 sm:border sm:border-line sm:px-4 sm:py-2 sm:transition-colors sm:hover:border-ink"
            aria-label="Search the collection"
            aria-expanded={searchOpen}
          >
            <Search className="size-[18px]" strokeWidth={1.4} />
            <span className="hidden text-xs text-stone md:inline">Search the collection</span>
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative -mr-2 p-2"
            aria-label={`Open shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          >
            <motion.span
              key={lastAdded?.at ?? 0}
              initial={lastAdded ? { scale: 0.7, rotate: -8 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="block"
            >
              <ShoppingBag className="size-5" strokeWidth={1.4} />
            </motion.span>
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute right-0 top-0 flex size-[18px] items-center justify-center rounded-full bg-brass text-[10px] font-semibold tabular-nums text-ink"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mega menu (desktop) */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            id="mega-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
            onMouseEnter={openMega}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-alabaster lg:block"
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-[repeat(3,1fr)_1.3fr] gap-10 px-10 py-10">
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <button
                    type="button"
                    onClick={() => pickCategory(c.id)}
                    className="group flex items-center gap-2 font-serif text-2xl"
                  >
                    {c.name}
                    <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                  <p className="mt-1 text-xs text-stone">{c.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {PRODUCTS.filter((p) => p.category === c.id).map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          onNavigate={() => setMegaOpen(false)}
                          className="text-sm text-ink/80 transition-colors hover:text-brass-dark"
                        >
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/products/vale-lounge-chair"
                onNavigate={() => setMegaOpen(false)}
                className="group relative block aspect-[4/3] overflow-hidden bg-bone"
              >
                <Image
                  src={CATEGORIES[2].image}
                  alt="Vale Lounge Chair in dove bouclé"
                  fill
                  sizes="30vw"
                  className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0" />
                <div className="absolute bottom-5 left-5 text-alabaster">
                  <p className="eyebrow text-brass">New this season</p>
                  <p className="mt-1 font-serif text-2xl">The Vale Lounge Chair</p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col bg-alabaster lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-4">
                <span className="font-serif text-xl">Halden &amp; Vale</span>
                <button type="button" className="-mr-2 p-2" onClick={closeMobile} aria-label="Close menu">
                  <X className="size-5" strokeWidth={1.4} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile">
                <button type="button" onClick={() => pickCategory("all")} className="eyebrow mb-6 text-stone">
                  Shop all
                </button>
                <ul className="space-y-6">
                  {CATEGORIES.map((c, i) => (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease }}
                    >
                      <button
                        type="button"
                        onClick={() => pickCategory(c.id)}
                        className="flex w-full items-center gap-4 text-left"
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden bg-bone">
                          <Image src={c.image} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span>
                          <span className="block font-serif text-2xl">{c.name}</span>
                          <span className="block text-xs text-stone">{c.tagline}</span>
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-10 border-t border-line pt-6">
                  <Link href="/#story" onNavigate={closeMobile} className="eyebrow block py-2">
                    The Atelier
                  </Link>
                  <Link href="/#reviews" onNavigate={closeMobile} className="eyebrow block py-2">
                    Reviews
                  </Link>
                </div>
              </nav>
              <p className="border-t border-line px-4 py-4 text-[11px] text-stone">
                Complimentary express shipping over $250 · 30-day returns
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter((p) =>
      [p.name, p.tagline, p.category, p.details.materials].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  const close = () => {
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
          className="absolute inset-x-0 top-full border-b border-line bg-alabaster shadow-[0_30px_60px_-30px_rgba(11,11,11,0.25)]"
        >
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="flex items-center gap-3 border-b border-ink pb-3">
              <Search className="size-5 shrink-0" strokeWidth={1.4} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lighting, ceramics, oak…"
                aria-label="Search products"
                className="w-full bg-transparent font-serif text-2xl placeholder:text-stone/60 focus:outline-none md:text-3xl"
              />
              <button type="button" onClick={close} className="p-1" aria-label="Close search">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <p className="eyebrow mt-5 text-stone">
              {query.trim() ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Popular now"}
            </p>
            {results.length === 0 ? (
              <p className="mt-4 text-sm text-stone">No pieces match “{query}”. Try “brass” or “oak”.</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {results.slice(0, 5).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} onNavigate={close} className="group block">
                      <span className="relative block aspect-square overflow-hidden bg-bone">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 18vw, 45vw"
                          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                        />
                      </span>
                      <span className="mt-2 block text-sm">{p.name}</span>
                      <span className="block text-xs text-stone">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
