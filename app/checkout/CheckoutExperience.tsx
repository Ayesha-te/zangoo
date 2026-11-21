"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { StoreApiError, useCart, type StoreCheckoutResult } from "@/app/components/cart/CartProvider";
import { useCatalog } from "@/app/components/catalog/CatalogProvider";
import { formatGBP, getCardCopy, getProductSizePricing } from "@/app/data/mattressProducts";
import { subscribeToNewsletter } from "@/app/lib/newsletter";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getTurnstileToken } from "@/app/lib/turnstile";
import { loadStripeJs } from "@/app/lib/stripe";
import { KlarnaMessage } from "@/app/components/commerce/KlarnaMessage";
import {
  LIMITS, addressError, cityError, emailDomainAcceptsMail, emailError, emailSuggestion, formatUkPhone, nameError, postcodeError,
  ukMobileNational,
} from "@/app/lib/validation";
import styles from "./checkout.module.css";

// Stripe.js (card details are entered in Stripe's own secure fields).
type StripeJs = import("@/app/lib/stripe").StripeJs;

/** Stripe's smallest card payment in GBP (30p); below it Stripe won't show its payment form. */
const MIN_CARD_PENNIES = 30;
const WHATSAPP_NUMBER = "+44 7830 376489";
const WHATSAPP_LINK = "https://wa.me/447830376489";
/** 3D Secure etc.: proxied to WordPress (vercel.json / next.config.ts) so the browser stays on this site. */
const STRIPE_ORDER_STATUS_URL = "/wc-stripe-order-status/";
const SIZE_LABELS: Record<string, string> = { single: "Single (W90 x L190 x D26cm)", double: "Double (W135 x L190 x D26cm)", king: "King (W150 x L200 x D26cm)" };
/** Payment methods that finish on the provider's own page (Stripe redirects there, then back to /checkout/). */
const METHOD_LABELS: Record<string, string> = {
  card: "Card", klarna: "Klarna", amazon_pay: "Amazon Pay", paypal: "PayPal", link: "Link", revolut_pay: "Revolut Pay",
};
const PENDING_KEY = "ob-pending-order";

type Fields = {
  email: string;
  phone: string;
  offers: boolean;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  instructions: string;
  billingSame: boolean;
  billFirstName: string;
  billLastName: string;
  billAddress1: string;
  billAddress2: string;
  billCity: string;
  billPostcode: string;
};
type FieldName = keyof Fields;
type Errors = Partial<Record<FieldName | "payment", string>>;

const EMPTY: Fields = {
  email: "", phone: "", offers: false, firstName: "", lastName: "", address1: "", address2: "", city: "",
  postcode: "", instructions: "", billingSame: true, billFirstName: "", billLastName: "", billAddress1: "", billAddress2: "",
  billCity: "", billPostcode: "",
};

/**
 * Every field is required except the ones the design marks optional (offers, delivery instructions, address line 2).
 * UK phone numbers only (client, 14/11/2026). emailDomainBad: the email's domain can't receive mail (DNS check).
 */
function validate(fields: Fields, emailDomainBad = false): Errors {
  const errors: Errors = {};
  const put = (name: FieldName, message: string | null) => {
    if (message) errors[name] = message;
  };
  put("email", emailError(fields.email) ?? (emailDomainBad ? EMAIL_DOMAIN_ERROR : null));
  // UK mobiles only (client, 17/11/2026): used for delivery updates by text.
  put("phone", !fields.phone.trim() ? "Please enter your mobile number. We need it for delivery updates." : ukMobileNational(fields.phone) ? null : "Please enter a valid UK mobile number: 11 digits starting with 07.");
  put("firstName", nameError(fields.firstName, "first name"));
  put("lastName", nameError(fields.lastName, "surname"));
  put("address1", addressError(fields.address1, true));
  put("address2", addressError(fields.address2, false));
  put("city", cityError(fields.city));
  put("postcode", postcodeError(fields.postcode));
  if (fields.instructions.length > LIMITS.instructions) errors.instructions = `Please keep delivery instructions under ${LIMITS.instructions} characters.`;
  if (!fields.billingSame) {
    put("billFirstName", nameError(fields.billFirstName, "first name"));
    put("billLastName", nameError(fields.billLastName, "surname"));
    put("billAddress1", addressError(fields.billAddress1, true));
    put("billAddress2", addressError(fields.billAddress2, false));
    put("billCity", cityError(fields.billCity));
    put("billPostcode", postcodeError(fields.billPostcode));
  }
  return errors;
}

const EMAIL_DOMAIN_ERROR = "This email address can't receive emails. Please check it for typos.";

type Placed = { orderNumber: string; email: string; firstName: string; total: number; items: Array<{ name: string; size: string; quantity: number }> };
/** Saved before Stripe sends the customer to Klarna / Amazon Pay etc., read when they come back. */
type PendingOrder = Placed & { orderId: string; nonce: string; paymentMethodId: string; method: string };

export function CheckoutExperience({ stripePublishableKey }: { stripePublishableKey: string | null }) {
  const { items, totals, coupons, applyCoupon, removeCoupon, placeOrder, refreshCart, mode, pending, error: cartError, clearError } = useCart();
  const { getProduct } = useCatalog();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  // Fields the customer has left (their errors show), and the field being typed in (its error waits until they leave).
  const [blurred, setBlurred] = useState<ReadonlySet<string>>(() => new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [code, setCode] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeFailed, setStripeFailed] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  // Apple Pay / Google Pay buttons only show on devices that have one set up.
  const [expressAvailable, setExpressAvailable] = useState(false);
  // Which payment method is chosen in Stripe's form (card, klarna, amazon_pay…).
  const [paymentType, setPaymentType] = useState("card");
  // The email's domain can't receive email (checked when the email field is left).
  const [emailDomainBad, setEmailDomainBad] = useState(false);
  const emailDomainBadRef = useRef(false);
  // Hidden field only bots fill in.
  const trapRef = useRef("");
  const stripeRef = useRef<StripeJs>(null);
  const elementsRef = useRef<StripeJs>(null);
  const paymentMountRef = useRef<HTMLDivElement>(null);
  const expressMountRef = useRef<HTMLDivElement>(null);
  // Latest form values for Stripe's event handlers (they are created once).
  const fieldsRef = useRef(fields);
  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  const subtotal = totals?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = totals?.total ?? subtotal;
  const totalPennies = Math.round(total * 100);
  // A 100% discount: nothing to pay, so the order is placed without a card.
  const freeOrder = items.length > 0 && totals !== null && totalPennies === 0;
  // Between 1p and 29p Stripe can't take a card payment (e.g. a 99.99% test code).
  const belowCardMinimum = totalPennies > 0 && totalPennies < MIN_CARD_PENNIES;
  const cardPayable = totalPennies >= MIN_CARD_PENNIES;
  const marketerCode = coupons.some((applied) => !applied.toLowerCase().startsWith("welcome-"));
  const originalTotal = items.reduce((sum, item) => {
    const product = getProduct(item.slug);
    const pricing = product ? getProductSizePricing(product, item.size) : null;
    return sum + Math.max(pricing?.regular ?? item.price, item.price) * item.quantity;
  }, 0);
  const discountPercent = totals && originalTotal ? Math.round((totals.discount / originalTotal) * 100) : 0;
  const saleSubtotal = items.reduce((sum, item) => {
    const product = getProduct(item.slug);
    const pricing = product ? getProductSizePricing(product, item.size) : null;
    return sum + (pricing?.sale ?? item.price) * item.quantity;
  }, 0);
  // Marketer codes take their % off the original price, so the subtotal shown is the original price then
  // (subtotal − discount = total either way).
  const shownSubtotal = marketerCode ? originalTotal : saleSubtotal;

  const set = <K extends FieldName>(name: K, value: Fields[K]) => {
    const next = { ...fields, [name]: value };
    setFields(next);
    // A changed email is checked again when the customer leaves the field.
    const domainBad = name === "email" ? false : emailDomainBad;
    if (name === "email") {
      setEmailDomainBad(false);
      emailDomainBadRef.current = false;
    }
    if (typeof value === "string") setEditing(name);
    setErrors(validate(next, domainBad));
  };
  const leaveField = (name: string) => {
    setEditing((current) => (current === name ? null : current));
    setBlurred((current) => (current.has(name) ? current : new Set(current).add(name)));
  };
  /** The error to show for a field: only once it has been left or Pay was pressed, and not while typing in it. */
  const shownError = (name: FieldName | "payment") =>
    errors[name] && editing !== name && (touched || blurred.has(name)) ? errors[name] : undefined;
  const hasShownErrors = (Object.keys(errors) as Array<FieldName | "payment">).some((name) => shownError(name));

  /** Does the email's domain accept mail? Shown as an error straight away when it clearly doesn't. */
  const checkEmailDomain = useCallback(async (email: string) => {
    if (emailError(email)) return false;
    const accepts = await emailDomainAcceptsMail(email);
    const bad = accepts === false;
    emailDomainBadRef.current = bad;
    setEmailDomainBad(bad);
    if (bad) setErrors((current) => ({ ...current, email: EMAIL_DOMAIN_ERROR }));
    return bad;
  }, []);
  const suggestion = emailSuggestion(fields.email);

  // Which of the 4 steps are complete (for the progress bar at the top).
  const liveErrors = useMemo(() => validate(fields, emailDomainBad), [fields, emailDomainBad]);
  const contactDone = !liveErrors.email && !liveErrors.phone;
  const addressDone = contactDone && !liveErrors.firstName && !liveErrors.lastName && !liveErrors.address1 && !liveErrors.city && !liveErrors.postcode;
  const steps = [
    { label: "Contact details", done: contactDone },
    { label: "Delivery address", done: addressDone },
    { label: "Delivery options", done: addressDone },
    { label: "Payment", done: false },
  ];
  const currentStep = steps.findIndex((step) => !step.done);

  /** Woo address objects from the form. */
  const addresses = useCallback((f: Fields) => {
    const national = ukMobileNational(f.phone);
    const phone = national ? formatUkPhone(national) : f.phone.trim();
    const delivery = {
      first_name: f.firstName.trim(), last_name: f.lastName.trim(), company: "", address_1: f.address1.trim(), address_2: f.address2.trim(),
      city: f.city.trim(), state: "", postcode: f.postcode.trim().toUpperCase(), country: "GB", phone,
    };
    const billing = f.billingSame
      ? { ...delivery, email: f.email.trim() }
      : {
          first_name: f.billFirstName.trim(), last_name: f.billLastName.trim(), company: "", address_1: f.billAddress1.trim(), address_2: f.billAddress2.trim(),
          city: f.billCity.trim(), state: "", postcode: f.billPostcode.trim().toUpperCase(), country: "GB", phone, email: f.email.trim(),
        };
    return { billing, delivery };
  }, []);

  /** Shows the first problem and moves the customer to it. */
  const showErrors = useCallback((found: Errors) => {
    setTouched(true);
    setEditing(null);
    setErrors(found);
    // There is no address lookup: missing address lines open the full address form straight away.
    if (found.address1 || found.city) setManualAddress(true);
    const first = Object.keys(found)[0];
    if (first) {
      // After the re-render (the address fields may have just appeared).
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
      }, 0);
    }
  }, []);

  /** Places the WooCommerce order with a Stripe payment method, then handles 3D Secure if the bank asks for it. */
  const completeOrder = useCallback(
    async (paymentMethodId: string, expressType = "") => {
      const f = fieldsRef.current;
      // Bots fill in the hidden field: stop here without sending anything.
      if (trapRef.current) throw new Error("Your order could not be placed. Please contact us on WhatsApp.");
      const { billing, delivery } = addresses(f);
      const snapshot = { items: items.map((item) => ({ name: item.name, size: item.size, quantity: item.quantity })), total };
      const spamToken = await getTurnstileToken("checkout");
      const result: StoreCheckoutResult = await placeOrder({
        billing_address: billing,
        shipping_address: delivery,
        customer_note: f.instructions.trim(),
        // Nothing to pay (100% discount): WooCommerce completes the order without a payment method.
        ...(paymentMethodId
          ? {
              payment_method: "stripe",
              payment_data: [
                { key: "payment_method", value: "stripe" },
                { key: "wc-stripe-payment-method", value: paymentMethodId },
                { key: "express_payment_type", value: expressType },
                { key: "wc-stripe-is-deferred-intent", value: true },
              ],
            }
          : {}),
      }, spamToken ? { "X-OB-Turnstile": spamToken } : {});
      const redirect = result.payment_result?.redirect_url ?? "";
      const confirm = redirect.match(/#wc-stripe-confirm-(pi|si):(.+):(.+):(.+)$/);
      if (confirm) {
        // The bank wants the customer to confirm (3D Secure): Stripe shows its own window, then WordPress is told.
        const [, , orderId, clientSecret, nonce] = confirm;
        // Klarna, Amazon Pay etc. leave this page to finish with the provider and come back to /checkout/:
        // remember the order so the confirmation can be shown then.
        const pending: PendingOrder = {
          orderNumber: result.order_number || String(result.order_id), email: f.email.trim(), firstName: f.firstName.trim(), ...snapshot,
          orderId, nonce, paymentMethodId, method: paymentTypeRef.current,
        };
        try {
          sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        } catch {
          // Private browsing: the provider still completes the order and the customer gets the email confirmation.
        }
        const outcome = await stripeRef.current.confirmPayment({ clientSecret, redirect: "if_required", confirmParams: { return_url: `${window.location.origin}/checkout/` } });
        try {
          sessionStorage.removeItem(PENDING_KEY);
        } catch {
          // Nothing was saved.
        }
        const intent = outcome.paymentIntent ?? outcome.error?.payment_intent;
        await fetch(STRIPE_ORDER_STATUS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ order_id: orderId, intent_id: intent?.id ?? "", payment_method_id: paymentMethodId, _ajax_nonce: nonce }),
        }).catch(() => undefined); // Stripe's webhook also updates the order.
        if (outcome.error) throw new Error(outcome.error.message ?? "Your payment could not be confirmed.");
        if (!["succeeded", "processing", "requires_capture"].includes(outcome.paymentIntent?.status)) throw new Error("Your payment was not completed. Please try again.");
      } else if (paymentMethodId && result.payment_result?.payment_status !== "success") {
        throw new Error("Your payment was not completed. Please check your details and try again.");
      } else if (redirect && !/order-received/.test(redirect)) {
        // Pay-later / bank redirect methods (e.g. Klarna) finish on the provider's page.
        window.location.assign(redirect);
        return;
      }
      if (f.offers) void subscribeToNewsletter({ email: f.email, firstName: f.firstName });
      setPlaced({ orderNumber: result.order_number || String(result.order_id), email: f.email.trim(), firstName: f.firstName.trim(), ...snapshot });
      window.scrollTo({ top: 0 });
      // WooCommerce empties the basket once the order is paid; reload it so the header count clears too.
      await refreshCart();
    },
    [addresses, items, placeOrder, refreshCart, total],
  );

  // Back from Klarna / Amazon Pay etc. (Stripe adds redirect_status to the return address).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("redirect_status");
    if (!status) return;
    window.history.replaceState(null, "", "/checkout/");
    let pending: PendingOrder | null = null;
    try {
      pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) ?? "null");
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      pending = null;
    }
    const method = METHOD_LABELS[pending?.method ?? ""];
    if (status === "succeeded" || status === "processing") {
      if (pending) {
        // Tell WordPress to check the payment now (Stripe's webhook also updates the order).
        void fetch(STRIPE_ORDER_STATUS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ order_id: pending.orderId, intent_id: params.get("payment_intent") ?? "", payment_method_id: pending.paymentMethodId, _ajax_nonce: pending.nonce }),
        }).catch(() => undefined);
        const { orderNumber, email, firstName, total: paid, items: bought } = pending;
        setPlaced({ orderNumber, email, firstName, total: paid, items: bought });
      } else {
        setPlaced({ orderNumber: "", email: "", firstName: "", total: 0, items: [] });
      }
      void refreshCart();
    } else {
      setPayError(`Your ${method ? `${method} ` : ""}payment wasn't completed, so you haven't been charged. Please try again or choose another way to pay.`);
    }
  }, [refreshCart]);

  const failPayment = (caught: unknown) => {
    const message = caught instanceof StoreApiError || caught instanceof Error ? caught.message : "";
    setPayError(message || "Your payment could not be completed. Please try again.");
  };

  // Start downloading Stripe.js as soon as the checkout opens, so the payment form is ready sooner.
  useEffect(() => {
    if (stripePublishableKey) loadStripeJs().catch(() => setStripeFailed(true));
  }, [stripePublishableKey]);

  // Latest values for Stripe's event handlers, which are attached once.
  const completeOrderRef = useRef(completeOrder);
  const paymentTypeRef = useRef(paymentType);
  useEffect(() => {
    paymentTypeRef.current = paymentType;
  }, [paymentType]);
  const showErrorsRef = useRef(showErrors);
  const totalPenniesRef = useRef(totalPennies);
  useEffect(() => {
    completeOrderRef.current = completeOrder;
    showErrorsRef.current = showErrors;
    totalPenniesRef.current = totalPennies;
  }, [completeOrder, showErrors, totalPennies]);

  // Keep Stripe's amount in step with the basket (only amounts Stripe can charge).
  useEffect(() => {
    if (elementsRef.current && cardPayable) elementsRef.current.update({ amount: totalPennies });
  }, [cardPayable, totalPennies]);

  // Stripe Payment Element (card, Klarna, Link, wallets) + Express Checkout (Apple Pay / Google Pay buttons).
  // Created once, when there is something Stripe can charge; it is not rebuilt when the basket refreshes.
  const hasItems = items.length > 0;
  useEffect(() => {
    if (!stripePublishableKey || mode !== "woocommerce" || placed || !hasItems || !cardPayable || elementsRef.current) return;
    let cancelled = false;
    loadStripeJs()
      .then(() => {
        if (cancelled || elementsRef.current || !window.Stripe || !paymentMountRef.current) return;
        const stripe = window.Stripe(stripePublishableKey);
        const elements = stripe.elements({
          mode: "payment",
          amount: totalPenniesRef.current,
          currency: "gbp",
          paymentMethodCreation: "manual",
          appearance: {
            theme: "stripe",
            variables: { colorPrimary: "#1557A7", colorText: "#1a2e44", fontFamily: "DM Sans, system-ui, sans-serif", fontSizeBase: "16px", borderRadius: "8px", spacingUnit: "5px" },
          },
          fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" }],
        });
        const payment = elements.create("payment", {
          layout: { type: "accordion", defaultCollapsed: false, radios: true, spacedAccordionItems: false },
          wallets: { applePay: "never", googlePay: "never" },
          fields: { billingDetails: { name: "never", email: "never", phone: "never", address: "never" } },
        });
        payment.mount(paymentMountRef.current);
        payment.on("ready", () => setStripeReady(true));
        // Stripe refused to show the form (e.g. unsupported amount or blocked network): say so instead of waiting.
        payment.on("loaderror", () => setStripeFailed(true));
        payment.on("change", (event: { complete: boolean; value?: { type?: string } }) => {
          setPaymentComplete(event.complete);
          if (event.value?.type) setPaymentType(event.value.type);
        });

        if (expressMountRef.current) {
          const express = elements.create("expressCheckout", { buttonHeight: 48, buttonType: { applePay: "plain", googlePay: "plain" }, paymentMethods: { applePay: "always", googlePay: "always", link: "never", paypal: "never", amazonPay: "never", klarna: "never" } });
          express.mount(expressMountRef.current);
          express.on("ready", (event: { availablePaymentMethods?: Record<string, boolean> | null }) => {
            setExpressAvailable(Boolean(event.availablePaymentMethods && Object.values(event.availablePaymentMethods).some(Boolean)));
          });
          express.on("click", (event: { resolve: () => void }) => {
            // Wallet payments still need the delivery details from this form first.
            const found = validate(fieldsRef.current, emailDomainBadRef.current);
            if (Object.keys(found).length) {
              showErrorsRef.current(found);
              return;
            }
            event.resolve();
          });
          express.on("confirm", async (event: { expressPaymentType: string; paymentFailed: (o?: unknown) => void }) => {
            setPaying(true);
            setPayError(null);
            try {
              const submitted = await elements.submit();
              if (submitted.error) throw new Error(submitted.error.message);
              const created = await stripe.createPaymentMethod({ elements });
              if (created.error) throw new Error(created.error.message);
              await completeOrderRef.current(created.paymentMethod.id, event.expressPaymentType);
            } catch (caught) {
              event.paymentFailed();
              failPayment(caught);
            } finally {
              setPaying(false);
            }
          });
        }
        stripeRef.current = stripe;
        elementsRef.current = elements;
      })
      .catch(() => setStripeFailed(true));
    return () => {
      cancelled = true;
    };
  }, [stripePublishableKey, mode, placed, hasItems, cardPayable]);

  async function onPay(event?: FormEvent) {
    event?.preventDefault();
    clearError();
    setPayError(null);
    const domainBad = await checkEmailDomain(fields.email);
    const found = validate(fields, domainBad);
    if (belowCardMinimum) found.payment = "This total is below the £0.30 minimum for card payments.";
    else if (!freeOrder && !paymentComplete && stripeReady) found.payment = "Please complete your payment details.";
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    if (freeOrder) {
      setPaying(true);
      try {
        await completeOrder("");
      } catch (caught) {
        failPayment(caught);
      } finally {
        setPaying(false);
      }
      return;
    }
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) {
      setPayError("Card payment isn't available right now. Please try again in a moment or contact us on WhatsApp.");
      return;
    }
    setPaying(true);
    try {
      const submitted = await elements.submit();
      if (submitted.error) throw new Error(submitted.error.message);
      const { billing } = addresses(fields);
      const created = await stripe.createPaymentMethod({
        elements,
        params: {
          billing_details: {
            name: `${billing.first_name} ${billing.last_name}`,
            email: billing.email,
            phone: billing.phone,
            address: { line1: billing.address_1, line2: billing.address_2, city: billing.city, state: "", postal_code: billing.postcode, country: "GB" },
          },
        },
      });
      if (created.error) throw new Error(created.error.message);
      await completeOrder(created.paymentMethod.id);
    } catch (caught) {
      failPayment(caught);
    } finally {
      setPaying(false);
    }
  }

  const field = (name: FieldName, label: ReactNode, input: ReactNode, wide = false) => (
    <label className={`${styles.field}${wide ? ` ${styles.wide}` : ""}${shownError(name) ? ` ${styles.invalid}` : ""}`} data-field={name}>
      <span className={styles.label}>{label}</span>
      {input}
      {shownError(name) ? <small className={styles.error} role="alert">{shownError(name)}</small> : null}
    </label>
  );
  const text = (name: FieldName, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      value={String(fields[name])}
      onChange={(event) => set(name, event.target.value as never)}
      aria-invalid={Boolean(shownError(name))}
      {...props}
      onBlur={(event) => {
        props.onBlur?.(event);
        leaveField(name);
      }}
    />
  );

  // The site's own menu and footer (client, 14/11/2026).
  const header = <SiteHeader />;
  const redirectMethod = paymentType !== "card" ? METHOD_LABELS[paymentType] ?? "the provider" : "";

  if (placed) {
    return (
      <div className={styles.page}>
        {header}
        <main className={styles.thanksWrap}>
          <section className={styles.thanks} role="status">
            <span className={styles.thanksIcon} aria-hidden="true">✓</span>
            <h1>Thank you{placed.firstName ? `, ${placed.firstName}` : ""}!</h1>
            <p className={styles.thanksLead}>Your order has been received. Thank you for shopping with OrthoBedroom.</p>
            {placed.orderNumber ? <dl className={styles.thanksFacts}>
              <div><dt>Order number</dt><dd>#{placed.orderNumber}</dd></div>
              <div><dt>Total paid</dt><dd>{formatGBP(placed.total)}</dd></div>
              <div><dt>Confirmation sent to</dt><dd>{placed.email}</dd></div>
            </dl> : <p>Your order confirmation has been sent to your email address.</p>}
            <ul className={styles.thanksItems}>
              {placed.items.map((item) => (
                <li key={`${item.name}-${item.size}`}>{item.quantity} × {item.name}, {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</li>
              ))}
            </ul>
            <p>We&rsquo;ll be in touch about delivery. Questions? Message us on WhatsApp: <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">{WHATSAPP_NUMBER}</a></p>
            <Link className={styles.payButton} href="/collections/bedroom/mattresses/">Continue shopping</Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={styles.page}>
        {header}
        <main className={styles.thanksWrap}>
          <section className={styles.thanks}>
            <h1>Your basket is empty</h1>
            <p className={styles.thanksLead}>{pending ? "Loading your basket…" : "Add a mattress to your basket to check out."}</p>
            {!pending ? <Link className={styles.payButton} href="/collections/bedroom/mattresses/">Shop mattresses</Link> : null}
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {header}
      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div>
            <h1>Secure checkout</h1>
            <p>Checkout as a guest. Already have an account? <Link href="/account/">Sign in</Link></p>
          </div>
          <ol className={styles.steps} aria-label="Checkout progress">
            {steps.map((step, index) => (
              <li key={step.label} className={step.done ? styles.stepDone : index === currentStep ? styles.stepCurrent : undefined} aria-current={index === currentStep ? "step" : undefined}>
                <span>{step.done ? "✓" : index + 1}</span>
                {step.label}
              </li>
            ))}
          </ol>
        </div>

        <form className={styles.layout} onSubmit={onPay} noValidate>
          <div className={styles.formColumn}>
            <section className={styles.card} aria-labelledby="co-contact">
              <div className={styles.cardHead}>
                <span className={styles.num}>1</span>
                <h2 id="co-contact">Contact details</h2>
                <p className={styles.headNote}>We&rsquo;ll use these details to keep you updated about your order.</p>
              </div>
              <div className={styles.grid}>
                {field(
                  "email",
                  <>Email address <i>*</i></>,
                  <>
                    {text("email", { type: "email", autoComplete: "email", placeholder: "you@example.com", maxLength: LIMITS.email, onBlur: (event) => void checkEmailDomain(event.target.value) })}
                    {suggestion ? (
                      <small className={styles.hint}>
                        Did you mean{" "}
                        <button type="button" className={styles.linkButton} onClick={() => { set("email", suggestion); void checkEmailDomain(suggestion); }}>{suggestion}</button>?
                      </small>
                    ) : null}
                  </>,
                )}
                {field(
                  "phone",
                  <>Mobile number <i>*</i></>,
                  // UK numbers only: a fixed +44, no country list (client, 14/11/2026).
                  <div className={styles.phone}>
                    <span className={styles.dial} title="UK numbers only"><UkFlag /> +44</span>
                    {text("phone", {
                      type: "tel", autoComplete: "tel-national", inputMode: "tel", placeholder: "07xxx xxxxxx", maxLength: LIMITS.phone,
                      // A valid mobile is tidied to the usual UK format, e.g. "+44 (0)7123456789" → "07123 456789".
                      onBlur: (event) => {
                        const national = ukMobileNational(event.target.value);
                        if (national) set("phone", `0${national.slice(0, 4)} ${national.slice(4)}`);
                      },
                    })}
                    <small className={styles.phoneHint}>Required for delivery updates by text.</small>
                  </div>,
                )}
              </div>
              <label className={styles.check}>
                <input type="checkbox" checked={fields.offers} onChange={(event) => set("offers", event.target.checked)} />
                <span>Email me offers and product updates <em>(optional)</em><small>You can unsubscribe at any time.</small></span>
              </label>
            </section>

            <section className={styles.card} aria-labelledby="co-address">
              <div className={styles.cardHead}>
                <span className={styles.num}>2</span>
                <h2 id="co-address">Delivery address</h2>
                <p className={styles.headNote}>Delivering to <b>United Kingdom</b> <UkFlag /></p>
              </div>
              <div className={styles.grid}>
                {field("firstName", <>First name <i>*</i></>, text("firstName", { autoComplete: "given-name", maxLength: LIMITS.name }))}
                {field("lastName", <>Surname <i>*</i></>, text("lastName", { autoComplete: "family-name", maxLength: LIMITS.name }))}
                {!manualAddress ? (
                  <>
                    {field(
                      "postcode",
                      <>Enter your postcode <i>*</i></>,
                      <div className={styles.search}>
                        <SearchIcon />
                        {text("postcode", { autoComplete: "postal-code", placeholder: "e.g. IG1 2LA", maxLength: LIMITS.postcode, onBlur: () => fields.postcode && setManualAddress(true) })}
                      </div>,
                      true,
                    )}
                    <button type="button" className={styles.linkButton} onClick={() => setManualAddress(true)}>Enter address manually</button>
                  </>
                ) : (
                  <>
                    {field("address1", <>Address line 1 <i>*</i></>, text("address1", { autoComplete: "address-line1", placeholder: "House number and street", maxLength: LIMITS.address }), true)}
                    {field("address2", <>Address line 2 <em>(optional)</em></>, text("address2", { autoComplete: "address-line2", placeholder: "Flat, building, etc.", maxLength: LIMITS.address }), true)}
                    {field("city", <>Town / City <i>*</i></>, text("city", { autoComplete: "address-level2", maxLength: LIMITS.city }))}
                    {field("postcode", <>Postcode <i>*</i></>, text("postcode", { autoComplete: "postal-code", maxLength: LIMITS.postcode }))}
                  </>
                )}
              </div>
            </section>

            <section className={styles.card} aria-labelledby="co-delivery">
              <div className={styles.cardHead}>
                <span className={styles.num}>3</span>
                <h2 id="co-delivery">Delivery options</h2>
                <p className={styles.headNote}>Choose a delivery option for your order.</p>
              </div>
              <label className={`${styles.option} ${styles.optionSelected}`}>
                <input type="radio" name="delivery" defaultChecked />
                <TruckIcon />
                <span><strong>Standard UK delivery</strong><small>Delivery in 3–5 working days</small></span>
                <b>FREE</b>
              </label>
              <div className={styles.collapse}>
                <button type="button" aria-expanded={instructionsOpen} onClick={() => setInstructionsOpen((open) => !open)}>
                  <ChatIcon /> <span>Delivery instructions <em>(optional)</em></span> <Chevron open={instructionsOpen} />
                </button>
                {instructionsOpen ? (
                  <>
                    <textarea value={fields.instructions} onChange={(event) => set("instructions", event.target.value)} rows={3} maxLength={LIMITS.instructions} placeholder="e.g. Please call 30 minutes before arrival" aria-label="Delivery instructions" />
                    <small className={styles.counter}>{fields.instructions.length}/{LIMITS.instructions}</small>
                  </>
                ) : null}
              </div>
            </section>

            <section className={styles.card} aria-labelledby="co-payment">
              <div className={styles.cardHead}>
                <span className={styles.num}>4</span>
                <h2 id="co-payment">Payment method</h2>
                <p className={styles.headNote}><LockIcon /> All transactions are secure and encrypted.</p>
              </div>
              <p className={styles.subtle}>Choose how you would like to pay</p>
              <div className={styles.express} hidden={!expressAvailable}>
                <div className={styles.expressHead}><strong>Express checkout</strong> <span>Faster option</span></div>
                <p>Pay quickly and securely with your saved payment method.</p>
                <div ref={expressMountRef} className={styles.expressMount} />
              </div>
              {expressAvailable ? <div className={styles.divider}><span>Or pay by card</span></div> : null}
              <div data-field="payment" className={shownError("payment") ? styles.invalid : undefined}>
                {freeOrder ? (
                  <p className={styles.notice}>Your discount covers the full order, so no payment is needed. Press <b>Place order</b> to finish.</p>
                ) : belowCardMinimum ? (
                  <p className={styles.notice} role="alert">
                    Card payments need a total of at least £0.30. With your discount this order comes to {formatGBP(total)}, so it can&rsquo;t be paid by card.
                    Please remove the discount code, or message us on WhatsApp ({WHATSAPP_NUMBER}).
                  </p>
                ) : !stripePublishableKey || stripeFailed ? (
                  <p className={styles.error} role="alert">Card payment isn&rsquo;t available right now. Please refresh the page, or message us on WhatsApp ({WHATSAPP_NUMBER}) to complete your order.</p>
                ) : !stripeReady ? (
                  <p className={styles.subtle}>Loading secure payment form…</p>
                ) : null}
                <div ref={paymentMountRef} className={styles.paymentMount} hidden={!cardPayable} />
                {/* What happens next for the chosen method, so it's clear what was picked. */}
                {cardPayable && stripeReady && !stripeFailed ? (
                  redirectMethod ? (
                    <div className={styles.methodNote} role="status">
                      <strong>Paying with {redirectMethod}</strong>
                      <p>
                        Press <b>Continue to {redirectMethod}</b> below. You&rsquo;ll go to {redirectMethod}&rsquo;s secure page to{" "}
                        {paymentType === "klarna" ? "choose how you’d like to pay (for example in instalments)" : paymentType === "amazon_pay" ? "sign in to your Amazon account and confirm" : "confirm your payment"}, then come
                        straight back here to see your order confirmation. Nothing is charged until you confirm there.
                      </p>
                    </div>
                  ) : (
                    <div className={paymentComplete ? `${styles.methodNote} ${styles.methodReady}` : styles.methodNote} role="status">
                      <strong>{paymentComplete ? "✓ Card details entered" : "Paying by card"}</strong>
                      <p>{paymentComplete ? <>Press <b>Pay {formatGBP(total)} securely</b> below to finish.</> : "Enter your card number, expiry date and security code above, then press Pay below."}</p>
                    </div>
                  )
                ) : null}
                {shownError("payment") ? <small className={styles.error} role="alert">{shownError("payment")}</small> : null}
              </div>
              <div className={styles.paySection}>
              <label className={styles.check}>
                <input type="checkbox" checked={fields.billingSame} onChange={(event) => set("billingSame", event.target.checked)} />
                <span>Billing address is the same as delivery address</span>
              </label>
              {!fields.billingSame ? (
                <div className={`${styles.grid} ${styles.billing}`}>
                  {field("billFirstName", <>First name <i>*</i></>, text("billFirstName", { autoComplete: "billing given-name", maxLength: LIMITS.name }))}
                  {field("billLastName", <>Surname <i>*</i></>, text("billLastName", { autoComplete: "billing family-name", maxLength: LIMITS.name }))}
                  {field("billAddress1", <>Address line 1 <i>*</i></>, text("billAddress1", { autoComplete: "billing address-line1", maxLength: LIMITS.address }), true)}
                  {field("billAddress2", <>Address line 2 <em>(optional)</em></>, text("billAddress2", { autoComplete: "billing address-line2", maxLength: LIMITS.address }), true)}
                  {field("billCity", <>Town / City <i>*</i></>, text("billCity", { autoComplete: "billing address-level2", maxLength: LIMITS.city }))}
                  {field("billPostcode", <>Postcode <i>*</i></>, text("billPostcode", { autoComplete: "billing postal-code", maxLength: LIMITS.postcode }))}
                </div>
              ) : null}
              {/* Honeypot: hidden from people (and screen readers), filled in by bots. */}
              <input className={styles.trap} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" onChange={(event) => { trapRef.current = event.target.value; }} />
              {payError ? <p className={styles.payError} role="alert">{payError}</p> : null}
              {touched && hasShownErrors ? <p className={styles.payError} role="alert">Please complete the highlighted fields.</p> : null}
              <button type="submit" className={styles.payButton} disabled={paying || pending || belowCardMinimum}>
                <LockIcon /> {paying ? "Processing payment…" : freeOrder ? "Place order" : redirectMethod ? `Continue to ${redirectMethod}` : `Pay ${formatGBP(total)} securely`} {!paying ? <span aria-hidden="true">→</span> : null}
              </button>
              <p className={styles.terms}>
                By placing your order, you agree to our <Link href="/faq/">Terms &amp; Conditions</Link>, <Link href="/contact/">Privacy Notice</Link> and <Link href="/returns/">Returns &amp; Guarantee</Link>.
              </p>
              <div className={styles.secureRow}>
                <ShieldIcon /> <span>Secure payments:</span>
                <img src="/payments/visa-svgrepo-com.svg" alt="Visa" />
                <img src="/payments/mastercard.svg" alt="Mastercard" />
                <img src="/payments/amex.svg" alt="American Express" />
                <img src="/payments/klarna.svg" alt="Klarna" />
                <img src="/payments/apple-pay.svg" alt="Apple Pay" />
                <img src="/payments/google-pay.svg" alt="Google Pay" />
              </div>
              </div>
            </section>
          </div>

          <aside className={styles.aside}>
            <section className={styles.card} aria-labelledby="co-order">
              <div className={styles.orderHead}>
                <h2 id="co-order">Your order</h2>
                <Link href="/cart/">Edit basket</Link>
              </div>
              <ul className={styles.orderItems}>
                {items.map((item) => {
                  const product = getProduct(item.slug);
                  const pricing = product ? getProductSizePricing(product, item.size) : null;
                  return (
                    <li key={`${item.slug}-${item.size}`}>
                      <span className={styles.thumb}>
                        {item.image ? <img src={item.image} alt="" /> : null}
                        <b className={item.quantity > 1 ? styles.qtyMany : undefined}>{item.quantity}</b>
                      </span>
                      <span className={styles.itemCopy}>
                        <strong>{item.name}</strong>
                        <small>{getCardCopy(item.slug).type}</small>
                        <small>{SIZE_LABELS[item.size] ?? item.size}</small>
                      </span>
                      <span className={styles.itemPrice}>{formatGBP((pricing?.sale ?? item.price) * item.quantity)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.code}>
                <button type="button" aria-expanded={codeOpen} onClick={() => setCodeOpen((open) => !open)}>
                  <TagIcon /> <span>Have a discount code?</span> <Chevron open={codeOpen} />
                </button>
                {codeOpen ? (
                  <div className={styles.codeRow}>
                    <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter code" aria-label="Discount code" autoComplete="off" maxLength={LIMITS.code} disabled={pending} />
                    <button type="button" disabled={pending || !code.trim()} onClick={() => applyCoupon(code).then(() => setCode("")).catch(() => undefined)}>Apply</button>
                  </div>
                ) : null}
                {cartError ? <p className={styles.error} role="alert">{cartError}</p> : null}
              </div>
              <dl className={styles.totals}>
                <div><dt>Subtotal</dt><dd>{formatGBP(shownSubtotal)}</dd></div>
                {totals && totals.discount > 0 ? (
                  <div className={styles.discount}>
                    <dt>
                      Discount{" "}
                      {coupons.map((applied) => (
                        <button type="button" key={applied} onClick={() => removeCoupon(applied).catch(() => undefined)} aria-label={`Remove discount code ${applied}`}>{applied.toUpperCase()} ×</button>
                      ))}
                    </dt>
                    <dd>−{formatGBP(totals.discount)}</dd>
                  </div>
                ) : null}
                {totals && totals.discount > 0 ? (
                  <p className={styles.discountNote}>{marketerCode ? `${discountPercent}% discount applied to original price` : "Welcome discount applied to the sale price"}</p>
                ) : null}
                <div><dt>Delivery</dt><dd>FREE</dd></div>
                <div className={styles.total}><dt>Total</dt><dd>{formatGBP(total)}<small>(incl. VAT)</small></dd></div>
              </dl>
              {/* Klarna instalments, so customers see the option before they reach the payment step. */}
              {cardPayable ? <KlarnaMessage amount={total} publishableKey={stripePublishableKey} className={styles.klarna} /> : null}
            </section>

          </aside>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

// ── Icons ──
const svg = (path: ReactNode, size = 20) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);
const LockIcon = () => svg(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>, 18);
const SearchIcon = () => svg(<path d="m21 21-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />, 18);
const TruckIcon = () => svg(<><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>, 26);
const ChatIcon = () => svg(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />, 22);
const TagIcon = () => svg(<><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>, 18);
const ShieldIcon = () => svg(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />, 26);
/** Union Jack as an image: Windows has no flag emoji (it shows the letters "GB"). */
const UkFlag = () => <img src="/flags/gb.svg" alt="" width="22" height="14" style={{ display: "inline-block", verticalAlign: "-2px", borderRadius: 2 }} />;
const Chevron = ({ open }: { open: boolean }) => <span className={styles.chevron} data-open={open || undefined}>{svg(<path d="m6 9 6 6 6-6" />, 18)}</span>;
