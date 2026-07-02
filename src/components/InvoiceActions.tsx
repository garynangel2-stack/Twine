"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InvoiceActions({ id, status, paymentLink }: { id: number; status: string; paymentLink: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function patch(payload: object) {
    setBusy(true);
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    router.refresh();
  }

  function copyLink() {
    if (!paymentLink) return;
    navigator.clipboard?.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {paymentLink && (
        <button className="btn-outline" onClick={copyLink}>{copied ? "Copied!" : "Copy payment link"}</button>
      )}
      {status === "draft" && <button className="btn-primary" disabled={busy} onClick={() => patch({ status: "sent" })}>Send invoice</button>}
      {(status === "sent" || status === "overdue") && (
        <>
          <button className="btn-primary" disabled={busy} onClick={() => patch({ status: "paid" })}>Mark paid</button>
          {status === "sent" && <button className="btn-outline" disabled={busy} onClick={() => patch({ status: "overdue" })}>Flag overdue</button>}
          <button className="btn-outline" disabled={busy} onClick={() => patch({ followup: true })}>Send follow-up</button>
        </>
      )}
    </div>
  );
}
