import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getData } from "@/lib/store";
import { getCustomer } from "@/lib/queries";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { InvoiceActions } from "@/components/InvoiceActions";
import { money, shortDate } from "@/lib/format";

export default function InvoiceDetail({ params }: { params: { id: string } }) {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const d = getData();

  const invoice = d.invoices.find((i) => i.id === Number(params.id) && i.business_id === bizId);
  if (!invoice) notFound();

  const items = d.invoice_items.filter((i) => i.invoice_id === invoice.id);
  const biz = d.businesses.find((b) => b.id === bizId);
  const customer = invoice.customer_id ? getCustomer(bizId, invoice.customer_id) : undefined;

  return (
    <div>
      <PageHeader
        title={invoice.number}
        subtitle={`Invoice for ${customer?.name ?? "—"}`}
        action={<Link href="/app/invoices" className="btn-ghost">← All invoices</Link>}
      />
      <div className="max-w-3xl space-y-6 p-8">
        <div className="flex items-center justify-between">
          <StatusBadge status={invoice.status} />
          <InvoiceActions id={invoice.id} status={invoice.status} paymentLink={invoice.payment_link} />
        </div>

        {invoice.status === "overdue" && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            This invoice is overdue. Twine can send an automatic follow-up per your reminder settings.
          </div>
        )}

        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-bold">{biz?.name}</p>
              <p className="text-sm text-ink/60">{biz?.phone}</p>
              <p className="text-sm text-ink/60">{biz?.email}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{invoice.number}</p>
              <p className="text-ink/60">Issued {shortDate(invoice.issued_date)}</p>
              {invoice.due_date && <p className="text-ink/60">Due {shortDate(invoice.due_date)}</p>}
              {invoice.paid_at && <p className="text-brand-600">Paid {shortDate(invoice.paid_at)}</p>}
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
              {items.map((it) => (
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
              <span className="text-xl font-bold">{money(invoice.total)}</span>
            </div>
          </div>

          {invoice.payment_link && (
            <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Payment link</p>
              <p className="mt-1 break-all text-brand-800">{invoice.payment_link}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
