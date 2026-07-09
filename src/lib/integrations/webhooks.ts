// Signature verification for incoming payment webhooks. No SDKs — plain crypto.
// If the relevant signing secret isn't configured we skip verification (dev/mock),
// but log a warning so it's obvious the endpoint is unauthenticated.

import crypto from "node:crypto";
import { appUrl } from "./config";

export function verifyStripe(rawBody: string, sigHeader: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[webhook] STRIPE_WEBHOOK_SECRET not set — skipping signature check");
    return true;
  }
  if (!sigHeader) return false;
  // Header looks like: t=timestamp,v1=signature[,v1=...]
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k, v];
    }),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  return timingSafeEqualHex(expected, v1);
}

export function verifySquare(rawBody: string, sigHeader: string | null): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) {
    console.warn("[webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set — skipping signature check");
    return true;
  }
  if (!sigHeader) return false;
  const url = `${appUrl()}/api/webhooks/square`;
  const expected = crypto.createHmac("sha256", key).update(url + rawBody).digest("base64");
  return timingSafeEqualStr(expected, sigHeader);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}
