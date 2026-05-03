"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SquareTerminal,
  Map,
  Settings,
} from "lucide-react";

const navItems = [
  {
    title: "The Matrix",
    href: "/dashboard",
    icon: SquareTerminal,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: Map,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col z-40 w-[64px] border-r border-white/[0.02]">
      {/* Navigation */}
      <div className="flex-1 py-4 space-y-3 overflow-y-auto w-full flex flex-col items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          const isExactDashboard = item.href === '/dashboard' && pathname === '/dashboard';
          const isActuallyActive = item.href === '/dashboard' ? isExactDashboard : isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group",
                isActuallyActive
                  ? "bg-[#DC2626]/[0.08] border border-[#DC2626]/30 shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]"
                  : "hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <item.icon className={cn(
                "transition-colors stroke-[2px]",
                "w-[20px] h-[20px]",
                isActuallyActive ? "text-[#DC2626]" : "text-zinc-500 group-hover:text-zinc-300"
              )} />

              {/* Collapsed active indicator dot */}
              {isActuallyActive && (
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#DC2626] shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

