import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, persist, logActivity } from "@/lib/store";

const ALLOWED = ["draft", "sent", "accepted", "declined"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const status = String(body.status || "");
  if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const quote = getData().quotes.find((q) => q.id === Number(params.id) && q.business_id === user.business_id);
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  quote.status = status;
  logActivity(user.business_id, "quote", `Quote ${quote.number} marked ${status}`);
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
