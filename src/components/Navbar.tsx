"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import Logo from "./Logo";
import { User, Settings, LogOut } from "lucide-react";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Technology", href: "#technology" },
  { name: "Live Demo", href: "#demo" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header 
      className="fixed top-4 inset-x-0 w-full flex justify-center z-50 transition-all duration-300 pointer-events-none px-4"
    >
      <div
        className="w-full max-w-[1100px] h-14 rounded-2xl border bg-[#0a0a0a]/80 backdrop-blur-xl border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between px-6"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold tracking-tight text-white group-hover:text-glow group-hover:scale-[1.02] transform origin-left transition-all duration-300">
            AI Guardian
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {!isDashboard && (
                <Link
                  href="/dashboard"
                  className="hidden md:flex text-sm font-medium bg-white text-black px-4 py-1.5 rounded-md hover:bg-zinc-50 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] items-center gap-2"
                >
                  Dashboard
                </Link>
              )}
              
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={cn("text-zinc-500 group-hover:text-white transition-all duration-200", dropdownOpen && "rotate-180 text-white")}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full bg-zinc-800 object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#52c41a] flex items-center justify-center text-white text-[11px] font-bold tracking-tighter">
                      {user.initials}
                    </div>
                  )}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-xl border border-white/[0.08] bg-[#0f0f0f]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/dashboard/settings#account"
                        onClick={() => { setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-zinc-500" />
                        View Account
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4 text-zinc-500" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-white/[0.06] py-1.5">
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/[0.08] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 hidden md:block"
              >
                Log in
              </Link>
              <Link
                href="#demo"
                className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-md hover:bg-zinc-50 transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] flex items-center gap-2"
              >
                <span>Request Access</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
