import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1).max(100),
    })
  ).min(1),
  shippingAddress: z.object({
    name: z.string().min(2),
    line1: z.string().min(2),
    line2: z.string().nullable().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4),
    phone: z.string().min(7),
  }),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, shippingAddress } = schema.parse(body);

    // Server pulls authoritative prices from DB — never trusts client prices
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "Some products are unavailable" },
        { status: 400 }
      );
    }
    const priceMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = items.map((i) => {
      const p = priceMap.get(i.productId)!;
      const lineTotal = p.price * i.quantity;
      subtotal += lineTotal;
      return {
        productId: p.id,
        productName: p.name,
        unitPrice: p.price,
        quantity: i.quantity,
        lineTotal,
      };
    });
    const shippingFee = subtotal >= 999 ? 0 : 49;
    const total = subtotal + shippingFee;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "paid", // demo: auto-paid
        subtotal,
        shippingFee,
        total,
        paymentMethod: "demo",
        shippingAddress: JSON.stringify(shippingAddress),
        items: { create: orderItemsData },
      },
    });

    // Decrement stock
    await Promise.all(
      items.map((i) =>
        prisma.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        })
      )
    );

    return NextResponse.json({ success: true, data: { id: order.id } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Order failed" },
      { status: 500 }
    );
  }
}
