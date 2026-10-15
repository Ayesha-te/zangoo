import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreCatalog } from "@/app/lib/woocommerce/catalog";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { WireframeExperience } from "@/app/product-page-wireframe/WireframeExperience";
import wireframeStyles from "@/app/product-page-wireframe/productPageWireframe.module.css";

type BedroomMattressPageProps = {
  params: Promise<{ item: string }>;
};

// One page per product in the store catalogue (WooCommerce, or the local catalogue as fallback).
export async function generateStaticParams() {
  const { products } = await getStoreCatalog();
  return products.map((mattress) => ({ item: mattress.slug }));
}

export async function generateMetadata({ params }: BedroomMattressPageProps): Promise<Metadata> {
  const { item } = await params;
  const product = (await getStoreCatalog()).products.find((mattress) => mattress.slug === item);

  return {
    title: product ? `${product.name} | Orthopaedic Mattress Sale | Furniture Co.` : "Orthopaedic Mattress | Furniture Co.",
    description: product?.description,
  };
}

export default async function BedroomMattressPage({ params }: BedroomMattressPageProps) {
  const { item } = await params;
  const { products } = await getStoreCatalog();
  const product = products.find((mattress) => mattress.slug === item);
  if (!product) notFound();

  const relatedProducts = products.filter((mattress) => mattress.slug !== product.slug);

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
