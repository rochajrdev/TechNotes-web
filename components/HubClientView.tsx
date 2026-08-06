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
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  Tag,
  FolderTree,
  LayoutGrid,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import type { NoteMetadata } from "@/lib/content";

interface HubClientViewProps {
  notes: NoteMetadata[];
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  shell: Terminal,
  web: Layers,
  devops: Container,
};

const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  shell: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  web: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
  },
  devops: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
};

const STATUS_LABELS: Record<string, { label: string; badgeVariant: "success" | "warning" | "purple" | "blue" }> = {
  concluido: { label: "Concluído", badgeVariant: "success" },
  em_progresso: { label: "Em Progresso", badgeVariant: "warning" },
  rascunho: { label: "Rascunho", badgeVariant: "blue" },
  revisao: { label: "Para Revisão", badgeVariant: "purple" },
};

export function HubClientView({ notes }: HubClientViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"grouped" | "grid">("grouped");

  // Categorias únicas extraídas dos conteúdos
  const categories = React.useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    notes.forEach((note) => {
      const existing = map.get(note.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        map.set(note.categorySlug, {
          slug: note.categorySlug,
          name: note.category,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [notes]);


  // Filtragem dinâmica
  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory =
        selectedCategory === "all" || note.categorySlug.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStatus =
        selectedStatus === "all" || (note.status || "concluido") === selectedStatus;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [notes, selectedCategory, selectedStatus, searchQuery]);

  // Agrupamento por categoria para a visão agrupada
  const groupedNotes = React.useMemo(() => {
    const groups: Record<string, { name: string; slug: string; items: NoteMetadata[] }> = {};

    filteredNotes.forEach((note) => {
      if (!groups[note.categorySlug]) {
        groups[note.categorySlug] = {
          name: note.category,
          slug: note.categorySlug,
          items: [],
        };
      }
      groups[note.categorySlug].items.push(note);
    });

    return Object.values(groups);
  }, [filteredNotes]);

  return (
    <div className="space-y-10 pb-16">
      {/* Standalone Top Header Navigation */}
      <header className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>
      </header>



      {/* Control Panel: Search & Filters */}
      <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por título, tag, palavra-chave ou categoria..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Limpar
              </button>
            )}
          </div>

          {/* View Mode Switches */}
          <div className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grouped")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                viewMode === "grouped"
                  ? "bg-zinc-800 text-cyan-400 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>Por Categorias</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                viewMode === "grid"
                  ? "bg-zinc-800 text-cyan-400 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Todas as Notas</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60">
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="h-3 w-3" /> Categoria:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-mono transition-all border",
              selectedCategory === "all"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
            )}
          >
            Todas ({notes.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono transition-all border",
                selectedCategory === cat.slug
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              )}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Main Aggregator View */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhuma nota encontrada</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não encontramos nenhum tópico de estudo correspondente aos termos de busca ou filtros selecionados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedStatus("all");
            }}
            className="mt-2"
          >
            Resetar Filtros
          </Button>
        </div>
      ) : viewMode === "grouped" ? (
        /* Modo Agrupado por Categoria */
        <div className="space-y-10">
          {groupedNotes.map((group) => {
            const Icon = CATEGORY_ICONS[group.slug] || FolderTree;
            const style = CATEGORY_COLORS[group.slug] || {
              border: "border-zinc-800",
              bg: "bg-zinc-800/40",
              text: "text-zinc-300",
              glow: "hover:border-zinc-700",
            };

            return (
              <section key={group.slug} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl border shadow-sm", style.bg, style.border, style.text)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        {group.name}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {group.items.length} {group.items.length === 1 ? "tópico indexado" : "tópicos indexados"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Note Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((note) => (
                    <NoteCard key={note.slug} note={note} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Modo Lista Geral Completa */
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-cyan-400" />
              Todas as Notas Filtradas ({filteredNotes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: NoteMetadata }) {
  const style = CATEGORY_COLORS[note.categorySlug] || {
    border: "border-zinc-800",
    bg: "bg-zinc-800/40",
    text: "text-zinc-300",
    glow: "hover:border-zinc-700",
  };

  const statusInfo = STATUS_LABELS[note.status || "concluido"] || STATUS_LABELS.concluido;

  return (
    <Link
      href={`/notes/${note.categorySlug}/${note.slug}`}
      className={cn(
        "group rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 hover:bg-zinc-900/90 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl relative overflow-hidden",
        style.glow
      )}
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[11px] font-mono font-semibold uppercase tracking-wider", style.text)}>
            {note.category}
          </span>
          <Badge variant={statusInfo.badgeVariant} className="text-[10px]">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
          {note.title}
        </h3>

        {/* Description */}
        {note.description && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {note.description}
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="space-y-3 pt-3 border-t border-zinc-800/60 text-xs">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono bg-zinc-950/80 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] font-mono text-zinc-500 self-center">
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta & Action Link */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {note.readingTime}
          </span>

          <span className="text-cyan-400 text-xs font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Acessar estudo
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
