import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateProductMetadata } from "../../../[slug]/[product]/[item]/page";
import { getMattressProduct, orthoMattressProducts } from "@/app/data/mattressProducts";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { WireframeExperience } from "@/app/product-page-wireframe/WireframeExperience";
import wireframeStyles from "@/app/product-page-wireframe/productPageWireframe.module.css";

type BedroomMattressPageProps = {
  params: Promise<{ item: string }>;
};

export function generateStaticParams() {
  return orthoMattressProducts.map((mattress) => ({
    item: mattress.slug,
  }));
}

export async function generateMetadata({ params }: BedroomMattressPageProps): Promise<Metadata> {
  const { item } = await params;

  return generateProductMetadata({
    params: Promise.resolve({ slug: "bedroom", product: "mattresses", item }),
  });
}

export default async function BedroomMattressPage({ params }: BedroomMattressPageProps) {
  const { item } = await params;
  const product = getMattressProduct(item);
  if (!product) notFound();

  const relatedProducts = orthoMattressProducts.filter((mattress) => mattress.slug !== product.slug).slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className={wireframeStyles.page}>
        <WireframeExperience product={product} relatedProducts={relatedProducts} isPreview={false} />
      </main>
      <SiteFooter />
    </>
  );
}
