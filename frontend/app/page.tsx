
// "use client";

// import { useState } from "react";
// import {
//   ArrowUpRight,
//   Sparkles,
//   X,
//   Layers,
//   Database,
//   MessageSquare,
//   Zap,
//   Globe,
//   Users,
//   Shield,
//   Search,
//   Bell,
//   CreditCard,
//   Server,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// /* ------------------------------------------------------------ */
// /*  داده‌های پروژه‌ها                                              */
// /* ------------------------------------------------------------ */

// interface Project {
//   id: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   tags: string[];
//   glow: string; // رنگ درخشش پس‌زمینه
// }

// const PROJECTS: Project[] = [
//   {
//     id: "simolmetal",
//     title: "Simol Metal",
//     subtitle: "وب‌سایت صنعتی",
//     description: "وب‌سایت شرکتی صنعت فلز با طراحی مینیمال و واکنش‌گرا",
//     tags: ["Next.js", "Tailwind", "SEO"],
//     glow: "bg-orange-500",
//   },
//   {
//     id: "daianweb",
//     title: "Daian Web",
//     subtitle: "سایت شرکتی",
//     description: "طراحی مدرن با تمرکز روی تجربه کاربری و سرعت بارگذاری",
//     tags: ["Next.js", "TypeScript", "RTL"],
//     glow: "bg-blue-500",
//   },
//   {
//     id: "chatapp",
//     title: "Chat Application",
//     subtitle: "دستیار هوشمند",
//     description: "چت‌بات با استریم پاسخ، تاریخچه گفتگو و احراز هویت",
//     tags: ["Next.js", "FastAPI", "JWT"],
//     glow: "bg-violet-500",
//   },
//   {
//     id: "soon",
//     title: "Project Five",
//     subtitle: "به‌زودی",
//     description: "پروژه‌ای در حال توسعه — منتظر بمانید",
//     tags: ["TBA"],
//     glow: "bg-pink-500",
//   },
// ];

// /* ------------------------------------------------------------ */
// /*  کامپوننت کارت پروژه (غیر از Taskino)                          */
// /* ------------------------------------------------------------ */

// function ProjectCard({ project, className }: { project: Project; className?: string }) {
//   return (
//     <button
//       className={cn(
//         "group relative overflow-hidden rounded-3xl p-5 lg:p-6 text-right",
//         "bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm",
//         "hover:bg-zinc-900 hover:border-zinc-700 hover:scale-[1.02]",
//         "transition-all duration-300",
//         className
//       )}
//     >
//       {/* درخشش رنگی */}
//       <div
//         className={cn(
//           "absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-10 blur-3xl",
//           "group-hover:opacity-30 transition-opacity duration-500",
//           project.glow
//         )}
//       />

//       <div className="relative h-full flex flex-col justify-between">
//         <div>
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="text-lg lg:text-xl font-bold text-white">{project.title}</h3>
//               <p className="text-[11px] text-zinc-500 mt-0.5">{project.subtitle}</p>
//             </div>
//             <ArrowUpRight
//               size={16}
//               className="text-zinc-600 group-hover:text-white transition-all shrink-0 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
//             />
//           </div>
//           <p className="text-xs text-zinc-400 mt-3 leading-relaxed line-clamp-2">
//             {project.description}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-1 mt-4">
//           {project.tags.map((t) => (
//             <span
//               key={t}
//               className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 border border-white/5 text-zinc-400"
//             >
//               {t}
//             </span>
//           ))}
//         </div>
//       </div>
//     </button>
//   );
// }

// /* ------------------------------------------------------------ */
// /*  کارت Taskino — قهرمان صفحه                                    */
// /* ------------------------------------------------------------ */

// function TaskinoCard({ onClick, className }: { onClick: () => void; className?: string }) {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "group relative overflow-hidden rounded-3xl text-right",
//         "bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600",
//         "hover:scale-[1.01] transition-transform duration-300",
//         className
//       )}
//     >
//       {/* لایه نویز/رادیال */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.2),transparent_55%)]" />
//       {/* انیمیشن شاین */}
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] bg-[length:200%_100%] animate-shine" />

//       <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
//         <div>
//           <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur text-[10px] font-medium mb-5 animate-float">
//             <Sparkles size={11} />
//             پروژه ویژه
//           </div>
//           <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">
//             Taskino
//           </h2>
//           <p className="text-white/85 mt-3 text-sm lg:text-base leading-relaxed max-w-xs">
//             پلتفرم مدیریت تسک و آفر با معماری میکروسرویس — ۳ اپ فرانت‌اند و ۷ سرویس مستقل بک‌اند
//           </p>
//         </div>

//         <div>
//           <div className="flex flex-wrap gap-1.5 mb-4">
//             {["Next.js", "TypeScript", "Express", "Prisma", "Kafka"].map((t) => (
//               <span
//                 key={t}
//                 className="px-2 py-0.5 text-[10px] rounded-md bg-black/30 backdrop-blur-sm text-white/90"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//           <div className="flex items-center gap-1.5 text-sm font-medium">
//             <span>مشاهده معماری</span>
//             <ArrowUpRight
//               size={16}
//               className="group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
//             />
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// }

// /* ------------------------------------------------------------ */
// /*  مودال معماری Taskino                                          */
// /* ------------------------------------------------------------ */

// function TaskinoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
//   if (!open) return null;

//   const frontendApps = ["tasker-app", "user-app", "admin-app"];
//   const services = [
//     { name: "user", icon: Users },
//     { name: "task", icon: Layers },
//     { name: "offer-service", icon: MessageSquare },
//     { name: "search-service", icon: Search },
//     { name: "notification-service", icon: Bell },
//     { name: "chat-service", icon: MessageSquare },
//     { name: "payment-service", icon: CreditCard },
//   ];
//   const stack = [
//     "Next.js",
//     "TypeScript",
//     "Express",
//     "PostgreSQL",
//     "Prisma",
//     "Kafka",
//     "Microservices",
//     "API Gateway",
//   ];

//   return (
//     <div
//       className="fixed inset-0 z-[60] grid place-items-center p-4 overflow-y-auto"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

//       <div
//         className="relative w-full max-w-5xl bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 lg:p-8 my-8 shadow-2xl shadow-emerald-500/10"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 left-4 h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 grid place-items-center transition-colors"
//           aria-label="بستن"
//         >
//           <X size={16} />
//         </button>

//         {/* Header */}
//         <div className="mb-8">
//           <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-medium text-emerald-400 mb-3">
//             <Sparkles size={11} />
//             Featured Project
//           </div>
//           <h2 className="text-3xl lg:text-4xl font-black">Taskino</h2>
//           <p className="text-zinc-400 text-sm mt-2">
//             معماری کامل میکروسرویس — از سه اپ Next.js تا هفت سرویس بک‌اند
//           </p>
//         </div>

//         {/* Diagram */}
//         <div className="space-y-3">
//           <ArchLayer label="Frontend Apps" icon={Globe}>
//             <div className="grid grid-cols-3 gap-2">
//               {frontendApps.map((app) => (
//                 <div
//                   key={app}
//                   className="px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center"
//                 >
//                   <p className="text-xs font-mono text-blue-300 truncate">{app}</p>
//                 </div>
//               ))}
//             </div>
//           </ArchLayer>

//           <Connector />

//           <ArchLayer label="API Gateway" icon={Shield} highlight>
//             <div className="px-3 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center">
//               <p className="text-sm font-bold text-emerald-300">Gateway</p>
//             </div>
//           </ArchLayer>

//           <Connector />

//           <ArchLayer label="Microservices" icon={Server}>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//               {services.map((s) => (
//                 <div
//                   key={s.name}
//                   className="px-2 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center gap-1.5"
//                 >
//                   <s.icon size={11} className="text-violet-400 shrink-0" />
//                   <p className="text-[10px] font-mono text-violet-300 truncate">{s.name}</p>
//                 </div>
//               ))}
//             </div>
//           </ArchLayer>

//           <Connector />

//           <div className="grid grid-cols-2 gap-3">
//             <ArchLayer label="Message Broker" icon={Zap}>
//               <div className="px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-center">
//                 <p className="text-sm font-bold text-orange-300">Kafka</p>
//               </div>
//             </ArchLayer>
//             <ArchLayer label="Database" icon={Database}>
//               <div className="flex gap-2">
//                 <div className="flex-1 px-2 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
//                   <p className="text-[11px] font-bold text-cyan-300">PostgreSQL</p>
//                 </div>
//                 <div className="flex-1 px-2 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
//                   <p className="text-[11px] font-bold text-cyan-300">Prisma</p>
//                 </div>
//               </div>
//             </ArchLayer>
//           </div>
//         </div>

//         {/* Tech stack */}
//         <div className="mt-8 pt-6 border-t border-zinc-800">
//           <p className="text-xs text-zinc-500 mb-3">تکنولوژی‌های استفاده‌شده</p>
//           <div className="flex flex-wrap gap-2">
//             {stack.map((t) => (
//               <span
//                 key={t}
//                 className="px-3 py-1 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ArchLayer({
//   label,
//   icon: Icon,
//   highlight,
//   children,
// }: {
//   label: string;
//   icon: React.ElementType;
//   highlight?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div
//       className={cn(
//         "rounded-2xl p-4",
//         highlight
//           ? "bg-emerald-500/5 border border-emerald-500/30"
//           : "bg-white/[0.02] border border-white/5"
//       )}
//     >
//       <div className="flex items-center gap-2 mb-3">
//         <Icon size={12} className="text-zinc-500" />
//         <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
//           {label}
//         </p>
//       </div>
//       {children}
//     </div>
//   );
// }

// function Connector() {
//   return (
//     <div className="flex justify-center">
//       <div className="h-5 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
//     </div>
//   );
// }

// /* ------------------------------------------------------------ */
// /*  صفحه اصلی                                                     */
// /* ------------------------------------------------------------ */

// export default function PortfolioPage() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0b] text-white flex flex-col relative">
//       {/* نورهای محیطی */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
//         <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
//       </div>

//       {/* Header */}
//       <header className="relative z-20 shrink-0 flex items-center justify-between px-5 lg:px-10 h-16 border-b border-white/5">
//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 grid place-items-center font-black text-black text-sm">
//             Y
//           </div>
//           <div>
//             <p className="text-sm font-bold leading-tight">نام شما</p>
//             <p className="text-[10px] text-zinc-500 leading-tight">
//               Full-Stack Developer
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <a
//             href="#"
//             className="hidden md:block text-xs text-zinc-400 hover:text-white transition-colors px-3 py-2"
//           >
//             دانلود رزومه
//           </a>
//           <button className="h-9 px-4 text-xs font-medium rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors">
//             استخدامم کن
//           </button>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="relative z-10 flex-1 lg:overflow-hidden px-4 lg:px-10 pt-6 pb-36 lg:pb-28">
//         <div className="h-full max-w-7xl mx-auto grid gap-3 lg:gap-4
//                         grid-cols-1 lg:grid-cols-12 lg:auto-rows-fr">
//           {/* Taskino — بزرگ‌ترین کارت */}
//           <TaskinoCard
//             onClick={() => setOpen(true)}
//             className="lg:col-span-5 lg:row-span-2 min-h-[280px]"
//           />

//           {/* ۴ کارت دیگر */}
//           <ProjectCard project={PROJECTS[0]} className="lg:col-span-4 min-h-[140px]" />
//           <ProjectCard project={PROJECTS[1]} className="lg:col-span-3 min-h-[140px]" />
//           <ProjectCard project={PROJECTS[2]} className="lg:col-span-3 min-h-[140px]" />
//           <ProjectCard project={PROJECTS[3]} className="lg:col-span-4 min-h-[140px]" />
//         </div>
//       </main>

//       <TaskinoModal open={open} onClose={() => setOpen(false)} />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskinoCard } from "@/components/TaskinoCard";
import { ProjectModal } from "@/components/ProjectModal";
import { PROJECTS, FEATURED_PROJECT, OTHER_PROJECTS, type Project } from "@/lib/projects";
import { Download, Mail } from "lucide-react";

export default function PortfolioPage() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0b] text-white flex flex-col relative">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 shrink-0 flex items-center justify-between px-5 lg:px-10 h-16 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 grid place-items-center font-black text-black text-sm">
            Y
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Your Name</p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              Full-Stack Developer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-2"
          >
            <Download size={13} /> Resume
          </a>
          <a
            href="mailto:you@example.com"
            className="h-9 px-4 text-xs font-medium rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Mail size={13} /> Hire Me
          </a>
        </div>
      </header>

      {/* Main grid */}
      <main className="relative z-10 flex-1 lg:overflow-hidden px-4 lg:px-10 pt-6 pb-32 lg:pb-24">
        <div className="h-full max-w-[1600px] mx-auto grid gap-3 lg:gap-4
                        grid-cols-1 lg:grid-cols-12 lg:grid-rows-2">
          {/* Profile — 3 cols, 2 rows */}
          <div className="lg:col-span-3 lg:row-span-2 min-h-[420px] lg:min-h-0">
            <ProfileCard />
          </div>

          {/* Taskino — 5 cols, 2 rows */}
          <div className="lg:col-span-5 lg:row-span-2 min-h-[340px]">
            <TaskinoCard project={FEATURED_PROJECT} onClick={() => setActive(FEATURED_PROJECT)} />
          </div>

          {/* 4 other projects — 2 cols each */}
          {OTHER_PROJECTS.map((p) => (
            <div
              key={p.id}
              className="lg:col-span-2 min-h-[160px]"
            >
              <ProjectCard project={p} onClick={() => setActive(p)} />
            </div>
          ))}
        </div>
      </main>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  );
}