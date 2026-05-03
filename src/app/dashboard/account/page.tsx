"use client";

import { useAuth } from "@/lib/auth";
import { Lock, Shield, Trash2, Info, Github, Apple } from "lucide-react";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="flex h-[calc(100vh-80px)] mt-20 max-w-5xl mx-auto w-full px-4 sm:px-8">
      {/* Secondary Sidebar (Raycast Style) */}
      <div className="w-56 shrink-0 flex flex-col gap-1 pr-8">
        <button className="flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-md bg-white/[0.08] text-white transition-colors">
          Account
        </button>
        <button className="flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-colors">
          Profile
        </button>
        <button className="flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-colors">
          Organization
        </button>
        <button className="flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.04] transition-colors">
          Affiliate Program
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-2 pb-20 overflow-y-auto hide-scrollbar">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-4">
          {user?.image ? (
            <img 
              src={user.image} 
              alt={user.name || "User"} 
              className="w-12 h-12 rounded-full border border-white/10 object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#52c41a] flex items-center justify-center text-white text-lg font-bold">
              {user?.initials || "U"}
            </div>
          )}
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-1.5">
            {user?.name || "User"}
            <span className="text-zinc-500 font-normal">シ</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-zinc-400 mb-12">
          <span>Developer credits: 0</span>
          <Info className="w-3.5 h-3.5 text-zinc-600" />
        </div>

        {/* Account Details Section */}
        <div className="mb-12">
          <h3 className="text-[13px] font-bold text-white mb-4">Account Details</h3>
          
          <div className="mb-6">
            <label className="block text-[11px] font-medium text-zinc-500 mb-2">Email</label>
            <input 
              type="text" 
              readOnly 
              value={user?.email || ""} 
              className="w-full max-w-md bg-[#111111] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-zinc-300 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-4 max-w-md">
            <button className="flex items-center gap-3 text-[13px] text-zinc-400 hover:text-white transition-colors">
              <Lock className="w-4 h-4 text-zinc-500" />
              Change Password
            </button>
            <button className="flex items-center gap-3 text-[13px] text-zinc-400 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-zinc-500" />
              Two-Factor Authentication
            </button>
            <button className="flex items-center gap-3 text-[13px] text-red-500 hover:text-red-400 transition-colors mt-2">
              <Trash2 className="w-4 h-4 text-red-500/80" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Auth Providers Section */}
        <div>
          <h3 className="text-[13px] font-bold text-white mb-4 mt-6">Auth Providers</h3>
          
          {/* Google Connected */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[13px] font-medium text-white">Google Connected</span>
            </div>
            
            <div className="border border-white/[0.06] bg-[#0a0a0a] rounded-lg p-3 max-w-md flex items-center justify-between">
              <span className="text-[13px] text-zinc-400 truncate pr-4">{user?.email || "Not available"}</span>
              <button className="text-[13px] text-zinc-500 hover:text-white transition-colors shrink-0">Remove</button>
            </div>
            
            <button className="text-[13px] text-zinc-500 hover:text-white transition-colors mt-3 flex items-center gap-2">
              <span className="text-lg leading-none mb-0.5">+</span> Add Account
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-white transition-colors max-w-max">
              <Github className="w-[14px] h-[14px]" />
              Connect GitHub
            </button>
            <button className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-white transition-colors max-w-max">
              <Apple className="w-[14px] h-[14px]" />
              Connect Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
