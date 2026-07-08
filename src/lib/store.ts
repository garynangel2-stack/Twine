import fs from "node:fs";
import path from "node:path";

// ---- Types ----
export type Business = { id: number; name: string; industry: string; phone: string | null; email: string | null; logo_initials: string | null; payment_provider?: "stripe" | "square" | null; created_at: string };
export type User = { id: number; business_id: number | null; name: string; email: string; password: string; role: "owner" | "admin"; created_at: string };
export type Customer = { id: number; business_id: number; name: string; email: string | null; phone: string | null; address: string | null; notes: string | null; created_at: string };
export type QuoteItem = { id: number; quote_id: number; description: string; qty: number; unit_price: number };
export type Quote = { id: number; business_id: number; customer_id: number | null; number: string; status: string; issued_date: string; valid_until: string | null; notes: string | null; total: number; created_at: string };
export type Booking = { id: number; business_id: number; customer_id: number | null; title: string; starts_at: string; ends_at: string | null; status: string; reminder_sent: number; notes: string | null; created_at: string };
export type InvoiceItem = { id: number; invoice_id: number; description: string; qty: number; unit_price: number };
export type Invoice = { id: number; business_id: number; customer_id: number | null; quote_id: number | null; number: string; status: string; issued_date: string; due_date: string | null; total: number; paid_at: string | null; payment_link: string | null; created_at: string };
export type ReminderSettings = { business_id: number; booking_reminder_hours: number; invoice_followup_days: number; review_request_enabled: number };
export type Waitlist = { id: number; name: string; email: string; business_type: string | null; website: string | null; status: string; created_at: string };
export type Activity = { id: number; business_id: number | null; kind: string; message: string; created_at: string };

export type Data = {
  businesses: Business[];
  users: User[];
  customers: Customer[];
  quotes: Quote[];
  quote_items: QuoteItem[];
  bookings: Booking[];
  invoices: Invoice[];
  invoice_items: InvoiceItem[];
  reminder_settings: ReminderSettings[];
  waitlist: Waitlist[];
  activity: Activity[];
  _seq: Record<string, number>;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "twine.json");

const g = globalThis as unknown as { __twineData?: Data };

// ---- date helpers ----
export const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
export const today = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => new Date(Date.now() + n * 86400000);
const iso = (d: Date) => d.toISOString().slice(0, 19).replace("T", " ");
const day = (d: Date) => d.toISOString().slice(0, 10);

function emptyData(): Data {
  return {
    businesses: [], users: [], customers: [], quotes: [], quote_items: [],
    bookings: [], invoices: [], invoice_items: [], reminder_settings: [],
    waitlist: [], activity: [], _seq: {},
  };
}

export function nextId(table: keyof Data): number {
  const d = getData();
  d._seq[table] = (d._seq[table] || 0) + 1;
  return d._seq[table];
}

export function getData(): Data {
  if (g.__twineData) return g.__twineData;
  let data: Data;
  try {
    if (fs.existsSync(DB_PATH)) {
      data = JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as Data;
    } else {
      data = seed();
    }
  } catch {
    data = seed();
  }
  g.__twineData = data;
  return data;
}

export function persist() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(g.__twineData, null, 2));
  } catch {
    // On read-only/serverless filesystems writes are best-effort; in-memory state still works per request.
  }
}

export function logActivity(businessId: number | null, kind: string, message: string) {
  const d = getData();
  d.activity.push({ id: nextId("activity"), business_id: businessId, kind, message, created_at: now() });
  persist();
}

// ---- Seed ----
function seed(): Data {
  const d = emptyData();
  g.__twineData = d; // so nextId works during seeding

  const biz: Business = {
    id: nextId("businesses"), name: "Ridgeline Home Services", industry: "contractor",
    phone: "(555) 214-8890", email: "hello@ridgeline.example", logo_initials: "RH", created_at: now(),
  };
  d.businesses.push(biz);

  d.users.push({ id: nextId("users"), business_id: biz.id, name: "Sam Rivera", email: "owner@twine.app", password: "twine123", role: "owner", created_at: now() });
  d.users.push({ id: nextId("users"), business_id: null, name: "Twine Admin", email: "admin@twine.app", password: "admin123", role: "admin", created_at: now() });

  d.reminder_settings.push({ business_id: biz.id, booking_reminder_hours: 24, invoice_followup_days: 3, review_request_enabled: 1 });

  const custDefs: [string, string, string, string][] = [
    ["Dana Whitfield", "dana.w@example.com", "(555) 771-2245", "48 Maple Court, Springfield"],
    ["Marcus Lee", "marcus.lee@example.com", "(555) 662-1180", "1290 Oak Ridge Rd, Springfield"],
    ["Priya Nair", "priya.nair@example.com", "(555) 903-4412", "77 Birchwood Ln, Fairview"],
    ["The Corner Bistro", "orders@cornerbistro.example", "(555) 220-9931", "5 Market St, Downtown"],
    ["Helen Osei", "helen.osei@example.com", "(555) 448-7756", "312 Cedar Ave, Fairview"],
  ];
  const custIds = custDefs.map((c) => {
    const id = nextId("customers");
    d.customers.push({ id, business_id: biz.id, name: c[0], email: c[1], phone: c[2], address: c[3], notes: null, created_at: now() });
    return id;
  });

  function addQuote(ci: number, number: string, status: string, issued: string, valid: string, items: [string, number, number][], notes: string) {
    const total = items.reduce((s, [, q, p]) => s + q * p, 0);
    const id = nextId("quotes");
    d.quotes.push({ id, business_id: biz.id, customer_id: custIds[ci], number, status, issued_date: issued, valid_until: valid, notes, total, created_at: now() });
    for (const [desc, qty, price] of items) d.quote_items.push({ id: nextId("quote_items"), quote_id: id, description: desc, qty, unit_price: price });
    return id;
  }
  addQuote(0, "Q-1001", "accepted", day(addDays(-12)), day(addDays(18)), [["Gutter cleaning & inspection", 1, 180], ["Downspout repair (2)", 2, 95]], "Includes debris haul-away.");
  addQuote(1, "Q-1002", "sent", day(addDays(-3)), day(addDays(27)), [["Deck power-wash", 1, 240], ["Deck re-seal (400 sq ft)", 400, 1.35]], "Weather-dependent scheduling.");
  addQuote(2, "Q-1003", "draft", today(), day(addDays(30)), [["Kitchen faucet replacement", 1, 320], ["Under-sink shutoff valves", 2, 45]], "");
  const q4 = addQuote(4, "Q-1004", "accepted", day(addDays(-20)), day(addDays(10)), [["Fence installation (cedar, 60 ft)", 60, 42], ["Post setting & concrete", 8, 65]], "Deposit collected.");

  const bookingDefs: [number, string, Date, string, number][] = [
    [0, "Gutter cleaning — Whitfield", addDays(1), "confirmed", 0],
    [1, "Deck power-wash — Lee", addDays(2), "scheduled", 0],
    [4, "Fence install day 1 — Osei", addDays(4), "confirmed", 0],
    [3, "Site visit — Corner Bistro", addDays(-2), "completed", 1],
  ];
  for (const [ci, title, starts, status, sent] of bookingDefs) {
    d.bookings.push({ id: nextId("bookings"), business_id: biz.id, customer_id: custIds[ci], title, starts_at: iso(starts), ends_at: null, status, reminder_sent: sent, notes: null, created_at: now() });
  }

  function addInvoice(ci: number, quoteId: number | null, number: string, status: string, issued: string, due: string, items: [string, number, number][], paidAt: string | null) {
    const total = items.reduce((s, [, q, p]) => s + q * p, 0);
    const id = nextId("invoices");
    d.invoices.push({ id, business_id: biz.id, customer_id: custIds[ci], quote_id: quoteId, number, status, issued_date: issued, due_date: due, total, paid_at: paidAt, payment_link: `https://pay.twine.app/i/${number.toLowerCase()}`, created_at: now() });
    for (const [desc, qty, price] of items) d.invoice_items.push({ id: nextId("invoice_items"), invoice_id: id, description: desc, qty, unit_price: price });
  }
  addInvoice(0, null, "INV-2001", "paid", day(addDays(-10)), day(addDays(-3)), [["Gutter cleaning & inspection", 1, 180], ["Downspout repair (2)", 2, 95]], iso(addDays(-6)));
  addInvoice(4, q4, "INV-2002", "overdue", day(addDays(-18)), day(addDays(-4)), [["Fence installation deposit", 1, 1200]], null);
  addInvoice(3, null, "INV-2003", "sent", day(addDays(-1)), day(addDays(13)), [["Quarterly maintenance visit", 1, 275]], null);

  const wl: [string, string, string, string, string][] = [
    ["Jordan Pace", "jordan@paceplumbing.example", "Home service contractor", "paceplumbing.example", "new"],
    ["Bright Smile Dental", "office@brightsmile.example", "Clinic or salon", "brightsmile.example", "invited"],
    ["Lakeside Events", "book@lakeside.example", "Event venue", "lakesideevents.example", "new"],
    ["Corley Electric", "info@corleyelectric.example", "Home service contractor", "", "converted"],
    ["Willow Spa", "hello@willowspa.example", "Clinic or salon", "willowspa.example", "new"],
  ];
  for (const [name, email, type, website, status] of wl) {
    d.waitlist.push({ id: nextId("waitlist"), name, email, business_type: type, website, status, created_at: now() });
  }

  for (const [kind, message] of [
    ["quote", "Quote Q-1004 accepted by Helen Osei"],
    ["invoice", "Invoice INV-2001 paid ($370.00)"],
    ["booking", "Booking confirmed: Gutter cleaning — Whitfield"],
    ["invoice", "Invoice INV-2002 is now overdue"],
  ] as [string, string][]) {
    d.activity.push({ id: nextId("activity"), business_id: biz.id, kind, message, created_at: now() });
  }

  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2));
  } catch {
    /* best-effort */
  }
  return d;
}
