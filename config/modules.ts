import type { ElementType } from "react";
import { Container, Cpu, Database, Layers, Terminal } from "lucide-react";

export interface ModulePage {
  title: string;
  href: string;
  badge?: string;
}

export interface ModuleDefinition {
  key: string;
  name: string;
  icon: ElementType;
  color: string;
  badgeColor: string;
  borderColor: string;
  pages: ModulePage[];
}

/**
 * Registro dos módulos e das páginas TSX exibidas no topo do sidebar.
 *
 * As notas não precisam ser cadastradas aqui: elas são descobertas
 * automaticamente em content/<chave-do-modulo>/*.md.
 */
export const MODULES: Record<string, ModuleDefinition> = {
  shell: {
    key: "shell",
    name: "Shell & Linux",
    icon: Terminal,
    color: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/40",
    pages: [
      { title: "Fundamentos Bash", href: "/shell/bash", badge: "Bash" },
      { title: "Comandos Essenciais", href: "/shell/comandos", badge: "CLI" },
      { title: "Scripts & Automação", href: "/shell/scripts", badge: "Scripts" },
    ],
  },
  web: {
    key: "web",
    name: "Desenvolvimento Web",
    icon: Layers,
    color: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    borderColor: "border-blue-500/40",
    pages: [
      { title: "Next.js App Router", href: "/web/nextjs", badge: "Next.js" },
      { title: "React 19 Hooks & Server", href: "/web/react", badge: "React" },
      { title: "Tailwind CSS v4", href: "/web/tailwind", badge: "Tailwind" },
    ],
  },
  devops: {
    key: "devops",
    name: "DevOps & Ferramentas",
    icon: Container,
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    borderColor: "border-cyan-500/40",
    pages: [
      { title: "Docker & Compose", href: "/devops/docker", badge: "Docker" },
      { title: "Git Workflow", href: "/devops/git", badge: "Git" },
      { title: "Linux Servers", href: "/devops/linux", badge: "Linux" },
    ],
  },
  "algoritmos-estrutura-dados": {
    key: "algoritmos-estrutura-dados",
    name: "Algoritmos & Estrutura de Dados",
    icon: Cpu,
    color: "text-purple-400",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    borderColor: "border-purple-500/40",
    pages: [],
  },
  "banco-de-dados-fundamentos": {
    key: "banco-de-dados-fundamentos",
    name: "Banco de Dados - Fundamentos",
    icon: Database,
    color: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/40",
    pages: [],
  },
};
