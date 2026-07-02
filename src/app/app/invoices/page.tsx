import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { listInvoices } from "@/lib/queries";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { money, shortDate } from "@/lib/format";

export default function InvoicesPage() {
  const user = getSessionUser()!;
  const invoices = listInvoices(user.business_id!);
  const outstanding = invoices.filter((i) => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Send payment links and let Twine chase overdue balances for you."
      />
      <div className="space-y-6 p-8">
        {outstanding > 0 && (
          <div className="card flex items-center justify-between p-5">
            <p className="text-sm text-ink/60">Total outstanding</p>
            <p className="text-xl font-bold">{money(outstanding)}</p>
          </div>
        )}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Number</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {invoices.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-ink/50">No invoices yet. Accept a quote to generate one.</td></tr>
              )}
              {invoices.map((i) => (
                <tr key={i.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/app/invoices/${i.id}`} className="font-medium text-brand-700 hover:underline">{i.number}</Link>
                  </td>
                  <td className="px-5 py-3">{i.customer_name ?? "—"}</td>
                  <td className="px-5 py-3 text-ink/60">{shortDate(i.due_date)}</td>
                  <td className="px-5 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-5 py-3 text-right font-medium">{money(i.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
