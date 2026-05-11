import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Sacred blessing strip */}
      <div
        className="text-center"
        style={{
          background:
            "linear-gradient(90deg, #4A2E1B 0%, #6F4E37 50%, #4A2E1B 100%)",
        }}
      >
        <p className="font-tamil py-1 text-[11px] tracking-[0.25em] text-brand-soft">
          🪔 &nbsp; ஶ்ரீ &nbsp;·&nbsp; வாழ்க வளமுடன் &nbsp;·&nbsp; LIVE IN PROSPERITY &nbsp;·&nbsp; ஓம் சாந்தி &nbsp; 🪔
        </p>
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 border-b border-border px-5 py-4">
        <span className="text-lg">🪔</span>
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-brand-hover"
        >
          Shri Fragrance
        </Link>
        <span className="text-lg">🪔</span>
      </div>
    </header>
  );
}
