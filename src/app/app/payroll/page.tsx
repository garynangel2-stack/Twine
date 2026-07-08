import { getSessionUser } from "@/lib/auth";
import { qboListEmployees, qboLastPayrollRun } from "@/lib/integrations/quickbooks";
import { qbo } from "@/lib/integrations/config";
import { PageHeader } from "@/components/PageHeader";
import { money, shortDate } from "@/lib/format";

export default async function PayrollPage() {
  getSessionUser();
  const { employees, mock } = await qboListEmployees();
  const { run } = await qboLastPayrollRun();
  const payrollLive = qbo.payrollEnabled();

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Employees and pay runs, powered by QuickBooks."
      />
      <div className="space-y-8 p-8">
        {!payrollLive && (
          <div className="card p-5">
            <p className="text-sm">
              <span className="font-medium">Payroll is in preview.</span>{" "}
              <span className="text-ink/60">
                {mock
                  ? "Showing sample data. Connect QuickBooks to load your real employees, and enable payroll scopes to run payroll."
                  : "Employees are live from QuickBooks. Pay runs need QuickBooks' partner-gated Payroll API — set QBO_PAYROLL_ENABLED once approved."}
              </span>
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Last pay run</p>
            <p className="mt-2 text-lg font-bold">{run?.period ?? "—"}</p>
            <p className="text-xs text-ink/50">Paid {run ? shortDate(run.payDate) : "—"}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Gross</p>
            <p className="mt-2 text-2xl font-bold">{run ? money(run.gross) : "—"}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Net pay</p>
            <p className="mt-2 text-2xl font-bold">{run ? money(run.net) : "—"}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Employees paid</p>
            <p className="mt-2 text-2xl font-bold">{run?.employees ?? 0}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Employees</h2>
          <div className="card mt-3 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {employees.length === 0 && (
                  <tr><td colSpan={2} className="px-5 py-10 text-center text-ink/50">No employees found.</td></tr>
                )}
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-black/[0.02]">
                    <td className="px-5 py-3 font-medium">{e.name}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`badge ${e.active ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-700"}`}>
                        {e.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" disabled title="Requires QuickBooks Payroll API access">Run payroll</button>
          <span className="text-sm text-ink/50">Running payroll unlocks once QuickBooks Payroll is connected.</span>
        </div>
      </div>
    </div>
  );
}
