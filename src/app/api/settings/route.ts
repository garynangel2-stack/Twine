import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { persist } from "@/lib/store";
import { getReminderSettings } from "@/lib/queries";

export async function PATCH(req: Request) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = getReminderSettings(user.business_id);
  const body = await req.json();

  settings.booking_reminder_hours = Math.max(1, Number(body.booking_reminder_hours) || 24);
  settings.invoice_followup_days = Math.max(1, Number(body.invoice_followup_days) || 3);
  settings.review_request_enabled = body.review_request_enabled ? 1 : 0;
  persist();

  return NextResponse.json({ ok: true });
}
