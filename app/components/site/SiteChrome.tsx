"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collectionMenu, navLinks } from "@/app/data/home";

function homeHref(href: string) {
  if (href === "#") return "/";
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

function navHref(href: string, isHome: boolean) {
  if (isHome && href.startsWith("#")) return href;
  return homeHref(href);
}

function sectionIdFromHref(href: string) {
  return href.startsWith("#") && href.length > 1 ? href.slice(1) : null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#");

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

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeDesktopMenu = () => {
      if (desktopQuery.matches) setMenuOpen(false);
    };

    closeDesktopMenu();
    desktopQuery.addEventListener("change", closeDesktopMenu);
    return () => desktopQuery.removeEventListener("change", closeDesktopMenu);
  }, []);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    let frame = 0;
    const sectionLinks = navLinks.filter((link) => sectionIdFromHref(link.href));

    const updateActiveSection = () => {
      frame = 0;

      if (window.scrollY < 160) {
        setActiveHref("#");
        return;
      }

      const activationLine = Math.min(window.innerHeight * 0.34, 300);
      const current = sectionLinks.reduce(
        (active, link) => {
          const id = sectionIdFromHref(link.href);
          const section = id ? document.getElementById(id) : null;
          if (!section) return active;

          const top = section.getBoundingClientRect().top;
          return top <= activationLine && top > active.top ? { href: link.href, top } : active;
        },
        { href: "#", top: Number.NEGATIVE_INFINITY },
      );

      setActiveHref(current.href);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  function onHomeHashClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setMenuOpen(false);

    if (!href.startsWith("#")) return;
    if (!isHome) return;

    event.preventDefault();

    if (href === "#") {
      window.history.pushState(null, "", "/");
      setActiveHref("#");
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    const id = sectionIdFromHref(href);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    window.history.pushState(null, "", href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveHref(href);
  }

  return (
    <header>
      <nav className={`nav${scrolled ? " up" : ""}`} aria-label="Main navigation">
        <div className="nav-in">
          <Link href="/" className="nav-logo" aria-label="Furniture Co. home">
            Furniture Co.
          </Link>
          <ul className="nav-links" role="list">
            {navLinks.map((link) => {
              const active = link.href === "/collections/" ? pathname.startsWith("/collections") : isHome && activeHref === link.href;
              const hasMegaMenu = link.label === "Collections";

              return (
                <li className={hasMegaMenu ? "nav-item has-mega" : "nav-item"} key={link.label}>
                  <Link
                    href={navHref(link.href, isHome)}
                    className={active ? "act" : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => onHomeHashClick(event, link.href)}
                  >
                    {link.label}
                  </Link>
                  {hasMegaMenu ? (
                    <div className="mega-menu" aria-label="Collection subcategories">
                      <div className="mega-panel">
                        <div className="mega-intro">
                          <span>Shop by room</span>
                          <strong>Explore collections</strong>
                          <p>Browse the main furniture categories, including the current bedroom mattress sale.</p>
                        </div>
                        <ul className="mega-links" role="list">
                          {collectionMenu.map((item) => (
                            <li key={item.label}>
                              <Link className="mega-link" href={item.href}>
                                <span className="mega-link-copy">
                                  <strong>{item.label}</strong>
                                  <small>{item.description}</small>
                                </span>
                                <em className="mega-link-badge">{item.badge}</em>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
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
      <div className={`mob-menu${menuOpen ? " open" : ""}`} id="mob" aria-hidden={!menuOpen} aria-label="Mobile navigation">
        <ul className="mob-links" role="list">
          {navLinks.map((link) => {
            const active = link.href === "/collections/" ? pathname.startsWith("/collections") : isHome && activeHref === link.href;
            const hasCollections = link.label === "Collections";

            return (
              <li key={link.label}>
                <Link
                  href={navHref(link.href, isHome)}
                  className={active ? "act" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => onHomeHashClick(event, link.href)}
                >
                  {link.label}
                </Link>
                {hasCollections ? (
                  <ul className="mob-sub-links" role="list" aria-label="Collection subcategories">
                    {collectionMenu.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} onClick={() => setMenuOpen(false)}>
                          <span>{item.label}</span>
                          <em>{item.badge}</em>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <Link href="/#contact" className="mob-consult-link" onClick={(event) => onHomeHashClick(event, "#contact")}>
          Book a free consultation
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer role="contentinfo">
      <div className="foot-in">
        <Link href="/" className="foot-logo" aria-label="Furniture Co. home">
          Furniture Co.
        </Link>
        <nav aria-label="Footer navigation">
          <ul className="foot-links" role="list">
            <li>
              <Link href="/about/">About Us</Link>
            </li>
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
        <p className="foot-copy">
          <small>&copy; 2026 Furniture Co. All rights reserved.</small>
        </p>
      </div>
    </footer>
  );
}
