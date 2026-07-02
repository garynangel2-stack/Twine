import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, persist, logActivity } from "@/lib/store";

const STATUSES = ["scheduled", "confirmed", "completed", "cancelled"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(params.id);
  const body = await req.json();

  const booking = getData().bookings.find((b) => b.id === id && b.business_id === user.business_id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (typeof body.reminder_sent !== "undefined") {
    booking.reminder_sent = 1;
    logActivity(user.business_id, "booking", `Reminder sent: ${booking.title}`);
  }
  if (typeof body.status === "string" && STATUSES.includes(body.status)) {
    booking.status = body.status;
    logActivity(user.business_id, "booking", `Booking ${body.status}: ${booking.title}`);
  }
  persist();

  return NextResponse.json({ ok: true });
}
