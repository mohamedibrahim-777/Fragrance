import { prisma } from "@/lib/db";
import { RefreshButton, ExportButton } from "../_components/AdminButtons";
import { UsersTable } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    orderCount: u._count.orders,
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-ink">Users</h1>
        <div className="flex gap-2">
          <RefreshButton />
          <ExportButton type="users" />
        </div>
      </div>

      <UsersTable users={rows} />
    </>
  );
}
