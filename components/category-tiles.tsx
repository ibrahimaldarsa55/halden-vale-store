"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { Reveal } from "./reveal";
import { useCategoryNav } from "./use-category-nav";

export function CategoryTiles() {
  const goToCategory = useCategoryNav();

  return (
    <section aria-label="Shop by category" className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-6 md:pt-28 lg:px-10">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-brass-dark">Three disciplines</p>
        <p className="mt-5 font-serif text-3xl font-light leading-snug md:text-[44px] md:leading-[1.15]">
          We make only what we would keep ourselves — <span className="italic">light to gather around,</span> vessels to hold, and
          furniture to grow old with.
        </p>
      </Reveal>
      <ul className="mt-14 grid gap-4 sm:grid-cols-3 md:gap-6">
        {CATEGORIES.map((c, i) => (
          <li key={c.id}>
            <Reveal delay={i * 0.1}>
              <button
                type="button"
                onClick={() => goToCategory(c.id)}
                className="group relative block aspect-[3/4] w-full overflow-hidden bg-bone text-left sm:aspect-[3/4.4]"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                <span className="absolute inset-x-5 bottom-5 flex items-end justify-between text-alabaster md:inset-x-7 md:bottom-7">
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-alabaster/70">
                      {PRODUCTS.filter((p) => p.category === c.id).length} pieces
                    </span>
                    <span className="mt-1 block font-serif text-3xl md:text-4xl">{c.name}</span>
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full border border-alabaster/40 transition-colors duration-500 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </span>
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
