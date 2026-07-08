"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export function CustomerForm({
  customer,
  triggerLabel,
  triggerClassName = "btn-primary",
}: {
  customer?: Customer;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const router = useRouter();
  const editing = !!customer;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch(editing ? `/api/customers/${customer!.id}` : "/api/customers", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      if (!editing) form.reset();
      setOpen(false);
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Something went wrong.");
    }
  }

  if (!open) {
    return (
      <button className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel ?? (editing ? "Edit" : "+ New customer")}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{editing ? "Edit customer" : "New customer"}</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div><label className="label">Name</label><input className="input" name="name" required defaultValue={customer?.name ?? ""} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Email</label><input className="input" name="email" type="email" defaultValue={customer?.email ?? ""} /></div>
            <div><label className="label">Phone</label><input className="input" name="phone" defaultValue={customer?.phone ?? ""} /></div>
          </div>
          <div><label className="label">Address</label><input className="input" name="address" defaultValue={customer?.address ?? ""} /></div>
          <div><label className="label">Notes</label><textarea className="input" name="notes" rows={2} defaultValue={customer?.notes ?? ""} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add customer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
