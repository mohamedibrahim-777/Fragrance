"use client";

import { useMemo, useState } from "react";
import { UserRoleSelect, DeleteRowButton } from "../_components/AdminButtons";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  orderCount: number;
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const [filter, setFilter] = useState<"all" | "Customer" | "Admin">("all");
  const filtered = useMemo(
    () => (filter === "all" ? users : users.filter((u) => u.role === filter)),
    [users, filter]
  );

  return (
    <>
      <div className="mt-3 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-ink"
        >
          <option value="all">All Users</option>
          <option value="Customer">Customers</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/50 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="py-3 pl-4 pr-3">User</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Phone</th>
                <th className="py-3 pr-3">Role</th>
                <th className="py-3 pr-3">Orders</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const initial = u.name.charAt(0).toUpperCase();
                return (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0 hover:bg-surface-2/30"
                  >
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                          {initial}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{u.name}</p>
                          <p className="font-mono text-[10px] text-ink-muted">{u.id.slice(0, 14)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-ink-muted">{u.email}</td>
                    <td className="py-3 pr-3 text-ink-muted">{u.phone ?? "-"}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                          u.role === "Admin"
                            ? "bg-brand-soft text-brand-hover"
                            : "bg-success/15 text-success"
                        }`}
                      >
                        {u.role.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-ink">{u.orderCount}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <UserRoleSelect id={u.id} role={u.role} />
                        <DeleteRowButton
                          endpoint={`/api/admin/users/${u.id}`}
                          label={`Delete user "${u.name}"? This cannot be undone.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-ink-muted">
                    No users match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
