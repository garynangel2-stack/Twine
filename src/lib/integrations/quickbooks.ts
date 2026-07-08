// QuickBooks Online integration. Pushes customers + invoices to QBO and reads
// payroll employees. Uses the QBO REST API via fetch with an OAuth access token
// from the environment. If QBO isn't configured, every function returns a mock
// result so the app keeps working.
//
// Note on tokens: QBO access tokens expire hourly and are refreshed with the
// refresh token. A production deployment should refresh + persist tokens; for
// now we use the QBO_ACCESS_TOKEN as-is (refresh wiring is a follow-up).

import { qbo as Q } from "./config";

type QboResult<T> = T & { mock: boolean; error?: string };

async function qboFetch(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(`${Q.base()}/v3/company/${Q.realmId()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${Q.accessToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const fault = json?.Fault as { Error?: { Detail?: string }[] } | undefined;
    throw new Error(fault?.Error?.[0]?.Detail || `QBO ${res.status}`);
  }
  return json;
}

export async function qboUpsertCustomer(
  name: string,
  email: string | null,
): Promise<QboResult<{ id?: string }>> {
  if (!Q.configured()) return { mock: true };
  try {
    const json = await qboFetch("/customer?minorversion=73", {
      method: "POST",
      body: JSON.stringify({
        DisplayName: name,
        ...(email ? { PrimaryEmailAddr: { Address: email } } : {}),
      }),
    });
    const customer = json?.Customer as { Id?: string } | undefined;
    return { id: customer?.Id, mock: false };
  } catch (e) {
    return { mock: true, error: String(e) };
  }
}

export async function qboCreateInvoice(opts: {
  customerRef: string;
  lines: { description: string; amount: number }[];
  docNumber: string;
}): Promise<QboResult<{ id?: string }>> {
  if (!Q.configured()) return { mock: true };
  try {
    const json = await qboFetch("/invoice?minorversion=73", {
      method: "POST",
      body: JSON.stringify({
        DocNumber: opts.docNumber,
        CustomerRef: { value: opts.customerRef },
        Line: opts.lines.map((l) => ({
          DetailType: "SalesItemLineDetail",
          Amount: l.amount,
          Description: l.description,
          SalesItemLineDetail: {},
        })),
      }),
    });
    const invoice = json?.Invoice as { Id?: string } | undefined;
    return { id: invoice?.Id, mock: false };
  } catch (e) {
    return { mock: true, error: String(e) };
  }
}

export type PayrollEmployee = { id: string; name: string; active: boolean };

const MOCK_EMPLOYEES: PayrollEmployee[] = [
  { id: "mock-1", name: "Sam Rivera", active: true },
  { id: "mock-2", name: "Alex Chen", active: true },
  { id: "mock-3", name: "Jordan Blake", active: false },
];

export async function qboListEmployees(): Promise<QboResult<{ employees: PayrollEmployee[] }>> {
  if (!Q.configured()) return { employees: MOCK_EMPLOYEES, mock: true };
  try {
    const json = await qboFetch(`/query?query=${encodeURIComponent("select * from Employee")}&minorversion=73`, {
      method: "GET",
    });
    const qr = json?.QueryResponse as { Employee?: { Id: string; DisplayName: string; Active?: boolean }[] } | undefined;
    const employees = (qr?.Employee || []).map((e) => ({
      id: e.Id,
      name: e.DisplayName,
      active: e.Active !== false,
    }));
    return { employees, mock: false };
  } catch (e) {
    return { employees: MOCK_EMPLOYEES, mock: true, error: String(e) };
  }
}

// Pay runs require QuickBooks' partner-gated Payroll API. Until that access is
// granted (QBO_PAYROLL_ENABLED=true + approved scopes) we return a mock summary.
export type PayrollRun = { period: string; payDate: string; gross: number; net: number; employees: number };

export async function qboLastPayrollRun(): Promise<QboResult<{ run: PayrollRun | null }>> {
  return {
    run: { period: "Jun 16 – Jun 30", payDate: "2026-07-03", gross: 18420, net: 13964, employees: 2 },
    mock: true,
  };
}
