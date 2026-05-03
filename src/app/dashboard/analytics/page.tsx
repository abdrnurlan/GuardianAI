"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  AlertTriangle, Target, Timer, Users, TrendingUp,
  BarChart3, Clock, Trash2, Camera, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Animation Config ───────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// ─── Mock Data ──────────────────────────────────────────────
const MOCK_7D = [
  { date: "Mar 10", incidents: 3, persons: 45 },
  { date: "Mar 11", incidents: 7, persons: 52 },
  { date: "Mar 12", incidents: 2, persons: 38 },
  { date: "Mar 13", incidents: 5, persons: 61 },
  { date: "Mar 14", incidents: 1, persons: 44 },
  { date: "Mar 15", incidents: 4, persons: 55 },
  { date: "Mar 16", incidents: 6, persons: 48 },
];

const MOCK_30D = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 1, 15 + i);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    incidents: Math.round(3 + Math.sin(i * 0.5) * 3 + Math.random() * 2),
    persons: Math.round(40 + Math.sin(i * 0.3) * 15 + Math.random() * 10),
  };
});

const MOCK_90D = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2025, 11, 17 + i);
  return {
    date: i % 7 === 0 ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    incidents: Math.round(2 + Math.sin(i * 0.15) * 4 + Math.random() * 3),
    persons: Math.round(35 + Math.cos(i * 0.1) * 20 + Math.random() * 15),
  };
});

const DATASETS: Record<string, typeof MOCK_7D> = { "7D": MOCK_7D, "30D": MOCK_30D, "90D": MOCK_90D };

const MOCK_HOURLY_DISTRIBUTION = [
  { hour: "6AM", count: 0 }, { hour: "7AM", count: 1 }, { hour: "8AM", count: 3 },
  { hour: "9AM", count: 5 }, { hour: "10AM", count: 2 }, { hour: "11AM", count: 4 },
  { hour: "12PM", count: 6 }, { hour: "1PM", count: 3 }, { hour: "2PM", count: 7 },
  { hour: "3PM", count: 4 }, { hour: "4PM", count: 2 }, { hour: "5PM", count: 1 },
];

const MOCK_INCIDENT_CARDS = [
  { id: "inc-001", type: "Violence Detected", camera: "CAM_01_HALLWAY", confidence: 94, timestamp: "2026-03-16 14:23:11", severity: "high" as const },
  { id: "inc-002", type: "Aggressive Behavior", camera: "CAM_03_CAFETERIA", confidence: 78, timestamp: "2026-03-16 14:15:02", severity: "medium" as const },
  { id: "inc-003", type: "Violence Detected", camera: "CAM_01_HALLWAY", confidence: 91, timestamp: "2026-03-15 16:42:30", severity: "high" as const },
  { id: "inc-004", type: "Suspicious Motion", camera: "CAM_02_ENTRANCE", confidence: 65, timestamp: "2026-03-15 09:18:45", severity: "low" as const },
  { id: "inc-005", type: "Violence Detected", camera: "CAM_03_CAFETERIA", confidence: 88, timestamp: "2026-03-14 11:30:22", severity: "high" as const },
];

const MOCK_SYSTEM_STATS = {
  totalIncidents: 28,
  avgConfidence: 87.2,
  avgResponseTime: "1.2s",
  totalPersonsDetected: 1247,
};

// ─── Types ──────────────────────────────────────────────────
interface Incident {
  id: string;
  filename: string;
  timestamp: string;
  image_url: string;
  confidence?: number;
  review_status?: string;
  person_count?: number;
}

// ─── Page ───────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7D");

  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/incidents");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch {
      // offline — use mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearIncidents = async () => {
    if (!confirm("Clear all incident history?")) return;
    try {
      await fetch("http://localhost:8000/api/incidents/clear", { method: "POST" });
      setIncidents([]);
    } catch {
      // offline
    }
  };

  const tooltipStyle = {
    backgroundColor: "rgba(10, 11, 15, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  };

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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Analytics & History</h1>
          <p className="text-sm text-zinc-400 mt-1">Review detected incidents and system performance.</p>
        </div>
        <button
          onClick={clearIncidents}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear History
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: "Total Incidents", value: incidents.length || MOCK_SYSTEM_STATS.totalIncidents, icon: AlertTriangle, change: incidents.length > 0 ? "live" : "+12%", changeColor: incidents.length > 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Avg Confidence", value: MOCK_SYSTEM_STATS.avgConfidence + "%", icon: Target, change: "+3.1%", changeColor: "text-emerald-400" },
          { label: "Response Time", value: MOCK_SYSTEM_STATS.avgResponseTime, icon: Timer, change: "-0.4s", changeColor: "text-emerald-400" },
          { label: "Persons Detected", value: MOCK_SYSTEM_STATS.totalPersonsDetected.toLocaleString(), icon: Users, change: "+156", changeColor: "text-zinc-400" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={staggerItem} className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-zinc-400" />
              </div>
              <span className={cn("text-[10px] font-medium", stat.changeColor)}>{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Area Chart — Incidents Over Time */}
        <motion.div variants={staggerItem} className="xl:col-span-3 glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-white">Incidents Over Time</span>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5">
              {["7D", "30D", "90D"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors",
                    timeRange === range ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATASETS[timeRange]}>
                <defs>
                  <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                  itemStyle={{ color: "#DC2626", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#DC2626"
                  strokeWidth={1.5}
                  fill="url(#incidentGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#DC2626", stroke: "#0A0B0F", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart — Hourly Distribution */}
        <motion.div variants={staggerItem} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-zinc-400" />
            </div>
            <span className="text-sm font-medium text-white">Hourly Dist.</span>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HOURLY_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#DC2626" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-5">
        {/* Incident History */}
        <motion.div variants={staggerItem} className="glass-card p-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Clock className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-white">Incident History</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-semibold text-red-400 border border-red-500/20">
                {incidents.length || MOCK_INCIDENT_CARDS.length}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {(incidents.length > 0 ? incidents.map((inc) => ({
              id: inc.id,
              type: "Violence Detected",
              camera: "CAM_01_MAIN",
              confidence: Math.round((inc.confidence || 0.85) * 100),
              timestamp: inc.timestamp,
              severity: ((inc.confidence || 0.85) > 0.85 ? "high" : (inc.confidence || 0.85) > 0.7 ? "medium" : "low") as "high" | "medium" | "low",
            })) : MOCK_INCIDENT_CARDS).map((incident, i) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.06] transition-all group cursor-pointer"
              >
                {/* Severity stripe */}
                <div className={cn(
                  "w-1 h-10 rounded-full shrink-0",
                  incident.severity === "high" && "bg-red-500",
                  incident.severity === "medium" && "bg-white",
                  incident.severity === "low" && "bg-zinc-600",
                )} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">{incident.type}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      incident.severity === "high" && "bg-red-500/15 text-red-400",
                      incident.severity === "medium" && "bg-white/15 text-white",
                      incident.severity === "low" && "bg-zinc-500/15 text-zinc-500",
                    )}>
                      {incident.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-500 font-mono">{incident.camera}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-zinc-400">{incident.confidence}%</div>
                  <div className="text-[10px] text-zinc-600 font-mono">{incident.timestamp.split(" ")[1]}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
