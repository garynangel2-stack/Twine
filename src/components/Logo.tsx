export function Logo({ className = "", mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}>
      {mark && <TwineMark className="h-6 w-6" />}
      <span>Twine</span>
    </span>
  );
}

// A simple vine/twine tendril mark.
export function TwineMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M16 30C16 22 8 22 8 15C8 9 12 6 16 6C20 6 24 9 24 15C24 22 16 22 16 30Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="text-brand-500"
      />
      <path
        d="M16 6C16 6 15 3 12 2.5M16 12C16 12 18 10 20.5 10.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="text-brand-400"
      />
      <circle cx="16" cy="18" r="2" className="fill-accent" />
    </svg>
  );
}
