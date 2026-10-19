"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/lib/api";
import { Sparkles, ChevronDown, LogOut, User as UserIcon, Settings } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, clear } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    clear();
    router.push("/login");
    router.refresh();
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="h-8 w-8 rounded-lg bg-black text-white grid place-items-center">
            <Sparkles size={16} />
          </div>
          <span className="text-lg">ChatBot</span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/dashboard" className="px-3 py-2 text-sm font-medium hover:bg-neutral-100 rounded-lg">
            داشبورد
          </Link>
          <Link href="/chat" className="px-3 py-2 text-sm font-medium hover:bg-neutral-100 rounded-lg">
            گفتگو
          </Link>
        </nav>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100"
          >
            <div className="h-8 w-8 rounded-full bg-black text-white text-xs font-bold grid place-items-center">
              {initials}
            </div>
            <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
              {user?.name ?? "کاربر"}
            </span>
            <ChevronDown size={14} className="text-neutral-500" />
          </button>

          {open && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5">
              <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setOpen(false); router.push("/profile"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-neutral-100"
              >
                <UserIcon size={14} /> پروفایل
              </button>
              <button
                onClick={() => { setOpen(false); router.push("/settings"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-neutral-100"
              >
                <Settings size={14} /> تنظیمات
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600"
              >
                <LogOut size={14} /> خروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}