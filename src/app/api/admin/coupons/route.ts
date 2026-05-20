import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function gate() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function POST(req: Request) {
  const denied = await gate();
  if (denied) return denied;

  const body = await req.json();
  const { code, description, type, value, minOrder, maxDiscount, usageLimit, expiresAt } = body;
  if (!code || typeof value !== "number") {
    return NextResponse.json({ success: false, error: "Missing code or value" }, { status: 400 });
  }
  const created = await prisma.coupon.create({
    data: {
      code: String(code).toUpperCase(),
      description: description ?? "",
      type: type === "Fixed" ? "Fixed" : "Percentage",
      value,
      minOrder: typeof minOrder === "number" ? minOrder : 0,
      maxDiscount: typeof maxDiscount === "number" ? maxDiscount : null,
      usageLimit: typeof usageLimit === "number" ? usageLimit : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  return NextResponse.json({ success: true, data: created });
}
