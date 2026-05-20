import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  return null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.price === "number") data.price = body.price;
  if (typeof body.mrp === "number") data.mrp = body.mrp;
  if (typeof body.stock === "number") data.stock = body.stock;
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.categoryId === "string" && body.categoryId.length > 0) {
    data.categoryId = body.categoryId;
  }
  if (Array.isArray(body.images)) {
    data.images = JSON.stringify(
      body.images.filter((s: unknown) => typeof s === "string" && (s as string).trim()).map((s: string) => s.trim())
    );
  }
  if (Array.isArray(body.features)) {
    data.features = JSON.stringify(
      body.features.filter((s: unknown) => typeof s === "string" && (s as string).trim()).map((s: string) => s.trim())
    );
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // soft delete by setting isActive=false (preserves order history references)
  await prisma.product.update({
    where: { id: params.id },
    data: { isActive: false },
  });
  return NextResponse.json({ success: true });
}
