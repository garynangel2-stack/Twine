import { NextResponse } from "next/server";
import { getData, persist, logActivity, now } from "@/lib/store";
import { verifySquare } from "@/lib/integrations/webhooks";

// Square calls this on payment events. We match the payment's order_id against
// the order id we stored on the invoice (payment_ref) and flip it to paid.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySquare(raw, req.headers.get("x-square-hmacsha256-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: { payment?: { status?: string; order_id?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.type === "payment.created" || event.type === "payment.updated") {
    const payment = event.data?.object?.payment;
    if (payment?.status === "COMPLETED" && payment.order_id) {
      markPaidByRef(payment.order_id);
    }
  }

  return NextResponse.json({ received: true });
}

function markPaidByRef(orderId: string) {
  const d = getData();
  const inv = d.invoices.find((i) => i.payment_ref === orderId);
  if (!inv || inv.status === "paid") return;
  inv.status = "paid";
  inv.paid_at = now();
  logActivity(inv.business_id, "invoice", `Invoice ${inv.number} paid via Square ($${inv.total.toFixed(2)})`);
  persist();
}
