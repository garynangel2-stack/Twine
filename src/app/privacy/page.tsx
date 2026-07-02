import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Privacy Policy — Twine" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/" className="inline-block"><Logo className="text-ink" /></Link>
      <h1 className="mt-8 text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: July 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
        <p>
          This is a pre-launch policy for Twine&apos;s waitlist. When you join the waitlist we collect
          your name, email, business type, and optionally your website. We use this information only
          to contact you about early access and product updates.
        </p>
        <p>We do not sell or share your personal information with third parties for advertising.</p>
        <p>
          You can ask us to remove your information at any time by emailing{" "}
          <a href="mailto:hello@twine.app" className="text-brand-600 underline">hello@twine.app</a>.
        </p>
        <p>
          Once the product launches, a full privacy policy covering customer and business data will
          replace this notice.
        </p>
      </div>
      <Link href="/" className="btn-outline mt-8">← Back home</Link>
    </main>
  );
}
