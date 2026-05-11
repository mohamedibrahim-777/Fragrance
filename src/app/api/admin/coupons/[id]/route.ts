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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = await gate();
  if (denied) return denied;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.value === "number") data.value = body.value;
  if (typeof body.minOrder === "number") data.minOrder = body.minOrder;
  if (typeof body.description === "string") data.description = body.description;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, error: "No fields" }, { status: 400 });
  }
  const updated = await prisma.coupon.update({ where: { id: params.id }, data });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await gate();
  if (denied) return denied;
  await prisma.coupon.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
