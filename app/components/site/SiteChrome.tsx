"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { collectionCategories, footerMainLinks, footerSocialLinks, navLinks } from "@/app/data/home";
import { useFavorites } from "@/app/components/favorites/FavoritesProvider";

const pendingSectionKey = "furnitureCoPendingSection";
const whatsappHref = "https://wa.me/447830376489";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.8h.1" />
      </svg>
    );
  }

  if (label === "Pinterest") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M10.5 20 12 13m0 0c-2.2-.4-2.6-2.1-2.1-3.5.6-1.7 2.2-2.5 4-1.9 1.7.6 2.4 2.3 1.8 4-.5 1.7-1.9 2.7-3.7 1.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function homeHref(href: string) {
  if (href === "#") return "/";
  if (href.startsWith("#")) return "/";
  return href;
}

function navHref(href: string, isHome: boolean) {
  if (href.startsWith("#")) return "/";
  return homeHref(href);
}

function sectionIdFromHref(href: string) {
  return href.startsWith("#") && href.length > 1 ? href.slice(1) : null;
}

function observedSectionId(href: string) {
  if (href === "/collections/") return "collections";
  return sectionIdFromHref(href);
}

export function SiteHeader() {
  const { favorites } = useFavorites();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDesktopCategory, setOpenDesktopCategory] = useState<string | null>(null);
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
    const sectionLinks = navLinks.filter((link) => observedSectionId(link.href));

    const updateActiveSection = () => {
      frame = 0;

      if (window.scrollY < 160) {
        setActiveHref("#");
        return;
      }

      const activationLine = Math.min(window.innerHeight * 0.34, 300);
      const current = sectionLinks.reduce(
        (active, link) => {
          const id = observedSectionId(link.href);
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

  useEffect(() => {
    if (!isHome) return;

    const pendingHref = window.sessionStorage.getItem(pendingSectionKey);
    if (!pendingHref) return;

    window.sessionStorage.removeItem(pendingSectionKey);

    if (pendingHref === "#") {
      window.history.replaceState(null, "", "/");
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        setActiveHref("#");
      });
      return;
    }

    const id = observedSectionId(pendingHref);
    if (!id) return;

    window.history.replaceState(null, "", "/");
    let attempts = 0;
    const scrollWhenReady = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        setActiveHref(pendingHref);
        return;
      }

      attempts += 1;
      if (attempts < 12) window.setTimeout(scrollWhenReady, 50);
    };

    window.requestAnimationFrame(scrollWhenReady);
  }, [isHome]);

  function onHomeHashClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setMenuOpen(false);

    if (!href.startsWith("#")) return;

    event.preventDefault();

    if (!isHome) {
      window.sessionStorage.setItem(pendingSectionKey, href);
      window.location.assign("/");
      return;
    }

    if (href === "#") {
      window.history.replaceState(null, "", "/");
      setActiveHref("#");
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    const id = sectionIdFromHref(href);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    window.history.replaceState(null, "", "/");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveHref(href);
  }

  return (
    <header>
      <nav className={`nav${scrolled ? " up" : ""}`} aria-label="Main navigation">
        <div className="announce-bar" aria-label="Store announcements">
          <div className="announce-track">
            <span>Summer mattress sale now live</span>
            <span>Free UK delivery on launch offers</span>
            <span>0% interest-free finance available</span>
          </div>
        </div>
        <div className="nav-in">
          <Link href="/" className="nav-logo" aria-label="Furniture Co. home">
            Furniture Co.
          </Link>
          <ul className="nav-links" role="list">
            {navLinks.map((link) => {
              const active =
                link.href === "/collections/"
                  ? pathname.startsWith("/collections") || (isHome && activeHref === "/collections/")
                  : isHome && activeHref === link.href;
              const hasMegaMenu = link.label === "Collections";
              const desktopCategory = collectionCategories.find((item) => item.label === openDesktopCategory);

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
                          {collectionCategories.map((item) => (
                            <li
                              className={`mega-category${openDesktopCategory === item.label ? " open" : ""}`}
                              key={item.label}
                              onMouseEnter={() => setOpenDesktopCategory(item.label)}
                              onFocus={() => setOpenDesktopCategory(item.label)}
                            >
                              <button
                                type="button"
                                className="mega-link"
                                aria-current={openDesktopCategory === item.label ? "true" : undefined}
                                aria-expanded={openDesktopCategory === item.label}
                                onClick={() => setOpenDesktopCategory(item.label)}
                              >
                                <span className="mega-link-copy">
                                  <strong>{item.label}</strong>
                                  <small>{item.groups.map((group) => group.label).join(", ")}</small>
                                </span>
                                <em className={`mega-link-badge${item.label === "Bedroom" ? " is-active" : ""}`}>{item.badge}</em>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div
                          className={`mega-products-panel${desktopCategory ? "" : " is-empty"}`}
                          aria-label={desktopCategory ? `${desktopCategory.label} subcategories` : "Subcategory instructions"}
                        >
                          {desktopCategory ? (
                            <>
                              <Link className="mega-panel-title" href={desktopCategory.href}>
                                View {desktopCategory.label}
                              </Link>
                              <ul className="mega-products" role="list">
                                {desktopCategory.groups.map((group) => (
                              <li className={`mega-product-group${"products" in group && group.products ? " has-products" : ""}`} key={group.label}>
                                <Link href={group.href}>{group.label}</Link>
                                {"products" in group && group.products ? (
                                  <ul
                                    className="mega-sub-products"
                                    role="list"
                                    aria-label={`${group.label} product pages`}
                                  >
                                    {group.products.map((product) => (
                                      <li key={product.label}>
                                        <Link href={product.href}>{product.label}</Link>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <p className="mega-products-hint">Hover over or select a room to view its subcategories.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="nav-tools" aria-label="Shopping tools">
            <Link href="/search/" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
            </Link>
            <Link href="/account/" aria-label="Account">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></svg>
            </Link>
            <Link href="/wishlist/" className="nav-wishlist" aria-label={`Favourite items, ${favorites.length} saved`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" /></svg>
              {favorites.length ? <span className="nav-wishlist-count">{favorites.length}</span> : null}
            </Link>
            <Link href="/cart/" aria-label="Cart">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-2 8H8L6 3H3m6 16a1 1 0 1 0 0 .1m9-.1a1 1 0 1 0 0 .1" /></svg>
            </Link>
          </div>
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
            const active =
              link.href === "/collections/"
                ? pathname.startsWith("/collections") || (isHome && activeHref === "/collections/")
                : isHome && activeHref === link.href;
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
                    {collectionCategories.map((item) => (
                      <li key={item.label}>
                        <div className="mob-category-btn">
                          <Link
                            href={item.href}
                            className="mob-category-label"
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                          <button
                            className="mob-category-meta"
                            type="button"
                            aria-label={`Toggle ${item.label} subcategories`}
                            aria-expanded={openMobileCategory === item.label}
                            onClick={() => {
                              setOpenMobileCategory((current) => (current === item.label ? null : item.label));
                              setOpenMobileGroup(null);
                            }}
                          >
                            <em className={item.label === "Bedroom" ? "is-active" : undefined}>{item.badge}</em>
                            <b aria-hidden="true">&gt;</b>
                          </button>
                        </div>
                        {openMobileCategory === item.label ? (
                          <ul className="mob-product-links" role="list" aria-label={`${item.label} products`}>
                            <li>
                              <Link href={item.href} onClick={() => setMenuOpen(false)}>View {item.label}</Link>
                            </li>
                            {item.groups.map((group) => {
                              const groupKey = `${item.label}:${group.label}`;
                              const products = "products" in group ? group.products : undefined;
                              const hasProducts = Boolean(products);

                              return (
                                <li key={group.label}>
                                  {hasProducts ? (
                                    <div className="mob-product-btn">
                                      <Link
                                        href={group.href}
                                        className="mob-product-label"
                                        onClick={() => setMenuOpen(false)}
                                      >
                                        {group.label}
                                      </Link>
                                      <button
                                        className="mob-product-toggle"
                                        type="button"
                                        aria-label={`Toggle ${group.label} subcategories`}
                                        aria-expanded={openMobileGroup === groupKey}
                                        onClick={() => setOpenMobileGroup((current) => (current === groupKey ? null : groupKey))}
                                      >
                                        <b aria-hidden="true">&gt;</b>
                                      </button>
                                    </div>
                                  ) : (
                                    <Link href={group.href} onClick={() => setMenuOpen(false)}>{group.label}</Link>
                                  )}
                                  {hasProducts && openMobileGroup === groupKey ? (
                                    <ul className="mob-product-sub-links" role="list" aria-label={`${group.label} product pages`}>
                                      <li>
                                        <Link href={group.href} onClick={() => setMenuOpen(false)}>View {group.label}</Link>
                                      </li>
                                      {products?.map((product) => (
                                        <li key={product.label}>
                                          <Link href={product.href} onClick={() => setMenuOpen(false)}>{product.label}</Link>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                              </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
        <a href={whatsappHref} className="mob-consult-link" target="_blank" rel="noopener noreferrer">
          Book a free consultation
        </a>
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
          <p>Responsibly crafted furniture, with mattress offers launching first.</p>
          <div className="foot-social" aria-label="Social links">
            {footerSocialLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.label} aria-label={link.label}>
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
        </div>
        <nav className="foot-main-nav" aria-label="Footer main navigation">
          <h2>Main Menu</h2>
          <ul className="foot-links" role="list">
            {footerMainLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="foot-support-nav" aria-label="Footer support navigation">
          <h2>Support</h2>
          <ul className="foot-links" role="list">
            <li>
              <Link href="/faq/">Returns &amp; Guarantee</Link>
            </li>
            <li>
              <Link href="/contact/">Secure Enquiry</Link>
            </li>
            <li>
              <Link href="/contact/">Privacy Notice</Link>
            </li>
            <li>
              <Link href="/contact/">Accessibility Statement</Link>
            </li>
            <li>
              <Link href="/contact/">Contact Support</Link>
            </li>
          </ul>
        </nav>
        <form className="foot-newsletter" aria-label="Footer newsletter sign-up">
          <h2>Newsletter</h2>
          <p>Mattress sale updates, launches, and room guides.</p>
          <label>
            <span>Email address</span>
            <input type="email" placeholder="you@example.com" required />
          </label>
          <button type="submit">Subscribe</button>
        </form>
        <p className="foot-copy">
          <small>&copy; 2026 Furniture Co. All rights reserved.</small>
        </p>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
