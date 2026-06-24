"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/app/data/home";
import { primaryButtonClasses } from "./buttonClasses";

function homeHref(href: string) {
  if (href === "#") return "/";
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header>
      <nav className={`nav${scrolled ? " up" : ""}`} aria-label="Main navigation">
        <div className="nav-in">
          <Link href="/" className="nav-logo" aria-label="Furniture Co. home">
            Furniture Co.
          </Link>
          <ul className="nav-links" role="list">
            {navLinks.map((link) => {
              const active = isHome && link.active;

              return (
                <li key={link.label}>
                  <Link href={homeHref(link.href)} className={active ? "act" : undefined} aria-current={active ? "page" : undefined}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/#contact"
            className="nav-cta inline-flex min-h-11 shrink-0 items-center rounded-lg border border-[#1557A7] px-4 py-2 text-sm font-semibold text-[#1557A7] transition hover:bg-[#1557A7] hover:text-white"
          >
            Book Consultation
          </Link>
          <button
            className="hbg"
            aria-expanded={menuOpen}
            aria-controls="mob"
            aria-label="Toggle menu"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className={`mob-menu${menuOpen ? " open" : ""}`} id="mob" hidden={!menuOpen} aria-label="Mobile navigation">
        <ul className="mob-links" role="list">
          {navLinks.map((link) => {
            const active = isHome && link.active;

            return (
              <li key={link.label}>
                <Link
                  href={homeHref(link.href)}
                  className={active ? "act" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/#contact" className={`${primaryButtonClasses} mob-cta`} onClick={() => setMenuOpen(false)}>
          Book Free Consultation
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer role="contentinfo">
      <div className="foot-in">
        <div className="foot-brand">
          <Link href="/" className="foot-logo" aria-label="Furniture Co. home">
            Furniture Co.
          </Link>
          <p className="foot-copy">
            <small>&copy; 2026 Furniture Co. All rights reserved.</small>
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="foot-links" role="list">
            <li>
              <Link href="/#faq">Returns &amp; Warranty</Link>
            </li>
            <li>
              <Link href="/#contact">Secure Enquiry</Link>
            </li>
            <li>
              <Link href="/#contact">Privacy Notice</Link>
            </li>
            <li>
              <Link href="/#contact">Accessibility Statement</Link>
            </li>
            <li>
              <Link href="/#contact">Contact Support</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
