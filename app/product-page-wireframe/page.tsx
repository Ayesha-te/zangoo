import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { getMattressProduct, orthoMattressProducts } from "@/app/data/mattressProducts";
import { WireframeExperience } from "./WireframeExperience";
import styles from "./productPageWireframe.module.css";

export const metadata: Metadata = {
  title: "Product Page Wireframe Preview | Furniture Co.",
  description: "Standalone product page wireframe preview for a mattress product layout.",
};

const product = getMattressProduct("capri-ortho-mattress") ?? orthoMattressProducts[0];
const relatedProducts = orthoMattressProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

export default function ProductPageWireframe() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <WireframeExperience product={product} relatedProducts={relatedProducts} />
      </main>
      <SiteFooter />
    </>
  );
}
