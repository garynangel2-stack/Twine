"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = { id: number; name: string };
type Item = { description: string; qty: number; unit_price: number };
type Initial = {
  id: number;
  customer_id: number | null;
  valid_until: string | null;
  notes: string | null;
  items: Item[];
};

export function QuoteBuilder({ customers, initial }: { customers: Customer[]; initial?: Initial }) {
  const router = useRouter();
  const editing = !!initial;
  const [customerId, setCustomerId] = useState<string>(
    initial?.customer_id?.toString() ?? customers[0]?.id?.toString() ?? ""
  );
  const [validUntil, setValidUntil] = useState(initial?.valid_until ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [items, setItems] = useState<Item[]>(
    initial?.items?.length ? initial.items : [{ description: "", qty: 1, unit_price: 0 }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0),
    [items]
  );

  function update(idx: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addRow() {
    setItems((prev) => [...prev, { description: "", qty: 1, unit_price: 0 }]);
  }
  function removeRow(idx: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  async function save(status: "draft" | "sent") {
    setError("");
    const clean = items.filter((i) => i.description.trim());
    if (!clean.length) {
      setError("Add at least one line item.");
      return;
    }
    setSaving(true);
    const payload = {
      customer_id: customerId ? Number(customerId) : null,
      valid_until: validUntil || null,
      notes,
      items: clean,
      ...(editing ? {} : { status }),
    };
    const res = await fetch(editing ? `/api/quotes/${initial!.id}` : "/api/quotes", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error || "Failed to save.");
      return;
    }
    const targetId = editing ? initial!.id : json.id;
    router.push(`/app/quotes/${targetId}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Customer</label>
          <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            {customers.length === 0 && <option value="">No customers — add one first</option>}
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Valid until</label>
          <input type="date" className="input" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="w-20 px-4 py-3">Qty</th>
              <th className="w-32 px-4 py-3">Unit price</th>
              <th className="w-28 px-4 py-3 text-right">Amount</th>
              <th className="w-10 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((it, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2">
                  <input className="input" placeholder="e.g. Gutter cleaning" value={it.description}
                    onChange={(e) => update(idx, { description: e.target.value })} />
                </td>
                <td className="px-4 py-2">
                  <input type="number" min="0" step="any" className="input" value={it.qty}
                    onChange={(e) => update(idx, { qty: Number(e.target.value) })} />
                </td>
                <td className="px-4 py-2">
                  <input type="number" min="0" step="0.01" className="input" value={it.unit_price}
                    onChange={(e) => update(idx, { unit_price: Number(e.target.value) })} />
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  ${((Number(it.qty) || 0) * (Number(it.unit_price) || 0)).toFixed(2)}
                </td>
                <td className="px-2 py-2 text-center">
                  <button onClick={() => removeRow(idx)} className="text-ink/30 hover:text-red-500" title="Remove">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-black/5 px-4 py-3">
          <button onClick={addRow} className="text-sm font-medium text-brand-600 hover:underline">+ Add line</button>
          <div className="text-right">
            <span className="mr-3 text-sm text-ink/50">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Terms, scheduling notes, deposit info…" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        {editing ? (
          <button className="btn-primary" disabled={saving} onClick={() => save("draft")}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        ) : (
          <>
            <button className="btn-outline" disabled={saving} onClick={() => save("draft")}>Save draft</button>
            <button className="btn-primary" disabled={saving} onClick={() => save("sent")}>
              {saving ? "Saving…" : "Save & mark sent"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
