
"use client";

import { Mail, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Brand icons (inline SVG)
   lucide-react نسخه‌های جدید آیکون‌های برند را حذف کرده‌اند
   ============================================================ */

function GithubIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function TwitterIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
    </svg>
  );
}

const SKILLS = ["Node.js", "Express", "PostgreSQL", "Prisma", "Kafka", "Next.js"];

const STATS = [
  { label: "Years", value: "4+" },
  { label: "Projects", value: "12" },
  { label: "Stack", value: "15+" },
];

const SOCIALS = [
  { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
];

export function ProfileCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl",
        "bg-gradient-to-b from-white/[0.04] to-transparent",
        "ring-1 ring-white/[0.06] p-5",
        className
      )}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

      {/* Subtle emerald glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex h-full flex-col">
        {/* Avatar + status */}
        <div className="mb-4 flex items-start justify-between">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-40 blur-md" />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-black text-black">
              YN
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/20">
            <Sparkles size={9} />
            Open
          </span>
        </div>

        {/* Identity */}
        <div className="mb-4">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-white">
            Your Name
          </h2>
          <p className="mt-0.5 text-xs text-zinc-400">Backend Developer</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500">
            <MapPin size={10} />
            <span>Tehran, Iran</span>
          </div>
        </div>

        {/* Bio */}
        <p className="mb-4 text-xs leading-relaxed text-zinc-400">
          I build scalable backend systems with Node.js, PostgreSQL, and
          event-driven architectures. Passionate about clean code and
          performance.
        </p>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-white/[0.03] px-2 py-1.5 ring-1 ring-white/[0.05]"
            >
              <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
              </p>
              <p className="mt-0.5 text-sm font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-4 flex flex-wrap gap-1">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 ring-1 ring-white/[0.05]"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Social + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-7 w-7 place-items-center rounded-lg text-zinc-500 ring-1 ring-transparent transition-all hover:bg-white/[0.04] hover:text-white hover:ring-white/[0.08]"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>

          <a
            href="mailto:you@example.com"
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            <Mail size={11} />
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}