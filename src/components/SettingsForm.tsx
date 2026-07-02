"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Settings = {
  booking_reminder_hours: number;
  invoice_followup_days: number;
  review_request_enabled: number;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_reminder_hours: Number(data.booking_reminder_hours),
        invoice_followup_days: Number(data.invoice_followup_days),
        review_request_enabled: data.review_request_enabled === "on" ? 1 : 0,
      }),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-6">
      <div className="card p-6">
        <label className="label">Appointment reminders</label>
        <p className="mb-3 text-sm text-ink/60">Send an automatic text & email reminder before each appointment.</p>
        <div className="flex items-center gap-2">
          <input className="input w-24" type="number" min="1" name="booking_reminder_hours" defaultValue={settings.booking_reminder_hours} />
          <span className="text-sm text-ink/70">hours before the appointment</span>
        </div>
      </div>

      <div className="card p-6">
        <label className="label">Overdue invoice follow-ups</label>
        <p className="mb-3 text-sm text-ink/60">Automatically nudge customers after an invoice becomes overdue.</p>
        <div className="flex items-center gap-2">
          <input className="input w-24" type="number" min="1" name="invoice_followup_days" defaultValue={settings.invoice_followup_days} />
          <span className="text-sm text-ink/70">days after the due date</span>
        </div>
      </div>

      <div className="card p-6">
        <label className="flex items-center gap-3">
          <input type="checkbox" name="review_request_enabled" defaultChecked={!!settings.review_request_enabled} className="h-4 w-4 rounded" />
          <span>
            <span className="font-medium">Send review requests</span>
            <span className="block text-sm text-ink/60">Ask happy customers for a review after a completed job.</span>
          </span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        {saved && <span className="text-sm font-medium text-brand-600">✓ Saved</span>}
      </div>
    </form>
  );
}
