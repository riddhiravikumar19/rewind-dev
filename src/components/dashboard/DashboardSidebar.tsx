"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/dashboard/LogoutButton";
import {
  Bug,
  FileText,
  FolderKanban,
  LayoutDashboard,
  PlayCircle,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Websites", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Sessions", href: "/dashboard/sessions", icon: PlayCircle },
  { label: "Bugs", href: "/dashboard/reports", icon: Bug },
  { label: "Ghost Replay", href: "/dashboard/replay", icon: PlayCircle },
  { label: "Demo Flow", href: "/dashboard/demo", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#1F3A2E] bg-[#0E1512]/80 p-5 md:block">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F3A2E] text-[#39FF88]">
          R
        </div>

        <h1 className="font-display text-xl font-bold text-[#F3FFF8]">
          Rewind.dev
        </h1>
      </Link>

      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-[#39FF88]/12 text-[#39FF88]"
                  : "text-[#7F9B8B] hover:bg-[#39FF88]/8 hover:text-[#F3FFF8]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-2">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}