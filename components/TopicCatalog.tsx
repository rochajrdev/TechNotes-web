"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Terminal,
  Layers,
  Database,
  Container,
  Cpu,
  Server,
  Code2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteMetadata } from "@/lib/content";

export interface CatalogTopic {
  id: string;
  title: string;
  description: string;
  docsCount: number | string;
  iconType: "text" | "icon";
  iconText?: string;
  iconComponent?: React.ElementType;
  iconColor: string;
  href: string;
  categoryKey?: string;
  featuredCollection?: string;
  featuredCollectionHref?: string;
  tags: string[];
  popularity: number;
}

const DEFAULT_TOPICS: CatalogTopic[] = [
  {
    id: "javascript",
    title: "JavaScript",
    description:
      "Conceitos fundamentais da linguagem, recursos ES6+, programação assíncrona e manipulação do DOM.",
    docsCount: "124 Docs",
    iconType: "text",
    iconText: "JS",
    iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    href: "/web/javascript",
    categoryKey: "web",
    tags: ["javascript", "es6", "async", "dom"],
    popularity: 98,
  },
  {
    id: "nodejs",
    title: "Node.js",
    description:
      "Execução server-side, arquitetura do event loop, streams, buffers e gerenciamento de pacotes.",
    docsCount: "89 Docs",
    iconType: "icon",
    iconComponent: Server,
    iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    href: "/web/nodejs",
    categoryKey: "web",
    tags: ["node", "backend", "streams", "event-loop"],
    popularity: 92,
  },
  {
    id: "python",
    title: "Python",
    description:
      "Estruturas de dados, decorators, generators e utilização abrangente da biblioteca padrão.",
    docsCount: "210 Docs",
    iconType: "icon",
    iconComponent: Code2,
    iconColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    href: "/web/python",
    categoryKey: "web",
    featuredCollection: "Data Science Fundamentals",
    featuredCollectionHref: "/notes/web/python-data-science",
    tags: ["python", "data-science", "algorithms"],
    popularity: 99,
  },
  {
    id: "csharp",
    title: "C# & .NET",
    description:
      "LINQ, tarefas assíncronas, gerenciamento de memória e padrões de arquitetura corporativa.",
    docsCount: "156 Docs",
    iconType: "icon",
    iconComponent: Cpu,
    iconColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    href: "/web/csharp",
    categoryKey: "web",
    tags: ["csharp", "dotnet", "linq", "enterprise"],
    popularity: 88,
  },
  {
    id: "sql",
    title: "SQL",
    description:
      "Consultas complexas, estratégias de indexação, normalização de dados e otimização de performance.",
    docsCount: "94 Docs",
    iconType: "icon",
    iconComponent: Database,
    iconColor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    href: "/devops/sql",
    categoryKey: "devops",
    tags: ["sql", "postgres", "queries", "indexing"],
    popularity: 90,
  },
  {
    id: "nextjs",
    title: "Next.js 16 & React 19",
    description:
      "App Router, Server Components (RSC), Server Actions, Suspense streaming e caching granular.",
    docsCount: "68 Docs",
    iconType: "icon",
    iconComponent: Layers,
    iconColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    href: "/web/nextjs",
    categoryKey: "web",
    featuredCollection: "Next.js Fullstack Architecture",
    featuredCollectionHref: "/web/nextjs",
    tags: ["nextjs", "react", "fullstack", "rsc"],
    popularity: 96,
  },
  {
    id: "shell",
    title: "Shell & Linux",
    description:
      "Automação Bash, pipes, streams, permissões POSIX, scripts de deploy e manipulação de texto.",
    docsCount: "75 Docs",
    iconType: "icon",
    iconComponent: Terminal,
    iconColor: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    href: "/shell/bash",
    categoryKey: "shell",
    tags: ["shell", "bash", "linux", "scripts"],
    popularity: 89,
  },
  {
    id: "devops",
    title: "Docker & DevOps",
    description:
      "Containers multi-stage, Docker Compose, redes isoladas, CI/CD pipelines e Kubernetes.",
    docsCount: "82 Docs",
    iconType: "icon",
    iconComponent: Container,
    iconColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    href: "/devops/docker",
    categoryKey: "devops",
    tags: ["docker", "devops", "containers", "ci-cd"],
    popularity: 91,
  },
];

interface TopicCatalogProps {
  dynamicNotes?: NoteMetadata[];
  onSelectCategory?: (categoryKey: string) => void;
}

export function TopicCatalog({ dynamicNotes = [], onSelectCategory }: TopicCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"popular" | "count" | "alpha">("popular");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mescla tópicos padrão com categorias descobertas dinamicamente em content/
  const allTopics = React.useMemo(() => {
    const defaultKeys = new Set(
      DEFAULT_TOPICS.map((t) => t.categoryKey?.toLowerCase()).filter(Boolean)
    );

    // Mapeia todas as notas por categoria
    const categoryNotesMap = new Map<string, { name: string; slug: string; notes: NoteMetadata[] }>();
    dynamicNotes.forEach((note) => {
      const key = note.categorySlug.toLowerCase();
      const existing = categoryNotesMap.get(key);
      if (existing) {
        existing.notes.push(note);
      } else {
        categoryNotesMap.set(key, {
          name: note.category,
          slug: note.categorySlug,
          notes: [note],
        });
      }
    });

    // 1. Atualiza tópicos padrão com a contagem real de notas se houver
    const enrichedDefaultTopics = DEFAULT_TOPICS.map((topic) => {
      if (!topic.categoryKey) return topic;
      const catData = categoryNotesMap.get(topic.categoryKey.toLowerCase());
      if (catData && catData.notes.length > 0) {
        return {
          ...topic,
          docsCount: `${catData.notes.length} Docs`,
        };
      }
      return topic;
    });

    // 2. Cria cards para quaisquer pastas customizadas novas (como Algoritmos e estrutura de dados)
    const customTopics: CatalogTopic[] = [];
    categoryNotesMap.forEach((catData, key) => {
      // Se não é uma das categorias padrão (shell, web, devops)
      if (!defaultKeys.has(key)) {
        const firstNote = catData.notes[0];
        customTopics.push({
          id: key,
          title: catData.name,
          description:
            firstNote?.description ||
            `Coleção de notas, guias e estudos sobre ${catData.name}.`,
          docsCount: `${catData.notes.length} ${catData.notes.length === 1 ? "Doc" : "Docs"}`,
          iconType: "icon",
          iconComponent: BookOpen,
          iconColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
          href: firstNote
            ? `/notes/${encodeURIComponent(catData.slug)}/${encodeURIComponent(firstNote.slug)}`
            : "/",
          categoryKey: catData.slug,
          tags: Array.from(new Set(catData.notes.flatMap((n) => n.tags))),
          popularity: 95,
        });
      }
    });

    return [...customTopics, ...enrichedDefaultTopics];
  }, [dynamicNotes]);

  // Filtra e ordena
  const filteredTopics = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let result = allTopics.filter((topic) => {
      if (!query) return true;
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.tags.some((t) => t.toLowerCase().includes(query)) ||
        (topic.featuredCollection && topic.featuredCollection.toLowerCase().includes(query))
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "popular") {
        return b.popularity - a.popularity;
      }
      if (sortBy === "count") {
        const countA = parseInt(String(a.docsCount).replace(/\D/g, ""), 10) || 0;
        const countB = parseInt(String(b.docsCount).replace(/\D/g, ""), 10) || 0;
        return countB - countA;
      }
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [allTopics, searchQuery, sortBy]);

  const sortLabels = {
    popular: "Most Popular",
    count: "Most Docs",
    alpha: "Alphabetical",
  };

  return (
    <section className="space-y-6 pt-2">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-zinc-800/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Topic Catalog
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Explore technical documentation organized by language, framework, and concept. Filter
            below to find focused study materials.
          </p>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter themes..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
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

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-zinc-400 transition-transform duration-200",
                  dropdownOpen && "transform rotate-180"
                )}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-zinc-800 bg-zinc-900/98 backdrop-blur-xl p-1.5 shadow-2xl z-30 animate-in fade-in-0 zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setSortBy("popular");
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                    sortBy === "popular"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  )}
                >
                  Most Popular
                </button>
                <button
                  onClick={() => {
                    setSortBy("count");
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                    sortBy === "count"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  )}
                >
                  Most Docs
                </button>
                <button
                  onClick={() => {
                    setSortBy("alpha");
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors",
                    sortBy === "alpha"
                      ? "bg-zinc-800 text-white font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  )}
                >
                  Alphabetical (A-Z)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      {filteredTopics.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
          <p className="text-sm text-zinc-400">No themes found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-cyan-400 hover:underline font-mono"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {filteredTopics.map((topic) => {
            const Icon = topic.iconComponent;
            const hasFeatured = !!topic.featuredCollection;

            return (
              <div
                key={topic.id}
                className={cn(
                  "group relative rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-900/90 transition-all duration-200 shadow-sm hover:shadow-xl",
                  hasFeatured && "lg:row-span-2 justify-between"
                )}
              >
                <div>
                  {/* Top Row: Icon Badge & Docs Count */}
                  <div className="flex items-center justify-between mb-5">
                    {topic.iconType === "text" ? (
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shadow-sm",
                          topic.iconColor
                        )}
                      >
                        {topic.iconText}
                      </div>
                    ) : (
                      Icon && (
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg border flex items-center justify-center shadow-sm",
                            topic.iconColor
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      )
                    )}

                    <span className="text-xs font-mono text-zinc-400 tracking-wide">
                      {topic.docsCount}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2.5">
                    {topic.title}
                  </h3>

                  {/* Topic Description */}
                  <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Optional Bottom Featured Collection Box */}
                {hasFeatured ? (
                  <div className="mt-8 pt-4 border-t border-zinc-800/80">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-1 group-hover:border-zinc-700 transition-colors">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                        Featured Collection
                      </span>
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 group-hover:text-white">
                        <span>{topic.featuredCollection}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-3 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/40">
                    <span className="font-mono text-[11px] text-zinc-400">
                      {topic.tags[0] ? `#${topic.tags[0]}` : ""}
                    </span>
                    <Link
                      href={topic.href}
                      className="text-zinc-400 hover:text-cyan-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>Acessar</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
