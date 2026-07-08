import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getData } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  const biz = getData().businesses.find((b) => b.id === user.business_id);

  return (
    <div className="app-dark flex min-h-screen bg-paper">
      <Sidebar userName={user.name} businessName={biz?.name ?? "My Business"} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
