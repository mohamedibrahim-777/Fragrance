"use client";

import { useEffect, useRef } from "react";

// Verified via commons.wikimedia.org/wiki/Special:FilePath redirect (200 OK).
const TEMPLES = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi_Amman_Temple,_Madurai.JPG?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswarar_Temple,_Thanjavur.JPG?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai_Meenakshi_Amman_Temple_North_Tower.JPG?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Shore_Temple_Mahabalipuram_Tamil_Nadu.JPG?width=1600",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy_temple7.JPG?width=1600",
];

export function TempleBackdrop() {
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const layers = layersRef.current;
    if (!layers.length) return;

    function update() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, doc.scrollTop / max));
      // Map p (0..1) across N segments. Each layer fades in/out around its segment center.
      const N = layers.length;
      const seg = 1 / N;
      for (let i = 0; i < N; i++) {
        const center = seg * (i + 0.5);
        const dist = Math.abs(p - center);
        // Cosine falloff inside ~1.2 segments — smooth crossfade
        const radius = seg * 1.2;
        const t = Math.max(0, 1 - dist / radius);
        const opacity = 0.45 + 0.45 * Math.sin((t * Math.PI) / 2);
        const el = layers[i];
        if (el) {
          el.style.opacity = t > 0 ? opacity.toFixed(3) : "0";
        }
      }
    }

    update();
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="temple-backdrop" aria-hidden="true">
      {TEMPLES.map((src, i) => (
        <div
          key={src}
          ref={(el) => {
            if (el) layersRef.current[i] = el;
          }}
          className="temple-backdrop-layer"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}
      <div className="temple-backdrop-veil" />
      <div className="temple-backdrop-mandala" />
    </div>
  );
}
