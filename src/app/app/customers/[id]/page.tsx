import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getCustomer, quotesByCustomer, bookingsByCustomer, invoicesByCustomer } from "@/lib/queries";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { CustomerForm } from "@/components/CustomerForm";
import { CustomerDelete } from "@/components/CustomerDelete";
import { money, shortDate, dateTime } from "@/lib/format";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const id = Number(params.id);
  const customer = getCustomer(bizId, id);
  if (!customer) notFound();

  const quotes = quotesByCustomer(bizId, id);
  const bookings = bookingsByCustomer(bizId, id);
  const invoices = invoicesByCustomer(bizId, id);

  return (
    <div>
      <PageHeader
        title={customer.name}
        subtitle="Customer profile and everything linked to them."
        action={
          <div className="flex items-center gap-2">
            <Link href="/app/customers" className="btn-ghost">← All customers</Link>
            <CustomerForm customer={customer} triggerClassName="btn-outline" triggerLabel="Edit" />
            <CustomerDelete id={customer.id} name={customer.name} />
          </div>
        }
      />

      <div className="space-y-8 p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Contact</p>
            <p className="mt-2 text-sm">{customer.email ?? "No email"}</p>
            <p className="text-sm text-ink/70">{customer.phone ?? "No phone"}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Address</p>
            <p className="mt-2 text-sm text-ink/70">{customer.address ?? "—"}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Notes</p>
            <p className="mt-2 text-sm text-ink/70">{customer.notes ?? "—"}</p>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Quotes</h2>
            <Link href="/app/quotes/new" className="text-sm text-brand-600 hover:underline">+ New quote</Link>
          </div>
          <div className="card mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-black/5">
                {quotes.length === 0 && (
                  <tr><td className="px-5 py-6 text-center text-ink/50">No quotes yet.</td></tr>
                )}
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-black/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/app/quotes/${q.id}`} className="font-medium hover:underline">{q.number}</Link>
                    </td>
                    <td className="px-5 py-3 text-ink/60">{shortDate(q.issued_date)}</td>
                    <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-5 py-3 text-right font-medium">{money(q.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Bookings</h2>
          <div className="card mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-black/5">
                {bookings.length === 0 && (
                  <tr><td className="px-5 py-6 text-center text-ink/50">No bookings yet.</td></tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.02]">
                    <td className="px-5 py-3 font-medium">{b.title}</td>
                    <td className="px-5 py-3 text-ink/60">{dateTime(b.starts_at)}</td>
                    <td className="px-5 py-3 text-right"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Invoices</h2>
          <div className="card mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-black/5">
                {invoices.length === 0 && (
                  <tr><td className="px-5 py-6 text-center text-ink/50">No invoices yet.</td></tr>
                )}
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-black/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/app/invoices/${inv.id}`} className="font-medium hover:underline">{inv.number}</Link>
                    </td>
                    <td className="px-5 py-3 text-ink/60">Due {shortDate(inv.due_date)}</td>
                    <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3 text-right font-medium">{money(inv.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
