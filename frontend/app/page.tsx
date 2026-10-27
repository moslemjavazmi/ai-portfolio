
"use client";

import { useState } from "react";
import { Download, Mail, ArrowUpRight } from "lucide-react";

import { ProfileCard } from "@/components/ProfileCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskinoCard } from "@/components/TaskinoCard";
import { ProjectModal } from "@/components/ProjectModal";

import {
  FEATURED_PROJECT,
  OTHER_PROJECTS,
  type Project,
} from "@/lib/projects";

export default function PortfolioPage() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0b] text-white lg:h-screen">
      {/* ================= Ambient background ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />
      </div>

      {/* ================= Header ================= */}
<header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-black/20 px-5 backdrop-blur-xl lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-50 blur-md" />
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-black">
              Y
            </div>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Your Name</p>
            <p className="text-[10px] leading-tight text-zinc-500">
              Backend Developer
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-all hover:border-white/20 hover:text-white md:grid"
          >
            {/* <Github size={14} /> */}
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-all hover:border-white/20 hover:text-white md:grid"
          >
            {/* <Linkedin size={14} /> */}
          </a>
          <a
            href="/resume.pdf"
            className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-white md:inline-flex"
          >
            <Download size={13} />
            Resume
          </a>
          <a
            href="mailto:you@example.com"
            className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-xs font-medium text-black transition-all hover:bg-emerald-400"
          >
            <Mail size={13} />
            Hire Me
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </header>

     <main className="relative z-10 flex flex-1 flex-col px-4 pb-40 pt-1 lg:overflow-hidden lg:px-10 lg:pb-52 lg:pt-3">
  {/* Status row */}
        <div className="mx-auto mb-1 flex w-full max-w-[1600px] items-center justify-between gap-4 lg:mb-2">
          {/* محتوای Status row را همان‌طور نگه دار */}
        </div>

        {/* Projects grid */}
       <div
          id="projects"
          className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-2.5 lg:h-[calc(100vh-240px)] lg:max-h-[560px]"
        >
          {/* Profile */}
          <div className="min-h-[340px] lg:col-span-3 lg:row-span-2 lg:min-h-0">
            <ProfileCard />
          </div>

          {/* Featured — Taskino */}
          <div className="min-h-[260px] lg:col-span-5 lg:row-span-2 lg:min-h-0">
            <TaskinoCard
              project={FEATURED_PROJECT}
              onClick={() => setActive(FEATURED_PROJECT)}
            />
          </div>

          {/* Other projects */}
          {OTHER_PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="min-h-[120px] lg:col-span-2 lg:min-h-0"
            >
              <ProjectCard
                project={project}
                index={index}
                onClick={() => setActive(project)}
              />
            </div>
          ))}
        </div>
      </main>

      <ProjectModal
        project={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}