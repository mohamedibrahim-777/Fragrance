import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function gate() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return user;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const me = await gate();
  if (me instanceof NextResponse) return me;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.role === "string" && ["Admin", "Customer"].includes(body.role)) {
    data.role = body.role;
  }
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.phone === "string") data.phone = body.phone;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, error: "No fields" }, { status: 400 });
  }
  const updated = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const me = await gate();
  if (me instanceof NextResponse) return me;
  if (me.id === params.id) {
    return NextResponse.json({ success: false, error: "Cannot delete self" }, { status: 400 });
  }
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
