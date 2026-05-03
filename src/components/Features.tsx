"use client";

import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="relative w-full py-32 flex flex-col items-center justify-center overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 w-full">
        {/* Section Header */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.span 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="text-[#DC2626] font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-6 px-3 py-1 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-full"
          >
            Core Infrastructure
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
          >
            Proactive Security.<br />
            <span className="text-zinc-600">Uncompromising Safety.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Enterprise-grade threat detection designed to protect educational campuses. We process streams in milliseconds so you can prevent incidents before they escalate.
          </motion.p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px]">
          
          {/* Card 1: CTR-GCN Logic (Large - Spans 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 relative rounded-3xl border border-white/10 glass overflow-hidden group"
          >
            {/* Live Indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-medium text-white uppercase tracking-wider">Live System</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black z-0 pointer-events-none" />

            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-red-500/20 border border-red-500/30 flex items-center justify-center mb-6 neon-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Dual-Stream CTR-GCN</h3>
              <p className="text-zinc-400 max-w-md">Our Hierarchy-aware Part-Informed Graph Convolutional Network analyzes both spatial joint relationships and temporal motion dynamics to detect aggressive behavior with 99.4% accuracy.</p>
            </div>
          </motion.div>

          {/* Card 2: Alerts (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1 relative rounded-3xl border border-white/10 glass overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black z-0 pointer-events-none" />
            <div className="relative z-10 p-10 h-full flex flex-col">
              
              {/* Fake Telegram Alert UI */}
              <div className="flex-1 w-full flex items-center justify-center mb-6 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500">
                <div className="w-full max-w-[200px] bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-500 text-xs">⚠️</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">AI Guardian</div>
                      <div className="text-[10px] text-zinc-500">Just now</div>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-300">
                    Hostility detected in <span className="text-white font-medium">Corridor A</span>. Confidence: 98%.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Instant Alerts</h3>
                <p className="text-zinc-400 text-sm">Real-time push notifications sent directly to administration via Telegram/WhatsApp APIs.</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Speed (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 relative rounded-3xl border border-white/10 glass overflow-hidden group flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-black z-0 pointer-events-none group-hover:from-red-500/20 transition-colors duration-500" />
            
            <div className="relative z-10 text-center p-8">
              <div className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-2 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                &lt;2s
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Response Time</h3>
              <p className="text-zinc-400 text-sm">From detection to notification, optimized for YOLOv11 and TensorRT.</p>
            </div>
          </motion.div>

          {/* Card 4: Hardware Agnostic (Medium - Spans 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 relative rounded-3xl border border-white/10 glass overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-zinc-900/50 to-black z-0 pointer-events-none" />

            <div className="relative z-10 p-10 h-full flex flex-col justify-start">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Integrates With Existing CCTV</h3>
              <p className="text-zinc-400">No need for expensive new hardware. AI Guardian processes standard RTSP streams from any IP camera, transforming legacy infrastructure into an active threat-prevention network.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
