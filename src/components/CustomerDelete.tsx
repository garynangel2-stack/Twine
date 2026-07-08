"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerDelete({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/app/customers");
      router.refresh();
    } else {
      setBusy(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <button className="btn-ghost text-red-600" onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirming(false)}>
      <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">Delete {name}?</h2>
        <p className="mt-2 text-sm text-ink/60">
          This removes the customer. Their quotes, bookings, and invoices are kept but no longer linked to a customer.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
          <button className="btn-primary bg-red-600 hover:bg-red-700" disabled={busy} onClick={remove}>
            {busy ? "Deleting…" : "Delete customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
