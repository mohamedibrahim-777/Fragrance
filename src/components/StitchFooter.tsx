import Link from "next/link";

export function StitchFooter() {
  return (
    <footer className="w-full py-margin px-gutter flex flex-col md:flex-row justify-between items-center gap-unit bg-surface-container-lowest rounded-t-full border-t border-outline-variant/20 shadow-[0_-10px_40px_rgba(217,119,7,0.05)]">
      <div className="font-headline-md text-headline-md text-secondary">
        SHRI FRAGRANCE
      </div>
      <div className="flex flex-wrap justify-center gap-gutter">
        <Link
          href="/about"
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:translate-y-[-2px] transition-transform"
        >
          The Craft
        </Link>
        <Link
          href="/shipping-policy"
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:translate-y-[-2px] transition-transform"
        >
          Shipping Rituals
        </Link>
        <Link
          href="/privacy"
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:translate-y-[-2px] transition-transform"
        >
          Privacy Sanctuary
        </Link>
        <Link
          href="/contact"
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:translate-y-[-2px] transition-transform"
        >
          Contact Priest
        </Link>
      </div>
      <div className="font-body-md text-body-md text-tertiary text-center">
        © {new Date().getFullYear()} Shri Fragrance. Crafted for the Divine.
      </div>
    </footer>
  );
}
