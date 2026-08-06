"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  BookOpen,
  Terminal,
  Layers,
  Container,
  Database,
  Code2,
  Cpu,
  Server,
  ArrowRight,
  FolderTree,
  CheckCircle2,
  Clock,
  Play,
  GraduationCap,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import type { NoteMetadata } from "@/lib/content";

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
  lessonsCount: number;
  firstLessonHref: string;
  tags: string[];
  lessonTitles: string[];
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
    glowHover: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10",
    baseLessons: [
      { title: "Docker & Compose", href: "/devops/docker" },
      { title: "Git Workflow", href: "/devops/git" },
      { title: "Linux Servers", href: "/devops/linux" },
    ],
    defaultTags: ["docker", "kubernetes", "git", "linux", "ci-cd"],
  },
  web: {
    name: "Desenvolvimento Web",
    description:
      "Construção de aplicações full-stack modernas com Next.js 16 (App Router), React 19 Server Components e Tailwind CSS v4.",
    icon: Layers,
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    borderColor: "border-blue-500/30",
    glowHover: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/10",
    baseLessons: [
      { title: "Next.js App Router", href: "/web/nextjs" },
      { title: "React 19 Hooks & Server", href: "/web/react" },
      { title: "Tailwind CSS v4", href: "/web/tailwind" },
    ],
    defaultTags: ["nextjs", "react", "tailwind", "frontend", "ssr"],
  },
  shell: {
    name: "Shell & Linux",
    description:
      "Domínio da linha de comando em sistemas Unix, automação com scripts Bash, pipelines, manipulação de processos e cheatsheets.",
    icon: Terminal,
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/30",
    glowHover: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10",
    baseLessons: [
      { title: "Fundamentos Bash", href: "/shell/bash" },
      { title: "Comandos Essenciais", href: "/shell/comandos" },
      { title: "Scripts & Automação", href: "/shell/scripts" },
    ],
    defaultTags: ["bash", "linux", "terminal", "cli", "automacao"],
  },
};

export function HubClientView({ notes }: HubClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Constrói a lista completa e dinâmica de categorias/trilhas para escolha na raiz
  const categoriesList = React.useMemo<CategoryCardData[]>(() => {
    const cards: CategoryCardData[] = [];
    const processedSlugs = new Set<string>();

    // 1. Processa trilhas base pré-configuradas (devops, web, shell)
    Object.entries(STATIC_TRACKS_CONFIG).forEach(([key, config]) => {
      processedSlugs.add(key.toLowerCase());

      const matchingNotes = notes.filter(
        (n) => n.categorySlug.toLowerCase().trim() === key.toLowerCase()
      );

      const dynamicLessons = matchingNotes.map((n) => ({
        title: n.title,
        href: `/notes/${encodeURIComponent(n.categorySlug)}/${encodeURIComponent(n.slug)}`,
      }));

      const allLessons = [...config.baseLessons, ...dynamicLessons];
      const firstHref = allLessons[0]?.href || `/devops/docker`;

      const tags = Array.from(
        new Set([
          ...config.defaultTags,
          ...matchingNotes.flatMap((n) => n.tags.map((t) => t.replace(/^#/, ""))),
        ])
      );

      cards.push({
        id: key,
        name: config.name,
        categorySlug: key,
        description: config.description,
        icon: config.icon,
        iconColor: config.iconColor,
        badgeColor: config.badgeColor,
        borderColor: config.borderColor,
        glowHover: config.glowHover,
        lessonsCount: allLessons.length,
        firstLessonHref: firstHref,
        tags: tags.slice(0, 5),
        lessonTitles: allLessons.map((l) => l.title),
      });
    });

    // 2. Processa todas as categorias customizadas criadas na pasta content/
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

      // Ordena aulas
      const sortedNotes = [...groupNotes].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" })
      );

      const firstNote = sortedNotes[0];
      const firstHref = firstNote
        ? `/notes/${encodeURIComponent(firstNote.categorySlug)}/${encodeURIComponent(firstNote.slug)}`
        : "/";

      // Detecta ícone e cores temáticas
      let Icon = BookOpen;
      let iconColor = "text-purple-400";
      let badgeColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
      let borderColor = "border-purple-500/30";
      let glowHover = "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10";
      let description = `Trilha completa de ${categoryName} com guias técnicos, códigos práticos e anotações estruturadas.`;

      const normalized = key.toLowerCase();
      if (normalized.includes("banco") || normalized.includes("sql") || normalized.includes("dados")) {
        Icon = Database;
        iconColor = "text-amber-400";
        badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
        borderColor = "border-amber-500/30";
        glowHover = "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10";
        description =
          "Fundamentos de banco de dados: evolução histórica, arquitetura, atores de dados e níveis de abstração.";
      } else if (normalized.includes("algorit") || normalized.includes("estrutura") || normalized.includes("code")) {
        Icon = Code2;
        iconColor = "text-violet-400";
        badgeColor = "bg-violet-500/10 text-violet-300 border-violet-500/30";
        borderColor = "border-violet-500/30";
        glowHover = "group-hover:border-violet-500/50 group-hover:shadow-violet-500/10";
        description =
          "Lógica computacional, análise de complexidade, estruturas de dados como vetores (arrays) e resolução de algoritmos.";
      }

      const allTags = Array.from(
        new Set(groupNotes.flatMap((n) => n.tags.map((t) => t.replace(/^#/, ""))))
      );

      cards.push({
        id: key,
        name: categoryName,
        categorySlug: rawCategory,
        description,
        icon: Icon,
        iconColor,
        badgeColor,
        borderColor,
        glowHover,
        lessonsCount: sortedNotes.length,
        firstLessonHref: firstHref,
        tags: allTags.slice(0, 5),
        lessonTitles: sortedNotes.map((n) => n.title),
      });
    });

    return cards;
  }, [notes]);

  // Filtra as categorias com base na busca
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const query = searchQuery.toLowerCase().trim();

    return categoriesList.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        cat.lessonTitles.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [categoriesList, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-2">
      {/* Header Superior Principal */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Busca Rápida de Trilhas */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por trilha, tecnologia ou tag..."
            className="w-full pl-10 pr-8 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Grid de Categorias */}
      <section className="space-y-6">

        {/* Grid de Cards de Categorias */}
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nenhuma trilha encontrada</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Não encontramos nenhuma categoria correspondente ao termo &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-cyan-400 hover:text-cyan-300"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <Link
                  key={category.id}
                  href={category.firstLessonHref}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:bg-zinc-900/70 hover:shadow-xl",
                    category.glowHover
                  )}
                >
                  <div className="space-y-4">
                    {/* Topo do Card: Ícone e Badge de Aulas */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105 duration-300",
                          category.badgeColor,
                          category.borderColor
                        )}
                      >
                        <CategoryIcon className={cn("h-6 w-6", category.iconColor)} />
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border border-zinc-800 bg-zinc-950/80 text-zinc-300">
                        <Play className="h-3 w-3 text-cyan-400 fill-cyan-400/20" />
                        <span>{category.lessonsCount} {category.lessonsCount === 1 ? "aula" : "aulas"}</span>
                      </span>
                    </div>

                    {/* Título & Descrição */}
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {category.name}
                      </h2>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {category.description}
                      </p>
                    </div>


                  </div>

                  {/* Rodapé do Card: Tags e Ação */}
                  <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {category.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-zinc-500 bg-zinc-950/60 px-1.5 py-0.5 rounded border border-zinc-800/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0">
                      <span>Acessar</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
