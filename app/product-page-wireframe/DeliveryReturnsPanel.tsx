import Link from "next/link";
import type { MattressProduct } from "@/app/data/mattressProducts";
import { productDeliverySummary } from "@/app/data/policies";
import styles from "./productPageWireframe.module.css";

/**
 * Product page "Delivery, Guarantee & Returns": the delivery area and returns summary come from the Delivery and
 * Returns pages' data (app/data/policies.ts); the product's own guarantee / warranty line is kept.
 */
export function DeliveryReturnsPanel({ product, deliveryReturns }: { product: MattressProduct; deliveryReturns: string }) {
  // "• <strong>1-Year Warranty</strong> - …" lines from the product's own text.
  const guarantee = deliveryReturns
    .split(/\n\s*\n|\n(?=\s*•)/)
    .map((line) => line.trim().replace(/^•\s*/, ""))
    .map((line) => line.match(/^<strong>(.*?)<\/strong>\s*-\s*([\s\S]*)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match && /warrant|guarantee/i.test(match[1])))
    .map((match) => ({ title: match[1].replace(/\s*&\s*Finance$/i, ""), text: match[2].trim() }));
  const points = [...productDeliverySummary(product), ...guarantee];

  return (
    <div className={styles.policyPanel}>
      <ul>
        {points.map((point) => (
          <li key={point.title}>
            <strong>{point.title}</strong> - {point.text}
          </li>
        ))}
      </ul>
      <p>
        Full details: <Link href="/delivery/">Delivery Information</Link> · <Link href="/returns/">Returns &amp; Guarantee</Link>
      </p>
    </div>
  );
}
