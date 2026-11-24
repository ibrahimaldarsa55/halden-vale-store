import { Info, Star } from "lucide-react";
import { REVIEWS } from "@/lib/reviews";
import { Reveal } from "./reveal";

export function Stars({ rating, className = "size-3.5" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${className} ${i < rating ? "fill-brass text-brass" : "text-line"}`}
          strokeWidth={1.2}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function Reviews() {
  const average = REVIEWS.reduce((n, r) => n + r.rating, 0) / REVIEWS.length;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-brass-dark">In their homes</p>
          <h2 id="reviews-title" className="mt-4 font-serif text-4xl md:text-6xl">
            Kind words
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-serif text-5xl">{average.toFixed(1)}</span>
          <span>
            <Stars rating={Math.round(average)} className="size-4" />
            <span className="mt-1 block text-xs text-stone">Average of {REVIEWS.length} sample reviews</span>
          </span>
        </div>
      </Reveal>

      <p className="mt-8 inline-flex items-center gap-2 border border-dashed border-brass/60 bg-brass/5 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-brass-dark">
        <Info className="size-3.5" /> Demo placeholder data — not real customer reviews
      </p>

      <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r, i) => (
          <li key={r.id} className="bg-alabaster">
            <Reveal delay={i * 0.08} className="flex h-full flex-col p-6 md:p-8">
              <Stars rating={r.rating} />
              <p className="mt-6 font-serif text-2xl leading-snug">“{r.title}”</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">{r.body}</p>
              <div className="mt-8 border-t border-line pt-4 text-xs">
                <p className="font-medium">{r.author}</p>
                <p className="mt-0.5 text-stone">
                  {r.location} · <span className="text-brass-dark">{r.product}</span>
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
