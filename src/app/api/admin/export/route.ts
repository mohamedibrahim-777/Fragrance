import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const head = cols.join(",");
  const body = rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")).join("\n");
  return head + "\n" + body;
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "Admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "products";

  let csv = "";
  let filename = "export.csv";

  if (type === "products") {
    const products = await prisma.product.findMany({ include: { category: true } });
    csv = toCsv(
      products.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category.name,
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        isActive: p.isActive,
      }))
    );
    filename = "products.csv";
  } else if (type === "orders") {
    const orders = await prisma.order.findMany({ include: { user: true, items: true } });
    csv = toCsv(
      orders.map((o) => ({
        id: o.id,
        customer: o.user.name,
        email: o.user.email,
        items: o.items.length,
        subtotal: o.subtotal,
        total: o.total,
        status: o.status,
        date: o.createdAt.toISOString(),
      }))
    );
    filename = "orders.csv";
  } else if (type === "users") {
    const users = await prisma.user.findMany();
    csv = toCsv(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone ?? "",
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      }))
    );
    filename = "users.csv";
  } else {
    return NextResponse.json({ success: false, error: "Unknown type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
