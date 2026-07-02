import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { listCustomers } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { QuoteBuilder } from "@/components/QuoteBuilder";

export default function NewQuotePage() {
  const user = getSessionUser()!;
  const customers = listCustomers(user.business_id!).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <PageHeader
        title="New quote"
        subtitle="Add line items and Twine totals it up into a branded quote."
        action={<Link href="/app/quotes" className="btn-ghost">← Back</Link>}
      />
      <div className="max-w-3xl p-8">
        <QuoteBuilder customers={customers} />
      </div>
    </div>
  );
}
