import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { listCustomers } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { CustomerForm } from "@/components/CustomerForm";

export default function CustomersPage() {
  const user = getSessionUser()!;
  const customers = listCustomers(user.business_id!);

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Everyone you quote, book, and invoice — in one place."
        action={<CustomerForm />}
      />
      <div className="p-8">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {customers.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-ink/50">No customers yet.</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-black/[0.02]">
                  <td className="px-5 py-3 font-medium">
                    <Link href={`/app/customers/${c.id}`} className="hover:underline">{c.name}</Link>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{c.email ?? "—"}</td>
                  <td className="px-5 py-3 text-ink/60">{c.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-ink/60">{c.address ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
