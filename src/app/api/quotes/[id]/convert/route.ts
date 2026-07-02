import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, logActivity, now, today } from "@/lib/store";

// Convert an accepted quote into a sent invoice, copying line items.
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bizId = user.business_id;
  const d = getData();

  const quote = d.quotes.find((q) => q.id === Number(params.id) && q.business_id === bizId);
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = d.quote_items.filter((i) => i.quote_id === quote.id);
  const count = d.invoices.filter((i) => i.business_id === bizId).length;
  const number = `INV-${2001 + count}`;
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  const invId = nextId("invoices");
  d.invoices.push({
    id: invId, business_id: bizId, customer_id: quote.customer_id, quote_id: quote.id, number,
    status: "sent", issued_date: today(), due_date: due, total: quote.total, paid_at: null,
    payment_link: `https://pay.twine.app/i/${number.toLowerCase()}`, created_at: now(),
  });
  for (const i of items) {
    d.invoice_items.push({ id: nextId("invoice_items"), invoice_id: invId, description: i.description, qty: i.qty, unit_price: i.unit_price });
  }
  logActivity(bizId, "invoice", `Invoice ${number} created from quote ${quote.number}`);
  persist();

  return NextResponse.json({ ok: true, invoiceId: invId });
}
