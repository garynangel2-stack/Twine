import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, nextId, persist, logActivity, now } from "@/lib/store";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user || !user.business_id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  const startsAt = String(body.starts_at || "").trim();
  if (!title || !startsAt) return NextResponse.json({ error: "Title and time are required." }, { status: 400 });

  const id = nextId("bookings");
  getData().bookings.push({
    id, business_id: user.business_id, customer_id: body.customer_id ? Number(body.customer_id) : null,
    title, starts_at: startsAt.replace("T", " "), ends_at: null, status: "scheduled", reminder_sent: 0, notes: null, created_at: now(),
  });
  logActivity(user.business_id, "booking", `Booking created: ${title}`);
  persist();
  return NextResponse.json({ ok: true, id });
}
