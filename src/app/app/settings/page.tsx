import { getSessionUser } from "@/lib/auth";
import { getReminderSettings } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { SettingsForm } from "@/components/SettingsForm";

export default function SettingsPage() {
  const user = getSessionUser()!;
  const settings = getReminderSettings(user.business_id!);

  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle="Set it once — Twine handles the follow-ups automatically."
      />
      <div className="p-8">
        <SettingsForm
          settings={{
            booking_reminder_hours: settings.booking_reminder_hours,
            invoice_followup_days: settings.invoice_followup_days,
            review_request_enabled: settings.review_request_enabled,
          }}
        />
      </div>
    </div>
  );
}
