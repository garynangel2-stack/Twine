import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getQuote, listCustomers } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { QuoteBuilder } from "@/components/QuoteBuilder";

export default function EditQuotePage({ params }: { params: { id: string } }) {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const quote = getQuote(bizId, Number(params.id));
  if (!quote) notFound();

  const customers = listCustomers(bizId).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <PageHeader
        title={`Edit ${quote.number}`}
        subtitle="Update line items, customer, or notes."
        action={<Link href={`/app/quotes/${quote.id}`} className="btn-ghost">← Back</Link>}
      />
      <div className="max-w-3xl p-8">
        <QuoteBuilder
          customers={customers}
          initial={{
            id: quote.id,
            customer_id: quote.customer_id,
            valid_until: quote.valid_until,
            notes: quote.notes,
            items: quote.items.map((it) => ({ description: it.description, qty: it.qty, unit_price: it.unit_price })),
          }}
        />
      </div>
    </div>
  );
}
