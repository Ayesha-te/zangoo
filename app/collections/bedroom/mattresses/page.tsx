import type { Metadata } from "next";
import CollectionProductPage from "../../[slug]/[product]/page";

export const metadata: Metadata = {
  title: "Mattresses | Furniture Co.",
  description: "Browse orthopaedic mattress sale products in the Bedroom collection.",
};

export default function BedroomMattressesPage() {
  return <CollectionProductPage params={Promise.resolve({ slug: "bedroom", product: "mattresses" })} />;
}
