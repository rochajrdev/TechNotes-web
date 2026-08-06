import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ collapsed = false, className, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={cn(
        "flex items-center select-none group",
        collapsed ? "justify-center gap-0" : "gap-3",
        className
      )}
    >
      {/* Container do Ícone Vetorial */}
      <div
        className={cn(
          iconSizes[size],
          "relative shrink-0 rounded-xl flex items-center justify-center p-1.5 transition-all duration-300",
          "bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900",
          "border border-cyan-500/40 hover:border-cyan-400",
          "shadow-[0_0_18px_rgba(56,189,248,0.2)] group-hover:shadow-[0_0_28px_rgba(56,189,248,0.45)]",
          "group-hover:scale-105"
        )}
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-emerald-500/15 opacity-80 blur-[2px] group-hover:opacity-100 transition-opacity" />

        {/* SVG Exclusivo Livro de Código Nítido (Base 100x100) */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]"
        >
          {/* Tag de Código Topo: < > */}
          <path
            d="M 37 14 L 27 22 L 37 30"
            stroke="#38BDF8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 63 14 L 73 22 L 63 30"
            stroke="#38BDF8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Camada Traseira de Contorno Externa da Capa */}
          <path
            d="M 14 42 L 14 78 C 30 70 44 73 50 82 C 56 73 70 70 86 78 L 86 42"
            stroke="#1E3A8A"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Páginas do Livro Principal */}
          <path
            d="M 20 38 L 20 74 C 32 68 45 70 50 80 C 55 70 68 68 80 74 L 80 38 C 68 32 55 34 50 37 C 45 34 32 32 20 38 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lombada Central */}
          <path
            d="M 50 37 L 50 80"
            stroke="#38BDF8"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* PÁGINA ESQUERDA: Chaves e Linhas */}
          <path
            d="M 30 46 C 28 46 28 47.5 28 49 C 28 50.5 26.5 51 25.5 51 C 26.5 51 28 51.5 28 53 C 28 54.5 28 56 30 56"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 35 48 H 44" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <path d="M 35 53 H 42" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

          <path
            d="M 42 61 C 44 61 44 62.5 44 64 C 44 65.5 45.5 66 46.5 66 C 45.5 66 44 66.5 44 68 C 44 69.5 44 71 42 71"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 27 63 H 37" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

          {/* PÁGINA DIREITA: Código, Colchete ] e Ponto e Vírgula ; */}
          <path d="M 56 48 H 71" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <path d="M 56 53 H 66" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

          {/* Colchete ] */}
          <path
            d="M 70 58 H 74 V 66 H 70"
            stroke="#38BDF8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path d="M 56 62 H 64" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

          {/* Ponto e Vírgula ; */}
          <circle cx="68" cy="68" r="2.5" fill="#38BDF8" />
          <path
            d="M 68 71 C 68 74 65.5 75.5 64 76"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Tipografia da Marca */}
      {!collapsed && (
        <div className="overflow-hidden transition-opacity duration-200">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Tech<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Notes</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 tracking-wide font-mono flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>developer dochub</span>
          </p>
        </div>
      )}
    </div>
  );
}
