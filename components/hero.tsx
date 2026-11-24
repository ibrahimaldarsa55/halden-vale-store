"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { unsplash } from "@/lib/format";
import { useCategoryNav } from "./use-category-nav";

const ease = [0.22, 1, 0.36, 1] as const;

const TRUST = [
  { icon: Truck, title: "Complimentary express shipping", detail: "On every order over $250" },
  { icon: RotateCcw, title: "30-day returns", detail: "Collected from your door, free of charge" },
  { icon: ShieldCheck, title: "Verified craftsmanship", detail: "Every piece signed & numbered by its maker" },
] as const;

export function Hero() {
  const goToCategory = useCategoryNav();

  return (
    <section aria-label="Introduction">
      <div className="relative flex h-[calc(100svh-6rem)] max-h-[940px] min-h-[600px] items-end overflow-hidden bg-ink text-alabaster">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        >
          <Image
            src={unsplash("1616627561839-074385245ff6", 2400)}
            alt="A calm bedroom with concrete walls, an oak bed and rust linen"
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-14 pt-32 sm:px-6 md:pb-20 lg:px-10 lg:pb-24">
          <motion.p
            className="eyebrow text-brass"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            The Autumn Collection · 2026
          </motion.p>
          <h1 className="mt-6 max-w-4xl font-serif text-[44px] font-light leading-[0.98] tracking-[-0.01em] sm:text-6xl md:text-7xl lg:text-[96px]">
            {["Objects built", "to be lived with —", "for generations."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 2 ? "italic text-brass" : ""}`}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.45 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease }}
          >
            <p className="max-w-md text-sm leading-relaxed text-alabaster/75 sm:text-base">
              Lighting, vessels and furniture made by hand in small European workshops — honest materials, architectural lines, and
              finishes that only improve with age.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-brass" onClick={() => goToCategory("all")}>
                Shop the collection <ArrowRight className="size-4" />
              </button>
              <a href="#story" className="btn-ghost text-alabaster hover:bg-alabaster hover:text-ink">
                Our atelier
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-b border-line bg-alabaster">
        <ul className="mx-auto grid max-w-[1440px] divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
          {TRUST.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-4 py-5 md:justify-center md:px-6 md:py-7">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brass/50">
                <Icon className="size-[18px] text-brass-dark" strokeWidth={1.3} />
              </span>
              <span>
                <span className="block text-[12px] font-medium uppercase tracking-[0.16em]">{title}</span>
                <span className="block text-xs text-stone">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
