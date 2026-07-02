"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuoteActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

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
    </div>
  );
}
