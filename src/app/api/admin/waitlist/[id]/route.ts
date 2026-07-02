import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getData, persist } from "@/lib/store";

const STATUSES = ["new", "invited", "converted"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const status = String(body.status || "");
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const row = getData().waitlist.find((w) => w.id === Number(params.id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  row.status = status;
  persist();
  return NextResponse.json({ ok: true });
}
