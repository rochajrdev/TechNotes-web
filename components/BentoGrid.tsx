"use client";

import * as React from "react";
import Link from "next/link";
import {
  Terminal,
  Layers,
  FolderGit2,
  Container,
  Cpu,
  ArrowUpRight,
  Code2,
  Workflow,
  Sparkles,
  Zap,
} from "lucide-react";
import { BorderBeam } from "./magicui/border-beam";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface TopicCard {
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  href: string;
  tags: string[];
  gradient: string;
  borderBeam?: boolean;
  featured?: boolean;
}

const topics: TopicCard[] = [
  {
    title: "Fundamentos Shell & Bash",
    category: "Shell Scripting",
    description:
      "Domine manipulação de streams (stdin/stdout), pipes, redirecionamentos, permissões chmod/chown e scripts de automação robustos.",
    icon: Terminal,
    href: "/shell/bash",
    tags: ["#bash", "#linux", "#pipes", "#chmod"],
    gradient: "from-emerald-500/10 via-zinc-900 to-zinc-950",
    borderBeam: true,
    featured: true,
  },
  {
    title: "Next.js 16 & Server Components",
    category: "Frontend Moderno",
    description:
      "Arquitetura App Router, renderização no servidor (RSC), otimizações de build, Server Actions e caching granular.",
    icon: Layers,
    href: "/web/nextjs",
    tags: ["#nextjs", "#rsc", "#react19"],
    gradient: "from-blue-500/10 via-zinc-900 to-zinc-950",
  },
  {
    title: "Git Workflow & Branching",
    category: "Controle de Versão",
    description:
      "Comandos avançados, rebase interativo, squash de commits, cherry-pick e resolução limpa de conflitos em equipe.",
    icon: FolderGit2,
    href: "/devops/git",
    tags: ["#git", "#rebase", "#workflow"],
    gradient: "from-amber-500/10 via-zinc-900 to-zinc-950",
  },
  {
    title: "Docker & Containerização",
    category: "DevOps & Infra",
    description:
      "Criação de Dockerfiles multi-stage otimizados, orquestração com Docker Compose, redes e gerenciamento de volumes.",
    icon: Container,
    href: "/devops/docker",
    tags: ["#docker", "#compose", "#containers"],
    gradient: "from-cyan-500/10 via-zinc-900 to-zinc-950",
  },
  {
    title: "Tailwind CSS v4 Engine",
    category: "Design System",
    description:
      "Configuração de temas inline, Lightning CSS, variáveis nativas e estilização utilitária de alta performance.",
    icon: Zap,
    href: "/web/tailwind",
    tags: ["#tailwind", "#css", "#design"],
    gradient: "from-purple-500/10 via-zinc-900 to-zinc-950",
  },
];

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic, index) => {
        const Icon = topic.icon;
        const isMain = topic.featured;

        return (
          <Link
            key={topic.title}
            href={topic.href}
            className={cn(
              "group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-blue-500/5",
              isMain && "md:col-span-2 lg:col-span-2 bg-gradient-to-br"
            )}
          >
            {/* Optional Border Beam for the featured card */}
            {topic.borderBeam && (
              <BorderBeam
                size={250}
                duration={12}
                colorFrom="#3b82f6"
                colorTo="#10b981"
              />
            )}

            <div>
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-100 group-hover:scale-105 group-hover:border-blue-500/40 transition-transform">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                      {topic.category}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                <div className="h-7 w-7 rounded-full bg-zinc-800/60 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3 mb-6">
                {topic.description}
              </p>
            </div>

            {/* Footer Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
