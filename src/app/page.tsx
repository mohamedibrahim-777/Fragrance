import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TempleScroll } from "@/components/TempleScroll";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Temple interior background"
            className="w-full h-full object-cover opacity-30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBiRPcqyqdwd7b5jZpS1W4OqR00pnl9Mdk29E0DqKmX1ZJ5rmItTmm2p9FQblrtp_DpO_vgUGPDeDtk7wBfTWj0Kv3-cFJtkrvIkRoScokVXpBZFJWnMtVTKGtYFRCjOh5Qf9nleqfdHNq-YAHF1GBLE7EKiL6SBVcA5NczGS02yTR2XpVy4jl6Kixux470HGUuX1hw1uaiMGj9Xq10q2EMj2glJJxuNq20oczAmTFM43LiB4dPLQQ7cIp1ItQ9Xm-6zgQDnqlsLel"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(247,189,72,0.08),transparent_60%)]" />
        </div>

        {/* Drifting embers */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden z-[5]">
          <span className="ember" />
          <span className="ember" />
          <span className="ember" />
          <span className="ember" />
          <span className="ember" />
          <span className="ember" />
        </div>

        <div className="relative z-10 text-center px-gutter max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-tertiary/80">
            ❋ &nbsp; Shri Fragrance &nbsp; ❋
          </p>
          <h1 className="font-headline-xl text-headline-xl text-secondary mb-unit drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Experience Divine Fragrance
          </h1>
          <div className="mx-auto my-6 w-32 h-px bg-gradient-to-r from-transparent via-tertiary to-transparent" />
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-margin max-w-2xl mx-auto italic">
            A sanctuary of scent. Handcrafted incense inspired by the hallowed
            atmosphere of Dravidian architecture and morning pujas.
          </p>
          <Link
            href="/products"
            className="breathe-glow inline-block bg-primary-container border border-tertiary text-on-primary-container px-8 py-4 font-label-sm uppercase tracking-widest hover:shadow-[0_0_28px_rgba(247,189,72,0.55)] transition-shadow duration-300"
          >
            Enter the Divine Experience
          </Link>
        </div>
      </section>

      {/* Marble premium panel */}
      <section className="px-gutter max-w-container-max-width mx-auto -mt-16 relative z-20">
        <ScrollReveal>
          <div className="marble-panel marble-panel-frame text-center">
            <p className="gold-eyebrow mb-3">✦ Ek Anubhav — One Experience ✦</p>
            <h2 className="font-headline-lg text-3xl md:text-4xl gold-text mb-4 italic font-semibold">
              Sacred craft, distilled across generations
            </h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-[#5b4416] leading-relaxed">
              Every stick is hand-rolled in Madurai using heritage recipes —
              aged sandalwood, jasmine soaked in dew, and resins blessed by
              temple priests. A ritual you can carry home.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-[#8b6914]">
              <span className="h-px w-12 bg-[#8b6914]/40" />
              <span className="text-xs tracking-[0.4em] uppercase">Since 1947</span>
              <span className="h-px w-12 bg-[#8b6914]/40" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PPT-style scroll-snap journey */}
      <TempleScroll />

      {/* Experience Rituals Section */}
      <section className="py-margin px-gutter max-w-container-max-width mx-auto">
        <ScrollReveal>
        <div className="text-center mb-margin">
          <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-tertiary/60">
            ✦ Curated Offerings ✦
          </p>
          <h2 className="font-headline-lg text-headline-lg text-tertiary mb-unit">
            <span className="ornament-frame">The Ritual Collection</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-tertiary to-transparent mx-auto" />
        </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <ScrollReveal>
          <div className="filigree-corners bg-surface-container border border-outline-variant/50 p-unit glow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Diya lamp and incense"
              className="w-full h-64 object-cover border border-tertiary/30 mb-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuft1ee65pWx23A-eYjygNLpXBFSDdAC7jevo9JleHCivWfBzETaiuFJ5c46TpSXMIQCO3mKRqRKZYUV1eFwMJ1wI4d9JVbF7iE_Fc1vmdklkc-z2JfZtpYKVwwvbcQyau3D1aB_gxmps26vbBa8YfoCsEwxowztbYxnTIWV8sb6bqFIeYI2n_g4es_DiAo5qT4se8lvMA4JKGhssWDQRpqa3lD3z5C4I1jg5r0Tpxvd5fBwRzkS4FcTwiDP9y8EzUNRmn2k2iHuIu"
            />
            <div className="text-center p-4">
              <span className="inline-block bg-surface-container-high text-tertiary font-label-sm px-3 py-1 border border-outline-variant rounded-full mb-2">
                Sandalwood
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Morning Puja
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Sacred sandalwood notes to awaken the spirit.
              </p>
            </div>
          </div>
          </ScrollReveal>
          {/* Card 2 — offset down */}
          <ScrollReveal delay={150}>
          <div className="filigree-corners bg-surface-container border border-outline-variant/50 p-unit glow-inner md:-translate-y-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Floral offering"
              className="w-full h-64 object-cover border border-tertiary/30 mb-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYM-IDG1u8OrGQ2tFBcrBZsAtg3PO7EUmK44qY1GVx9tlFJlcSwhYfVZXt-Juxfugscx8BhYJSGk_hMPaS86hIlyFsd3ZTiFk_PlM6eFLOidlWynfPUpK-FM7tgrlsgoyxy5shZS8wS7y4LrBInTCTf7nHIdP4BAeWg7A3OMDWie5CjfZ8X7xmxMhmxs4WLOMrcRSut20qo8EGXJSjGBbfHqpWbyfs4AD0E11_CMM-fAx11eogMtRgGZS69Nh6EDJNbZqnOK24KPSS"
            />
            <div className="text-center p-4">
              <span className="inline-block bg-surface-container-high text-tertiary font-label-sm px-3 py-1 border border-outline-variant rounded-full mb-2">
                Jasmine
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Evening Aarti
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Calming floral notes for deep meditation.
              </p>
            </div>
          </div>
          </ScrollReveal>
          {/* Card 3 */}
          <ScrollReveal delay={300}>
          <div className="filigree-corners bg-surface-container border border-outline-variant/50 p-unit glow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Temple carving details"
              className="w-full h-64 object-cover border border-tertiary/30 mb-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuY-22aFTnn2wLoPVKQeInwgasSNA-UWpCciwHj6j5smSCpBOI1vGejou0Qxz0V96pHx9Y_LzVLmfo1aeaNC5jzrBm3e8GKwFkP9Mbj9-6v_xjTO2Ee6ZXTgA8Ehl25dnahoPItRpCW7ocPbUTzZSAyjavKrber5JrrM9Vgf5wMflRHR_CPLqTHjehOQyq-WWMhIEbuLuJtojQ1YgvzUMmNDw8_BiUb3UMjgG8JYoDbV5m55HmxglwGlHK-q0WxYmGxpTEujdRM1Sj"
            />
            <div className="text-center p-4">
              <span className="inline-block bg-surface-container-high text-tertiary font-label-sm px-3 py-1 border border-outline-variant rounded-full mb-2">
                Frankincense
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Temple Corridors
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Resinous depth echoing ancient stone halls.
              </p>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-margin bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tertiary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tertiary/40 to-transparent" />
        <div className="max-w-container-max-width mx-auto px-gutter">
          <ScrollReveal>
          <div className="text-center mb-12">
            <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-tertiary/60">
              ✦ Voices of the Faithful ✦
            </p>
            <h2 className="font-headline-lg text-headline-lg text-tertiary">
              <span className="ornament-frame">Whispers from the Sanctum</span>
            </h2>
          </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <ScrollReveal>
            <div className="bg-surface-container border-l-2 border-tertiary p-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
              </div>
              <p className="font-headline-md text-headline-md text-on-surface italic mb-4">
                &quot;A transcendent experience. The sandalwood scent transports me directly to the sanctum of Madurai.&quot;
              </p>
              <p className="font-label-sm text-tertiary uppercase tracking-widest">
                — Devotee M.
              </p>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
            <div className="bg-surface-container border-l-2 border-tertiary p-8 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
              </div>
              <p className="font-headline-md text-headline-md text-on-surface italic mb-4">
                &quot;The craftsmanship is evident. Not just incense, but a beautifully curated ritual.&quot;
              </p>
              <p className="font-label-sm text-tertiary uppercase tracking-widest">
                — Seeker R.
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
