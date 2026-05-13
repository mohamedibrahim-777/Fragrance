"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StitchFooter } from "@/components/StitchFooter";

export function SiteNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <StitchFooter />;
}

export function SiteMobileFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Footer />;
}
