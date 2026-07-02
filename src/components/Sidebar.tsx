"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

const NAV = [
  { href: "/app", label: "Dashboard", icon: "▦" },
  { href: "/app/quotes", label: "Quotes", icon: "❝" },
  { href: "/app/bookings", label: "Bookings", icon: "🗓" },
  { href: "/app/invoices", label: "Invoices", icon: "＄" },
  { href: "/app/customers", label: "Customers", icon: "☺" },
  { href: "/app/settings", label: "Reminders", icon: "⏰" },
];

export function Sidebar({ userName, businessName }: { userName: string; businessName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-black/5 bg-white">
      <div className="p-5">
        <Link href="/app"><Logo className="text-lg text-ink" /></Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Workspace</p>
        <p className="truncate text-sm font-medium">{businessName}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "text-ink/70 hover:bg-black/5"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-black/5 p-3">
        <div className="px-2 py-1 text-sm">
          <p className="font-medium">{userName}</p>
          <button onClick={logout} className="mt-1 text-xs text-ink/50 hover:text-ink">Log out</button>
        </div>
      </div>
    </aside>
  );
}
