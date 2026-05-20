import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const VALID_STATUS = ["pending", "paid", "shipped", "delivered", "cancelled", "failed"];

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
  if (typeof body.status !== "string" || !VALID_STATUS.includes(body.status)) {
    return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
  }
  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status: body.status },
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await gate();
  if (denied) return denied;
  await prisma.order.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
