"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      form.reset();
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return <button className="btn-primary" onClick={() => setOpen(true)}>+ New customer</button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">New customer</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div><label className="label">Name</label><input className="input" name="name" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Email</label><input className="input" name="email" type="email" /></div>
            <div><label className="label">Phone</label><input className="input" name="phone" /></div>
          </div>
          <div><label className="label">Address</label><input className="input" name="address" /></div>
          <div><label className="label">Notes</label><textarea className="input" name="notes" rows={2} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Add customer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
