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
    <main className="site min-h-screen">
      {/* Nav */}
      <header id="top" className="sticky top-0 z-30 border-b border-white/5 bg-[#07100c]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo className="text-lg" />
          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#who-its-for" className="transition-colors hover:text-white">Who it&apos;s for</a>
            <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-white/70 transition-colors hover:text-white">Log in</Link>
            <a href="#waitlist" className="cta cta-primary">Join waitlist</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(60% 55% at 50% 0%, rgba(63,181,135,0.16), transparent 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 pt-28 pb-28 text-center">
          <span className="eyebrow">Now taking early access signups</span>
          <h1 className="display mx-auto mt-8 max-w-3xl text-5xl sm:text-7xl">
            Stop chasing paperwork.
            <br />
            <span className="accent">Start closing more work.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            Twine sends quotes, books appointments, and follows up automatically — built for local
            businesses that still run on spreadsheets and phone calls.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#waitlist" className="cta cta-primary">Join the waitlist →</a>
            <a href="#how-it-works" className="cta cta-ghost">See how it works</a>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="who-its-for" className="border-t rule">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <span className="eyebrow">Who it&apos;s for</span>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              Built for businesses still running on paper.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">
              See exactly what Twine replaces for businesses like yours.
            </p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {INDUSTRIES.map((ind) => (
              <div key={ind.key} className="bg-[#07100c] p-8">
                <span className="eyebrow">{ind.key}</span>
                <h3 className="mt-3 text-xl font-medium text-white">{ind.heading}</h3>

                <p className="mt-8 text-xs uppercase tracking-[0.16em] text-white/35">What it costs you today</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/55">
                  {ind.pains.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-white/30" />
                      {p}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--vine-soft)" }}>With Twine</p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
                  {ind.gains.map((g) => (
                    <li key={g} className="flex gap-3">
                      <span className="mt-1.5 shrink-0" style={{ color: "var(--vine-soft)" }}>↳</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t rule">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <span className="eyebrow">How it works</span>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              From phone calls to paperwork-free.
            </h2>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="display text-5xl" style={{ color: "var(--vine)" }}>{s.n}</div>
                <div className="mt-5 h-px w-full bg-white/10" />
                <h3 className="mt-5 text-xl font-medium text-white">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.d}</p>
              </div>
            ))}
          </div>

          <figure className="mx-auto mt-24 max-w-3xl text-center">
            <p className="eyebrow justify-center">Why we&apos;re building this</p>
            <blockquote className="display mt-6 text-2xl leading-snug text-white sm:text-3xl">
              Most software is built for companies with an ops team. We&apos;re building for the ones without.
            </blockquote>
            <figcaption className="mt-8 text-base leading-relaxed text-white/55">
              A contractor, a vet clinic, a wedding venue — these businesses run on trust and word of
              mouth, not dashboards. Twine takes the paperwork off your plate without asking you to learn
              a new system.
              <span className="mt-3 block text-sm" style={{ color: "var(--vine-soft)" }}>— The Twine team</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t rule">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="eyebrow">Pricing</span>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              Simple, honest, built for one location to start.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/55">
              No setup fees. Cancel anytime. Founding customers lock in their price for good.
            </p>
          </div>
          <div className="panel p-10">
            <span className="eyebrow">Founding customer</span>
            <p className="display mt-4 text-6xl text-white">
              $49<span className="text-xl font-normal text-white/45">/mo</span>
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/75">
              {["Unlimited quotes & bookings", "Automatic reminders", "Payment & invoice tracking", "Locked-in price for life as an early customer"].map((f) => (
                <li key={f} className="flex gap-3">
                  <span style={{ color: "var(--vine-soft)" }}>↳</span>{f}
                </li>
              ))}
            </ul>
            <a href="#waitlist" className="cta cta-primary mt-10 w-full">Join the waitlist →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t rule">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <span className="eyebrow">Questions</span>
          <h2 className="display mt-5 text-4xl sm:text-5xl">Frequently asked.</h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-normal text-white/90">
                  {f.q}
                  <span className="text-xl transition-transform group-open:rotate-45" style={{ color: "var(--vine-soft)" }}>+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="relative overflow-hidden border-t rule">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50% 60% at 50% 100%, rgba(63,181,135,0.14), transparent 70%)" }}
        />
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="eyebrow">Founding customers, chapter one</span>
            <h2 className="display mt-5 text-4xl sm:text-5xl">Get early access.</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/60">
              We&apos;re onboarding a small group of founding customers first. Join the waitlist to be one
              of them.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t rule">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Quotes, bookings, and reminders on autopilot for local businesses that still run on
              spreadsheets and phone calls.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-white/45">
              <li><a href="#who-its-for" className="transition-colors hover:text-white">Who it&apos;s for</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-white">How it works</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
              <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-white/45">
              <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
              <li><a href="mailto:hello@twine.app" className="transition-colors hover:text-white">hello@twine.app</a></li>
              <li><Link href="/login" className="transition-colors hover:text-white">Customer login</Link></li>
            </ul>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-6 pb-12 text-xs text-white/30">
          © 2026 Twine. Early access — onboarding founding customers now.
        </p>
      </footer>
    </main>
  );
}
