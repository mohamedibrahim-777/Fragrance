import { prisma } from "@/lib/db";
import { RefreshButton } from "../_components/AdminButtons";
import { CouponsView } from "./CouponsClient";

export const dynamic = "force-dynamic";

const SEED_COUPONS = [
  { code: "SHRI15", description: "15% off — Light up your pooja room", type: "Percentage", value: 15, minOrder: 500, maxDiscount: 250 },
  { code: "MEGA100", description: "Flat ₹100 off on orders above ₹999", type: "Fixed", value: 100, minOrder: 999, maxDiscount: null },
  { code: "FRAG10", description: "10% off on all agarbatti", type: "Percentage", value: 10, minOrder: 0, maxDiscount: 150 },
  { code: "FLAT50", description: "Flat ₹50 off on orders above ₹499", type: "Fixed", value: 50, minOrder: 499, maxDiscount: null },
  { code: "WELCOME20", description: "Welcome offer — 20% off on your first order", type: "Percentage", value: 20, minOrder: 300, maxDiscount: 200 },
  { code: "FIRST10", description: "First-time customer 10% off", type: "Percentage", value: 10, minOrder: 0, maxDiscount: 100 },
];

export default async function AdminCoupons() {
  const existing = await prisma.coupon.count();
  if (existing === 0) {
    await prisma.coupon.createMany({
      data: SEED_COUPONS.map((c) => ({
        code: c.code,
        description: c.description,
        type: c.type,
        value: c.value,
        minOrder: c.minOrder,
        maxDiscount: c.maxDiscount,
      })),
    });
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  const rows = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    type: c.type,
    value: c.value,
    minOrder: c.minOrder,
    maxDiscount: c.maxDiscount,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Coupons & Referrals</h1>
        <RefreshButton />
      </div>
      <CouponsView coupons={rows} />
    </>
  );
}
