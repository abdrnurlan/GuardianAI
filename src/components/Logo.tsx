import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string; // For sizing and positioning
  glow?: boolean; // Optional glow effect
}

export default function Logo({ className, glow = false }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {glow && (
        <div className="absolute inset-0 bg-[#DC2626] opacity-40 blur-lg rounded-full" />
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#DC2626] relative z-10"
      >
        {/* The "Neural Spark" - A custom geometric shape */}
        <path
          d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        {/* Core Node */}
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
}
