import { NextResponse } from "next/server";
import { authenticate, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = authenticate(String(email || ""), String(password || ""));
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  setSessionCookie(user.id);
  const redirect = user.role === "admin" ? "/admin" : "/app";
  return NextResponse.json({ ok: true, redirect });
}
