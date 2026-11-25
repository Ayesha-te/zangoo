import type { Metadata } from "next";
import CollectionProductPage from "../../[slug]/[product]/page";

export const metadata: Metadata = {
  title: "Orthopaedic & Pocket Spring Mattresses | Free London Delivery | OrthoBedroom",
  description: "Shop UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels. Single, double and king sizes with free Greater London delivery and 0% finance.",
};

export default function BedroomMattressesPage() {
  return <CollectionProductPage params={Promise.resolve({ slug: "bedroom", product: "mattresses" })} />;
}
