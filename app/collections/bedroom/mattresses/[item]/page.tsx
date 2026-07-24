import type { Metadata } from "next";
import ProductLandingPage, { generateMetadata as generateProductMetadata } from "../../../[slug]/[product]/[item]/page";
import { orthoMattressProducts } from "@/app/data/mattressProducts";

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

  return (
    <ProductLandingPage
      params={Promise.resolve({ slug: "bedroom", product: "mattresses", item })}
    />
  );
}
