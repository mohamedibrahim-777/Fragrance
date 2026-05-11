import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Catamaran } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthSync } from "@/components/AuthSync";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const catamaran = Catamaran({
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-catamaran",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shri Fragrance — Pooja essentials, delivered fresh",
  description:
    "South Indian devotional fragrance: agarbatti, sambrani, vilakku, karpooram, pooja oils.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${catamaran.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background text-ink">
        <AuthSync />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
