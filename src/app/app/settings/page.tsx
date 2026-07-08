import { getSessionUser } from "@/lib/auth";
import { getReminderSettings } from "@/lib/queries";
import { getData } from "@/lib/store";
import { integrationStatus } from "@/lib/integrations/config";
import { PageHeader } from "@/components/PageHeader";
import { SettingsForm } from "@/components/SettingsForm";

export default function SettingsPage() {
  const user = getSessionUser()!;
  const bizId = user.business_id!;
  const settings = getReminderSettings(bizId);
  const biz = getData().businesses.find((b) => b.id === bizId);
  const paymentProvider = biz?.payment_provider === "square" ? "square" : "stripe";

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Reminders, payments, and integrations — set once and Twine handles the rest."
      />
      <div className="p-8">
        <SettingsForm
          settings={{
            booking_reminder_hours: settings.booking_reminder_hours,
            invoice_followup_days: settings.invoice_followup_days,
            review_request_enabled: settings.review_request_enabled,
          }}
          paymentProvider={paymentProvider}
          integrations={integrationStatus()}
        />
      </div>
    </div>
  );
}
