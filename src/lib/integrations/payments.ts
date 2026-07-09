// Payment-link creation. Each business picks Stripe or Square (stored on the
// business record). We call the chosen provider's REST API directly with fetch
// so there are no SDK dependencies. If the provider isn't configured, or a call
// fails, we return a mock link so invoice creation never breaks.

import { stripe as S, square as SQ, appUrl } from "./config";

export type PaymentProvider = "stripe" | "square";

export type PaymentLinkResult = {
  url: string;
  provider: PaymentProvider | "mock";
  mock: boolean;
  ref?: string | null; // provider reference used to match incoming webhooks
  error?: string;
};

type LinkOpts = {
  provider: PaymentProvider | null | undefined;
  amount: number; // in dollars
  description: string;
  invoiceNumber: string;
  invoiceId: number; // used as the webhook match key
};

function mockUrl(invoiceNumber: string): string {
  return `https://pay.twine.app/i/${invoiceNumber.toLowerCase()}`;
}

export async function createPaymentLink(opts: LinkOpts): Promise<PaymentLinkResult> {
  const provider: PaymentProvider = opts.provider === "square" ? "square" : "stripe";
  try {
    if (provider === "stripe" && S.configured()) return await stripeLink(opts);
    if (provider === "square" && SQ.configured()) return await squareLink(opts);
  } catch (e) {
    return { url: mockUrl(opts.invoiceNumber), provider: "mock", mock: true, error: String(e) };
  }
  return { url: mockUrl(opts.invoiceNumber), provider: "mock", mock: true };
}

async function stripeLink({ amount, description, invoiceNumber, invoiceId }: LinkOpts): Promise<PaymentLinkResult> {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  // client_reference_id lets the webhook map the paid session back to this invoice.
  body.set("client_reference_id", String(invoiceId));
  body.set("success_url", `${appUrl()}/app/invoices?paid=${encodeURIComponent(invoiceNumber)}`);
  body.set("cancel_url", `${appUrl()}/app/invoices`);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(Math.round(amount * 100)));
  body.set("line_items[0][price_data][product_data][name]", description || `Invoice ${invoiceNumber}`);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${S.key()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status}`);
  return { url: json.url, provider: "stripe", mock: false, ref: json.id };
}

async function squareLink({ amount, description, invoiceNumber, invoiceId }: LinkOpts): Promise<PaymentLinkResult> {
  const res = await fetch(`${SQ.base()}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SQ.token()}`,
      "Content-Type": "application/json",
      "Square-Version": "2024-06-04",
    },
    body: JSON.stringify({
      idempotency_key: `${invoiceId}-${Date.now()}`,
      quick_pay: {
        name: description || `Invoice ${invoiceNumber}`,
        price_money: { amount: Math.round(amount * 100), currency: "USD" },
        location_id: SQ.locationId(),
      },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || `Square ${res.status}`);
  // Store the order id so the payment webhook can match this invoice.
  return { url: json?.payment_link?.url, provider: "square", mock: false, ref: json?.payment_link?.order_id ?? null };
}
