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
  { href: "/products", label: "Shop", icon: Grid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile", label: "Account", icon: User },
];

const ADMIN_TAB = { href: "/admin", label: "Dashboard", icon: LayoutDashboard };

export function Footer() {
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tabs =
    mounted && user?.role === "Admin"
      ? [BASE_TABS[0], ADMIN_TAB, ...BASE_TABS.slice(1)]
      : BASE_TABS;

  return (
    <>
      <div className="h-20 md:hidden" />
      <nav className="fixed inset-x-0 bottom-0 z-30 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 shadow-[0_-4px_30px_rgba(0,0,0,0.6)]">
        <ul className="mx-auto flex max-w-[1200px] items-center justify-around px-2 py-2">
          {tabs.map((t) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
            const Icon = t.icon;
            return (
              <li key={t.href} className="flex-1">
                <Link
                  href={t.href}
                  className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                    active
                      ? "text-tertiary"
                      : "text-on-surface-variant hover:text-tertiary"
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
