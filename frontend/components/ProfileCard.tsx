"use client";

import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";

const JOURNEY = [
  "WordPress",
  "PHP",
  "Node.js",
  "React",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "AI Agents",
];

export function ProfileCard() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm p-5 flex flex-col">
      {/* subtle glow */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Photo */}
      <div className="relative mx-auto mb-4">
        <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-zinc-900">
          <Image
            src="/me.jpg"               // ← replace with your photo
            alt="Portrait"
            width={112}
            height={112}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
      </div>

      {/* Name + role */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white leading-tight">Your Name</h2>
        <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
          Full-Stack Developer
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">
          Photonics Engineer · MSc, Shiraz University of Technology
        </p>
      </div>

      {/* Bio */}
      <p className="text-[11px] text-zinc-400 leading-relaxed text-center mb-4">
        3+ years crafting web products — from WordPress and PHP to
        Next.js, FastAPI, and autonomous AI agents.
      </p>

      {/* Career journey */}
      <div className="mt-auto">
        <p className="text-[9px] uppercase tracking-wider text-zinc-600 mb-2 font-semibold">
          Journey
        </p>
        <div className="flex flex-wrap gap-1">
          {JOURNEY.map((step, i) => (
            <span
              key={step}
              className={`px-1.5 py-0.5 text-[9px] rounded-md border ${
                i === JOURNEY.length - 1
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-white/[0.03] border-white/5 text-zinc-500"
              }`}
            >
              {step}
            </span>
          ))}
        </div>

        {/* Contact */}
        {/* <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-zinc-800">
          <a
            href="mailto:you@example.com"
            className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center transition-colors"
            aria-label="Email"
          >
            <Mail size={12} />
          </a>
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center transition-colors"
            aria-label="GitHub"
          >
            <Github size={12} />
          </a>
          <a
            href="https://linkedin.com/in/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={12} />
          </a>
          <a
            href="/resume.pdf"
            className="ml-1 px-2 py-1 text-[9px] rounded-lg bg-white text-black font-medium hover:bg-zinc-200 inline-flex items-center gap-0.5"
          >
            CV <ArrowUpRight size={9} />
          </a>
        </div> */}
        <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-zinc-800">
            <a href="mailto:you@example.com" /* ... */>
                <Mail size={12} />
            </a>
            <a href="https://github.com/yourhandle" /* ... */>
                {/* استفاده از آیکون جایگزین یا فقط متن */}
                <span className="text-[10px]">GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourhandle" /* ... */>
                <span className="text-[10px]">LinkedIn</span>
            </a>
            {/* ... */}
        </div>
      </div>
    </div>
  );
}