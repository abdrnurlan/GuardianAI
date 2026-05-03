"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login();
    }, 1200);
  };

  const handleGoogleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      login();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[320px] mx-auto relative"
    >
      {/* Claude-style Google OAuth Button */}
      <div className="mb-6">
        <button type="button" onClick={handleGoogleDemo} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-[10px] bg-[#0d0d0d] border border-white/[0.08] hover:bg-[#1a1a1a] hover:border-white/[0.15] hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] transition-all duration-300">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-[14px] font-medium text-white/90">Continue with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center mb-6">
        <span className="text-[11px] uppercase tracking-wider text-zinc-600 font-medium">or</span>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="relative group">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className="appearance-none block w-full px-4 py-2.5 bg-[#111111] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:bg-[#1a1a1a] sm:text-[14px] hover:border-white/20 transition-all duration-300"
            style={{
              boxShadow: emailFocused ? '0 0 15px rgba(255, 255, 255, 0.03)' : 'none'
            }}
            placeholder="Enter your email"
          />
        </div>
        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-[10px] px-4 rounded-[10px] text-[14px] font-medium text-black bg-white hover:bg-zinc-100 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /></span>
            ) : (
              "Continue with email"
            )}
          </button>
        </div>
      </form>

      {/* Sign Up Link styled for minimalism with precise arrow animation */}
      <div className="mt-8">
        <Link 
          href="/signup" 
          className="group flex justify-center items-center text-[13px] text-zinc-500 hover:text-white transition-all w-full"
        >
          Don&apos;t have an account? <span className="text-zinc-300 ml-1 group-hover:text-white transition-colors">Sign up</span> 
          <span className="ml-1 opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300">→</span>
        </Link>
      </div>
    </motion.div>
  );
}
