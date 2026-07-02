import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getQuote, getCustomer } from "@/lib/queries";
import { getData } from "@/lib/store";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { QuoteActions } from "@/components/QuoteActions";
import { money, shortDate } from "@/lib/format";

export default function QuoteDetail({ params }: { params: { id: string } }) {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const quote = getQuote(bizId, Number(params.id));
  if (!quote) notFound();

  const biz = getData().businesses.find((b) => b.id === bizId);
  const customer = quote.customer_id ? getCustomer(bizId, quote.customer_id) : undefined;

  return (
    <div>
      <PageHeader
        title={quote.number}
        subtitle={`Quote for ${quote.customer_name ?? "—"}`}
        action={<Link href="/app/quotes" className="btn-ghost">← All quotes</Link>}
      />
      <div className="max-w-3xl space-y-6 p-8">
        <div className="flex items-center justify-between">
          <StatusBadge status={quote.status} />
          <QuoteActions id={quote.id} status={quote.status} />
        </div>

        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">{biz?.name}</p>
              <p className="text-sm text-ink/60">{biz?.phone}</p>
              <p className="text-sm text-ink/60">{biz?.email}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{quote.number}</p>
              <p className="text-ink/60">Issued {shortDate(quote.issued_date)}</p>
              {quote.valid_until && <p className="text-ink/60">Valid until {shortDate(quote.valid_until)}</p>}
            </div>
          </div>

          {customer && (
            <div className="mt-6 rounded-lg bg-black/[0.02] p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Bill to</p>
              <p className="mt-1 font-medium">{customer.name}</p>
              {customer.address && <p className="text-ink/60">{customer.address}</p>}
              {customer.email && <p className="text-ink/60">{customer.email}</p>}
            </div>
          )}

          <table className="mt-6 w-full text-sm">
            <thead className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="py-2">Description</th>
                <th className="w-16 py-2 text-right">Qty</th>
                <th className="w-28 py-2 text-right">Unit</th>
                <th className="w-28 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {quote.items.map((it) => (
                <tr key={it.id}>
                  <td className="py-2">{it.description}</td>
                  <td className="py-2 text-right">{it.qty}</td>
                  <td className="py-2 text-right">{money(it.unit_price)}</td>
                  <td className="py-2 text-right font-medium">{money(it.qty * it.unit_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-48 border-t border-black/10 pt-3 text-right">
              <span className="mr-4 text-sm text-ink/50">Total</span>
              <span className="text-xl font-bold">{money(quote.total)}</span>
            </div>
          </div>

          {quote.notes && (
            <div className="mt-6 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Notes</p>
              <p className="mt-1 text-ink/70">{quote.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
