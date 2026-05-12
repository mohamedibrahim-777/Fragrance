import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_4px_30px_rgba(217,119,7,0.1)]">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max-width mx-auto">
        <Link
          href="/"
          className="font-headline-lg text-headline-lg text-primary tracking-widest uppercase"
        >
          SHRI FRAGRANCE
        </Link>

        <div className="hidden md:flex space-x-gutter">
          <Link
            href="/products"
            className="font-headline-md text-headline-md tracking-tight text-on-surface-variant hover:text-tertiary transition-colors duration-300"
          >
            Fragrances
          </Link>
          <Link
            href="/about"
            className="font-headline-md text-headline-md tracking-tight text-on-surface-variant hover:text-tertiary transition-colors duration-300"
          >
            Heritage
          </Link>
          <Link
            href="/products"
            className="font-headline-md text-headline-md tracking-tight text-on-surface-variant hover:text-tertiary transition-colors duration-300"
          >
            Rituals
          </Link>
        </div>

        <div className="flex space-x-unit">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="text-tertiary hover:text-secondary-fixed-dim transition-all duration-300"
          >
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-tertiary hover:text-secondary-fixed-dim transition-all duration-300"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
