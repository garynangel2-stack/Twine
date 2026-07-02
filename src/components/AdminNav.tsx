"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/waitlist", label: "Waitlist" },
  { href: "/admin/businesses", label: "Businesses" },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-6 text-sm">
      <nav className="flex items-center gap-4">
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={active ? "font-semibold text-white" : "text-white/60 hover:text-white"}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 border-l border-white/15 pl-4">
        <span className="text-white/70">{userName}</span>
        <button onClick={logout} className="text-white/50 hover:text-white">Log out</button>
      </div>
    </div>
  );
}
