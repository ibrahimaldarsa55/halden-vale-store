"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Lock, Minus, Plus, ShoppingBag, Tag, Trash, Truck, X } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";
import { FREE_SHIPPING_THRESHOLD, variantLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useStore } from "./store-provider";
import { useCategoryNav } from "./use-category-nav";
import { useOverlay } from "./use-overlay";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const store = useStore();
  const { cartOpen, setCartOpen, lines, itemCount, subtotal, discount, shipping, total, freeShippingRemaining } = store;
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  const goToCategory = useCategoryNav();
  useOverlay(cartOpen, close);

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-alabaster sm:max-w-[460px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-7">
              <h2 className="font-serif text-2xl">
                Your Bag <span className="ml-1 align-middle text-sm text-stone tabular-nums">({itemCount})</span>
              </h2>
              <button type="button" onClick={close} className="-mr-2 p-2" aria-label="Close bag">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-line">
                  <ShoppingBag className="size-6 text-stone" strokeWidth={1.2} />
                </span>
                <p className="mt-6 font-serif text-2xl">Your bag is empty</p>
                <p className="mt-2 max-w-xs text-sm text-stone">
                  Begin with a signature piece — each is made in small batches by our partner workshops.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-8"
                  onClick={() => {
                    close();
                    goToCategory("all");
                  }}
                >
                  Explore the collection <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-line px-5 py-4 sm:px-7">
                  <p className="flex items-center gap-2 text-xs">
                    <Truck className="size-4 text-brass-dark" strokeWidth={1.4} />
                    {freeShippingRemaining > 0 ? (
                      <span>
                        You&apos;re <strong className="font-semibold">{formatPrice(freeShippingRemaining, true)}</strong> away
                        from complimentary express shipping
                      </span>
                    ) : (
                      <span>You&apos;ve unlocked complimentary express shipping</span>
                    )}
                  </p>
                  <div className="mt-3 h-[3px] w-full overflow-hidden bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
                    <motion.div
                      className="h-full bg-brass"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 sm:px-7">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <Link
                            href={`/products/${line.slug}`}
                            onNavigate={close}
                            className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-bone"
                          >
                            <Image src={line.product.images[0]} alt={line.product.name} fill sizes="96px" className="object-cover" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  href={`/products/${line.slug}`}
                                  onNavigate={close}
                                  className="block truncate font-serif text-lg leading-tight hover:text-brass-dark"
                                >
                                  {line.product.name}
                                </Link>
                                <p className="mt-1 text-xs text-stone">{variantLabel(line.product, line.variants)}</p>
                              </div>
                              <p className="text-sm tabular-nums">{formatPrice(line.lineTotal)}</p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <QuantityControl
                                value={line.quantity}
                                onChange={(q) => store.setQuantity(line.key, q)}
                                label={line.product.name}
                              />
                              <button
                                type="button"
                                onClick={() => store.removeItem(line.key)}
                                className="flex items-center gap-1.5 text-xs text-stone transition-colors hover:text-ink"
                                aria-label={`Remove ${line.product.name}`}
                              >
                                <Trash className="size-3.5" strokeWidth={1.4} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-line bg-white/60 px-5 pb-6 pt-5 sm:px-7">
                  <PromoField />
                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-stone">Subtotal</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal, true)}</dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-brass-dark">
                        <dt>Promo ({store.promo?.code})</dt>
                        <dd className="tabular-nums">−{formatPrice(discount, true)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-stone">Express shipping</dt>
                      <dd className="tabular-nums">{shipping === 0 ? "Complimentary" : formatPrice(shipping, true)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-line pt-3 text-base">
                      <dt className="font-medium">Total</dt>
                      <dd className="font-medium tabular-nums">{formatPrice(total, true)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className="btn-primary mt-5 w-full"
                    onClick={() => {
                      close();
                      store.setCheckoutOpen(true);
                    }}
                  >
                    <Lock className="size-3.5" /> Secure checkout
                  </button>
                  <p className="mt-3 text-center text-[11px] text-stone">
                    Taxes calculated at checkout · Demo only — no payment is taken
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QuantityControl({
  value,
  onChange,
  label,
  size = "sm",
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "lg";
  min?: number;
  max?: number;
}) {
  const pad = size === "lg" ? "h-14 w-12" : "h-9 w-9";
  return (
    <div className="inline-flex items-center border border-line bg-white" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className={`${pad} flex items-center justify-center transition-colors hover:bg-bone disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className={`${size === "lg" ? "w-10 text-base" : "w-8 text-sm"} text-center tabular-nums`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${pad} flex items-center justify-center transition-colors hover:bg-bone disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function PromoField() {
  const { promo, applyPromo, removePromo } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyPromo(code)) {
      setCode("");
      setError(null);
    } else {
      setError("That code isn’t recognised. Try AURUM10.");
    }
  };

  if (promo) {
    return (
      <div className="flex items-center justify-between border border-brass/50 bg-brass/10 px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <Check className="size-4 text-brass-dark" />
          <span>
            <strong className="font-semibold tracking-wider">{promo.code}</strong>
            <span className="text-stone"> · {Math.round(promo.rate * 100)}% off applied</span>
          </span>
        </span>
        <button type="button" onClick={removePromo} className="text-xs text-stone underline-offset-2 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="promo" className="sr-only">
        Promo code
      </label>
      <div className="flex">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone" strokeWidth={1.4} />
          <input
            id="promo"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            placeholder="Promo code"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "promo-error" : undefined}
            className="field pl-9 uppercase placeholder:normal-case"
          />
        </div>
        <button type="submit" className="border border-l-0 border-ink bg-ink px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-alabaster transition-colors hover:bg-brass hover:text-ink">
          Apply
        </button>
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            id="promo-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-800"
          >
            {error}
          </motion.p>
        ) : (
          <p className="mt-2 text-[11px] text-stone">Demo tip: use code AURUM10 for 10% off.</p>
        )}
      </AnimatePresence>
    </form>
  );
}
