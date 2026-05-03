"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Maximize2, Minimize2, Radio, Activity, AlertTriangle,
  Users, Zap, Camera, Shield, TrendingUp, SlidersHorizontal,
  Bell, Download, Play, Trash2, CheckCircle, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Animation Config ───────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// ─── Mock Data ──────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: "evt-001", type: "violence" as const, camera: "CAM_01_HALLWAY", confidence: 0.94, timestamp: "2026-03-16T14:23:11Z", status: "resolved" as const },
  { id: "evt-002", type: "person_detected" as const, camera: "CAM_02_ENTRANCE", confidence: 0.87, timestamp: "2026-03-16T14:21:45Z", status: "active" as const },
  { id: "evt-003", type: "person_detected" as const, camera: "CAM_01_HALLWAY", confidence: 0.91, timestamp: "2026-03-16T14:18:30Z", status: "resolved" as const },
  { id: "evt-004", type: "violence" as const, camera: "CAM_03_CAFETERIA", confidence: 0.78, timestamp: "2026-03-16T14:15:02Z", status: "resolved" as const },
  { id: "evt-005", type: "person_detected" as const, camera: "CAM_02_ENTRANCE", confidence: 0.95, timestamp: "2026-03-16T14:12:18Z", status: "active" as const },
  { id: "evt-006", type: "person_detected" as const, camera: "CAM_01_HALLWAY", confidence: 0.82, timestamp: "2026-03-16T14:08:55Z", status: "resolved" as const },
];

const MOCK_SPARKLINE_DATA = [
  { time: "00:00", value: 2 }, { time: "01:00", value: 0 }, { time: "02:00", value: 1 },
  { time: "03:00", value: 0 }, { time: "04:00", value: 0 }, { time: "05:00", value: 3 },
  { time: "06:00", value: 5 }, { time: "07:00", value: 12 }, { time: "08:00", value: 18 },
  { time: "09:00", value: 24 }, { time: "10:00", value: 15 }, { time: "11:00", value: 8 },
  { time: "12:00", value: 22 }, { time: "13:00", value: 19 }, { time: "14:00", value: 14 },
];

// ─── Mini Sparkline Component ───────────────────────────────
function MiniSparkline({ data }: { data: { time: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  const width = 280;
  const height = 80;
  const padding = 4;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - (d.value / (max || 1)) * (height - padding * 2),
  }));

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DC2626" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkFill)" />
      <path d={pathD} fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#DC2626" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill="#DC2626" opacity="0.3" />
    </svg>
  );
}

// ─── Types ──────────────────────────────────────────────────
interface BackendStats {
  is_violence?: boolean;
  confidence?: number;
  person_count?: number;
  fps?: number;
}

// ─── Main Page ──────────────────────────────────────────────
export default function DashboardMatrix() {
  const [isFocused, setIsFocused] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<BackendStats>({});
  const [isConnected, setIsConnected] = useState(false);
  const [mockFps, setMockFps] = useState(28.4);
  const [mockPersons, setMockPersons] = useState(3);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processInputRef = useRef<HTMLInputElement>(null);
  const [processingJob, setProcessingJob] = useState<{ id: string; status: string; progress: number; downloadUrl?: string; incidents?: number } | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [cameraModal, setCameraModal] = useState(false);
  const [cameraInput, setCameraInput] = useState("0");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const prevFrameUrl = useRef<string | null>(null);

  // Poll backend for frames + stats
  useEffect(() => {
    let isActive = true;

    const pollFrame = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/frame?t=${Date.now()}`);
        if (!res.ok) {
          setIsConnected(false);
          if (isActive) setTimeout(pollFrame, 1000);
          return;
        }
        setIsConnected(true);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (isActive) {
          setFrameUrl(url);
          if (prevFrameUrl.current) URL.revokeObjectURL(prevFrameUrl.current);
          prevFrameUrl.current = url;
          setTimeout(pollFrame, 83);
        } else {
          URL.revokeObjectURL(url);
        }
      } catch {
        setIsConnected(false);
        if (isActive) setTimeout(pollFrame, 1000);
      }
    };

    const pollStats = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/stats`);
        if (res.ok) {
          const data = await res.json();
          if (isActive) setStats(data);
        }
      } catch {
        // offline
      } finally {
        if (isActive) setTimeout(pollStats, 800);
      }
    };

    const pollEvents = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/incidents`);
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.incidents || []).slice(0, 10).map((inc: Record<string, unknown>) => ({
            id: inc.id as string,
            type: "violence" as const,
            camera: "CAM_01_MAIN",
            confidence: (inc.confidence as number) || 0,
            timestamp: inc.timestamp as string,
            status: inc.review_status === "pending" ? "active" as const : "resolved" as const,
            video_url: inc.video_url ? `http://localhost:8000${inc.video_url}` : undefined,
          }));
          if (isActive && mapped.length > 0) setEvents(mapped);
        }
      } catch {}
      if (isActive) setTimeout(pollEvents, 5000);
    };

    pollFrame();
    pollStats();
    pollEvents();

    return () => {
      isActive = false;
      if (prevFrameUrl.current) URL.revokeObjectURL(prevFrameUrl.current);
    };
  }, []);

  // Animate mock metrics when offline
  useEffect(() => {
    if (isConnected) return;
    const interval = setInterval(() => {
      setMockFps(prev => Math.max(20, Math.min(35, +(prev + (Math.random() - 0.5) * 2).toFixed(1))));
      setMockPersons(Math.floor(Math.random() * 5) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Poll processing job status
  useEffect(() => {
    if (!processingJob || processingJob.status === "done" || processingJob.status === "error") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/process-video/${processingJob.id}`);
        const data = await res.json();
        setProcessingJob({ id: processingJob.id, ...data });
        if (data.status === "done") {
          setProcessedVideoUrl(`http://localhost:8000${data.download_url}`);
        }
      } catch {}
    }, 1500);
    return () => clearInterval(interval);
  }, [processingJob]);

  const handleProcessVideo = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/api/upload-and-process", { method: "POST", body: form });
      const data = await res.json();
      if (data.ok) {
        setProcessingJob({ id: data.job_id, status: "queued", progress: 0 });
        setProcessedVideoUrl(null);
      }
    } catch {}
  };

  const handleClearIncidents = async () => {
    if (!confirm("Are you sure you want to clear all incidents? This cannot be undone.")) return;
    try {
      await fetch("http://localhost:8000/api/incidents/clear", { method: "POST" });
      setEvents([]); // Optimistically clear feed
    } catch {}
  };

  const handleReviewIncident = async (id: string, status: "confirmed" | "false_alarm", e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:8000/api/incidents/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer: "web_dashboard" })
      });
      // Optimistically update the local state
      setEvents(events.map(ev => 
        ev.id === id ? { ...ev, status: "resolved" } : ev
      ));
    } catch {}
  };

  const isViolence = stats.is_violence;
  const confidenceStr = ((stats.confidence || 0) * 100).toFixed(1) + "%";
  const displayFps = isConnected ? Math.round(stats.fps || 0) : mockFps;
  const displayPersons = isConnected ? (stats.person_count || 0) : mockPersons;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col gap-6 pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">The Matrix</h1>
          <p className="text-sm text-zinc-400 mt-1">Live camera feeds and real-time detection monitor.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
            isConnected
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-zinc-500/10 border-zinc-500/20"
          )}>
            <Radio className={cn("w-3.5 h-3.5", isConnected ? "text-emerald-400 animate-pulse" : "text-zinc-400")} />
            <span className={cn("text-xs font-medium", isConnected ? "text-emerald-300" : "text-zinc-400")}>
              {isConnected ? "Live" : "Mock Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 flex-1">

        {/* ───── Widget 1: Hero Camera Feed ───── */}
        <motion.div
          variants={staggerItem}
          className={cn(
            "xl:col-span-2 xl:row-span-2 lg:col-span-2 relative rounded-2xl overflow-hidden glass-card group min-h-[400px] xl:min-h-0",
            isFocused && "fixed inset-4 z-50 !bg-[#0a0a0a] !border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]",
            isViolence && !isFocused && "!border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.15)]"
          )}
        >
          {/* Inner top highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

          {/* Camera overlay bar */}
          <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-black/70 to-transparent z-10 flex items-center justify-between px-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2.5">
              <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
              <span className="text-xs font-semibold text-white/90 tracking-wider font-mono">CAM_01_HALLWAY</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/[0.06]">
                <Zap className="w-3 h-3 text-zinc-400" />
                <span className="font-mono">{displayFps} FPS</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/[0.06]">
                <Users className="w-3 h-3 text-zinc-400" />
                <span className="font-mono">{displayPersons}</span>
              </div>
              <button
                onClick={() => setIsFocused(!isFocused)}
                className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              >
                {isFocused ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Video / Placeholder */}
          <div className="w-full h-full flex items-center justify-center relative min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {frameUrl ? (
              <img src={frameUrl} alt="Live Stream" className="w-full h-full object-contain relative z-0" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DC2626]/10 to-red-500/5 border border-[#DC2626]/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-[#DC2626]/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Camera Feed Standby</p>
                  <p className="text-xs text-zinc-500 max-w-[240px]">System standby. Initializing neural network cascade and securing local processing unit.</p>
                </div>
              </div>
            )}

            {/* Violence detection overlay */}
            {isViolence && (
              <div className="absolute inset-6 border-2 border-red-500/50 rounded-xl pointer-events-none flex items-start p-5 z-20">
                <div className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/40 uppercase tracking-widest backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <AlertTriangle className="w-4 h-4" />
                  Violence Detected {confidenceStr}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ───── Widget 2: System Health ───── */}
        <motion.div variants={staggerItem} className="glass-card p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Shield className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-white">System Health</span>
            </div>
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase",
              isConnected
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
            )}>
              {isConnected ? "Online" : "Mock"}
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Backend</span>
              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500" : "bg-zinc-600")} />
                <span className={cn("text-xs font-medium", isConnected ? "text-emerald-400" : "text-zinc-400")}>
                  {isConnected ? "Connected" : "Offline"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">CTR-GCN Model</span>
              <span className="text-xs font-medium text-emerald-400">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Uptime</span>
              <span className="text-xs font-medium text-white font-mono">47h 23m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">GPU Temp</span>
              <span className="text-xs font-medium text-white font-mono">62°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Inference</span>
              <span className="text-xs font-medium text-white font-mono">34ms</span>
            </div>
          </div>
        </motion.div>

        {/* ───── Widget 3: Live Metrics ───── */}
        <motion.div variants={staggerItem} className="glass-card p-5 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Activity className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm font-medium text-white">Live Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">FPS</span>
              <span className="text-3xl font-bold text-white tracking-tighter font-mono transition-all duration-500">
                {displayFps}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Persons</span>
              <span className="text-3xl font-bold text-white tracking-tighter font-mono transition-all duration-500">
                {displayPersons}
              </span>
            </div>
            <div className="col-span-2 flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Threat Level</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-zinc-300 capitalize">Low</span>
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full w-[15%] rounded-full bg-zinc-400 transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ───── Widget 4: Quick Actions ───── */}
        <motion.div variants={staggerItem} className="glass-card p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm font-medium text-white">Quick Actions</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 flex-1">
            <button
              onClick={() => { setCameraInput("0"); setCameraModal(true); }}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-200 group"
            >
              <Camera className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Add Camera</span>
            </button>
            <button
              onClick={() => processInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#DC2626]/[0.05] border border-[#DC2626]/20 hover:bg-[#DC2626]/10 hover:border-[#DC2626]/40 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="w-4 h-4 text-[#DC2626] group-hover:scale-110 transition-transform relative z-10" />
              <span className="text-[10px] font-medium text-zinc-300 group-hover:text-white transition-colors relative z-10">Analyze Video</span>
            </button>
            <button
              onClick={() => window.location.href = "/dashboard/settings"}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-200 group"
            >
              <SlidersHorizontal className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Settings</span>
            </button>
            <button
              onClick={() => window.location.href = "/dashboard/analytics"}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-200 group"
            >
              <TrendingUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Analytics</span>
            </button>
          </div>
          {/* Processing status */}
          {processingJob && (
            <div className="text-[10px] text-zinc-400">
              {processingJob.status === "processing" && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-[#DC2626] rounded-full transition-all duration-500" style={{ width: `${processingJob.progress}%` }} />
                  </div>
                  <span>{processingJob.progress}%</span>
                </div>
              )}
              {processingJob.status === "done" && (
                <span className="text-emerald-400">✓ Done — {processingJob.incidents} incidents found</span>
              )}
              {processingJob.status === "queued" && <span className="animate-pulse">Queued...</span>}
              {processingJob.status === "error" && <span className="text-red-400">Error processing</span>}
            </div>
          )}
          {uploadStatus !== "idle" && (
            <div className="text-[10px] text-zinc-400">
              {uploadStatus === "uploading" && <span className="animate-pulse">Uploading video...</span>}
              {uploadStatus === "done" && <span className="text-emerald-400">✓ Uploaded — live feed switched</span>}
              {uploadStatus === "error" && <span className="text-red-400">Upload failed — is backend running?</span>}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setUploadStatus("uploading");
              const form = new FormData();
              form.append("file", f);
              fetch("http://localhost:8000/api/upload", { method: "POST", body: form })
                .then(res => {
                  if (res.ok) { setUploadStatus("done"); setTimeout(() => setUploadStatus("idle"), 3000); }
                  else setUploadStatus("error");
                })
                .catch(() => setUploadStatus("error"));
            }
            e.target.value = "";
          }} />
          <input ref={processInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleProcessVideo(f);
            e.target.value = "";
          }} />
        </motion.div>

        {/* ───── Widget 5: Mini Sparkline ───── */}
        <motion.div variants={staggerItem} className="glass-card p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-white">Activity</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Last 15h</span>
          </div>

          <div className="flex-1 relative min-h-[80px]">
            <MiniSparkline data={MOCK_SPARKLINE_DATA} />
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-zinc-500">Total events</span>
            <span className="text-xs font-semibold text-white font-mono">
              {MOCK_SPARKLINE_DATA.reduce((sum, d) => sum + d.value, 0)}
            </span>
          </div>
        </motion.div>

        {/* ───── Widget: Processed Video Player ───── */}
        {processedVideoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-4 lg:col-span-2 glass-card p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/30 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#DC2626]" />
                </div>
                <span className="text-sm font-medium text-white">Processed Video — Skeleton Overlay</span>
              </div>
              <a
                href={processedVideoUrl}
                download
                className="text-[10px] px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              >
                Download .mp4
              </a>
            </div>
            <video
              src={processedVideoUrl}
              controls
              className="w-full rounded-lg bg-black border border-white/[0.06]"
              style={{ maxHeight: "500px" }}
            />
          </motion.div>
        )}

        {/* ───── Widget 6: Event Feed ───── */}
        <motion.div variants={staggerItem} className="xl:col-span-4 lg:col-span-2 glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Radio className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-white">Event Feed</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-semibold text-zinc-400">
                {events.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleClearIncidents} className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1.5" title="Clear Event Feed">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
              <button className="text-xs text-zinc-500 hover:text-white transition-colors">View All</button>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: EASE }}
                onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                className="flex flex-col gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    event.type === "violence" ? "bg-red-500" : "bg-zinc-500"
                  )} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-semibold",
                        event.type === "violence" ? "text-red-400" : "text-zinc-300"
                      )}>
                        {event.type === "violence" ? "Violence Detected" : "Person Detected"}
                      </span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded",
                        event.status === "active"
                          ? "bg-white/15 text-white"
                          : "bg-zinc-500/15 text-zinc-500"
                      )}>
                        {event.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{event.camera}</span>
                  </div>

                  {(event as any).video_url && (
                    <div className="flex items-center gap-1.5 px-2 py-1 shrink-0 rounded-md bg-[#DC2626]/10 text-[#DC2626] group-hover:bg-[#DC2626]/20 transition-colors">
                      <Play className="w-[10px] h-[10px] fill-current" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Replay</span>
                    </div>
                  )}

                  <span className="text-xs font-mono text-zinc-400">{(event.confidence * 100).toFixed(0)}%</span>

                  <span className="text-[10px] text-zinc-600 font-mono hidden sm:block">
                    {new Date(event.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {expandedEventId === event.id && (event as any).video_url && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="w-full relative rounded-lg overflow-hidden border border-white/[0.05] flex flex-col gap-2 p-2 bg-black/20"
                  >
                    <video 
                      src={(event as any).video_url} 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                      className="w-full h-auto bg-black border border-white/10 rounded-lg aspect-video" 
                    />
                    
                    {/* Feedback Loop Buttons like Telegram */}
                    {event.status === "active" ? (
                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={(e) => handleReviewIncident(event.id, "confirmed", e)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-colors text-xs font-semibold"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm Threat
                        </button>
                        <button 
                          onClick={(e) => handleReviewIncident(event.id, "false_alarm", e)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 hover:border-zinc-500/30 transition-colors text-xs font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5" /> False Alarm
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2 rounded-md bg-white/[0.02] border border-white/[0.05] text-zinc-500 text-xs font-medium">
                        Incident Reviewed
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ───── Camera Source Modal ───── */}
      {cameraModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setCameraModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Camera className="w-4.5 h-4.5 text-zinc-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Add Camera Source</h3>
                <p className="text-[11px] text-zinc-500">RTSP URL or webcam index</p>
              </div>
            </div>

            <input
              autoFocus
              value={cameraInput}
              onChange={(e) => setCameraInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const type = cameraInput.startsWith("rtsp") ? "rtsp" : "webcam";
                  fetch("http://localhost:8000/api/camera", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source: cameraInput, type }),
                  }).catch(() => {});
                  setCameraModal(false);
                }
                if (e.key === "Escape") setCameraModal(false);
              }}
              placeholder="0, rtsp://192.168.1.1:554/stream..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 outline-none focus:border-[#DC2626]/50 focus:ring-1 focus:ring-[#DC2626]/20 transition-all font-mono"
            />

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setCameraModal(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const type = cameraInput.startsWith("rtsp") ? "rtsp" : "webcam";
                  fetch("http://localhost:8000/api/camera", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ source: cameraInput, type }),
                  }).catch(() => {});
                  setCameraModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#DC2626] hover:bg-[#b91c1c] transition-all"
              >
                Connect
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
