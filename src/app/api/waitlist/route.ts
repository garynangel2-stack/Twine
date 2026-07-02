import { NextResponse } from "next/server";
import { getData, nextId, persist, now } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const business_type = String(body.business_type || "").trim();
    const website = String(body.website || "").trim();

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
    }

    getData().waitlist.push({
      id: nextId("waitlist"), name, email, business_type, website, status: "new", created_at: now(),
    });
    persist();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
