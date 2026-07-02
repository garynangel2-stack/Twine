import Link from "next/link";
import { adminStats, waitlistByType, listWaitlist } from "@/lib/admin";
import { money, shortDate } from "@/lib/format";
import { StatusBadge } from "@/components/PageHeader";

export default function AdminOverview() {
  const stats = adminStats();
  const byType = waitlistByType();
  const recent = listWaitlist().slice(0, 6);

  const cards = [
    { label: "Waitlist signups", value: stats.waitlistTotal, sub: `${stats.waitlistNew} new` },
    { label: "Converted", value: stats.converted, sub: "to customers" },
    { label: "Active businesses", value: stats.businesses, sub: "on Twine" },
    { label: "Collected (all)", value: money(stats.collected), sub: `${money(stats.grossBilled)} billed` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Back office overview</h1>
        <p className="mt-1 text-sm text-ink/60">Waitlist, customers, and platform health at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
            <p className="mt-1 text-xs text-ink/50">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Waitlist by industry</h2>
          <div className="mt-4 space-y-3">
            {byType.map((t) => {
              const pct = stats.waitlistTotal ? Math.round((t.n / stats.waitlistTotal) * 100) : 0;
              return (
                <div key={t.type ?? "unknown"}>
                  <div className="flex justify-between text-sm">
                    <span>{t.type || "Unspecified"}</span>
                    <span className="text-ink/50">{t.n}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-black/5">
                    <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent signups</h2>
            <Link href="/admin/waitlist" className="text-sm text-brand-600 hover:underline">Manage all</Link>
          </div>
          <div className="mt-4 divide-y divide-black/5">
            {recent.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-ink/50">{w.email} · {shortDate(w.created_at)}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
