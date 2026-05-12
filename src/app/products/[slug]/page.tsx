export const dynamic = "force-dynamic";

export default function ProductPage() {
  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-gutter py-margin grid grid-cols-1 md:grid-cols-12 gap-margin mt-16">
      {/* Image Section (Left Split) */}
      <div className="md:col-span-6 relative rounded-full overflow-hidden shadow-[0_0_40px_rgba(217,119,7,0.15)] border border-outline-variant/30 aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Mysuru Sandalwood Incense"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmV8AoVpbtDWDz1NJBBH682LhBVT7qZh5NhP6rujZKhP4hOvZgoBKkrUOlV9V8H6Pn5cxPk-9rjQNY2Br9Xcc8Ec_RQIM_YAmCHuOhgs2e406KYvCopNyneZ3LOcvIOUCCgpkAEXXaOAVdv8_C_7ynGmVcFQV284mx-xIg37CWJLN6ef-wPCis_k3zzDK3yznJOpvOjQ5d_VKllRTlhyBCDrLXHpQqlJUOARzOYQ2kh0wpNFsuRL-TNezuUSSzvYglgEM0r6ptjgkv"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface-container-highest/90 to-transparent backdrop-blur-sm">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant/50 font-label-sm text-label-sm text-tertiary">AUTHENTIC</span>
            <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant/50 font-label-sm text-label-sm text-tertiary">SLOW BURN</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="md:col-span-6 flex flex-col justify-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Mysuru Sandalwood
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Sourced directly from the royal reserves of Karnataka, this pure
            sandalwood blend offers a creamy, woody aroma that instantly
            transforms your space into a serene sanctuary.
          </p>
          <div className="font-headline-lg text-headline-lg text-tertiary">
            ₹ 2,400{" "}
            <span className="font-body-md text-body-md text-on-surface-variant">
              / 50 sticks
            </span>
          </div>
        </div>

        {/* Fragrance Notes Chips */}
        <div className="space-y-3">
          <h3 className="font-headline-md text-headline-md text-secondary">
            Fragrance Profile
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-surface-container-low border border-outline/40 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 shadow-[inset_0_0_10px_rgba(217,119,7,0.05)]">
              Deep Wood
            </div>
            <div className="px-4 py-2 bg-surface-container-low border border-outline/40 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 shadow-[inset_0_0_10px_rgba(217,119,7,0.05)]">
              Creamy Heart
            </div>
            <div className="px-4 py-2 bg-surface-container-low border border-outline/40 rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-2 shadow-[inset_0_0_10px_rgba(217,119,7,0.05)]">
              Subtle Spice
            </div>
          </div>
        </div>

        {/* Ritual Usage Guide (Bento) */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-secondary">
            Ritual Usage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                spa
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Meditation
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Grounds the mind for deep stillness.
                </p>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Aarti
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Purifies the altar space.
                </p>
              </div>
            </div>
            <div className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl flex items-start gap-4 hover:shadow-[0_0_20px_rgba(217,119,7,0.1)] transition-shadow sm:col-span-2">
              <span
                className="material-symbols-outlined text-tertiary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                self_improvement
              </span>
              <div>
                <h4 className="font-headline-md text-body-lg text-on-surface mb-1">
                  Evening Relaxation
                </h4>
                <p className="font-body-md text-label-sm text-on-surface-variant">
                  Clears residual daily energies, fostering a calm transition to rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <button
            className="w-full sm:w-auto bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest py-4 px-8 rounded border border-tertiary/50 hover:shadow-[0_0_25px_rgba(217,119,7,0.3)] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shopping_bag
            </span>
            Add to Ritual Bag
          </button>
        </div>
      </div>
    </main>
  );
}
