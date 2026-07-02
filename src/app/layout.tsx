import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twine — Quotes, bookings & reminders on autopilot",
  description:
    "Simple software for local businesses that still run on spreadsheets and phone calls. Built for contractors, clinics & salons, and event venues.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
