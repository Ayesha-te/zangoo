import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import type { Policy } from "@/app/data/policies";

/** Delivery / Returns pages: rendered from app/data/policies.ts (the same text the product pages summarise). */
export function PolicyPage({ policy, label, related }: { policy: Policy; label: string; related: { label: string; href: string } }) {
  return (
    <>
      <SiteHeader />
      <Breadcrumbs items={[{ label }]} />
      <main className="simple-page policy-page">
        <section className="wrap simple-page-inner">
          <span className="sec-lbl">Customer Help</span>
          <h1>{policy.title}</h1>
          <p className="policy-intro">{policy.intro}</p>
          {policy.sections.map((section) => (
            <section className="policy-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </section>
          ))}
          <p className="policy-meta">
            Last updated {policy.updated}. See also our <Link href={related.href}>{related.label}</Link> or <Link href="/contact/">contact us</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
