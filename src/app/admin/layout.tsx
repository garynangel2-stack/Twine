import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/app");

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-black/5 bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin"><Logo className="text-white" /></Link>
            <span className="badge bg-white/10 text-white/80">Back office</span>
          </div>
          <AdminNav userName={user.name} />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
