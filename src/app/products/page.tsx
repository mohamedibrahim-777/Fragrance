import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="temple-stone-bg flex-grow pt-[120px] pb-margin px-gutter max-w-container-max-width mx-auto w-full relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-outline-variant/0 via-outline-variant/10 to-outline-variant/0 -z-10" />
      <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-outline-variant/0 via-outline-variant/10 to-outline-variant/0 -z-10" />

      {/* Header & Filters */}
      <header className="mb-margin flex flex-col md:flex-row justify-between items-end gap-gutter border-b weathered-border pb-gutter relative">
        <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-tertiary/40 to-transparent" />
        <div>
          <h1
            className="font-headline-xl text-headline-xl text-tertiary mb-unit"
            style={{ textShadow: "0 4px 20px rgba(247,189,72,0.15)" }}
          >
            Sacred Fragrances
          </h1>
          <p className="font-body-lg text-body-lg text-outline max-w-2xl">
            Discover our collection of divine scents, meticulously hand-rolled
            in the South Indian tradition. Each fragrance is an offering,
            designed to elevate your daily rituals.
          </p>
        </div>
        <div className="flex gap-unit flex-wrap">
          <button className="px-5 py-2.5 bg-surface-container text-tertiary rounded-sm font-label-sm text-label-sm uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/40 border-b border-r border-surface-container-lowest hover:bg-surface-variant transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(247,189,72,0.4)]">All</span>
          </button>
          <button className="px-5 py-2.5 bg-surface-container-lowest text-outline rounded-sm font-label-sm text-label-sm uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.02),_0_2px_4px_rgba(0,0,0,0.3)] border-t border-l border-outline-variant/20 border-b border-r border-black hover:text-tertiary hover:border-outline-variant/40 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <span className="relative z-10">Floral</span>
          </button>
          <button className="px-5 py-2.5 bg-surface-container-lowest text-outline rounded-sm font-label-sm text-label-sm uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.02),_0_2px_4px_rgba(0,0,0,0.3)] border-t border-l border-outline-variant/20 border-b border-r border-black hover:text-tertiary hover:border-outline-variant/40 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <span className="relative z-10">Woody</span>
          </button>
          <button className="px-5 py-2.5 bg-surface-container-lowest text-outline rounded-sm font-label-sm text-label-sm uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.02),_0_2px_4px_rgba(0,0,0,0.3)] border-t border-l border-outline-variant/20 border-b border-r border-black hover:text-tertiary hover:border-outline-variant/40 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <span className="relative z-10">Resin</span>
          </button>
        </div>
      </header>

      {/* Product Grid (Bento) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Product 1: Featured */}
        <article className="md:col-span-8 group relative rounded-sm overflow-hidden bronze-card candle-glow flex flex-col md:flex-row h-[500px]">
          <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent z-10 md:bg-gradient-to-r md:from-surface-container-highest md:via-surface-container-highest/50 md:to-transparent opacity-90" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Mysore Sandalwood Incense"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 opacity-70 mix-blend-luminosity group-hover:mix-blend-normal"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf1EokVM-7WyfBJAyeyUZjKVWVY6W1G-XXFZJQuxB1N1ZywMc1VXircjkY7WHvQjfXmNLKUlQNlAHNscBAW4i-b5k4PMAjnOyW9aJxnPh6YKKOxtz6isSq49jLm4l0pmuuXgOv3boCeFVLMD7kBPq_fKIru2S46lc_YKvO4R0ES5AZGUKJZgnOtHF9DSJ8D2yHo6qMLZ1VvrVDjRkBK3lM9PKUrmfCJMYK8465inhT5o8zJ5OpDG4jWqGKfLTHxN9aBC4f9JQ5NRXu"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/10 to-transparent mix-blend-overlay z-10" />
          </div>
          <div className="w-full md:w-2/5 p-gutter flex flex-col justify-center relative z-20">
            <div className="flex gap-unit mb-unit">
              <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">Woody</span>
              <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">Signature</span>
            </div>
            <Link href="/products/mysuru-sandalwood">
              <h2 className="font-headline-lg text-headline-lg text-tertiary mb-2 group-hover:text-tertiary-fixed transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer">
                Mysore Sandalwood
              </h2>
            </Link>
            <p className="font-body-md text-body-md text-outline mb-6 line-clamp-3">
              The quintessential temple fragrance. Aged heartwood from Karnataka,
              blended with subtle spices to create a deeply grounding,
              meditative aroma that lingers for hours.
            </p>
            <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
              <span className="font-headline-md text-headline-md text-primary drop-shadow-[0_0_8px_rgba(255,180,168,0.2)]">₹1,200</span>
              <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-sm font-label-sm text-label-sm uppercase tracking-widest border-t border-l border-error/30 border-b border-r border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.5)] hover:bg-error-container hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_0_20px_rgba(181,38,25,0.4)] transition-all flex items-center gap-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  Add to Tray
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                </span>
              </button>
            </div>
          </div>
        </article>

        {/* Product 2 */}
        <article className="md:col-span-4 group relative rounded-sm overflow-hidden bronze-card candle-glow flex flex-col h-[500px]">
          <div className="w-full h-3/5 relative overflow-hidden bg-black border-b border-outline-variant/30">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent z-10 opacity-80" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Madurai Jasmine Incense"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzX2piiMUMLSTjJ5n_oYH9WZ3KhY64jo-TYbd9x2GIk_NwwDEG3uwhM62EJVREoilJ862JE0_vFDu07KmzXhik9HcTdhWjKWQDNwiYDQWDSWk4Ap_yyxTQbTeopXgD-m0N_roVZqMxOQQmSntE-qQtC1YGQ7YDP7Li8cgU8TnTPrLh3fAfrEh9vM46qqUQ7f8_CEyVpQV7nvX6MPQpFMRyIFaXxhX341V1Kz8tqNucPso2z8QEg8yxExCKgKPf9KPy4aPR-Rq6epqB"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/5 to-transparent mix-blend-overlay z-10" />
          </div>
          <div className="p-gutter flex flex-col flex-grow relative z-20">
            <div className="flex gap-unit mb-unit">
              <span className="px-3 py-1 bg-surface-container-lowest text-secondary-fixed-dim rounded-sm font-label-sm text-label-sm uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] border-t border-l border-outline-variant/30 border-b border-r border-black">Floral</span>
            </div>
            <Link href="/products/madurai-jasmine">
              <h2 className="font-headline-md text-headline-md text-tertiary mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer">
                Madurai Jasmine
              </h2>
            </Link>
            <p className="font-body-md text-body-md text-outline text-sm mb-4 line-clamp-2">
              Intoxicating night-blooming jasmine, capturing the essence of a
              sultry evening temple offering.
            </p>
            <div className="flex justify-between items-center mt-auto border-t border-outline-variant/20 pt-4">
              <span className="font-headline-md text-headline-md text-primary text-xl drop-shadow-[0_0_8px_rgba(255,180,168,0.2)]">₹950</span>
              <button
                aria-label="Add to tray"
                className="text-tertiary bg-surface-container-lowest hover:bg-surface-variant hover:text-tertiary-fixed transition-colors p-2 rounded-sm border-t border-l border-outline-variant/30 border-b border-r border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(247,189,72,0.2)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <span className="material-symbols-outlined relative z-10">add</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
