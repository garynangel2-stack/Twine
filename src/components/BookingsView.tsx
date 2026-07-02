"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = { id: number; name: string };
type Booking = {
  id: number;
  title: string;
  starts_at: string;
  status: string;
  reminder_sent: number;
  customer_name: string | null;
};

const BADGE: Record<string, string> = {
  scheduled: "bg-amber-100 text-amber-800",
  confirmed: "bg-brand-100 text-brand-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function fmt(s: string) {
  const d = new Date(s.replace(" ", "T"));
  return isNaN(d.getTime()) ? s : d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function BookingsView({ bookings, customers }: { bookings: Booking[]; customers: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [toast, setToast] = useState("");

  async function addBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy("new");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(null);
    if (res.ok) { form.reset(); setOpen(false); router.refresh(); }
  }

  async function patch(id: number, payload: object, msg?: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(null);
    if (msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }
    router.refresh();
  }

  return (
    <div className="p-8">
      <div className="mb-4 flex justify-end">
        <button className="btn-primary" onClick={() => setOpen(true)}>+ New booking</button>
      </div>

      {toast && (
        <div className="mb-4 rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">{toast}</div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Appointment</th>
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Reminder</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {bookings.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-ink/50">No bookings yet.</td></tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-black/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-medium">{b.title}</p>
                  <p className="text-xs text-ink/50">{b.customer_name ?? "—"}</p>
                </td>
                <td className="px-5 py-3 text-ink/60">{fmt(b.starts_at)}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${BADGE[b.status] || "bg-gray-100 text-gray-700"}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {b.reminder_sent ? (
                    <span className="text-xs font-medium text-brand-600">✓ Sent</span>
                  ) : (
                    <span className="text-xs text-ink/40">Not sent</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {!b.reminder_sent && b.status !== "cancelled" && b.status !== "completed" && (
                      <button className="btn-outline px-2 py-1 text-xs" disabled={busy === b.id}
                        onClick={() => patch(b.id, { reminder_sent: 1 }, `Reminder sent for “${b.title}”`)}>
                        Send reminder
                      </button>
                    )}
                    {b.status === "scheduled" && (
                      <button className="btn-outline px-2 py-1 text-xs" disabled={busy === b.id}
                        onClick={() => patch(b.id, { status: "confirmed" })}>Confirm</button>
                    )}
                    {(b.status === "scheduled" || b.status === "confirmed") && (
                      <button className="btn-outline px-2 py-1 text-xs" disabled={busy === b.id}
                        onClick={() => patch(b.id, { status: "completed" })}>Complete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
          <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">New booking</h2>
            <form onSubmit={addBooking} className="mt-4 space-y-3">
              <div><label className="label">Title</label><input className="input" name="title" required placeholder="e.g. Site visit — Smith" /></div>
              <div>
                <label className="label">Customer</label>
                <select className="input" name="customer_id" defaultValue="">
                  <option value="">— none —</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="label">Date & time</label><input className="input" name="starts_at" type="datetime-local" required /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn-primary" disabled={busy === "new"}>{busy === "new" ? "Saving…" : "Add booking"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
