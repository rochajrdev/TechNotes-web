"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Search,
  BookOpen,
  FolderGit2,
  Container,
  Layers,
  Sparkles,
  ChevronDown,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  FileText,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  Database,
  Code2,
  Cpu,
  Server,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./CommandMenu";
import type { NoteMetadata } from "@/lib/content";

interface CategoryMeta {
  key: string;
  name: string;
  icon: React.ElementType;
  color: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
}

const KNOWN_CATEGORIES: Record<string, CategoryMeta> = {
  shell: {
    key: "shell",
    name: "Shell & Linux",
    icon: Terminal,
    color: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-emerald-500/10",
  },
  web: {
    key: "web",
    name: "Desenvolvimento Web",
    icon: Layers,
    color: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/10",
  },
  devops: {
    key: "devops",
    name: "DevOps & Ferramentas",
    icon: Container,
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    borderColor: "border-cyan-500/40",
    glowColor: "shadow-cyan-500/10",
  },
};

const baseNavigationData: Record<
  string,
  { title: string; href: string; badge?: string; icon?: React.ElementType }[]
> = {
  shell: [
    { title: "Fundamentos Bash", href: "/shell/bash", badge: "Bash" },
    { title: "Comandos Essenciais", href: "/shell/comandos", badge: "CLI" },
    { title: "Scripts & Automação", href: "/shell/scripts", badge: "Scripts" },
  ],
  web: [
    { title: "Next.js App Router", href: "/web/nextjs", badge: "Next.js" },
    { title: "React 19 Hooks & Server", href: "/web/react", badge: "React" },
    { title: "Tailwind CSS v4", href: "/web/tailwind", badge: "Tailwind" },
  ],
  devops: [
    { title: "Docker & Compose", href: "/devops/docker", badge: "Docker", icon: Container },
    { title: "Git Workflow", href: "/devops/git", badge: "Git", icon: FolderGit2 },
    { title: "Linux Servers", href: "/devops/linux", badge: "Linux", icon: Terminal },
  ],
};

function resolveCategoryMeta(key: string, nameFallback?: string): CategoryMeta {
  const normalized = key.toLowerCase().trim();
  if (KNOWN_CATEGORIES[normalized]) {
    return KNOWN_CATEGORIES[normalized];
  }

  // Detecta ícones por termos comuns
  let Icon = BookOpen;
  let color = "text-purple-400";
  let badgeColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
  let borderColor = "border-purple-500/40";
  let glowColor = "shadow-purple-500/10";

  if (normalized.includes("banco") || normalized.includes("sql") || normalized.includes("dados")) {
    Icon = Database;
    color = "text-amber-400";
    badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    borderColor = "border-amber-500/40";
    glowColor = "shadow-amber-500/10";
  } else if (normalized.includes("algorit") || normalized.includes("estrutura") || normalized.includes("code")) {
    Icon = Code2;
    color = "text-violet-400";
    badgeColor = "bg-violet-500/10 text-violet-300 border-violet-500/30";
    borderColor = "border-violet-500/40";
    glowColor = "shadow-violet-500/10";
  } else if (normalized.includes("python") || normalized.includes("py")) {
    Icon = Code2;
    color = "text-sky-400";
    badgeColor = "bg-sky-500/10 text-sky-300 border-sky-500/30";
    borderColor = "border-sky-500/40";
    glowColor = "shadow-sky-500/10";
  }

  return {
    key,
    name: nameFallback || key,
    icon: Icon,
    color,
    badgeColor,
    borderColor,
    glowColor,
  };
}

interface SidebarProps {
  dynamicNotes?: NoteMetadata[];
}

export function Sidebar({ dynamicNotes = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState("");

  // Carregar preferência salva de recolhimento no desktop
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("technotes_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  // Fechar menu mobile ao mudar de rota
  React.useEffect(() => {
    setMobileOpen(false);
    setFilterQuery("");
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("technotes_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 1. Detecta a categoria / tópico ativo com base na URL
  const activeCategoryData = React.useMemo(() => {
    // Caso 1: Rota direta tipo /devops, /web, /shell
    const baseMatch = pathname.match(/^\/(devops|web|shell)(?:\/.*)?$/);
    if (baseMatch) {
      const catKey = baseMatch[1].toLowerCase();
      const meta = resolveCategoryMeta(catKey);

      // Itens base estáticos
      const baseItems = baseNavigationData[catKey] || [];

      // Notas dinâmicas em Markdown dessa categoria
      const dynamicItems = dynamicNotes
        .filter((n) => n.categorySlug.toLowerCase().trim() === catKey)
        .map((note) => ({
          title: note.title,
          href: `/notes/${encodeURIComponent(note.categorySlug)}/${encodeURIComponent(note.slug)}`,
          badge: note.badge || "MD",
        }));

      const existingHrefs = new Set(baseItems.map((i) => i.href));
      const combinedItems = [...baseItems, ...dynamicItems.filter((i) => !existingHrefs.has(i.href))];

      return {
        meta,
        items: combinedItems,
      };
    }

    // Caso 2: Rota dinâmica de notas tipo /notes/[category]/[slug]
    const notesMatch = pathname.match(/^\/notes\/([^/]+)(?:\/([^/]+))?/);
    if (notesMatch) {
      const rawCategorySlug = decodeURIComponent(notesMatch[1]);
      const catKey = rawCategorySlug.toLowerCase().trim();

      // Busca notas dessa categoria
      const matchingNotes = dynamicNotes.filter(
        (n) =>
          n.categorySlug.toLowerCase().trim() === catKey ||
          encodeURIComponent(n.categorySlug).toLowerCase() === notesMatch[1].toLowerCase()
      );

      const categoryName = matchingNotes[0]?.category || rawCategorySlug;
      const meta = resolveCategoryMeta(rawCategorySlug, categoryName);

      // Base items se for shell, web ou devops
      const baseItems = baseNavigationData[catKey] || [];

      const dynamicItems = matchingNotes.map((note) => ({
        title: note.title,
        href: `/notes/${encodeURIComponent(note.categorySlug)}/${encodeURIComponent(note.slug)}`,
        badge: note.badge || "MD",
      }));

      const existingHrefs = new Set(baseItems.map((i) => i.href));
      const combinedItems = [...baseItems, ...dynamicItems.filter((i) => !existingHrefs.has(i.href))];

      return {
        meta,
        items: combinedItems.length > 0 ? combinedItems : dynamicItems,
      };
    }

    return null;
  }, [pathname, dynamicNotes]);

  // Se estiver na página inicial (Catálogo Principal), não renderiza a sidebar para manter a tela limpa
  if (pathname === "/" || !activeCategoryData) {
    return null;
  }

  const { meta, items } = activeCategoryData;
  const CategoryIcon = meta.icon;

  // Filtragem interna de tópicos
  const filteredItems = items.filter((item) => {
    if (!filterQuery.trim()) return true;
    return item.title.toLowerCase().includes(filterQuery.toLowerCase().trim());
  });

  return (
    <>
      {/* Botão Mobile Flutuante */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 shadow-xl backdrop-blur-md hover:text-white"
        aria-label="Abrir menu do curso"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay Backdrop Mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Dinâmica e Contextual do Tópico Ativo */}
      <aside
        className={cn(
          "bg-zinc-950/95 backdrop-blur-md border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 z-40 select-none transition-all duration-300 ease-in-out shrink-0",
          isCollapsed ? "w-[72px]" : "w-80",
          "max-md:fixed max-md:top-0 max-md:left-0 max-md:w-80 max-md:h-full max-md:z-50",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* Topo / Voltar ao Catálogo e Ações */}
        <div className="p-3.5 border-b border-zinc-800/70 flex items-center justify-between min-h-[64px]">
          {isCollapsed ? (
            <div className="w-full flex flex-col items-center gap-2">
              <Link
                href="/"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                title="Voltar ao Catálogo Principal"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                onClick={toggleCollapse}
                className="hidden md:flex p-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 transition-colors"
                title="Expandir barra lateral"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all group"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Voltar ao Catálogo</span>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCollapse}
                  className="hidden md:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                  title="Recolher menu lateral"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Cabeçalho do Tópico / Trilha Ativa */}
        {!isCollapsed ? (
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/20">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-md",
                  meta.badgeColor,
                  meta.borderColor
                )}
              >
                <CategoryIcon className={cn("h-5 w-5", meta.color)} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-semibold">
                  Trilha Atual
                </span>
                <h2 className="text-sm font-bold text-white truncate leading-tight">
                  {meta.name}
                </h2>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/80">
              <span>Conteúdos disponíveis</span>
              <span className="font-bold text-zinc-200">{items.length} itens</span>
            </div>
          </div>
        ) : (
          <div className="py-3 flex justify-center border-b border-zinc-800/60">
            <div
              className={cn(
                "h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-md",
                meta.badgeColor,
                meta.borderColor
              )}
              title={meta.name}
            >
              <CategoryIcon className={cn("h-5 w-5", meta.color)} />
            </div>
          </div>
        )}

        {/* Campo de Filtro Rápido */}
        {!isCollapsed && (
          <div className="p-3 pb-1 border-b border-zinc-800/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={`Filtrar em ${meta.name}...`}
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors font-sans"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lista Dinâmica de Conteúdos da Categoria Ativa */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              Nenhum conteúdo encontrado para &quot;{filterQuery}&quot;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const decodedItemHref = decodeURIComponent(item.href);
              const decodedCurrentPath = decodeURIComponent(pathname);
              const isActive =
                decodedCurrentPath === decodedItemHref ||
                decodedCurrentPath.startsWith(`${decodedItemHref}/`);

              if (isCollapsed) {
                return (
                  <div key={item.href} className="flex justify-center py-0.5">
                    <Link
                      href={item.href}
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all group relative border",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border-transparent hover:border-zinc-800"
                      )}
                      title={item.title}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {isActive && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950" />
                      )}
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs transition-all group border",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 font-semibold shadow-sm shadow-cyan-500/5"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 border-transparent hover:border-zinc-800/80"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded border shrink-0",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 group-hover:text-zinc-300"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ml-1",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 group-hover:border-zinc-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Rodapé da Sidebar: Atalho Global Ctrl + K */}
        <div className="p-3 border-t border-zinc-800/70 bg-zinc-950/60">
          {isCollapsed ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 transition-colors"
              title="Buscar globalmente (Ctrl + K)"
            >
              <Search className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-xs transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                <span>Busca Global</span>
              </div>
              <kbd className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">
                ⌘K
              </kbd>
            </button>
          )}
        </div>
      </aside>

      {/* Modal de Busca Global (Ctrl + K) */}
      <CommandMenu
        open={searchOpen}
        setOpen={setSearchOpen}
        dynamicNotes={dynamicNotes}
      />
    </>
  );
}
