import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <div
      className={cn(
        "flex items-center select-none group",
        collapsed ? "justify-center gap-0" : "gap-3",
        className
      )}
    >
      {/* Ícone Vetorial Exclusivo TechNotes */}
      <div
        className={cn(
          iconSizes[size],
          "relative shrink-0 rounded-xl flex items-center justify-center p-1.5 transition-all duration-300",
          "bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900",
          "border border-blue-500/30 hover:border-cyan-400/60",
          "shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_22px_rgba(56,189,248,0.35)]",
          "group-hover:scale-105"
        )}
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-emerald-500/10 opacity-75 blur-[2px] group-hover:opacity-100 transition-opacity" />

        {/* SVG Exclusivo: Terminal + Código + Nó de Rede (T & N) */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
        >
          <defs>
            <linearGradient id="tn-gradient-1" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="tn-accent" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Ângulo de Terminal / Prompt ">" */}
          <path
            d="M7 9L14 16L7 23"
            stroke="url(#tn-accent)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Barra inferior de comando / cursor piscante "_" estilizado como bloco */}
          <path
            d="M17 22H25"
            stroke="url(#tn-gradient-1)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Nó de Conexão Superior / Ponto de rede */}
          <circle cx="21" cy="11" r="2.25" fill="#38BDF8" className="animate-pulse" />
          <path
            d="M18.5 13.5L16 16"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </svg>
      </div>

      {/* Tipografia de Marca */}
      {!collapsed && (
        <div className="overflow-hidden transition-opacity duration-200">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Tech<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Notes</span>
            </span>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.2 rounded font-semibold tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 tracking-wide font-mono flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>developer dochub</span>
          </p>
        </div>
      )}
    </div>
  );
}
