import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages, parseFeatures } from "@/lib/utils";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product || !product.isActive) notFound();

  return (
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
  );
}
