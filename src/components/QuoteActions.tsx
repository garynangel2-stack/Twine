"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuoteActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  async function convert() {
    setBusy(true);
    const res = await fetch(`/api/quotes/${id}/convert`, { method: "POST" });
    const json = await res.json();
    setBusy(false);
    if (res.ok && json.invoiceId) {
      router.push(`/app/invoices/${json.invoiceId}`);
      router.refresh();
    }
  }

  async function remove() {
    setBusy(true);
    const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/app/quotes");
      router.refresh();
    } else {
      setBusy(false);
      setConfirming(false);
    }
  }

  const canEdit = status === "draft" || status === "sent";

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <button className="btn-primary" disabled={busy} onClick={() => setStatus("sent")}>Mark as sent</button>
      )}
      {status === "sent" && (
        <>
          <button className="btn-primary" disabled={busy} onClick={() => setStatus("accepted")}>Mark accepted</button>
          <button className="btn-outline" disabled={busy} onClick={() => setStatus("declined")}>Mark declined</button>
        </>
      )}
      {status === "accepted" && (
        <button className="btn-primary" disabled={busy} onClick={convert}>Convert to invoice</button>
      )}
      {status === "declined" && (
        <button className="btn-outline" disabled={busy} onClick={() => setStatus("sent")}>Re-open</button>
      )}
      {canEdit && (
        <Link href={`/app/quotes/${id}/edit`} className="btn-outline">Edit</Link>
      )}
      <button className="btn-ghost text-red-600" disabled={busy} onClick={() => setConfirming(true)}>Delete</button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirming(false)}>
          <div className="card w-full max-w-sm p-6 text-left" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">Delete this quote?</h2>
            <p className="mt-2 text-sm text-ink/60">This permanently removes the quote and its line items.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
              <button className="btn-primary bg-red-600 hover:bg-red-700" disabled={busy} onClick={remove}>
                {busy ? "Deleting…" : "Delete quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
