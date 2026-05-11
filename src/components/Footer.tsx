"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid,
  ShoppingCart,
  Heart,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/store";
import { useEffect, useState } from "react";

const BASE_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Categories", icon: Grid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile", label: "Account", icon: User },
];

const ADMIN_TAB = {
  href: "/admin",
  label: "Dashboard",
  icon: LayoutDashboard,
};

export function Footer() {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Admin: insert Dashboard between Home and Categories
  const tabs =
    mounted && user?.role === "Admin"
      ? [BASE_TABS[0], ADMIN_TAB, ...BASE_TABS.slice(1)]
      : BASE_TABS;

  return (
    <>
      {/* spacer so content isn't hidden behind sticky bottom nav */}
      <div className="h-20" />

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white shadow-[0_-4px_12px_-6px_rgba(42,31,21,0.1)]">
        <ul className="mx-auto flex max-w-[1200px] items-center justify-around px-2 py-2">
          {tabs.map((t) => {
            const active =
              t.href === "/"
                ? pathname === "/"
                : pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium ${
                    active ? "text-brand" : "text-ink-muted"
                  }`}
                >
                  <Icon size={20} />
                  <span>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
