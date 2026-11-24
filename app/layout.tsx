import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { Checkout } from "@/components/checkout";
import { DemoBanner } from "@/components/demo-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Halden & Vale — Architectural objects for considered living",
    template: "%s · Halden & Vale",
  },
  description:
    "Hand-made lighting, vessels and furniture from small European workshops. An Aurum North demo storefront concept.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-hidden">
        <StoreProvider>
          <DemoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Checkout />
        </StoreProvider>
      </body>
    </html>
  );
}
