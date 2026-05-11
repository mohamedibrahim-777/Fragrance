import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { Truck, Leaf, Shield, Gift } from "lucide-react";
import { HomeShop } from "./_home/HomeShop";

export const dynamic = "force-dynamic";

export default async function Home() {
  const top = await prisma.category.findFirst({ where: { slug: "agarbatti" } });
  const subs = top
    ? await prisma.category.findMany({
        where: { parentId: top.id, isActive: true },
        orderBy: { name: "asc" },
      })
    : [];

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Map for client component
  const productsForClient = allProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    image: parseImages(p.images)[0] ?? "",
    categorySlug: p.category?.slug ?? "",
  }));

  const chipCats = [
    { slug: "all", name: "All" },
    ...subs.map((s) => ({ slug: s.slug, name: s.name.replace(/\s*\([^)]*\)/, "") })),
  ];

  return (
    <>
      {/* HERO — clean white panel with brown accents (dashboard aesthetic) */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-6 px-5 py-10 md:grid-cols-[1.3fr_1fr] md:gap-10 md:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-hover">
              🪔 Pure & Natural · Tamil Nadu
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl md:text-[44px]">
              Pure Fragrances, <br />
              <span className="text-brand">Divine Moments</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
              Handcrafted agarbattis made from natural ingredients. Light a
              stick, breathe, and let the sacred smoke fill your home the way
              it has for generations.
            </p>
            {/* Thirukkural verse */}
            <div className="mt-5 border-l-2 border-brand pl-4">
              <p className="font-tamil text-base text-brand-hover sm:text-lg">
                “அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு”
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                — Thirukkural · Kural 1
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
              >
                Shop Now →
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
              >
                Find your fragrance
              </Link>
            </div>
          </div>
          {/* Agarbatti hero image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border shadow-sm sm:h-48 sm:w-48 lg:h-56 lg:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Incense_sticks_in_bangalore.jpg"
                alt="Agarbatti"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — clean card row */}
      <section className="bg-surface-2/40">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-3">
          <Trust icon={Truck} text="Free delivery ₹399+" />
          <Trust icon={Leaf} text="100% natural" />
          <Trust icon={Shield} text="Secure payments" />
        </div>
      </section>

      {/* SHOP BY CATEGORY + BEST SELLERS */}
      <section className="mx-auto max-w-[1200px] px-5 py-7">
        <h2 className="text-lg font-bold text-ink">Shop by category</h2>
        <HomeShop categories={chipCats} products={productsForClient} />
      </section>

      {/* FIRST ORDER OFFER BANNER — dashboard card style */}
      <section className="mx-auto max-w-[1200px] px-5 py-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl">
              🎁
            </span>
            <div>
              <p className="text-base font-extrabold text-ink sm:text-lg">
                First order offer
              </p>
              <p className="text-sm text-ink-muted">
                Use code below for{" "}
                <span className="font-bold text-brand">10% off</span>
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-brand px-6 py-3 text-base font-extrabold tracking-[0.2em] text-white shadow-sm">
            FIRST10
          </span>
        </div>
      </section>

      {/* DEVOTIONAL MANTRA BAND — Thayumanavar */}
      <section className="mx-auto max-w-[1200px] px-5 pb-8">
        <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="flex items-center justify-center gap-3 text-2xl">
            <span role="img" aria-label="diya">🪔</span>
            <span className="text-brand">❀</span>
            <span role="img" aria-label="diya">🪔</span>
          </div>
          <p className="font-tamil mt-4 text-lg italic text-brand-hover sm:text-xl">
            “எல்லோரும் இன்புற்றிருக்க நினைப்பதுவே அல்லாமல்
            <br className="hidden sm:block" />
            வேறொன்று அறியேன் பராபரமே”
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-ink-muted">
            May everyone live in joy — I know nothing else, O Supreme
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-brand">
            — Thayumanavar
          </p>
        </div>
      </section>
    </>
  );
}

function Trust({
  icon: Icon,
  text,
}: {
  icon: typeof Truck;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-hover">
        <Icon size={16} />
      </span>
      <span className="text-sm font-semibold text-ink">{text}</span>
    </div>
  );
}

