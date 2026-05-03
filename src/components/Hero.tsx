"use client";

import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamically import Spline to avoid SSR issues and improve initial load performance
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center w-full pt-14 bg-black overflow-hidden hide-spline-logo">
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0 w-full h-[150vh] -top-[25vh] left-0 right-0 overflow-hidden">
        {/* We removed the CSS scale so it renders crisp at 1x resolution. 
            User needs to zoom in within Spline to make it fill the screen instead. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Spline scene="https://prod.spline.design/RLgcKlF1xpkcuT6i/scene.splinecode" />
        </div>
        
        {/* Gradients to blend edges and make text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10 pointer-events-none" />
      </div>

      {/* Hero Content Layer - with pointer-events-none so it doesn't block Spline, 
          but buttons inside must have pointer-events-auto */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-4xl pointer-events-none">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl"
        >
          Detect Physical Violence in{" "}
          <span className="text-white">
            1-2 Seconds.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
        >
          A dual-stage AI cascade (YOLO + CTR-GCN) analyzing 3D skeletal motion.
          Instant alerts. Zero facial recognition. Total privacy.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            Enter Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
          
          <a
            href="#how-it-works"
            className="text-white/70 hover:text-white px-8 py-3.5 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] transition-all hover:bg-white/[0.1]"
          >
            How It Works
          </a>
        </motion.div>
      </div>
    </div>
  );
}
