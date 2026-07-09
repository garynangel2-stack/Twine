import { NextResponse } from "next/server";
import { getData, persist, logActivity, now } from "@/lib/store";
import { verifyStripe } from "@/lib/integrations/webhooks";

// Stripe calls this when a Checkout session is paid. We match the session's
// client_reference_id (the invoice id we set when creating the link) and flip
// the invoice to paid.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyStripe(raw, req.headers.get("stripe-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: { client_reference_id?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const ref = event.data?.object?.client_reference_id;
    const invId = Number(ref);
    if (Number.isFinite(invId)) markPaid(invId);
  }

  return NextResponse.json({ received: true });
}

function markPaid(invId: number) {
  const d = getData();
  const inv = d.invoices.find((i) => i.id === invId);
  if (!inv || inv.status === "paid") return;
  inv.status = "paid";
  inv.paid_at = now();
  logActivity(inv.business_id, "invoice", `Invoice ${inv.number} paid via Stripe ($${inv.total.toFixed(2)})`);
  persist();
}
