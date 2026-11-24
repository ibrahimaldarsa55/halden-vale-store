"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Lock, Package, ShieldCheck, X } from "lucide-react";
import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { formatPrice } from "@/lib/format";
import { variantLabel } from "@/lib/products";
import { useStore, type PricedLine } from "./store-provider";
import { useOverlay } from "./use-overlay";

const ease = [0.22, 1, 0.36, 1] as const;

type Step = 0 | 1 | 2 | 3;
const STEPS = ["Information", "Delivery", "Payment"] as const;

interface Contact {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

interface Payment {
  name: string;
  card: string;
  expiry: string;
  cvc: string;
}

type DeliveryId = "express" | "white-glove";

const DELIVERY: Record<DeliveryId, { label: string; detail: string; price: number }> = {
  express: { label: "Express courier", detail: "2–4 business days, fully tracked", price: 0 },
  "white-glove": {
    label: "White-glove delivery",
    detail: "Scheduled two-person delivery, room of choice & packaging removal",
    price: 95,
  },
};

interface PlacedOrder {
  number: string;
  email: string;
  name: string;
  lines: PricedLine[];
  total: number;
  delivery: DeliveryId;
}

const EMPTY_CONTACT: Contact = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postcode: "",
  country: "United States",
};
const EMPTY_PAYMENT: Payment = { name: "", card: "", expiry: "", cvc: "" };

export function Checkout() {
  const store = useStore();
  const { checkoutOpen, setCheckoutOpen } = store;
  const [step, setStep] = useState<Step>(0);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [delivery, setDelivery] = useState<DeliveryId>("express");
  const [payment, setPayment] = useState<Payment>(EMPTY_PAYMENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  const close = useCallback(() => {
    setCheckoutOpen(false);
    // Reset after the exit animation once an order has completed.
    if (order) {
      setTimeout(() => {
        setOrder(null);
        setStep(0);
        setPayment(EMPTY_PAYMENT);
      }, 400);
    }
  }, [order, setCheckoutOpen]);
  useOverlay(checkoutOpen, close);

  const deliveryPrice = DELIVERY[delivery].price;
  const shippingTotal = store.shipping + deliveryPrice;
  const orderTotal = store.subtotal - store.discount + shippingTotal;

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) e.email = "Enter a valid email address";
    if (!contact.firstName.trim()) e.firstName = "Required";
    if (!contact.lastName.trim()) e.lastName = "Required";
    if (!contact.address.trim()) e.address = "Required";
    if (!contact.city.trim()) e.city = "Required";
    if (!contact.postcode.trim()) e.postcode = "Required";
    return e;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (!payment.name.trim()) e.name = "Required";
    if (payment.card.replace(/\s/g, "").length < 15) e.card = "Enter a 15–16 digit card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) e.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(payment.cvc)) e.cvc = "3–4 digits";
    return e;
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      const v = validateContact();
      setErrors(v);
      if (Object.keys(v).length === 0) setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const v = validatePayment();
      setErrors(v);
      if (Object.keys(v).length > 0) return;
      setPlacing(true);
      setTimeout(() => {
        setOrder({
          number: `HV-${Math.floor(100000 + Math.random() * 900000)}`,
          email: contact.email,
          name: contact.firstName,
          lines: store.lines,
          total: orderTotal,
          delivery,
        });
        store.clearCart();
        setPlacing(false);
        setStep(3);
      }, 1400);
    }
  };

  const fillDemo = () => {
    setPayment({ name: `${contact.firstName} ${contact.lastName}`.trim() || "Alex Morgan", card: "4242 4242 4242 4242", expiry: "12/29", cvc: "123" });
    setErrors({});
  };

  const summaryLines = order?.lines ?? store.lines;

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-y-auto bg-alabaster"
          role="dialog"
          aria-modal="true"
          aria-label="Checkout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="sticky top-0 z-10 border-b border-line bg-alabaster/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
              <span className="font-serif text-xl tracking-[0.06em]">
                Halden <span className="italic text-brass-dark">&amp;</span> Vale
              </span>
              <span className="hidden items-center gap-2 text-xs text-stone sm:flex">
                <Lock className="size-3.5" /> Demo checkout — no real payment is processed
              </span>
              <button type="button" onClick={close} className="-mr-2 p-2" aria-label="Close checkout">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
          </div>

          {step === 3 && order ? (
            <Confirmation order={order} onClose={close} />
          ) : store.lines.length === 0 ? (
            <div className="mx-auto max-w-md px-6 py-24 text-center">
              <p className="font-serif text-3xl">Your bag is empty</p>
              <button type="button" className="btn-primary mt-8" onClick={close}>
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-16 lg:py-14">
              <div className="order-2 lg:order-1">
                <Stepper step={step} onJump={(s) => s < step && setStep(s)} />
                <form onSubmit={next} noValidate className="mt-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      {step === 0 && (
                        <fieldset className="space-y-6">
                          <legend className="font-serif text-3xl">Contact & shipping</legend>
                          <Field label="Email" error={errors.email} className="mt-6">
                            <input
                              className="field"
                              type="email"
                              autoComplete="email"
                              value={contact.email}
                              onChange={(e) => setContact({ ...contact, email: e.target.value })}
                              aria-invalid={!!errors.email}
                            />
                          </Field>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="First name" error={errors.firstName}>
                              <input className="field" autoComplete="given-name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} aria-invalid={!!errors.firstName} />
                            </Field>
                            <Field label="Last name" error={errors.lastName}>
                              <input className="field" autoComplete="family-name" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} aria-invalid={!!errors.lastName} />
                            </Field>
                          </div>
                          <Field label="Address" error={errors.address}>
                            <input className="field" autoComplete="street-address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} aria-invalid={!!errors.address} />
                          </Field>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="City" error={errors.city}>
                              <input className="field" autoComplete="address-level2" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} aria-invalid={!!errors.city} />
                            </Field>
                            <Field label="Postcode" error={errors.postcode}>
                              <input className="field" autoComplete="postal-code" value={contact.postcode} onChange={(e) => setContact({ ...contact, postcode: e.target.value })} aria-invalid={!!errors.postcode} />
                            </Field>
                            <Field label="Country">
                              <select className="field" autoComplete="country-name" value={contact.country} onChange={(e) => setContact({ ...contact, country: e.target.value })}>
                                {["United States", "Canada", "United Kingdom", "Portugal", "France", "Germany", "Australia"].map((c) => (
                                  <option key={c}>{c}</option>
                                ))}
                              </select>
                            </Field>
                          </div>
                        </fieldset>
                      )}

                      {step === 1 && (
                        <fieldset>
                          <legend className="font-serif text-3xl">Delivery method</legend>
                          <div className="mt-6 space-y-3">
                            {(Object.keys(DELIVERY) as DeliveryId[]).map((id) => {
                              const d = DELIVERY[id];
                              const active = delivery === id;
                              const price = id === "express" ? store.shipping : d.price;
                              return (
                                <label
                                  key={id}
                                  className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${active ? "border-ink bg-white" : "border-line hover:border-stone"}`}
                                >
                                  <input type="radio" name="delivery" value={id} checked={active} onChange={() => setDelivery(id)} className="sr-only" />
                                  <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-ink" : "border-stone/60"}`}>
                                    {active && <motion.span layoutId="delivery-dot" className="size-2.5 rounded-full bg-ink" />}
                                  </span>
                                  <span className="flex-1">
                                    <span className="flex justify-between gap-4 text-sm font-medium">
                                      {d.label}
                                      <span className="tabular-nums">{price === 0 ? "Complimentary" : `+${formatPrice(price)}`}</span>
                                    </span>
                                    <span className="mt-1 block text-xs text-stone">{d.detail}</span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <div className="mt-8 border-t border-line pt-6 text-sm">
                            <p className="eyebrow text-stone">Shipping to</p>
                            <p className="mt-2">
                              {contact.firstName} {contact.lastName}, {contact.address}, {contact.city} {contact.postcode}, {contact.country}
                            </p>
                          </div>
                        </fieldset>
                      )}

                      {step === 2 && (
                        <fieldset className="space-y-6">
                          <legend className="flex w-full items-end justify-between gap-4 font-serif text-3xl">Payment</legend>
                          <div className="mt-6 flex items-start gap-3 border border-brass/40 bg-brass/10 p-4 text-xs leading-relaxed">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brass-dark" />
                            <p>
                              This is a demonstration checkout. Card details are never stored or transmitted — please don&apos;t enter a real card.{" "}
                              <button type="button" onClick={fillDemo} className="font-semibold underline underline-offset-2">
                                Fill demo card
                              </button>
                            </p>
                          </div>
                          <Field label="Name on card" error={errors.name}>
                            <input className="field" autoComplete="off" value={payment.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} aria-invalid={!!errors.name} />
                          </Field>
                          <Field label="Card number" error={errors.card}>
                            <div className="relative">
                              <CreditCard className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone" strokeWidth={1.4} />
                              <input
                                className="field pr-10 tabular-nums"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="4242 4242 4242 4242"
                                value={payment.card}
                                onChange={(e) =>
                                  setPayment({
                                    ...payment,
                                    card: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(),
                                  })
                                }
                                aria-invalid={!!errors.card}
                              />
                            </div>
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Expiry" error={errors.expiry}>
                              <input
                                className="field tabular-nums"
                                inputMode="numeric"
                                placeholder="MM/YY"
                                autoComplete="off"
                                value={payment.expiry}
                                onChange={(e) => {
                                  const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                                  setPayment({ ...payment, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d });
                                }}
                                aria-invalid={!!errors.expiry}
                              />
                            </Field>
                            <Field label="CVC" error={errors.cvc}>
                              <input
                                className="field tabular-nums"
                                inputMode="numeric"
                                placeholder="123"
                                autoComplete="off"
                                value={payment.cvc}
                                onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                                aria-invalid={!!errors.cvc}
                              />
                            </Field>
                          </div>
                        </fieldset>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button type="button" onClick={() => setStep((step - 1) as Step)} className="flex items-center justify-center gap-2 text-sm text-stone hover:text-ink">
                        <ArrowLeft className="size-4" /> Back to {STEPS[step - 1].toLowerCase()}
                      </button>
                    ) : (
                      <button type="button" onClick={close} className="flex items-center justify-center gap-2 text-sm text-stone hover:text-ink">
                        <ArrowLeft className="size-4" /> Return to shop
                      </button>
                    )}
                    <button type="submit" className="btn-primary min-w-[240px]" disabled={placing}>
                      {placing ? (
                        <>
                          <motion.span
                            className="size-4 rounded-full border-2 border-alabaster/30 border-t-alabaster"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          />
                          Placing order…
                        </>
                      ) : step === 2 ? (
                        <>
                          <Lock className="size-3.5" /> Place order · {formatPrice(orderTotal, true)}
                        </>
                      ) : (
                        `Continue to ${STEPS[step + 1].toLowerCase()}`
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <aside className="order-1 lg:order-2">
                <div className="border border-line bg-white p-5 sm:p-6 lg:sticky lg:top-24">
                  <p className="eyebrow text-stone">Order summary</p>
                  <ul className="mt-5 space-y-4">
                    {summaryLines.map((l) => (
                      <li key={l.key} className="flex gap-4">
                        <span className="relative aspect-square w-16 shrink-0 bg-bone">
                          <Image src={l.product.images[0]} alt={l.product.name} fill sizes="64px" className="object-cover" />
                          <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] text-alabaster">
                            {l.quantity}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{l.product.name}</span>
                          <span className="block text-xs text-stone">{variantLabel(l.product, l.variants)}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(l.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
                    <Row label="Subtotal" value={formatPrice(store.subtotal, true)} />
                    {store.discount > 0 && <Row label={`Promo · ${store.promo?.code}`} value={`−${formatPrice(store.discount, true)}`} accent />}
                    <Row label="Shipping" value={shippingTotal === 0 ? "Complimentary" : formatPrice(shippingTotal, true)} />
                    <Row label="Estimated tax" value="Calculated on confirmation" muted />
                    <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                      <dt>Total</dt>
                      <dd className="tabular-nums">{formatPrice(orderTotal, true)}</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stepper({ step, onJump }: { step: Step; onJump: (s: Step) => void }) {
  return (
    <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => onJump(i as Step)}
              disabled={!done}
              className={`flex items-center gap-2 ${active ? "text-ink" : done ? "text-ink/70 hover:text-ink" : "text-stone/60"}`}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full border text-[10px] transition-colors ${
                  active ? "border-ink bg-ink text-alabaster" : done ? "border-brass bg-brass text-ink" : "border-line"
                }`}
              >
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={active ? "" : "hidden sm:inline"}>{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-12" />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex justify-between text-xs">
        <span className="text-ink/80">{label}</span>
        {error && <span className="text-red-800">{error}</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, accent, muted }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${accent ? "text-brass-dark" : ""}`}>
      <dt className={accent ? "" : "text-stone"}>{label}</dt>
      <dd className={`text-right tabular-nums ${muted ? "text-xs text-stone" : ""}`}>{value}</dd>
    </div>
  );
}

function Confirmation({ order, onClose }: { order: PlacedOrder; onClose: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.span
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-brass"
      >
        <Check className="size-9 text-ink" strokeWidth={1.6} />
      </motion.span>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease }}>
        <p className="eyebrow mt-10 text-brass-dark">Order confirmed · {order.number}</p>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Thank you{order.name ? `, ${order.name}` : ""}.</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-stone">
          A confirmation has been “sent” to <span className="text-ink">{order.email}</span>. Our atelier will begin preparing your
          pieces, and you&apos;ll receive tracking details once they leave the workshop.
        </p>
        <div className="mt-10 border border-line bg-white p-6 text-left">
          <div className="flex items-center gap-3 text-sm">
            <Package className="size-4 text-brass-dark" strokeWidth={1.4} />
            {order.delivery === "white-glove" ? "White-glove delivery — our team will call to schedule" : "Express courier — 2–4 business days"}
          </div>
          <ul className="mt-5 divide-y divide-line border-t border-line">
            {order.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {l.product.name} <span className="text-stone">× {l.quantity}</span>
                  <span className="block text-xs text-stone">{variantLabel(l.product, l.variants)}</span>
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-line pt-4 font-medium">
            <span>Total charged</span>
            <span className="tabular-nums">{formatPrice(order.total, true)}</span>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-stone">Demo order — no payment was taken and nothing will ship.</p>
        <button type="button" onClick={onClose} className="btn-primary mt-8">
          Continue shopping
        </button>
      </motion.div>
    </div>
  );
}
