"use client";

import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Accent, Project } from "@/lib/projects";

const ACCENT_STYLES: Record<
  Accent,
  { text: string; border: string; bg: string; dot: string }
> = {
  blue:    { text: "text-blue-300",    border: "border-blue-500/30",    bg: "bg-blue-500/10",    dot: "bg-blue-400" },
  violet:  { text: "text-violet-300",  border: "border-violet-500/30",  bg: "bg-violet-500/10",  dot: "bg-violet-400" },
  emerald: { text: "text-emerald-300", border: "border-emerald-500/40", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  orange:  { text: "text-orange-300",  border: "border-orange-500/30",  bg: "bg-orange-500/10",  dot: "bg-orange-400" },
  cyan:    { text: "text-cyan-300",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10",    dot: "bg-cyan-400" },
  pink:    { text: "text-pink-300",    border: "border-pink-500/30",    bg: "bg-pink-500/10",    dot: "bg-pink-400" },
};

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      <div
        className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-3xl p-6 lg:p-8 my-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300 mb-3">
            <Sparkles size={11} /> {project.subtitle}
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white">
            {project.title}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="space-y-2">
          {project.architecture.layers.map((layer, idx) => {
            const style = ACCENT_STYLES[layer.accent];
            return (
              <div key={idx}>
                <div
                  className={cn(
                    "rounded-2xl p-3.5 border",
                    layer.highlight
                      ? `${style.bg} ${style.border}`
                      : "bg-white/[0.02] border-white/5"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      {layer.label}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className={cn(
                          "px-2.5 py-1 text-[11px] rounded-lg border font-mono",
                          style.bg,
                          style.border,
                          style.text
                        )}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {idx < project.architecture.layers.length - 1 && (
                  <div className="flex justify-center">
                    <div className="h-3 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tech stack */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-semibold">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Visit live site */}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full h-11 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-2"
        >
          Visit Live Site <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}