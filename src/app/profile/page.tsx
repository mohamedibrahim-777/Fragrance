import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-8 sm:py-10">
      <h1 className="font-display text-4xl font-medium text-ink">My profile</h1>

      <dl className="mt-8 rounded-lg border border-border bg-surface p-6">
        <Row label="Name" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role} />
      </dl>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/my-orders"
          className="rounded border border-border bg-surface p-5 text-sm font-medium text-ink transition hover:border-brass hover:text-brass"
        >
          📦 My orders
        </Link>
        <Link
          href="/products"
          className="rounded border border-border bg-surface p-5 text-sm font-medium text-ink transition hover:border-brass hover:text-brass"
        >
          🛍 Continue shopping
        </Link>
      </div>

      {user.role === "Admin" && (
        <div className="mt-6 rounded-lg border-2 border-brand bg-brand-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-hover">
            Admin
          </p>
          <p className="mt-1 text-sm text-ink">
            Access customer details and all orders.
          </p>
          <Link
            href="/admin"
            className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-hover"
          >
            Open admin dashboard →
          </Link>
        </div>
      )}

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-3 last:border-0">
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
