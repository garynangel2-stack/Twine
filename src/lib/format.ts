export function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

export function shortDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s.includes("T") || s.includes(" ") ? s.replace(" ", "T") : s + "T00:00:00");
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function dateTime(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s.replace(" ", "T"));
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-brand-100 text-brand-700",
  declined: "bg-red-100 text-red-700",
  scheduled: "bg-amber-100 text-amber-800",
  confirmed: "bg-brand-100 text-brand-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-brand-100 text-brand-700",
  overdue: "bg-red-100 text-red-700",
  new: "bg-blue-100 text-blue-700",
  invited: "bg-amber-100 text-amber-800",
  converted: "bg-brand-100 text-brand-700",
};

export function statusClass(status: string): string {
  return STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
}
