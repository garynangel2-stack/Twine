import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { dashboardStats, listBookings, recentActivity } from "@/lib/queries";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { money, dateTime } from "@/lib/format";

export default function Dashboard() {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const stats = dashboardStats(bizId);
  const upcoming = listBookings(bizId)
    .filter((b) => ["scheduled", "confirmed"].includes(b.status) && new Date(b.starts_at.replace(" ", "T")) >= new Date())
    .slice(0, 5);
  const activity = recentActivity(bizId);

  const cards = [
    { label: "Open quotes", value: stats.openQuotes, href: "/app/quotes" },
    { label: "Upcoming bookings", value: stats.upcoming, href: "/app/bookings" },
    { label: "Outstanding", value: money(stats.outstanding), href: "/app/invoices", tone: stats.overdue ? "warn" : "" },
    { label: "Collected", value: money(stats.paidThis), href: "/app/invoices" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle="Here's what needs your attention today."
      />
      <div className="space-y-8 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="card p-5 transition-shadow hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{c.label}</p>
              <p className={`mt-2 text-2xl font-bold ${c.tone === "warn" ? "text-red-600" : ""}`}>{c.value}</p>
              {c.label === "Outstanding" && stats.overdue > 0 && (
                <p className="mt-1 text-xs font-medium text-red-600">{stats.overdue} overdue</p>
              )}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Upcoming bookings</h2>
              <Link href="/app/bookings" className="text-sm text-brand-600 hover:underline">View all</Link>
            </div>
            <div className="mt-4 divide-y divide-black/5">
              {upcoming.length === 0 && <p className="py-6 text-sm text-ink/50">No upcoming bookings.</p>}
              {upcoming.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-ink/50">{dateTime(b.starts_at)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Recent activity</h2>
            <div className="mt-4 space-y-3">
              {activity.length === 0 && <p className="py-6 text-sm text-ink/50">Nothing yet.</p>}
              {activity.map((a) => (
                <div key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                  <div>
                    <p>{a.message}</p>
                    <p className="text-xs text-ink/40">{dateTime(a.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card flex flex-wrap items-center gap-3 p-6">
          <p className="mr-auto font-semibold">Quick actions</p>
          <Link href="/app/quotes/new" className="btn-primary">+ New quote</Link>
          <Link href="/app/bookings" className="btn-outline">+ New booking</Link>
          <Link href="/app/customers" className="btn-outline">+ New customer</Link>
        </div>
      </div>
    </div>
  );
}
