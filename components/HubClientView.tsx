"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Terminal,
  Layers,
  Container,
  Database,
  Code2,
  Cpu,
  Server,
  ArrowRight,
  Sparkles,
  FileText,
  Command,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import type { NoteMetadata } from "@/lib/content";
import { getNoteHref } from "@/lib/note-path";

interface HubClientViewProps {
  notes: NoteMetadata[];
}

interface CategoryCardData {
  id: string;
  name: string;
  categorySlug: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  badgeColor: string;
  borderColor: string;
  glowHover: string;
  firstLessonHref: string;
  tags: string[];
  gridSpan: string;
  previewType: "docker" | "react" | "bash" | "database" | "algorithm" | "generic";
}

const STATIC_TRACKS_CONFIG: Record<
  string,
  {
    name: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    badgeColor: string;
    borderColor: string;
    glowHover: string;
    baseLessons: { title: string; href: string }[];
    defaultTags: string[];
    gridSpan: string;
    previewType: "docker" | "react" | "bash" | "database" | "algorithm" | "generic";
  }
> = {
  devops: {
    name: "DevOps & Ferramentas",
    description:
      "Containers Docker, orquestração de microsserviços, fluxos profissionais de Git e administração de servidores Linux.",
    icon: Container,
    iconColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    borderColor: "border-cyan-500/30",
    glowHover: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    baseLessons: [
      { title: "Docker & Compose", href: "/devops/docker" },
      { title: "Git Workflow", href: "/devops/git" },
      { title: "Linux Servers", href: "/devops/linux" },
    ],
    defaultTags: ["docker", "kubernetes", "git", "linux", "ci-cd"],
    gridSpan: "md:col-span-12 lg:col-span-7",
    previewType: "docker",
  },
  web: {
    name: "Desenvolvimento Web",
    description:
      "Construção de aplicações full-stack modernas com Next.js 16 (App Router), React 19 Server Components e Tailwind CSS v4.",
    icon: Layers,
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    borderColor: "border-blue-500/30",
    glowHover: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    baseLessons: [
      { title: "Next.js App Router", href: "/web/nextjs" },
      { title: "React 19 Hooks & Server", href: "/web/react" },
      { title: "Tailwind CSS v4", href: "/web/tailwind" },
    ],
    defaultTags: ["nextjs", "react", "tailwind", "frontend", "ssr"],
    gridSpan: "md:col-span-12 lg:col-span-5",
    previewType: "react",
  },
  banco: {
    name: "Banco de dados - Fundamentos",
    description:
      "Fundamentos teóricos e práticos de bancos de dados: evolução histórica, arquitetura, atores e níveis de abstração.",
    icon: Database,
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    borderColor: "border-amber-500/30",
    glowHover: "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    baseLessons: [],
    defaultTags: ["banco-de-dados", "sql", "modelagem", "abstracao"],
    gridSpan: "md:col-span-6 lg:col-span-4",
    previewType: "database",
  },
  algoritmos: {
    name: "Algoritmos e Estrutura de Dados",
    description:
      "Lógica computacional, análise de complexidade, estruturas de dados como vetores (arrays) e resolução de problemas.",
    icon: Code2,
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    borderColor: "border-violet-500/30",
    glowHover: "hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    baseLessons: [],
    defaultTags: ["algoritmos", "estrutura-de-dados", "arrays", "logica"],
    gridSpan: "md:col-span-6 lg:col-span-4",
    previewType: "algorithm",
  },
  shell: {
    name: "Shell & Linux",
    description:
      "Domínio da linha de comando em sistemas Unix, automação com scripts Bash, pipelines, manipulação de processos e cheatsheets.",
    icon: Terminal,
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/30",
    glowHover: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    baseLessons: [
      { title: "Fundamentos Bash", href: "/shell/bash" },
      { title: "Comandos Essenciais", href: "/shell/comandos" },
      { title: "Scripts & Automação", href: "/shell/scripts" },
    ],
    defaultTags: ["bash", "linux", "terminal", "cli", "automacao"],
    gridSpan: "md:col-span-12 lg:col-span-4",
    previewType: "bash",
  },
};

function BentoCardPreview({ type }: { type: CategoryCardData["previewType"] }) {
  if (type === "docker") {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60 text-zinc-500 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-rose-500/60" />
          <span className="w-2 h-2 rounded-full bg-amber-500/60" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="ml-1 text-zinc-400">docker-compose.yml</span>
        </div>
        <div className="text-zinc-400">
          <span className="text-cyan-400">services:</span>
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;</span>
          <span className="text-blue-300">api:</span>
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="text-zinc-400">image:</span>{" "}
          <span className="text-emerald-400">&quot;node:20-alpine&quot;</span>
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="text-zinc-400">ports:</span>{" "}
          <span className="text-amber-300">[&quot;3000:3000&quot;]</span>
        </div>
      </div>
    );
  }

  if (type === "react") {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60 text-zinc-500 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-rose-500/60" />
          <span className="w-2 h-2 rounded-full bg-amber-500/60" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="ml-1 text-zinc-400">page.tsx</span>
        </div>
        <div className="text-zinc-400">
          <span className="text-purple-400">export default async function</span>{" "}
          <span className="text-blue-300">Page</span>() &#123;
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;</span>
          <span className="text-purple-400">return</span> (
          <span className="text-cyan-400">&lt;ServerComponent /&gt;</span>);
          <br />
          &#125;
        </div>
      </div>
    );
  }

  if (type === "bash") {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60 text-zinc-500 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span className="text-zinc-400">bash terminal</span>
        </div>
        <div className="text-zinc-400 space-y-1">
          <div>
            <span className="text-emerald-400">$</span>{" "}
            <span className="text-zinc-300">chmod +x script.sh</span>
          </div>
          <div>
            <span className="text-emerald-400">$</span>{" "}
            <span className="text-cyan-300">./script.sh --build</span>
          </div>
          <div className="text-emerald-400/80 text-[10px]">✓ process ready</div>
        </div>
      </div>
    );
  }

  if (type === "database") {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60 text-zinc-500 text-[10px]">
          <Database className="w-3 h-3 text-amber-400" />
          <span className="text-zinc-400">schema.sql</span>
        </div>
        <div className="text-zinc-400">
          <span className="text-amber-400">CREATE TABLE</span>{" "}
          <span className="text-blue-300">users</span> (
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;</span>id{" "}
          <span className="text-amber-300">UUID PRIMARY KEY</span>,
          <br />
          <span className="text-zinc-600">&nbsp;&nbsp;</span>created_at{" "}
          <span className="text-amber-300">TIMESTAMP</span>
          <br />
          );
        </div>
      </div>
    );
  }

  if (type === "algorithm") {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] leading-relaxed shadow-inner overflow-hidden select-none">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-800/60 text-zinc-500 text-[10px]">
          <Code2 className="w-3 h-3 text-violet-400" />
          <span className="text-zinc-400">array_structure</span>
        </div>
        <div className="text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-violet-300 border border-zinc-700 text-[10px]">
              [0]
            </span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-violet-300 border border-zinc-700 text-[10px]">
              [1]
            </span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-violet-300 border border-zinc-700 text-[10px]">
              [2]
            </span>
            <span className="text-zinc-500 text-[10px]">→ O(1) Access</span>
          </div>
          <div className="text-zinc-500 text-[10px]">Binary search & sort</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-[11px] text-zinc-400 shadow-inner">
      <span className="text-zinc-500">docs //</span> notas técnicas estruturadas
    </div>
  );
}

export function HubClientView({ notes }: HubClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Constrói a lista dinâmica de categorias para o Bento Grid
  const categoriesList = React.useMemo<CategoryCardData[]>(() => {
    const cards: CategoryCardData[] = [];
    const processedSlugs = new Set<string>();

    // 1. Processa trilhas base configuradas
    Object.entries(STATIC_TRACKS_CONFIG).forEach(([key, config]) => {
      let matchingNotes: NoteMetadata[] = [];
      let rawCategorySlug = key;

      if (key === "devops" || key === "web" || key === "shell") {
        processedSlugs.add(key.toLowerCase());
        matchingNotes = notes.filter(
          (n) => n.categorySlug.toLowerCase().trim() === key.toLowerCase()
        );
      } else if (key === "banco") {
        const found = notes.find((n) =>
          n.categorySlug.toLowerCase().includes("banco")
        );
        if (found) {
          rawCategorySlug = found.categorySlug;
          processedSlugs.add(rawCategorySlug.toLowerCase().trim());
          matchingNotes = notes.filter(
            (n) => n.categorySlug.toLowerCase().trim() === rawCategorySlug.toLowerCase().trim()
          );
        }
      } else if (key === "algoritmos") {
        const found = notes.find((n) =>
          n.categorySlug.toLowerCase().includes("algorit")
        );
        if (found) {
          rawCategorySlug = found.categorySlug;
          processedSlugs.add(rawCategorySlug.toLowerCase().trim());
          matchingNotes = notes.filter(
            (n) => n.categorySlug.toLowerCase().trim() === rawCategorySlug.toLowerCase().trim()
          );
        }
      }

      const dynamicLessons = matchingNotes.map((n) => ({
        title: n.title,
        href: getNoteHref(n),
      }));

      const allLessons = [...config.baseLessons, ...dynamicLessons];
      const firstHref =
        allLessons[0]?.href ||
        (matchingNotes[0]
          ? getNoteHref(matchingNotes[0])
          : "/");

      const tags = Array.from(
        new Set([
          ...config.defaultTags,
          ...matchingNotes.flatMap((n) => n.tags.map((t) => t.replace(/^#/, ""))),
        ])
      );

      cards.push({
        id: key,
        name: config.name,
        categorySlug: rawCategorySlug,
        description: config.description,
        icon: config.icon,
        iconColor: config.iconColor,
        badgeColor: config.badgeColor,
        borderColor: config.borderColor,
        glowHover: config.glowHover,
        firstLessonHref: firstHref,
        tags: tags.slice(0, 5),
        gridSpan: config.gridSpan,
        previewType: config.previewType,
      });
    });

    // 2. Processa novas categorias dinâmicas criadas em content/
    const customGroups = new Map<string, NoteMetadata[]>();
    notes.forEach((note) => {
      const key = note.categorySlug.toLowerCase().trim();
      if (!processedSlugs.has(key)) {
        const list = customGroups.get(key) || [];
        list.push(note);
        customGroups.set(key, list);
      }
    });

    customGroups.forEach((groupNotes, key) => {
      const rawCategory = groupNotes[0]?.categorySlug || key;
      const categoryName = groupNotes[0]?.category || rawCategory;

      const sortedNotes = [...groupNotes].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" })
      );

      const firstNote = sortedNotes[0];
      const firstHref = firstNote
        ? getNoteHref(firstNote)
        : "/";

      const allTags = Array.from(
        new Set(groupNotes.flatMap((n) => n.tags.map((t) => t.replace(/^#/, ""))))
      );

      cards.push({
        id: key,
        name: categoryName,
        categorySlug: rawCategory,
        description: `Notas técnicas, referências e documentação estruturada sobre ${categoryName}.`,
        icon: BookOpen,
        iconColor: "text-purple-400",
        badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        borderColor: "border-purple-500/30",
        glowHover: "hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
        firstLessonHref: firstHref,
        tags: allTags.slice(0, 5),
        gridSpan: "md:col-span-6 lg:col-span-6",
        previewType: "generic",
      });
    });

    return cards;
  }, [notes]);

  // Filtro de busca
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const query = searchQuery.toLowerCase().trim();

    return categoriesList.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [categoriesList, searchQuery]);

  return (
    <div className="w-full space-y-8 pb-20 pt-2">
      {/* Header Superior Principal */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <Link href="/" className="hover:opacity-90 transition-opacity inline-block">
            <Logo size="md" />
          </Link>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Hub agregador de anotações técnicas, cheatsheets e referências dinâmicas para desenvolvimento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Stats Badges */}
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <span>{notes.length} Notas</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-purple-400" />
              <span>{categoriesList.length} Trilhas</span>
            </div>
          </div>

          {/* Busca Rápida */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por categoria, tecnologia ou tag..."
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-[10px] font-mono text-zinc-400 select-none">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            )}
          </div>
        </div>
      </header>

      {/* Bento Grid Principal estilo Pinterest / Apple Bento */}
      <section>
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nenhuma categoria encontrada</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Não encontramos nenhuma categoria correspondente a &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-cyan-400 hover:text-cyan-300"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <Link
                  key={category.id}
                  href={category.firstLessonHref}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-md transition-all duration-300",
                    "hover:-translate-y-1 hover:bg-zinc-900/70 hover:shadow-2xl",
                    category.gridSpan,
                    category.glowHover
                  )}
                >
                  {/* Fundo com gradiente sutil no hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                  <div className="relative space-y-5">
                    {/* Topo: Ícone e Botão de Acesso */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-105",
                          category.badgeColor,
                          category.borderColor
                        )}
                      >
                        <CategoryIcon className={cn("h-6 w-6", category.iconColor)} />
                      </div>

                      <div className="h-8 w-8 rounded-full border border-zinc-800 bg-zinc-950/60 flex items-center justify-center text-zinc-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Título & Descrição */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {category.description}
                      </p>
                    </div>

                    {/* Visual Preview Interativo do Bento */}
                    <div className="pt-1">
                      <BentoCardPreview type={category.previewType} />
                    </div>
                  </div>

                  {/* Rodapé: Tags Técnicas */}
                  <div className="relative pt-4 mt-5 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {category.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded-md border border-zinc-800/80 group-hover:border-zinc-700 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
