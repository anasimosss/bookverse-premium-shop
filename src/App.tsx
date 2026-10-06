import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bank,
  CaretDown,
  Check,
  CheckCircle,
  CreditCard,
  DeviceMobile,
  LockKey,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  SpinnerGap,
  Trash,
  Truck,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { StoreProvider, useStore } from "@/context/StoreContext";
import Navigation, { Footer } from "@/components/Navigation";
import HomeView from "@/components/HomeView";
import { AccountView, BookDetailView, CatalogView } from "@/components/CatalogViews";
import {
  ETHIOPIAN_CITIES,
  PAYMENT_METHODS,
  deliveryZoneFor,
  formatETB,
  isValidEthiopianPhone,
  type Order,
  type PaymentMethod,
} from "@/data/bookData";

const DELIVERY_FEE = 120;
const FREE_DELIVERY_THRESHOLD = 1500;

function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartOpen, setCartOpen, setQuantity, removeFromCart, cartSubtotal, goTo } = useStore();
  const shipping = cartSubtotal >= FREE_DELIVERY_THRESHOLD || cartSubtotal === 0 ? 0 : DELIVERY_FEE;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[80] bg-navy/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[85] flex w-full max-w-md flex-col border-l border-white/10 bg-navy-deep"
          >
            <header className="flex items-center justify-between border-b border-white/8 px-6 py-5">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Your bag</span>
                <h2 className="mt-2 font-serif text-xl text-ivory">
                  {cart.length === 0 ? "Empty for now" : `${cart.length} title${cart.length > 1 ? "s" : ""} selected`}
                </h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-full text-ivory/60 hover:bg-white/8 hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="mt-16 text-center">
                  <ShoppingBag className="mx-auto h-10 w-10 text-gold/70" />
                  <h3 className="mt-4 font-serif text-xl text-ivory">Your bag is empty</h3>
                  <p className="mt-2 text-sm text-ivory/55">Add a title and it will appear here, ready to check out.</p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      goTo("catalog");
                    }}
                    className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-soft"
                  >
                    Browse the collection
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.book.id} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <span
                        className="h-24 w-16 shrink-0 rounded-sm ring-1 ring-inset ring-white/10"
                        style={{ backgroundImage: `linear-gradient(150deg, ${item.book.coverFrom}, ${item.book.coverTo})` }}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-serif text-base text-ivory">{item.book.title}</h3>
                            <p className="truncate text-xs text-ivory/50">{item.book.author}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.book.id)} aria-label="Remove" className="text-ivory/40 hover:text-gold">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center gap-3 rounded-full border border-white/12 px-3 py-1.5">
                            <button aria-label="Decrease" onClick={() => setQuantity(item.book.id, item.quantity - 1)} className="text-ivory/60 hover:text-gold">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center font-mono text-xs text-ivory">{item.quantity}</span>
                            <button aria-label="Increase" onClick={() => setQuantity(item.book.id, item.quantity + 1)} className="text-ivory/60 hover:text-gold">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-sm text-gold">{formatETB(item.book.price * item.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="border-t border-white/8 px-6 py-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-ivory/65">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">{formatETB(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ivory/65">
                    <span>Delivery</span>
                    <span className="font-mono text-ivory">{shipping === 0 ? "Free" : formatETB(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/8 pt-3 text-base">
                    <span className="text-ivory">Total</span>
                    <span className="font-serif text-xl text-gold">{formatETB(cartSubtotal + shipping)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-xs text-ivory/50">
                    <Truck className="h-4 w-4 text-gold" />
                    {cartSubtotal >= FREE_DELIVERY_THRESHOLD
                      ? "Free delivery unlocked."
                      : `Add ${formatETB(FREE_DELIVERY_THRESHOLD - cartSubtotal)} for free delivery.`}
                  </p>
                </div>
                <button
                  onClick={onCheckout}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
                >
                  Proceed to checkout
                  <ArrowRight weight="bold" />
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutModal({
  open,
  onClose,
  onPlaced,
}: {
  open: boolean;
  onClose: () => void;
  onPlaced: (order: Order) => void;
}) {
  const { cart, cartSubtotal, placeOrder, user } = useStore();
  const shipping = cartSubtotal >= FREE_DELIVERY_THRESHOLD || cartSubtotal === 0 ? 0 : DELIVERY_FEE;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? ETHIOPIAN_CITIES[0],
    address: user?.address ?? "",
    payment: PAYMENT_METHODS[0].id as PaymentMethod,
  });

  const zone = deliveryZoneFor(form.city);
  const phoneValid = isValidEthiopianPhone(form.phone);
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === form.payment) ?? PAYMENT_METHODS[0];

  const confirmDelivery = () => {
    if (cart.length === 0) {
      toast.error("Your bag is empty. Add a title before checking out.");
      return;
    }
    if (!form.name.trim() || !form.address.trim()) {
      toast.error("Please add your name and delivery address.");
      return;
    }
    if (!phoneValid) {
      toast.error("Enter a valid Ethiopian phone number, e.g. +251 91 234 5678.");
      return;
    }
    setStep(2);
  };

  const runDemoPayment = (event: React.FormEvent) => {
    event.preventDefault();
    setStep(3);
    setProcessing(true);
    window.setTimeout(() => {
      const order = placeOrder({
        items: cart,
        subtotal: cartSubtotal,
        shipping,
        total: cartSubtotal + shipping,
        paymentMethod: form.payment,
        city: form.city,
        address: form.address.trim(),
        customerName: form.name.trim(),
        phone: form.phone.trim(),
      });
      setProcessing(false);
      toast.success("Demo payment approved. A receipt is on its way.");
      onClose();
      onPlaced(order);
    }, 1600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-navy/85 px-4 py-10 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.form
            onSubmit={runDemoPayment}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-navy-deep/97 p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Checkout</span>
                <h2 className="mt-3 font-serif text-2xl text-ivory">
                  {step === 1 ? "Delivery details" : step === 2 ? "Payment method" : "Confirming your order"}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ivory/60 hover:bg-white/8 hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {["Delivery", "Payment", "Confirm"].map((label, index) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px]",
                      index + 1 <= step ? "bg-gold text-navy" : "bg-white/10 text-ivory/40",
                    )}
                  >
                    {index + 1 < step ? <Check weight="bold" className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", index + 1 <= step ? "text-gold" : "text-ivory/40")}>
                    {label}
                  </span>
                  {index < 2 && <span className={cn("h-px flex-1", index + 1 < step ? "bg-gold/60" : "bg-white/10")} />}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
              <div className="space-y-4">
                {step === 1 && (
                  <>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Full name</span>
                      <input
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder="Aster Bekele"
                        className="mt-2 w-full rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Phone number</span>
                      <input
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder="+251 91 234 5678"
                        className={cn(
                          "mt-2 w-full rounded-xl border bg-navy/50 px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/35",
                          form.phone && !phoneValid ? "border-red-400/60 focus:border-red-400" : "border-white/12 focus:border-gold/60",
                        )}
                      />
                      {form.phone && !phoneValid && (
                        <span className="mt-1.5 block text-xs text-red-300/80">Enter a valid Ethiopian number, e.g. +251 91 234 5678.</span>
                      )}
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">City</span>
                      <div className="relative mt-2">
                        <select
                          value={form.city}
                          onChange={(event) => setForm({ ...form, city: event.target.value })}
                          className="w-full appearance-none rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60"
                        >
                          {ETHIOPIAN_CITIES.map((city) => (
                            <option key={city} value={city} className="bg-navy text-ivory">
                              {city}
                            </option>
                          ))}
                        </select>
                        <CaretDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Delivery address</span>
                      <textarea
                        value={form.address}
                        onChange={(event) => setForm({ ...form, address: event.target.value })}
                        rows={3}
                        placeholder="Sub-city, woreda, house number or landmark"
                        className="mt-2 w-full resize-none rounded-xl border border-white/12 bg-navy/50 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60 placeholder:text-ivory/35"
                      />
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs text-ivory/60">
                      <Truck className="h-4 w-4 text-gold" />
                      {zone.eta} · dispatched from the {zone.hub}.
                    </div>
                    <button
                      type="button"
                      onClick={confirmDelivery}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
                    >
                      Continue to payment
                      <ArrowRight weight="bold" />
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5">
                      <ShieldCheck className="h-4 w-4 text-gold" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Demo / sandbox mode</span>
                    </div>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((method) => {
                        const Icon = method.id === "Telebirr" ? DeviceMobile : method.id === "Chapa" ? CreditCard : Bank;
                        const active = form.payment === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setForm({ ...form, payment: method.id })}
                            className={cn(
                              "flex w-full items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition",
                              active ? "border-gold bg-gold/10" : "border-white/12 hover:border-gold/40",
                            )}
                          >
                            <span className="flex gap-3">
                              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", active ? "text-gold" : "text-ivory/60")} />
                              <span>
                                <span className="block text-sm font-medium text-ivory">{method.label}</span>
                                <span className="block text-xs text-ivory/50">{method.note}</span>
                              </span>
                            </span>
                            <span
                              className={cn(
                                "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                                active ? "border-gold bg-gold text-navy" : "border-white/20",
                              )}
                            >
                              {active && <CheckCircle weight="fill" className="h-4 w-4" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-ivory/60">
                      {selectedMethod.instructions}
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-ivory/80 transition hover:border-gold/50 hover:text-gold"
                      >
                        <ArrowLeft weight="bold" />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
                      >
                        <LockKey weight="bold" />
                        Pay {formatETB(cartSubtotal + shipping)}
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <SpinnerGap className={cn("h-10 w-10 text-gold", processing ? "animate-spin" : "")} />
                    <h3 className="font-serif text-xl text-ivory">
                      {processing ? `Verifying with ${selectedMethod.label}…` : "Payment approved"}
                    </h3>
                    <p className="max-w-xs text-sm text-ivory/55">
                      Simulating {selectedMethod.verifyLabel}. No real charge is made — this is a demo checkout.
                    </p>
                  </div>
                )}
              </div>

              <aside className="h-fit rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <h3 className="font-serif text-lg text-ivory">Order summary</h3>
                <ul className="mt-4 space-y-3">
                  {cart.map((item) => (
                    <li key={item.book.id} className="flex items-center gap-3">
                      <span
                        className="h-12 w-8 shrink-0 rounded-sm ring-1 ring-inset ring-white/10"
                        style={{ backgroundImage: `linear-gradient(150deg, ${item.book.coverFrom}, ${item.book.coverTo})` }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ivory">{item.book.title}</span>
                        <span className="font-mono text-[10px] text-ivory/45">x{item.quantity}</span>
                      </span>
                      <span className="font-mono text-xs text-ivory/70">{formatETB(item.book.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-2 border-t border-white/8 pt-4 text-sm">
                  <div className="flex justify-between text-ivory/60">
                    <span>Subtotal</span>
                    <span className="font-mono text-ivory">{formatETB(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ivory/60">
                    <span>Delivery</span>
                    <span className="font-mono text-ivory">{shipping === 0 ? "Free" : formatETB(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/8 pt-3">
                    <span className="text-ivory">Total</span>
                    <span className="font-serif text-xl text-gold">{formatETB(cartSubtotal + shipping)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-gold/10 px-3 py-2 text-[11px] text-gold">
                  <ShieldCheck className="h-4 w-4" />
                  Demo payment — no real charge is made.
                </div>
              </aside>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Confirmation({ order, onClose }: { order: Order; onClose: () => void }) {
  const { goTo, setAccountOpen } = useStore();
  const zone = deliveryZoneFor(order.city);
  const eta = new Date(Date.now() + zone.days * 86400000).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-navy/90 px-4 py-10 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg rounded-3xl border border-gold/25 bg-navy-deep/97 p-8 text-center shadow-2xl"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckCircle weight="fill" className="h-9 w-9" />
        </span>
        <h2 className="mt-6 font-serif text-3xl text-ivory">Order confirmed</h2>
        <p className="mt-3 text-sm text-ivory/60">
          Thank you, {order.customerName.split(" ")[0]}. We have sent a receipt to your account.
        </p>
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Reference</span>
            <span className="font-mono text-sm text-gold">{order.reference}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Total paid</span>
            <span className="font-serif text-lg text-ivory">{formatETB(order.total)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Payment</span>
            <span className="text-sm text-ivory/75">{order.paymentMethod}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/40">Delivery</span>
            <span className="text-sm text-ivory/75">
              {order.city}, {order.address}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-4 text-sm text-ivory/70">
            <Truck className="h-5 w-5 text-gold" />
            Estimated arrival {eta} · {zone.eta}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold/10 px-4 py-2.5 text-[11px] text-gold">
            <ShieldCheck className="h-4 w-4" />
            Demo payment — no real charge was made. Saved to your order history.
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              onClose();
              goTo("catalog");
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Continue shopping
            <ArrowRight weight="bold" />
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-ivory/80 transition hover:border-gold/50 hover:text-gold"
          >
            Print receipt
          </button>
        </div>
        <button
          onClick={() => {
            onClose();
            setAccountOpen(true);
          }}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 text-xs text-ivory/55 transition hover:text-gold"
        >
          View this order in my history
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function AccountPanel() {
  const { accountOpen, setAccountOpen } = useStore();
  return (
    <AnimatePresence>
      {accountOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAccountOpen(false)}
            className="fixed inset-0 z-[80] bg-navy/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[85] w-full max-w-lg border-l border-white/10 bg-navy-deep"
          >
            <button
              onClick={() => setAccountOpen(false)}
              aria-label="Close account"
              className="absolute right-4 top-5 z-10 grid h-9 w-9 place-items-center rounded-full text-ivory/60 hover:bg-white/8 hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
            <AccountView />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Shell() {
  const { view } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-dvh bg-navy text-ivory antialiased">
      <Navigation />
      <main>
        {view === "home" && <HomeView />}
        {view === "catalog" && <CatalogView />}
        {view === "book" && <BookDetailView />}
      </main>
      <Footer />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onPlaced={setPlaced} />
      <AccountPanel />
      <AnimatePresence>{placed && <Confirmation order={placed} onClose={() => setPlaced(null)} />}</AnimatePresence>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#fbf9f4",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}