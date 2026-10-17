import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { FavoritesProvider } from "@/app/components/favorites/FavoritesProvider";
import { CartProvider } from "@/app/components/cart/CartProvider";
import { CatalogProvider } from "@/app/components/catalog/CatalogProvider";
import { getStoreCatalog, getStoreUrl } from "@/app/lib/woocommerce/catalog";
import { FloatingWhatsApp } from "@/app/components/site/FloatingWhatsApp";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orthopaedic Mattresses UK | London-Based | OrthoKip",
  description: "Shop UK-made orthopaedic mattresses in medium-to-firm, firm and extra-firm feels. Based in Ilford, London, with free UK delivery, 0% finance and a 1-year guarantee.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Store catalogue from WooCommerce at build time (local catalogue as fallback). Only the public store URL
  // reaches the browser (for the WooCommerce cart); API credentials stay on the server.
  const catalog = await getStoreCatalog();
  const storeUrl = catalog.source === "woocommerce" ? getStoreUrl() : null;

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CatalogProvider products={catalog.products} storeUrl={storeUrl}><FavoritesProvider><CartProvider>{children}<FloatingWhatsApp /></CartProvider></FavoritesProvider></CatalogProvider>
      </body>
    </html>
  );
}
