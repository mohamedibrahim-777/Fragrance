"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main nav */}
      <nav className="bg-surface/85 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_4px_30px_rgba(217,119,7,0.12)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-gutter py-3 max-w-container-max-width mx-auto gap-6">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-7 justify-end">
            <Link href="/products" className="nav-link font-headline-md text-sm tracking-[0.25em] uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300">
              Our Products
            </Link>
            <Link href="/products?cat=agarbatti-sandalwood" className="nav-link font-headline-md text-sm tracking-[0.25em] uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300">
              Fragrances
            </Link>
            <Link href="/about" className="nav-link font-headline-md text-sm tracking-[0.25em] uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300">
              Heritage
            </Link>
            <Link href="/collections/agarbatti-temple" className="nav-link font-headline-md text-sm tracking-[0.25em] uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300">
              Rituals
            </Link>
          </div>

          {/* Centered brand emblem */}
          <Link href="/" className="flex flex-col items-center group" aria-label="Shri Fragrance — home">
            <span className="text-[10px] tracking-[0.55em] text-tertiary/70 uppercase font-headline-md">
              ✦ Est. Salem ✦
            </span>
            <span className="font-headline-lg text-2xl md:text-3xl text-primary tracking-[0.35em] uppercase mt-0.5 drop-shadow-[0_1px_8px_rgba(247,189,72,0.25)]">
              SHRI
            </span>
            <span className="-mt-0.5 text-[10px] tracking-[0.55em] text-tertiary/70 uppercase font-headline-md">
              Fragrance
            </span>
          </Link>

          {/* Right utility */}
          <div className="flex items-center gap-3 justify-start md:justify-end">
            <Link href="/search" aria-label="Search" className="brass-medallion md:flex hidden">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="brass-medallion">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </Link>
            <Link href="/cart" aria-label="Cart" className="brass-medallion">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </Link>
            <Link href="/profile" aria-label="Profile" className="brass-medallion">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>

        {/* Bottom gold hairline */}
        <div className="h-px bg-gradient-to-r from-transparent via-tertiary/40 to-transparent" />
      </nav>
    </header>
  );
}
