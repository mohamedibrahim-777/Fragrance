import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/utils";
import { SearchClient } from "./SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const all = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const products = all.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    mrp: p.mrp,
    image: parseImages(p.images)[0] ?? "",
  }));

  return <SearchClient products={products} />;
}
