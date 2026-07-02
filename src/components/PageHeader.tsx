export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-black/5 px-8 py-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  // Imported style map kept inline to avoid a client boundary.
  const map: Record<string, string> = {
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
  return (
    <span className={`badge ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
