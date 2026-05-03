"use client";

import { Github } from "lucide-react";
import Logo from "./Logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Live Demo", href: "#demo" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Resources: [
    { label: "Documentation", href: "#how-it-works" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Research Paper", href: "#features" },
    { label: "API Reference", href: "#features" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "GDPR Compliance", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Raycast Deep Subtle Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-end">
        <div 
          className="w-full max-w-[1200px] h-[800px] absolute bottom-[-400px]"
          style={{ 
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)", 
            WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)" 
          }}
        >
          <img 
            src="/red-abstraction.png" 
            className="w-full h-full object-cover opacity-70 blur-[100px]" 
            alt="Red Glow" 
          />
        </div>
      </div>

      {/* Footer body — Sheer base to let glow shine through */}
      <div className="relative border-t border-white/[0.06] bg-black/20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Logo className="w-5 h-5" />
                <span className="text-white font-semibold tracking-tight text-sm">
                  AI Guardian
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                AI-powered violence detection for educational environments.
                Real-time skeleton analysis. Privacy-first. Open source.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm text-white font-semibold tracking-[0.15em] uppercase mb-6">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              © {new Date().getFullYear()} AI Guardian. Built for Infomatrix 2026.
            </p>
            <a
              href="https://github.com"
              className="text-zinc-600 hover:text-white transition-colors"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
