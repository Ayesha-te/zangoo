import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import CapriOrthoMattress2Client from "./CapriOrthoMattress2Client";

export const metadata: Metadata = {
  title: "Capri Ortho Mattress 2 | UK-Handcrafted Orthopaedic Support | Furniture Co.",
  description:
    "Capri Ortho Mattress 2 landing page with UK-handcrafted orthopaedic support, double-sided comfort, open coil springs, wire edge support, and WebP mattress imagery.",
};

export default function CapriOrthoMattress2Page() {
  return (
    <>
      <SiteHeader />
      <CapriOrthoMattress2Client />
      <SiteFooter />
    </>
  );
}
