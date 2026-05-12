import Link from "next/link";

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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-gutter max-w-3xl">
          <h1 className="font-headline-xl text-headline-xl text-secondary mb-unit">
            Experience Divine Fragrance
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-margin max-w-2xl mx-auto">
            A sanctuary of scent. Handcrafted incense inspired by the hallowed
            atmosphere of Dravidian architecture and morning pujas.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-container border border-tertiary text-on-primary-container px-8 py-4 font-label-sm uppercase tracking-widest hover:shadow-[0_0_15px_rgba(247,189,72,0.4)] transition-shadow duration-300"
          >
            Enter the Divine Experience
          </Link>
        </div>
      </section>

      {/* Experience Rituals Section */}
      <section className="py-margin px-gutter max-w-container-max-width mx-auto">
        <div className="text-center mb-margin">
          <h2 className="font-headline-lg text-headline-lg text-tertiary mb-unit">
            The Ritual Collection
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-tertiary to-transparent mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="bg-surface-container border border-outline-variant/50 p-unit glow-inner">
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
          {/* Card 2 — offset down */}
          <div className="bg-surface-container border border-outline-variant/50 p-unit glow-inner md:-translate-y-8">
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
          {/* Card 3 */}
          <div className="bg-surface-container border border-outline-variant/50 p-unit glow-inner">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-margin bg-surface-container-lowest">
        <div className="max-w-container-max-width mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
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
          </div>
        </div>
      </section>
    </>
  );
}
