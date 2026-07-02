import { getSessionUser } from "@/lib/auth";
import { listBookings, listCustomers } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { BookingsView } from "@/components/BookingsView";

export default function BookingsPage() {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const bookings = listBookings(bizId);
  const customers = listCustomers(bizId).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Schedule appointments and let Twine handle the reminders."
      />
      <BookingsView bookings={bookings} customers={customers} />
    </div>
  );
}
