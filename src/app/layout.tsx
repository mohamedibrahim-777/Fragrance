import type { Metadata } from "next";
import { Manrope, Noto_Serif, Catamaran } from "next/font/google";
import { SiteNavbar, SiteFooter, SiteMobileFooter } from "@/components/SiteChrome";
import { AuthSync } from "@/components/AuthSync";
import { TempleBackdrop } from "@/components/TempleBackdrop";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const catamaran = Catamaran({
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-catamaran",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shri Fragrance — Divine Temple Agarbatti Experience",
  description:
    "Handcrafted incense inspired by the hallowed atmosphere of Dravidian architecture and morning pujas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${manrope.variable} ${notoSerif.variable} ${catamaran.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-background font-body-md temple-aura min-h-screen flex flex-col">
        <AuthSync />
        <TempleBackdrop />
        <SiteNavbar />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
        <SiteMobileFooter />
      </body>
    </html>
  );
}
