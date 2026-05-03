"use client";

import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";

export default function OpenSourceCTA() {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#DC2626]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm text-[#DC2626] font-medium tracking-[0.2em] uppercase block mb-6">
            Open Source
          </span>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Built in the Open.
          </h2>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto mb-12">
            AI Guardian is fully open-source. Inspect every line of code.
            Deploy on your own infrastructure. Own your security data completely.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>

            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white px-8 py-3.5 rounded-full border border-white/10 hover:bg-white/[0.05] transition-all"
            >
              Try Live Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
