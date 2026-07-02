"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: number; name: string; email: string; business_type: string | null; website: string | null; status: string; created_at: string;
};

const BADGE: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  invited: "bg-amber-100 text-amber-800",
  converted: "bg-brand-100 text-brand-700",
};

function d(s: string) {
  const dt = new Date(s.replace(" ", "T"));
  return isNaN(dt.getTime()) ? s : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function WaitlistTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  async function setStatus(id: number, status: string) {
    setBusy(id);
    await fetch(`/api/admin/waitlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {["all", "new", "invited", "converted"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`badge ${filter === f ? "bg-ink text-white" : "bg-black/5 text-ink/60"} capitalize`}>
            {f}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Industry</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-ink/50">No signups in this view.</td></tr>
            )}
            {filtered.map((w) => (
              <tr key={w.id} className="hover:bg-black/[0.02]">
                <td className="px-5 py-3 font-medium">{w.name}</td>
                <td className="px-5 py-3 text-ink/60">{w.email}</td>
                <td className="px-5 py-3 text-ink/60">{w.business_type ?? "—"}</td>
                <td className="px-5 py-3 text-ink/60">{d(w.created_at)}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${BADGE[w.status] || "bg-gray-100 text-gray-700"} capitalize`}>{w.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {w.status === "new" && (
                      <button className="btn-outline px-2 py-1 text-xs" disabled={busy === w.id} onClick={() => setStatus(w.id, "invited")}>Invite</button>
                    )}
                    {w.status === "invited" && (
                      <button className="btn-outline px-2 py-1 text-xs" disabled={busy === w.id} onClick={() => setStatus(w.id, "converted")}>Mark converted</button>
                    )}
                    {w.status !== "new" && (
                      <button className="btn-ghost px-2 py-1 text-xs" disabled={busy === w.id} onClick={() => setStatus(w.id, "new")}>Reset</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
