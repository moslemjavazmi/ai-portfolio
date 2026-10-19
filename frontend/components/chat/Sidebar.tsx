"use client";

import { Plus, MessageSquare, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Conversation {
  id: string;
  title: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onClose,
  isMobile,
}: SidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-black text-white w-72">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <span className="text-lg font-bold tracking-tight">ChatBot</span>
        {isMobile && (
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-4">
        <Button
          onClick={onNew}
          variant="secondary"
          className="w-full !bg-white !text-black hover:!bg-neutral-100"
        >
          <Plus size={16} />
          گفتگوی جدید
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
              "transition-colors",
              activeId === c.id
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <MessageSquare size={16} className="shrink-0" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut size={16} />
          خروج
        </button>
      </div>
    </aside>
  );
}