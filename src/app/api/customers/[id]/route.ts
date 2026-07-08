import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, persist, logActivity } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  const customer = getData().customers.find((c) => c.id === id && c.business_id === user.business_id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const name = String(body.name ?? customer.name).trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  customer.name = name;
  customer.email = String(body.email ?? "").trim() || null;
  customer.phone = String(body.phone ?? "").trim() || null;
  customer.address = String(body.address ?? "").trim() || null;
  customer.notes = String(body.notes ?? "").trim() || null;
  persist();

  return NextResponse.json({ ok: true, id });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bizId = user.business_id;

  const d = getData();
  const id = Number(params.id);
  const customer = d.customers.find((c) => c.id === id && c.business_id === bizId);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Detach from related records so quotes/bookings/invoices aren't orphaned.
  for (const q of d.quotes) if (q.business_id === bizId && q.customer_id === id) q.customer_id = null;
  for (const b of d.bookings) if (b.business_id === bizId && b.customer_id === id) b.customer_id = null;
  for (const inv of d.invoices) if (inv.business_id === bizId && inv.customer_id === id) inv.customer_id = null;

  d.customers = d.customers.filter((c) => !(c.id === id && c.business_id === bizId));
  logActivity(bizId, "customer", `Customer ${customer.name} deleted`);
  persist();

  return NextResponse.json({ ok: true });
}
