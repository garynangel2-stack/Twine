import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { listQuotes } from "@/lib/queries";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { money, shortDate } from "@/lib/format";

export default function QuotesPage() {
  const user = getSessionUser()!;
  const quotes = listQuotes(user.business_id!);

  return (
    <div>
      <PageHeader
        title="Quotes"
        subtitle="Build a branded quote in minutes and track what's been accepted."
        action={<Link href="/app/quotes/new" className="btn-primary">+ New quote</Link>}
      />
      <div className="p-8">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Number</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Issued</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {quotes.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-ink/50">No quotes yet. Create your first one.</td></tr>
              )}
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/app/quotes/${q.id}`} className="font-medium text-brand-700 hover:underline">{q.number}</Link>
                  </td>
                  <td className="px-5 py-3">{q.customer_name ?? "—"}</td>
                  <td className="px-5 py-3 text-ink/60">{shortDate(q.issued_date)}</td>
                  <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-5 py-3 text-right font-medium">{money(q.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
