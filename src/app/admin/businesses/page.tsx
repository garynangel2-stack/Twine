import { listBusinesses } from "@/lib/admin";
import { money, shortDate } from "@/lib/format";

export default function AdminBusinesses() {
  const businesses = listBusinesses();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Businesses</h1>
        <p className="mt-1 text-sm text-ink/60">Every business running on Twine and their activity.</p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-5 py-3">Business</th>
              <th className="px-5 py-3">Industry</th>
              <th className="px-5 py-3 text-right">Customers</th>
              <th className="px-5 py-3 text-right">Quotes</th>
              <th className="px-5 py-3 text-right">Invoices</th>
              <th className="px-5 py-3 text-right">Collected</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {businesses.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-ink/50">No businesses yet.</td></tr>
            )}
            {businesses.map((b) => (
              <tr key={b.id} className="hover:bg-black/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-ink/50">{b.email ?? "—"}</p>
                </td>
                <td className="px-5 py-3 capitalize text-ink/60">{b.industry}</td>
                <td className="px-5 py-3 text-right">{b.customers}</td>
                <td className="px-5 py-3 text-right">{b.quotes}</td>
                <td className="px-5 py-3 text-right">{b.invoices}</td>
                <td className="px-5 py-3 text-right font-medium">{money(b.collected)}</td>
                <td className="px-5 py-3 text-ink/60">{shortDate(b.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
