"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/components/cart/CartProvider";
import { useFavorites } from "@/app/components/favorites/FavoritesProvider";

type Mode = "sign-in" | "register";

const benefits = [
  { title: "Track your orders", text: "See delivery dates and order status in one place." },
  { title: "Faster checkout", text: "Save your delivery address and details for next time." },
  { title: "Saved favourites", text: "Keep your wishlist across your phone and computer." },
  { title: "Members-only offers", text: "Early access to mattress sales and new launches." },
];

export function AccountExperience() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [notice, setNotice] = useState("");
  const { favorites } = useFavorites();
  const { count } = useCart();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Accounts have no backend yet: be honest instead of pretending to sign the customer in.
    setNotice("Customer accounts are launching soon. For help with an order, please contact our team.");
  }

  return (
    <div className="account-layout">
      <section className="account-card" aria-labelledby="account-form-title">
        <div className="account-tabs" role="tablist" aria-label="Account options">
          {(["sign-in", "register"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              className={mode === item ? "is-active" : undefined}
              onClick={() => {
                setMode(item);
                setNotice("");
              }}
            >
              {item === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <h2 id="account-form-title">{mode === "sign-in" ? "Welcome back" : "Create your account"}</h2>
        <p className="account-sub">
          {mode === "sign-in" ? "Sign in to see your orders and saved pieces." : "It only takes a minute."}
        </p>

        <form className="account-form" onSubmit={submit}>
          {mode === "register" ? (
            <label>
              Full name
              <input type="text" name="name" autoComplete="name" required />
            </label>
          ) : null}
          <label>
            Email address
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" name="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={8} required />
          </label>
          {mode === "sign-in" ? (
            <div className="account-row">
              <label className="account-check">
                <input type="checkbox" name="remember" /> Remember me
              </label>
              <Link href="/contact/">Forgot password?</Link>
            </div>
          ) : (
            <label className="account-check">
              <input type="checkbox" name="offers" /> Email me mattress offers and new launches
            </label>
          )}
          <button className="btn btn-p" type="submit">
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
          {notice ? (
            <p className="account-notice" role="status">
              {notice}
            </p>
          ) : null}
        </form>
      </section>

      <aside className="account-side">
        <section className="account-panel" aria-labelledby="account-benefits-title">
          <h2 id="account-benefits-title">With an account you can</h2>
          <ul className="account-benefits" role="list">
            {benefits.map((benefit) => (
              <li key={benefit.title}>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>{benefit.title}</strong>
                  <small>{benefit.text}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <nav className="account-panel account-quick" aria-label="Quick links">
          <Link href="/wishlist/">
            <strong>Wishlist</strong>
            <small>{favorites.length ? `${favorites.length} saved ${favorites.length === 1 ? "piece" : "pieces"}` : "Your saved pieces"}</small>
          </Link>
          <Link href="/cart/">
            <strong>Basket</strong>
            <small>{count ? `${count} ${count === 1 ? "item" : "items"}` : "Ready when you are"}</small>
          </Link>
          <Link href="/contact/">
            <strong>Order help</strong>
            <small>Talk to our team</small>
          </Link>
        </nav>
      </aside>
    </div>
  );
}
