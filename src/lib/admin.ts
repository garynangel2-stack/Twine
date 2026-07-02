import { getData } from "./store";

export function adminStats() {
  const d = getData();
  return {
    waitlistTotal: d.waitlist.length,
    waitlistNew: d.waitlist.filter((w) => w.status === "new").length,
    converted: d.waitlist.filter((w) => w.status === "converted").length,
    businesses: d.businesses.length,
    grossBilled: d.invoices.reduce((s, i) => s + i.total, 0),
    collected: d.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0),
  };
}

export function waitlistByType() {
  const counts = new Map<string | null, number>();
  for (const w of getData().waitlist) {
    counts.set(w.business_type, (counts.get(w.business_type) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([type, n]) => ({ type, n }))
    .sort((a, b) => b.n - a.n);
}

export function listWaitlist() {
  return [...getData().waitlist].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listBusinesses() {
  const d = getData();
  return [...d.businesses]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((b) => ({
      ...b,
      customers: d.customers.filter((c) => c.business_id === b.id).length,
      quotes: d.quotes.filter((q) => q.business_id === b.id).length,
      invoices: d.invoices.filter((i) => i.business_id === b.id).length,
      collected: d.invoices.filter((i) => i.business_id === b.id && i.status === "paid").reduce((s, i) => s + i.total, 0),
    }));
}
