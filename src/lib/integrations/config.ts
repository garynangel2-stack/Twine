// Central place that reads integration credentials from environment variables.
// Nothing here contains secrets — the actual values live in .env.local / Vercel.
// When a provider isn't configured, the app falls back to mock behavior so it
// still works end-to-end in development and demos.

export function appUrl(): string {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://loopline-4.vercel.app";
}

export const stripe = {
  key: () => process.env.STRIPE_SECRET_KEY || "",
  configured: () => !!process.env.STRIPE_SECRET_KEY,
};

export const square = {
  token: () => process.env.SQUARE_ACCESS_TOKEN || "",
  locationId: () => process.env.SQUARE_LOCATION_ID || "",
  base: () =>
    process.env.SQUARE_ENV === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com",
  configured: () => !!process.env.SQUARE_ACCESS_TOKEN && !!process.env.SQUARE_LOCATION_ID,
};

export const qbo = {
  accessToken: () => process.env.QBO_ACCESS_TOKEN || "",
  realmId: () => process.env.QBO_REALM_ID || "",
  base: () =>
    process.env.QBO_ENV === "production"
      ? "https://quickbooks.api.intuit.com"
      : "https://sandbox-quickbooks.api.intuit.com",
  configured: () => !!process.env.QBO_ACCESS_TOKEN && !!process.env.QBO_REALM_ID,
  payrollEnabled: () =>
    !!process.env.QBO_ACCESS_TOKEN && !!process.env.QBO_REALM_ID && process.env.QBO_PAYROLL_ENABLED === "true",
};

// A serializable snapshot for rendering connection status in the UI.
export function integrationStatus() {
  return {
    stripe: stripe.configured(),
    square: square.configured(),
    quickbooks: qbo.configured(),
    payroll: qbo.payrollEnabled(),
  };
}
