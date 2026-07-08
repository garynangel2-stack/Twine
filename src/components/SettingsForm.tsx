"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Settings = {
  booking_reminder_hours: number;
  invoice_followup_days: number;
  review_request_enabled: number;
};

type Integrations = {
  stripe: boolean;
  square: boolean;
  quickbooks: boolean;
  payroll: boolean;
};

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span className={`badge ${ok ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-700"}`}>
      {ok ? "Connected" : "Not connected"}
    </span>
  );
}

export function SettingsForm({
  settings,
  paymentProvider,
  integrations,
}: {
  settings: Settings;
  paymentProvider: "stripe" | "square";
  integrations: Integrations;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<"stripe" | "square">(paymentProvider);

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
        payment_provider: provider,
      }),
    });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  const providerConnected = provider === "stripe" ? integrations.stripe : integrations.square;

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

      <div className="card p-6">
        <label className="label">Payments</label>
        <p className="mb-3 text-sm text-ink/60">Choose the card processor used for invoice payment links.</p>
        <div className="flex gap-2">
          {(["stripe", "square"] as const).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setProvider(p)}
              className={`btn ${provider === p ? "btn-primary" : "btn-outline"} capitalize`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-ink/60">
          <StatusPill ok={providerConnected} />
          {!providerConnected && <span>Add the {provider} keys in your environment to go live.</span>}
        </div>
      </div>

      <div className="card p-6">
        <label className="label">Integrations</label>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center justify-between"><span>Stripe</span><StatusPill ok={integrations.stripe} /></li>
          <li className="flex items-center justify-between"><span>Square</span><StatusPill ok={integrations.square} /></li>
          <li className="flex items-center justify-between"><span>QuickBooks Online</span><StatusPill ok={integrations.quickbooks} /></li>
          <li className="flex items-center justify-between"><span>QuickBooks Payroll</span><StatusPill ok={integrations.payroll} /></li>
        </ul>
        <p className="mt-3 text-xs text-ink/50">Connection status reflects the keys configured in your environment.</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        {saved && <span className="text-sm font-medium text-brand-600">✓ Saved</span>}
      </div>
    </form>
  );
}
