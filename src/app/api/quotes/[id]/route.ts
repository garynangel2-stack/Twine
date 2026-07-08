import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, logActivity } from "@/lib/store";

const ALLOWED = ["draft", "sent", "accepted", "declined"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bizId = user.business_id;

  const d = getData();
  const quote = d.quotes.find((q) => q.id === Number(params.id) && q.business_id === bizId);
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Full edit: replace fields + line items.
  if (Array.isArray(body.items)) {
    const clean: { description: string; qty: number; unit_price: number }[] = body.items
      .filter((i: { description?: string }) => i.description?.trim());
    if (!clean.length) return NextResponse.json({ error: "At least one line item is required." }, { status: 400 });

    quote.customer_id = body.customer_id ?? null;
    quote.valid_until = body.valid_until ?? null;
    quote.notes = body.notes ?? "";
    quote.total = clean.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0);

    d.quote_items = d.quote_items.filter((i) => i.quote_id !== quote.id);
    for (const i of clean) {
      d.quote_items.push({ id: nextId("quote_items"), quote_id: quote.id, description: i.description.trim(), qty: Number(i.qty) || 0, unit_price: Number(i.unit_price) || 0 });
    }
    logActivity(bizId, "quote", `Quote ${quote.number} edited`);
    persist();
    return NextResponse.json({ ok: true, id: quote.id });
  }

  // Status-only update.
  const status = String(body.status || "");
  if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  quote.status = status;
  logActivity(bizId, "quote", `Quote ${quote.number} marked ${status}`);
  persist();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = getData();
  const id = Number(params.id);
  d.quotes = d.quotes.filter((q) => !(q.id === id && q.business_id === user.business_id));
  d.quote_items = d.quote_items.filter((i) => i.quote_id !== id);
  persist();
  return NextResponse.json({ ok: true });
}
