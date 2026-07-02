import { listWaitlist } from "@/lib/admin";
import { WaitlistTable } from "@/components/WaitlistTable";

export default function AdminWaitlist() {
  const rows = listWaitlist();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Waitlist</h1>
        <p className="mt-1 text-sm text-ink/60">Invite founding customers and track conversions.</p>
      </div>
      <WaitlistTable rows={rows} />
    </div>
  );
}
