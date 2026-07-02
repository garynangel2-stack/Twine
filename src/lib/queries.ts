import { getData, persist, type Customer as SCustomer } from "./store";

export type Customer = SCustomer;

export type Quote = {
  id: number; number: string; status: string; issued_date: string; valid_until: string | null;
  notes: string | null; total: number; customer_name: string | null; customer_id: number | null;
};

export type Booking = {
  id: number; title: string; starts_at: string; status: string; reminder_sent: number;
  customer_name: string | null; customer_id: number | null;
};

export type Invoice = {
  id: number; number: string; status: string; issued_date: string; due_date: string | null;
  total: number; paid_at: string | null; payment_link: string | null; customer_name: string | null; customer_id: number | null;
};

function customerName(bizId: number, customerId: number | null): string | null {
  if (!customerId) return null;
  return getData().customers.find((c) => c.id === customerId && c.business_id === bizId)?.name ?? null;
}

export function listCustomers(bizId: number): Customer[] {
  return getData().customers
    .filter((c) => c.business_id === bizId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCustomer(bizId: number, id: number): Customer | undefined {
  return getData().customers.find((c) => c.business_id === bizId && c.id === id);
}

export function listQuotes(bizId: number): Quote[] {
  return getData().quotes
    .filter((q) => q.business_id === bizId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((q) => ({ ...q, customer_name: customerName(bizId, q.customer_id) }));
}

export function getQuote(bizId: number, id: number) {
  const q = getData().quotes.find((x) => x.business_id === bizId && x.id === id);
  if (!q) return undefined;
  const items = getData().quote_items.filter((i) => i.quote_id === id);
  return { ...q, customer_name: customerName(bizId, q.customer_id), items };
}

export function listBookings(bizId: number): Booking[] {
  return getData().bookings
    .filter((b) => b.business_id === bizId)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .map((b) => ({ ...b, customer_name: customerName(bizId, b.customer_id) }));
}

export function listInvoices(bizId: number): Invoice[] {
  return getData().invoices
    .filter((i) => i.business_id === bizId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((i) => ({ ...i, customer_name: customerName(bizId, i.customer_id) }));
}

export function getReminderSettings(bizId: number) {
  const d = getData();
  let row = d.reminder_settings.find((r) => r.business_id === bizId);
  if (!row) {
    row = { business_id: bizId, booking_reminder_hours: 24, invoice_followup_days: 3, review_request_enabled: 1 };
    d.reminder_settings.push(row);
    persist();
  }
  return row;
}

export function recentActivity(bizId: number, limit = 8) {
  return getData().activity
    .filter((a) => a.business_id === bizId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit);
}

export function dashboardStats(bizId: number) {
  const d = getData();
  const nowStr = new Date().toISOString().slice(0, 19).replace("T", " ");
  const quotes = d.quotes.filter((q) => q.business_id === bizId);
  const bookings = d.bookings.filter((b) => b.business_id === bizId);
  const invoices = d.invoices.filter((i) => i.business_id === bizId);
  return {
    openQuotes: quotes.filter((q) => ["draft", "sent"].includes(q.status)).length,
    upcoming: bookings.filter((b) => ["scheduled", "confirmed"].includes(b.status) && b.starts_at >= nowStr).length,
    outstanding: invoices.filter((i) => ["sent", "overdue"].includes(i.status)).reduce((s, i) => s + i.total, 0),
    overdue: invoices.filter((i) => i.status === "overdue").length,
    paidThis: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0),
  };
}
