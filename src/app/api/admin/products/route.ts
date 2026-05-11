import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, price, mrp, stock, categorySlug, image } = body as {
    name?: string;
    description?: string;
    price?: number;
    mrp?: number;
    stock?: number;
    categorySlug?: string;
    image?: string;
  };

  if (!name || typeof price !== "number" || typeof mrp !== "number") {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const cat = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : await prisma.category.findFirst({ where: { parentId: { not: null } } });
  if (!cat) {
    return NextResponse.json({ success: false, error: "No category found" }, { status: 400 });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  const sku = "SKU-" + Date.now().toString(36).toUpperCase();

  const created = await prisma.product.create({
    data: {
      slug,
      sku,
      name,
      description: description ?? "",
      price,
      mrp,
      stock: stock ?? 100,
      categoryId: cat.id,
      images: JSON.stringify(image ? [image] : []),
      features: JSON.stringify([]),
      isActive: true,
    },
  });
  return NextResponse.json({ success: true, data: created });
}
