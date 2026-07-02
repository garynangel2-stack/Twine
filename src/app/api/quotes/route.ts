import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, logActivity, now, today } from "@/lib/store";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bizId = user.business_id;

  const body = await req.json();
  const items: { description: string; qty: number; unit_price: number }[] = Array.isArray(body.items) ? body.items : [];
  const clean = items.filter((i) => i.description?.trim());
  if (!clean.length) return NextResponse.json({ error: "At least one line item is required." }, { status: 400 });

  const d = getData();
  const total = clean.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0);
  const count = d.quotes.filter((q) => q.business_id === bizId).length;
  const number = `Q-${1001 + count}`;
  const status = body.status === "sent" ? "sent" : "draft";

  const id = nextId("quotes");
  d.quotes.push({
    id, business_id: bizId, customer_id: body.customer_id ?? null, number, status,
    issued_date: today(), valid_until: body.valid_until ?? null, notes: body.notes ?? "", total, created_at: now(),
  });
  for (const i of clean) {
    d.quote_items.push({ id: nextId("quote_items"), quote_id: id, description: i.description.trim(), qty: Number(i.qty) || 0, unit_price: Number(i.unit_price) || 0 });
  }
  logActivity(bizId, "quote", `Quote ${number} created${status === "sent" ? " and sent" : ""}`);
  persist();

  return NextResponse.json({ ok: true, id });
}
