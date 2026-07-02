"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
      setMessage("You're on the list — we'll be in touch as a spot opens for your industry.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-2xl">
          ✓
        </div>
        <p className="font-semibold">Thanks for joining!</p>
        <p className="mt-1 text-sm text-ink/70">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input className="input" id="name" name="name" required placeholder="Your name" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required placeholder="you@business.com" />
      </div>
      <div>
        <label className="label" htmlFor="website">Website (optional)</label>
        <input className="input" id="website" name="website" placeholder="yourbusiness.com" />
      </div>
      <div>
        <label className="label" htmlFor="business_type">What kind of business?</label>
        <select className="input" id="business_type" name="business_type" defaultValue="Home service contractor">
          <option>Home service contractor</option>
          <option>Clinic or salon</option>
          <option>Event venue</option>
          <option>Other</option>
        </select>
      </div>
      <button className="btn-primary w-full" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <p className="text-sm text-red-600">{message}</p>}
      <p className="text-center text-xs text-ink/50">No spam, ever.</p>
    </form>
  );
}
