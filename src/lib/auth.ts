import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getData } from "./store";

const COOKIE = "twine_session";
const SECRET = process.env.TWINE_SECRET || "twine-dev-secret-change-me";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin";
  business_id: number | null;
};

function sign(payload: string): string {
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return payload;
}

export function createSessionToken(userId: number): string {
  return sign(String(userId));
}

export function setSessionCookie(userId: number) {
  cookies().set(COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

function toSession(u: { id: number; name: string; email: string; role: "owner" | "admin"; business_id: number | null }): SessionUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role, business_id: u.business_id };
}

export function getSessionUser(): SessionUser | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  const id = Number(payload);
  if (!Number.isFinite(id)) return null;
  const user = getData().users.find((u) => u.id === id);
  return user ? toSession(user) : null;
}

export function authenticate(email: string, password: string): SessionUser | null {
  const e = email.trim().toLowerCase();
  const user = getData().users.find((u) => u.email === e);
  if (!user || user.password !== password) return null;
  return toSession(user);
}
