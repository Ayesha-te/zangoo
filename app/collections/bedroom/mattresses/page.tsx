import type { Metadata } from "next";
import CollectionProductPage from "../../[slug]/[product]/page";

export const metadata: Metadata = {
  title: "Orthopaedic Mattresses UK | Free UK Delivery | OrthoBedroom",
  description: "Shop UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels. Single, double and king sizes with free UK delivery and 0% finance.",
};

export default function BedroomMattressesPage() {
  return <CollectionProductPage params={Promise.resolve({ slug: "bedroom", product: "mattresses" })} />;
}
