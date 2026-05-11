import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { ProductEditor } from "./ProductEditor";

export const dynamic = "force-dynamic";

export default async function AdminProductEdit({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) notFound();

  const img = parseImages(product.images)[0] ?? "";

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
        }}
        sku={product.sku}
        category={product.category.name}
        image={img}
      />
    </div>
  );
}
