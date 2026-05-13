"use client";

import { useEffect, useRef } from "react";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
};

const SLIDES: Slide[] = [
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Incense_at_a_wedding_in_South_India.jpg/1280px-Incense_at_a_wedding_in_South_India.jpg",
    eyebrow: "I — Aarti at Dawn",
    title: "Where smoke meets prayer",
    text: "Hand-rolled in Salem. The first stick is lit before the sun touches the gopuram.",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Sandalwood_harvest.jpg",
    eyebrow: "II — Chandan",
    title: "Aged sandalwood, blessed wood",
    text: "Mysore heartwood, weathered for fifteen years. The scent of sanctum stone after rain.",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jasminum_sambac_kz01.jpg/960px-Jasminum_sambac_kz01.jpg",
    eyebrow: "III — Mallipoo",
    title: "Night-bloom jasmine",
    text: "Plucked at dusk, soaked in dew. The flower the goddess wears in her hair.",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Agarwood_top_grade.jpg",
    eyebrow: "IV — Oudh",
    title: "Resin of the ancients",
    text: "Aged agarwood — deep, dark, devotional. A scent older than memory.",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Incense_in_Vietnam.jpg/960px-Incense_in_Vietnam.jpg",
    eyebrow: "V — Dhoop",
    title: "Smoke as offering",
    text: "Every curl of smoke a syllable. Every syllable a prayer rising to the divine.",
  },
];

export function TempleScroll() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>(".temple-slide"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          (e.target as HTMLElement).classList.toggle("is-active", e.isIntersecting);
        }
      },
      { threshold: 0.55 }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative my-margin"
      aria-label="Sacred journey"
    >
      <div className="text-center mb-12">
        <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-tertiary/60">
          ✦ A Sacred Journey ✦
        </p>
        <h2 className="font-headline-lg text-headline-lg text-tertiary">
          <span className="ornament-frame">Five Offerings</span>
        </h2>
      </div>

      <div className="temple-scroll-track">
        {SLIDES.map((s, i) => (
          <article key={i} className="temple-slide">
            <div
              className="temple-slide-bg"
              style={{ backgroundImage: `url("${s.image}")` }}
            />
            <div className="temple-slide-overlay" />
            <div className="temple-slide-content">
              <p className="gold-eyebrow mb-4">{s.eyebrow}</p>
              <h3 className="font-headline-xl text-3xl md:text-5xl text-tertiary mb-4 italic max-w-3xl mx-auto leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                {s.title}
              </h3>
              <div className="mx-auto my-5 w-24 h-px bg-gradient-to-r from-transparent via-tertiary to-transparent" />
              <p className="max-w-xl mx-auto text-base md:text-lg text-on-surface-variant italic">
                {s.text}
              </p>
            </div>
            <div className="temple-slide-counter">
              <span className="font-headline-md text-tertiary text-sm tracking-[0.4em]">
                {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
