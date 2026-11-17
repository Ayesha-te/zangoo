import type { Metadata } from "next";
import { PolicyPage } from "@/app/components/site/PolicyPage";
import { DELIVERY_POLICY } from "@/app/data/policies";

export const metadata: Metadata = {
  title: "Delivery Information | OrthoBedroom",
  description: "Free mattress delivery from OrthoBedroom: delivery areas (London or UK), delivery times and what to expect.",
};

export default function DeliveryPage() {
  return <PolicyPage policy={DELIVERY_POLICY} label="Delivery" related={{ label: "Returns & Guarantee", href: "/returns/" }} />;
}
