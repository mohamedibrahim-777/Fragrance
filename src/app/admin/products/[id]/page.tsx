import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { ProductEditor } from "./ProductEditor";

export const dynamic = "force-dynamic";

function parseFeatures(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function AdminProductEdit({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { parentId: { not: null }, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    }),
  ]);
  if (!product) notFound();

  const images = parseImages(product.images);
  const features = parseFeatures(product.features);

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-ink-muted hover:text-brand"
      >
        ← Back to products
      </Link>
      <ProductEditor
        id={product.id}
        initial={{
          name: product.name,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          stock: product.stock,
          isActive: product.isActive,
          categoryId: product.categoryId,
          images: images.join("\n"),
          features: features.join("\n"),
        }}
        sku={product.sku}
        categories={categories}
        previewImage={images[0] ?? ""}
      />
    </div>
  );
}
