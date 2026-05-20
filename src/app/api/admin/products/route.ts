import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    description,
    price,
    mrp,
    stock,
    categoryId,
    categorySlug,
    image,
    images,
    features,
    isActive,
  } = body as {
    name?: string;
    description?: string;
    price?: number;
    mrp?: number;
    stock?: number;
    categoryId?: string;
    categorySlug?: string;
    image?: string;
    images?: string[];
    features?: string[];
    isActive?: boolean;
  };

  if (!name || typeof price !== "number" || typeof mrp !== "number") {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  let cat = null;
  if (categoryId) {
    cat = await prisma.category.findUnique({ where: { id: categoryId } });
  } else if (categorySlug) {
    cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
  } else {
    cat = await prisma.category.findFirst({ where: { parentId: { not: null } } });
  }
  if (!cat) {
    return NextResponse.json({ success: false, error: "Category not found" }, { status: 400 });
  }

  const slug =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
    "-" +
    Date.now().toString(36);
  const sku = "SKU-" + Date.now().toString(36).toUpperCase();

  const imageList = Array.isArray(images)
    ? images.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
    : image
    ? [image]
    : [];
  const featureList = Array.isArray(features)
    ? features.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
    : [];

  const created = await prisma.product.create({
    data: {
      slug,
      sku,
      name,
      description: description ?? "",
      price,
      mrp,
      stock: typeof stock === "number" ? stock : 100,
      categoryId: cat.id,
      images: JSON.stringify(imageList),
      features: JSON.stringify(featureList),
      isActive: typeof isActive === "boolean" ? isActive : true,
    },
  });
  return NextResponse.json({ success: true, data: created });
}
