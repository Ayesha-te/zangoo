import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStripeCheckoutConfig } from "@/app/lib/woocommerce/api";
import { getStoreCatalog } from "@/app/lib/woocommerce/catalog";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import { WireframeExperience } from "@/app/product-page-wireframe/WireframeExperience";
import wireframeStyles from "@/app/product-page-wireframe/productPageWireframe.module.css";

type BedroomMattressPageProps = {
  params: Promise<{ item: string }>;
};

// One page per product in the store catalogue (WooCommerce, or the local catalogue as fallback).
export async function generateStaticParams() {
  const [{ products }, stripe] = await Promise.all([getStoreCatalog({ includeComingSoon: true }), getStripeCheckoutConfig()]);
  return products.map((mattress) => ({ item: mattress.slug }));
}

export async function generateMetadata({ params }: BedroomMattressPageProps): Promise<Metadata> {
  const { item } = await params;
  const product = (await getStoreCatalog({ includeComingSoon: true })).products.find((mattress) => mattress.slug === item);

  return {
    title: product?.copy?.seoTitle ? `${product.copy.seoTitle} | OrthoBedroom` : product ? `${product.name} | Orthopaedic Mattress Sale | OrthoBedroom` : "Orthopaedic Mattress | OrthoBedroom",
    description: product?.copy?.metaDescription ?? product?.description,
  };
}

export default async function BedroomMattressPage({ params }: BedroomMattressPageProps) {
  const { item } = await params;
  const [{ products }, stripe] = await Promise.all([getStoreCatalog({ includeComingSoon: true }), getStripeCheckoutConfig()]);
  const product = products.find((mattress) => mattress.slug === item);
  if (!product) notFound();

  // Related products: only ones customers can buy.
  const relatedProducts = products.filter((mattress) => mattress.slug !== product.slug && !mattress.comingSoon);

  return (
    <>
      <SiteHeader />
      <main className={wireframeStyles.page}>
        <WireframeExperience product={product} relatedProducts={relatedProducts} isPreview={false} stripeKey={stripe?.publishableKey ?? null} />
      </main>
      <SiteFooter />
    </>
  );
}
