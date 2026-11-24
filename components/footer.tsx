"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { CATEGORIES } from "@/lib/products";
import { useCategoryNav } from "./use-category-nav";

export function Footer() {
  const goToCategory = useCategoryNav();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  };

  return (
    <footer className="bg-ink text-alabaster">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-b border-alabaster/10 py-16 md:grid-cols-2 md:py-20 lg:gap-20">
          <div>
            <p className="eyebrow text-brass">The Journal</p>
            <h2 className="mt-4 font-serif text-3xl font-light leading-tight md:text-5xl">
              Letters from the workshop, <span className="italic">four times a year.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-alabaster/60">
              New collections, maker profiles and first access to limited runs. No noise — unsubscribe any time.
            </p>
          </div>
          <div className="flex flex-col justify-end">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 border-b border-brass py-4 text-sm"
                >
                  <Check className="size-4 text-brass" /> Thank you — you&apos;re on the list (demo, no email is stored).
                </motion.p>
              ) : (
                <motion.form key="form" onSubmit={subscribe} noValidate exit={{ opacity: 0 }}>
                  <label htmlFor="newsletter" className="sr-only">
                    Email address
                  </label>
                  <div className="flex items-center gap-3 border-b border-alabaster/30 transition-colors focus-within:border-brass">
                    <Mail className="size-4 shrink-0 text-alabaster/50" strokeWidth={1.4} />
                    <input
                      id="newsletter"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="Your email address"
                      className="w-full bg-transparent py-4 text-sm placeholder:text-alabaster/40 focus:outline-none"
                      aria-invalid={status === "error"}
                    />
                    <button type="submit" className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brass">
                      Subscribe <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <p className={`mt-3 text-xs ${status === "error" ? "text-red-300" : "text-alabaster/40"}`}>
                    {status === "error" ? "Please enter a valid email address." : "By subscribing you agree to our privacy policy."}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-2xl">
              Halden <span className="italic text-brass">&amp;</span> Vale
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-alabaster/50">
              Architectural objects for considered living. Designed in Porto, made across Europe.
            </p>
          </div>
          <FooterCol title="Shop">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => goToCategory(c.id)} className="hover:text-brass">
                  {c.name}
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => goToCategory("all")} className="hover:text-brass">
                All pieces
              </button>
            </li>
          </FooterCol>
          <FooterCol title="Client care">
            {["Shipping & delivery", "Returns & repairs", "Care guides", "Trade programme"].map((l) => (
              <li key={l}>
                <span className="cursor-default">{l}</span>
              </li>
            ))}
          </FooterCol>
          <FooterCol title="House">
            <li>
              <Link href="/#story" className="hover:text-brass">
                The atelier
              </Link>
            </li>
            <li>
              <Link href="/#reviews" className="hover:text-brass">
                Reviews
              </Link>
            </li>
            <li>
              <span className="cursor-default">Showroom · Porto</span>
            </li>
          </FooterCol>
        </div>

        <div className="flex flex-col gap-3 border-t border-alabaster/10 py-6 text-[11px] text-alabaster/40 md:flex-row md:justify-between">
          <p>© 2026 Halden &amp; Vale — a fictional brand.</p>
          <p>
            An <span className="text-brass">Aurum North</span> demo concept. Imagery via Unsplash. No real transactions are processed.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-alabaster/40">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-alabaster/80">{children}</ul>
    </div>
  );
}
