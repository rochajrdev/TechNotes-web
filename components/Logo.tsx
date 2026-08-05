import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex items-center select-none group",
        collapsed ? "justify-center gap-0" : "gap-3",
        className
      )}
    >
      {/* Ícone Vetorial Inspirado em Livro Técnico + Código */}
      <div
        className={cn(
          iconSizes[size],
          "relative shrink-0 rounded-xl flex items-center justify-center p-1 transition-all duration-300",
          "bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900",
          "border border-blue-500/30 hover:border-cyan-400/60",
          "shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_24px_rgba(56,189,248,0.4)]",
          "group-hover:scale-105"
        )}
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-emerald-500/10 opacity-75 blur-[2px] group-hover:opacity-100 transition-opacity" />

        {/* SVG Livro Aberto com Tags e Código */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]"
        >
          <defs>
            <linearGradient id="tn-brand-grad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="tn-line-grad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Tag de Código Topo: < > */}
          <path
            d="M 23 9 L 17 14 L 23 19"
            stroke="url(#tn-line-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 41 9 L 47 14 L 41 19"
            stroke="url(#tn-line-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Camada Traseira / Capa Externa do Livro */}
          <path
            d="M 7 28 L 7 51 C 18 45 28 47 32 55 C 36 47 46 45 57 51 L 57 28"
            stroke="url(#tn-brand-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />

          {/* Livro Aberto Principal - Páginas */}
          <path
            d="M 12 25 L 12 48 C 21 43 28 45 32 53 C 36 45 43 43 52 48 L 52 25 C 43 20 36 22 32 24 C 28 22 21 20 12 25 Z"
            stroke="url(#tn-brand-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Linha Central do Livro (Lombada) */}
          <path
            d="M 32 24 L 32 53"
            stroke="url(#tn-brand-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* PÁGINA ESQUERDA: Chaves e Código */}
          {/* Chave { */}
          <path
            d="M 17 30 C 15.5 30 15.5 31 15.5 32 C 15.5 33 14.5 33.5 13.5 33.5 C 14.5 33.5 15.5 34 15.5 35 C 15.5 36 15.5 37 17 37"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Linhas de Código */}
          <path d="M 19 31 H 26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 19 34 H 24" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Chave } */}
          <path
            d="M 26 40 C 27.5 40 27.5 41 27.5 42 C 27.5 43 28.5 43.5 29.5 43.5 C 28.5 43.5 27.5 44 27.5 45 C 27.5 46 27.5 47 26 47"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M 16 41 H 23" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 16 44 H 22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* PÁGINA DIREITA: Código, Colchete ] e Ponto e vírgula ; */}
          <path d="M 37 31 H 46" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 37 34 H 43" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Colchete ] */}
          <path d="M 45 37 H 47.5 V 42 H 45" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M 37 39 H 42" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 37 43 H 45" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Ponto e Vírgula ; */}
          <circle cx="43" cy="46" r="1.2" fill="#38BDF8" />
          <path d="M 43 47.5 C 43 49 41.5 50 40.5 50.5" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
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
