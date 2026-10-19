"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  onClick: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-4 lg:p-5 text-left h-full",
        "bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm",
        "hover:bg-zinc-900 hover:border-zinc-700 hover:scale-[1.02]",
        "transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-10 blur-3xl",
          "group-hover:opacity-30 transition-opacity duration-500",
          project.glow
        )}
      />

      <div className="relative h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm lg:text-base font-bold text-white truncate">
                {project.title}
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                {project.subtitle}
              </p>
            </div>
            <ArrowUpRight
              size={14}
              className="text-zinc-600 group-hover:text-white transition-all shrink-0 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[9px] rounded-md bg-white/5 border border-white/5 text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}