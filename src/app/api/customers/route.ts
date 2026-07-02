import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, now } from "@/lib/store";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const id = nextId("customers");
  getData().customers.push({
    id, business_id: user.business_id, name,
    email: String(body.email || "").trim() || null,
    phone: String(body.phone || "").trim() || null,
    address: String(body.address || "").trim() || null,
    notes: String(body.notes || "").trim() || null,
    created_at: now(),
  });
  persist();

  return NextResponse.json({ ok: true, id });
}
