"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Login failed");
      setLoading(false);
      return;
    }
    router.push(json.redirect);
    router.refresh();
  }

  return (
    <main
      className="app-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-5"
      style={{ backgroundImage: "radial-gradient(60% 50% at 50% 0%, rgba(63,181,135,0.14), transparent 70%)" }}
    >
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center"><Logo className="text-xl text-ink" /></Link>
        <div className="card mt-6 p-8">
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">Log in to your Twine workspace.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input className="input" id="email" name="email" type="email" required autoComplete="email" defaultValue="owner@twine.app" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input className="input" id="password" name="password" type="password" required autoComplete="current-password" defaultValue="twine123" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>
          <div className="mt-6 rounded-lg bg-black/5 p-3 text-xs text-ink/60">
            <p className="font-semibold text-ink/70">Demo logins</p>
            <p className="mt-1">Business owner — owner@twine.app / twine123</p>
            <p>Admin back office — admin@twine.app / admin123</p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-ink/60">
          No account yet? <Link href="/#waitlist" className="text-brand-600 underline">Join the waitlist</Link>
        </p>
      </div>
    </main>
  );
}
