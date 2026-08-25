import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/lib/CartContext";
import FloatingCartBar from "@/components/FloatingCartBar";
import MadeByBadge from "@/components/MadeByBadge";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PizzaFlix",
  description: "More Than Fast Food. It's an Experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebas.variable} ${inter.variable} antialiased`}
      >
        <CartProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <FloatingCartBar />
          <MadeByBadge />
        </CartProvider>
      </body>
    </html>
  );
}