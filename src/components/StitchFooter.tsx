"use client";

import Link from "next/link";

export function StitchFooter() {
  return (
    <footer className="relative w-full mt-margin bg-surface-container-lowest/90 backdrop-blur-sm border-t border-tertiary/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tertiary/50 to-transparent" />

      <div className="max-w-container-max-width mx-auto px-gutter py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="text-[10px] tracking-[0.55em] text-tertiary/70 uppercase font-headline-md">
            ✦ Est. Salem ✦
          </p>
          <h3 className="mt-1 font-headline-lg text-2xl text-primary tracking-[0.3em] uppercase drop-shadow-[0_1px_8px_rgba(247,189,72,0.2)]">
            SHRI
          </h3>
          <p className="text-[10px] tracking-[0.55em] text-tertiary/70 uppercase font-headline-md">
            Fragrance
          </p>
          <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
            Handcrafted temple agarbatti from the heart of Tamil Nadu.
            Sacred craft since 1947.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-headline-md text-sm tracking-[0.3em] uppercase text-tertiary mb-4">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="text-on-surface-variant hover:text-tertiary transition-colors">All Fragrances</Link></li>
            <li><Link href="/collections/agarbatti-sandalwood" className="text-on-surface-variant hover:text-tertiary transition-colors">Sandalwood</Link></li>
            <li><Link href="/collections/agarbatti-jasmine" className="text-on-surface-variant hover:text-tertiary transition-colors">Jasmine</Link></li>
            <li><Link href="/collections/agarbatti-temple" className="text-on-surface-variant hover:text-tertiary transition-colors">Temple Blend</Link></li>
          </ul>
        </div>

        {/* Sanctuary */}
        <div>
          <h4 className="font-headline-md text-sm tracking-[0.3em] uppercase text-tertiary mb-4">
            Sanctuary
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-on-surface-variant hover:text-tertiary transition-colors">The Craft</Link></li>
            <li><Link href="/shipping-policy" className="text-on-surface-variant hover:text-tertiary transition-colors">Shipping Rituals</Link></li>
            <li><Link href="/refund-policy" className="text-on-surface-variant hover:text-tertiary transition-colors">Refund Policy</Link></li>
            <li><Link href="/privacy" className="text-on-surface-variant hover:text-tertiary transition-colors">Privacy Sanctuary</Link></li>
            <li><Link href="/terms" className="text-on-surface-variant hover:text-tertiary transition-colors">Terms</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-headline-md text-sm tracking-[0.3em] uppercase text-tertiary mb-4">
            Reach Us
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="text-on-surface-variant hover:text-tertiary transition-colors">Contact Priest</Link></li>
            <li><a href="mailto:melwinanto77@gmail.com" className="text-on-surface-variant hover:text-tertiary transition-colors">melwinanto77@gmail.com</a></li>
            <li><a href="tel:+916369109974" className="text-on-surface-variant hover:text-tertiary transition-colors">+91 63691 09974</a></li>
            <li><span className="text-on-surface-variant">Salem, Tamil Nadu</span></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noopener" className="brass-medallion !w-9 !h-9">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </a>
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noopener" className="brass-medallion !w-9 !h-9">
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
            </a>
            <a aria-label="WhatsApp" href="https://wa.me/916369109974" target="_blank" rel="noopener" className="brass-medallion !w-9 !h-9">
              <span className="material-symbols-outlined text-[16px]">chat</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/20">
        <div className="max-w-container-max-width mx-auto px-gutter py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-on-surface-variant tracking-wider">
            © {new Date().getFullYear()} Shri Fragrance. Crafted for the Divine.
          </p>
          <p className="text-tertiary/70 tracking-[0.3em] uppercase">
            ॐ &nbsp;•&nbsp; Made with devotion in Salem &nbsp;•&nbsp; ॐ
          </p>
        </div>
      </div>
    </footer>
  );
}
