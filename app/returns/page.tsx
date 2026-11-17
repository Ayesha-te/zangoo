import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/site/PolicyPage";
import { RETURNS_POLICY } from "@/app/data/policies";

export const metadata: Metadata = {
  title: "Returns & Guarantee | OrthoBedroom",
  description: "OrthoBedroom returns: 14-day cancellation for online orders, faulty items, our 1-year guarantee and refunds.",
};

export default function ReturnsPage() {
  return <PolicyPage policy={RETURNS_POLICY} label="Returns & Guarantee" related={{ label: "Delivery Information", href: "/delivery/" }} />;
}
