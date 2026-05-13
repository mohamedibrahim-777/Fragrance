import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

function parseFeatures(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: { select: { name: true } } },
  });
  if (!product || !product.isActive) notFound();

  return (
    <main className="flex-grow max-w-container-max-width mx-auto w-full px-gutter pt-[140px] pb-margin">
      <ProductDetail
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          images: parseImages(product.images),
          features: parseFeatures(product.features),
          price: product.price,
          mrp: product.mrp,
          stock: product.stock,
          sku: product.sku,
          categoryName: product.category.name,
        }}
      />
    </main>
  );
}
