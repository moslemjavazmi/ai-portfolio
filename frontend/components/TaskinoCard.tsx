
"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  onClick: () => void;
  className?: string;
}

const STATS = [
  { label: "Apps", value: "3" },
  { label: "Services", value: "7" },
  { label: "Stack", value: "8+" },
];

export function TaskinoCard({ project, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-2xl text-left",
        "bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600",
        "ring-1 ring-white/[0.15] transition-all duration-500",
        "hover:ring-white/[0.25] hover:shadow-2xl hover:shadow-emerald-500/20",
        className
      )}
    >
      {/* Radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(6,78,59,0.45),transparent_60%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.15]" />

      {/* Shine */}
      <div className="absolute inset-0 animate-shine bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-5 lg:p-6">
        <div>
          {/* Featured badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles size={10} />
            Featured Project
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black leading-[0.95] tracking-tight text-white lg:text-4xl xl:text-5xl">
            {project.title}
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
            {project.shortDescription}
          </p>
        </div>

        <div>
          {/* Stats bar */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/10 bg-black/20 px-2 py-1.5 backdrop-blur-sm"
              >
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-black/25 px-2 py-0.5 text-[10px] font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="relative">
              View Architecture
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-white/60 transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </button>
  );
}