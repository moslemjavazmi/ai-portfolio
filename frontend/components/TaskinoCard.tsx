"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  onClick: () => void;
  className?: string;
}

export function TaskinoCard({ project, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl text-left h-full",
        "bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600",
        "hover:scale-[1.01] transition-transform duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)] bg-[length:200%_100%] animate-shine" />

      <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur text-[10px] font-medium mb-4 animate-float">
            <Sparkles size={11} /> Featured Project
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
            {project.title}
          </h2>
          <p className="text-white/85 mt-3 text-sm lg:text-base leading-relaxed max-w-sm">
            {project.shortDescription}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] rounded-md bg-black/30 backdrop-blur-sm text-white/90"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-white">
            <span>View Architecture</span>
            <ArrowUpRight
              size={16}
              className="group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </div>
      </div>
    </button>
  );
}