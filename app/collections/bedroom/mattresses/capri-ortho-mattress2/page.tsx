import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/app/components/site/SiteChrome";
import CapriOrthoMattress2Client from "./CapriOrthoMattress2Client";

export const metadata: Metadata = {
  title: "Capri Ortho Orthopaedic Mattress | Medium-to-Firm | OrthoBedroom",
  description:
    "Shop the UK-made Capri Ortho medium-to-firm orthopaedic mattress with open coil springs, wire-edge support and a double-sided 26cm design. Free UK delivery.",
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
