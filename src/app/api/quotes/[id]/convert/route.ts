import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, logActivity, now, today } from "@/lib/store";
import { createPaymentLink } from "@/lib/integrations/payments";
import { qboUpsertCustomer, qboCreateInvoice } from "@/lib/integrations/quickbooks";

// Convert an accepted quote into a sent invoice, copying line items.
// On creation we generate a payment link via the business's chosen processor
// and (best-effort) push the customer + invoice to QuickBooks.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bizId = user.business_id;
  const d = getData();

  const quote = d.quotes.find((q) => q.id === Number(params.id) && q.business_id === bizId);
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const biz = d.businesses.find((b) => b.id === bizId);
  const items = d.quote_items.filter((i) => i.quote_id === quote.id);
  const count = d.invoices.filter((i) => i.business_id === bizId).length;
  const number = `INV-${2001 + count}`;
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  // Allocate the invoice id first so the payment link can reference it (used by webhooks).
  const invId = nextId("invoices");

  // Payment link via the business's chosen provider (mock link if unconfigured).
  const link = await createPaymentLink({
    provider: biz?.payment_provider ?? null,
    amount: quote.total,
    description: `Invoice ${number}`,
    invoiceNumber: number,
    invoiceId: invId,
  });

  d.invoices.push({
    id: invId, business_id: bizId, customer_id: quote.customer_id, quote_id: quote.id, number,
    status: "sent", issued_date: today(), due_date: due, total: quote.total, paid_at: null,
    payment_link: link.url, payment_ref: link.ref ?? null, created_at: now(),
  });
  for (const i of items) {
    d.invoice_items.push({ id: nextId("invoice_items"), invoice_id: invId, description: i.description, qty: i.qty, unit_price: i.unit_price });
  }
  logActivity(bizId, "invoice", `Invoice ${number} created from quote ${quote.number}`);
  persist();

  // Best-effort QuickBooks sync — never blocks invoice creation.
  const customer = quote.customer_id ? d.customers.find((c) => c.id === quote.customer_id) : undefined;
  if (customer) {
    const qc = await qboUpsertCustomer(customer.name, customer.email);
    if (!qc.mock && qc.id) {
      const inv = await qboCreateInvoice({
        customerRef: qc.id,
        docNumber: number,
        lines: items.map((i) => ({ description: i.description, amount: i.qty * i.unit_price })),
      });
      if (!inv.mock) logActivity(bizId, "invoice", `Invoice ${number} synced to QuickBooks`);
    }
  }

  return NextResponse.json({ ok: true, invoiceId: invId, payment: { provider: link.provider, mock: link.mock } });
}
