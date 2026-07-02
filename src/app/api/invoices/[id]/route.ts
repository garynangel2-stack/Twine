import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, persist, logActivity, now } from "@/lib/store";

const STATUSES = ["draft", "sent", "paid", "overdue"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();

  const inv = getData().invoices.find((i) => i.id === id && i.business_id === user.business_id);
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.followup) {
    logActivity(user.business_id, "invoice", `Payment follow-up sent for ${inv.number}`);
    return NextResponse.json({ ok: true });
  }

  if (typeof body.status === "string" && STATUSES.includes(body.status)) {
    inv.status = body.status;
    inv.paid_at = body.status === "paid" ? now() : null;
    const msg = body.status === "paid" ? `Invoice ${inv.number} paid ($${inv.total.toFixed(2)})` : `Invoice ${inv.number} marked ${body.status}`;
    logActivity(user.business_id, "invoice", msg);
    persist();
  }

  return NextResponse.json({ ok: true });
}
