import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WaitlistForm } from "@/components/WaitlistForm";

const INDUSTRIES = [
  {
    key: "Contractors",
    heading: "HVAC, plumbing, landscaping & more",
    pains: [
      "Quotes take a day to type up and email, so jobs go to whoever answers first.",
      "No-shows and missed callbacks pile up because reminders are manual texts you forget to send.",
      "Chasing overdue invoices eats an evening every week.",
    ],
    gains: [
      "Instant quote builder — turn a job description into a branded PDF quote in under 2 minutes.",
      "Automatic text & email reminders sent before every appointment.",
      "One-click invoicing with payment links and automatic follow-up on overdue balances.",
    ],
  },
  {
    key: "Clinics & Salons",
    heading: "Dental, vet, beauty & wellness",
    pains: [
      "The front desk plays phone tag all day to confirm appointments.",
      "Last-minute cancellations leave expensive gaps in the calendar.",
      "Rebooking regulars depends on someone remembering to call.",
    ],
    gains: [
      "Online booking with automatic confirmations and reminders.",
      "Waitlist fills cancellations automatically.",
      "Review requests and rebooking nudges go out on their own.",
    ],
  },
  {
    key: "Venues",
    heading: "Event, wedding & rental spaces",
    pains: [
      "Every inquiry is a long email thread before anything is booked.",
      "Deposits and balances are tracked in a spreadsheet nobody trusts.",
      "Vendor and client reminders are all manual.",
    ],
    gains: [
      "Branded proposals and contracts ready to send in minutes.",
      "Deposit and balance tracking with payment links built in.",
      "Automatic reminders for every milestone leading up to the date.",
    ],
  },
];

const STEPS = [
  { n: "01", t: "Tell it the job.", d: "Type a quick description, or forward the client's text or email. That's the only manual step." },
  { n: "02", t: "Twine builds the paperwork.", d: "A branded quote, invoice, or booking confirmation is ready to send in under two minutes — no templates to wrangle." },
  { n: "03", t: "Follow-ups happen on their own.", d: "Reminders, review requests, and overdue-invoice nudges go out automatically, on the schedule you set once." },
];

const FAQ = [
  { q: "When does Twine actually launch?", a: "We're onboarding a small group of founding customers first, on a rolling basis. Joining the waitlist gets you an invite as soon as a spot opens for your industry." },
  { q: "Do I need to be technical to set it up?", a: "No. If you can send a text message, you can run Twine. Setup takes a few minutes and we help you import your existing customers." },
  { q: "What happens to the information I submit on the waitlist?", a: "We only use it to contact you about early access. We never sell or share your data." },
  { q: "Will there be a free trial?", a: "Founding customers get an extended trial and locked-in pricing. Details come with your invite." },
  { q: "I run more than one location — does that work?", a: "Twine starts with single-location businesses, but multi-location support is on the roadmap. Tell us on the waitlist and we'll keep you posted." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header id="top" className="sticky top-0 z-30 border-b border-black/5 bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo className="text-lg text-ink" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
            <a href="#who-its-for" className="hover:text-ink">Who it&apos;s for</a>
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost">Log in</Link>
            <a href="#waitlist" className="btn-primary">Join waitlist</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-20 text-center">
        <span className="badge bg-brand-100 text-brand-700">Now taking early access signups</span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Stop chasing paperwork. <span className="text-brand-600">Start closing more work.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">
          Twine sends quotes, books appointments, and follows up automatically — built for local
          businesses that still run on spreadsheets and phone calls.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="#waitlist" className="btn-primary">Join the waitlist</a>
          <a href="#how-it-works" className="btn-outline">See how it works</a>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who-its-for" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-600">
            Built for businesses still running on paper
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold">Pick your industry</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-ink/60">
            See exactly what Twine replaces for businesses like yours.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {INDUSTRIES.map((ind) => (
              <div key={ind.key} className="card p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">{ind.key}</p>
                <h3 className="mt-1 text-lg font-bold">{ind.heading}</h3>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink/50">What&apos;s costing you today</p>
                <ul className="mt-2 space-y-2 text-sm text-ink/70">
                  {ind.pains.map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-red-500">✕</span>{p}</li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-600">With Twine</p>
                <ul className="mt-2 space-y-2 text-sm text-ink/80">
                  {ind.gains.map((g) => (
                    <li key={g} className="flex gap-2"><span className="text-brand-500">✓</span>{g}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-600">
            From phone calls to paperwork-free
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold">How Twine works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card p-6">
                <div className="text-3xl font-black text-brand-200">{s.n}</div>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-ink/70">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-brand-900 p-8 text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-200">Why we&apos;re building this</p>
            <p className="mt-3 text-xl font-semibold leading-relaxed">
              Most software is built for companies with an ops team. We&apos;re building for the ones without.
            </p>
            <p className="mt-4 text-sm text-brand-100">
              A contractor, a vet clinic, a wedding venue — these businesses run on trust and word of
              mouth, not dashboards. Twine takes the paperwork off your plate without asking you to
              learn a new system.
            </p>
            <p className="mt-4 text-sm text-brand-200">— The Twine team</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Simple, honest pricing</p>
          <h2 className="mt-2 text-3xl font-bold">Built for one location to start</h2>
          <div className="mx-auto mt-10 max-w-sm card p-8 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Founding customer pricing</p>
            <p className="mt-2 text-4xl font-extrabold">$49<span className="text-lg font-medium text-ink/50">/mo</span></p>
            <p className="mt-1 text-sm text-ink/60">No setup fees. Cancel anytime.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Unlimited quotes & bookings", "Automatic reminders", "Payment & invoice tracking", "Locked-in price for life as an early customer"].map((f) => (
                <li key={f} className="flex gap-2"><span className="text-brand-500">✓</span>{f}</li>
              ))}
            </ul>
            <a href="#waitlist" className="btn-primary mt-6 w-full">Join the waitlist</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-600">Questions</p>
          <h2 className="mt-2 text-center text-3xl font-bold">Frequently asked</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.q}
                  <span className="text-brand-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="bg-brand-50 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Founding customers, chapter one</p>
            <h2 className="mt-2 text-3xl font-bold">Get early access</h2>
            <p className="mt-3 text-ink/70">
              We&apos;re onboarding a small group of founding customers first. Join the waitlist to be
              one of them.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
          <div>
            <Logo className="text-ink" />
            <p className="mt-3 max-w-xs text-sm text-ink/60">
              Quotes, bookings, and reminders on autopilot for local businesses that still run on
              spreadsheets and phone calls.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-3 space-y-1 text-sm text-ink/60">
              <li><a href="#who-its-for" className="hover:text-ink">Who it&apos;s for</a></li>
              <li><a href="#how-it-works" className="hover:text-ink">How it works</a></li>
              <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
              <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-1 text-sm text-ink/60">
              <li><Link href="/privacy" className="hover:text-ink">Privacy Policy</Link></li>
              <li><a href="mailto:hello@twine.app" className="hover:text-ink">hello@twine.app</a></li>
              <li><Link href="/login" className="hover:text-ink">Customer login</Link></li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl px-5 text-xs text-ink/40">
          © 2026 Twine. Early access — onboarding founding customers now.
        </p>
      </footer>
    </main>
  );
}
