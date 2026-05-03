"use client";

import { motion } from "framer-motion";
import { Camera, Brain, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: "01",
    icon: Camera,
    title: "Connect",
    desc: "Any RTSP camera, webcam, or video file. One click to start real-time monitoring.",
  },
  {
    num: "02",
    icon: Brain,
    title: "Analyze",
    desc: "Stage 1: YOLO11n-Pose extracts skeletal keypoints. Stage 2: CTR-GCN graph network classifies aggression patterns.",
  },
  {
    num: "03",
    icon: Bell,
    title: "Alert",
    desc: "Instant Telegram notification with screenshot and confidence score. Review and confirm directly from your phone.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-32 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#DC2626]/20 via-[#DC2626]/5 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <span className="text-sm text-[#DC2626] font-medium tracking-[0.2em] uppercase block mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Camera to alert.
            <br />
            <span className="text-zinc-500">Under two seconds.</span>
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-0 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="group relative flex-1 px-8 py-10 md:py-0"
                >
                  {/* Large background number */}
                  <div
                    className="absolute top-0 left-4 md:left-6 text-[8rem] md:text-[10rem] font-bold text-white/[0.03] leading-none select-none pointer-events-none group-hover:text-[#DC2626]/[0.06] transition-colors duration-700"
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>

                  <div className="relative z-10 pt-16 md:pt-24">
                    <div className="mb-6">
                      <Icon
                        className="w-6 h-6 text-[#DC2626] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="text-xl md:text-3xl font-semibold text-white tracking-tight mb-4">
                      {step.title}
                    </h3>

                    <p className="text-base text-zinc-400 leading-relaxed max-w-xs">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Desktop connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20 w-16">
                    <div className="h-px w-full bg-gradient-to-r from-[#DC2626]/40 to-[#DC2626]/10" />
                  </div>
                )}

                {/* Mobile vertical connector */}
                {i < steps.length - 1 && (
                  <div className="md:hidden flex justify-start pl-12 py-2">
                    <div className="w-px h-10 bg-gradient-to-b from-[#DC2626]/30 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom latency indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 flex items-center gap-6"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-[#DC2626]/30 to-transparent" />
          <span className="text-sm font-mono font-semibold text-[#DC2626] tracking-[0.15em] uppercase whitespace-nowrap">
            Total Latency: &lt; 2 seconds
          </span>
        </motion.div>
      </div>
    </section>
  );
}
