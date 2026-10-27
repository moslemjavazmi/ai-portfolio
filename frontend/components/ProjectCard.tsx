
"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  onClick: () => void;
  index?: number;
  className?: string;
}

export function ProjectCard({ project, onClick, index, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-2xl p-4 text-left",
        "bg-gradient-to-b from-white/[0.03] to-transparent",
        "ring-1 ring-white/[0.06] hover:ring-white/[0.12]",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/50",
        className
      )}
    >
      {/* Accent glow */}
      <div
        className={cn(
          "absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl",
          "transition-opacity duration-500 group-hover:opacity-25",
          project.glow
        )}
      />

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              {index !== undefined && (
                <p className="mb-1 font-mono text-[9px] tracking-wider text-zinc-600">
                  {String(index + 1).padStart(2, "0")}
                </p>
              )}
              <h3 className="truncate text-sm font-semibold tracking-tight text-white">
                {project.title}
              </h3>
              <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                {project.subtitle}
              </p>
            </div>

            {/* Arrow box */}
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ring-white/[0.06] bg-white/[0.02] transition-all duration-300 group-hover:bg-white/[0.06] group-hover:ring-white/[0.12]">
              <ArrowUpRight
                size={12}
                className="text-zinc-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
              />
            </div>
          </div>

          <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
            {project.shortDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 ring-1 ring-white/[0.05]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}