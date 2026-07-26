"use client";

import * as React from "react";
import { Terminal as TerminalIcon, Play, RefreshCw, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommandScenario {
  id: string;
  name: string;
  command: string;
  output: string[];
  explanation: string;
}

const scenarios: CommandScenario[] = [
  {
    id: "bash-pipes",
    name: "Bash: Pipes & Filtros",
    command: "cat /var/log/nginx/access.log | grep '404' | awk '{print $7}' | sort | uniq -c",
    output: [
      "    42 /api/v1/unknown-route",
      "    18 /favicon.ico",
      "     9 /wp-login.php (tentativa bloqueada)",
      "✓ Pipeline executado: 69 requisições 404 agrupadas",
    ],
    explanation: "Filtra acessos 404 no log, extrai as URLs e conta as ocorrências únicas.",
  },
  {
    id: "git-rebase",
    name: "Git: Rebase Interativo",
    command: "git checkout feature/auth && git fetch origin && git rebase -i origin/main",
    output: [
      "Auto-merging app/auth/page.tsx",
      "[detached HEAD 9f21ab4] feat: implement JWT cookie verification",
      "Successfully rebased and updated refs/heads/feature/auth.",
      "✓ Branch sincronizada com a main sem commits de merge extras",
    ],
    explanation: "Atualiza sua branch de feature mantendo o histórico de commits linear e limpo.",
  },
  {
    id: "docker-clean",
    name: "Docker: Limpeza Prune",
    command: "docker system prune -a --volumes",
    output: [
      "Deleted Containers: 4 stopped containers",
      "Deleted Images: 12 untagged images",
      "Deleted Volumes: 2 orphaned volumes",
      "✓ Espaço total liberado: 4.82 GB",
    ],
    explanation: "Remove todos os containers parados, imagens órfãs e volumes não utilizados.",
  },
  {
    id: "nextjs-build",
    name: "Next.js: Build Otimizado",
    command: "npm run build -- --profile",
    output: [
      "▲ Next.js 16.2.9 (App Router)",
      "✓ Compiled successfully in 1.4s",
      "○ / (Static SSG) - 1.2 kB",
      "● /shell/[slug] (SSG Generated) - 2.4 kB",
      "✓ Zero JavaScript extra enviado aos clientes!",
    ],
    explanation: "Gera páginas estáticas ultrarrápidas com React Server Components.",
  },
];

export function AnimatedTerminal() {
  const [selectedId, setSelectedId] = React.useState<string>("bash-pipes");
  const [step, setStep] = React.useState<number>(0);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);

  const activeScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setStep(0);
    setIsTyping(true);
  };

  React.useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setStep(1);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedId]);

  return (
    <div className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl shadow-blue-500/10 overflow-hidden font-mono text-xs">
      {/* Top bar with tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 bg-zinc-900/80 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 ml-1">
            <TerminalIcon className="h-3.5 w-3.5 text-blue-400" />
            technotes-shell@archlinux
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-lg border border-zinc-800/60 overflow-x-auto">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelect(scenario.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] transition-all whitespace-nowrap",
                selectedId === scenario.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              )}
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="p-5 space-y-4 min-h-[220px] bg-gradient-to-b from-zinc-950 to-zinc-950/90">
        {/* Command line */}
        <div className="flex items-start gap-2 text-zinc-100 text-sm">
          <span className="text-emerald-400 select-none font-bold">➜</span>
          <span className="text-blue-400 select-none">~</span>
          <span className="text-zinc-500 select-none">$</span>
          <div className="flex-1 text-zinc-100 font-semibold break-all">
            {activeScenario.command}
            {isTyping && (
              <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse align-middle" />
            )}
          </div>
        </div>

        {/* Output section with animation */}
        <AnimatePresence mode="wait">
          {!isTyping && (
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-1 pl-4 border-l-2 border-zinc-800 text-zinc-300 text-xs"
            >
              {activeScenario.output.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "leading-relaxed",
                    line.startsWith("✓")
                      ? "text-emerald-400 font-semibold"
                      : line.startsWith("▲")
                      ? "text-blue-400"
                      : "text-zinc-400"
                  )}
                >
                  {line}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Explanation Callout */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-zinc-300 font-medium">Conceito: </strong>
              {activeScenario.explanation}
            </span>
          </div>

          <button
            onClick={() => handleSelect(selectedId)}
            className="flex items-center gap-1 text-zinc-500 hover:text-blue-400 transition-colors shrink-0 ml-2"
            title="Reexecutar comando"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Reexecutar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
