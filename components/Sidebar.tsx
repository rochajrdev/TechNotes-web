"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  BookOpen,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  FileText,
  ChevronDown,
  ArrowLeft,
  Database,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./CommandMenu";
import type { NoteMetadata } from "@/lib/content";
import {
  MODULES,
  type ModuleDefinition,
  type ModuleGroup,
  type ModulePage,
} from "@/config/modules";
import { getNoteHref } from "@/lib/note-path";

function resolveCategoryMeta(key: string, nameFallback?: string): ModuleDefinition {
  const normalized = key.toLowerCase().trim();
  if (MODULES[normalized]) {
    return MODULES[normalized];
  }

  // Detecta ícones por termos comuns
  let Icon = BookOpen;
  let color = "text-purple-400";
  let badgeColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
  let borderColor = "border-purple-500/40";

  if (normalized.includes("banco") || normalized.includes("sql") || normalized.includes("dados")) {
    Icon = Database;
    color = "text-amber-400";
    badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    borderColor = "border-amber-500/40";
  } else if (normalized.includes("algorit") || normalized.includes("estrutura") || normalized.includes("code")) {
    Icon = Code2;
    color = "text-violet-400";
    badgeColor = "bg-violet-500/10 text-violet-300 border-violet-500/30";
    borderColor = "border-violet-500/40";
  } else if (normalized.includes("python") || normalized.includes("py")) {
    Icon = Code2;
    color = "text-sky-400";
    badgeColor = "bg-sky-500/10 text-sky-300 border-sky-500/30";
    borderColor = "border-sky-500/40";
  }

  return {
    key,
    name: nameFallback || key,
    icon: Icon,
    color,
    badgeColor,
    borderColor,
    pages: [],
  };
}

interface SidebarProps {
  dynamicNotes?: NoteMetadata[];
}

type NavigationItem = ModulePage;

interface NavigationSection {
  key: "pages" | "notes";
  title: string;
  description: string;
  items: NavigationItem[];
}

interface NavigationGroup extends ModuleGroup {
  notes: NavigationItem[];
}

function buildGroups(moduleKey: string, notes: NoteMetadata[]): NavigationGroup[] {
  const configuredGroups = MODULES[moduleKey]?.groups || [];
  const groups = new Map<string, NavigationGroup>();

  for (const group of configuredGroups) {
    groups.set(group.key.toLowerCase(), { ...group, notes: [] });
  }

  for (const note of notes) {
    if (!note.groupSlug) continue;
    const key = note.groupSlug.toLowerCase();
    const group = groups.get(key) || {
      key: note.groupSlug,
      name: note.group || note.groupSlug,
      pages: [],
      notes: [],
    };
    group.notes.push({ title: note.title, href: getNoteHref(note), badge: note.badge || "MD" });
    groups.set(key, group);
  }

  return Array.from(groups.values());
}

export function Sidebar({ dynamicNotes = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState("");
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(() => new Set());

  // Carregar preferência salva de recolhimento no desktop
  React.useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("technotes_sidebar_collapsed");
    } catch {
      // ignore
    }

    if (saved === null) return;
    const timer = window.setTimeout(() => setIsCollapsed(saved === "true"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Fechar menu mobile ao mudar de rota
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setFilterQuery("");
    }, 0);
    return () => window.clearTimeout(timer);
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
    // Caso 1: qualquer rota de módulo cadastrada em app/<modulo>/...
    const baseMatch = pathname.match(/^\/(?!notes(?:\/|$))([^/]+)(?:\/.*)?$/);
    if (baseMatch) {
      const catKey = baseMatch[1].toLowerCase();
      const meta = resolveCategoryMeta(catKey);

      // Itens base estáticos
      const baseItems = MODULES[catKey]?.pages || [];

      // Notas dinâmicas em Markdown dessa categoria
      const matchingNotes = dynamicNotes.filter(
        (n) => n.categorySlug.toLowerCase().trim() === catKey
      );
      const dynamicItems = matchingNotes
        .filter((note) => !note.groupSlug)
        .map((note) => ({
          title: note.title,
          href: getNoteHref(note),
          badge: note.badge || "MD",
        }));

      return {
        meta,
        pages: baseItems,
        notes: dynamicItems,
        groups: buildGroups(catKey, matchingNotes),
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

      // Páginas TSX registradas para este módulo
      const baseItems = MODULES[catKey]?.pages || [];

      const dynamicItems = matchingNotes.filter((note) => !note.groupSlug).map((note) => ({
        title: note.title,
        href: getNoteHref(note),
        badge: note.badge || "MD",
      }));

      return {
        meta,
        pages: baseItems,
        notes: dynamicItems,
        groups: buildGroups(catKey, matchingNotes),
      };
    }

    return null;
  }, [pathname, dynamicNotes]);

  // Se estiver na página inicial (Catálogo Principal), não renderiza a sidebar para manter a tela limpa
  if (pathname === "/" || !activeCategoryData) {
    return null;
  }

  const { meta, pages, notes, groups } = activeCategoryData;
  const CategoryIcon = meta.icon;

  const totalItems =
    pages.length +
    notes.length +
    groups.reduce((total, group) => total + group.pages.length + group.notes.length, 0);
  const normalizedFilter = filterQuery.toLowerCase().trim();
  const navigationSections: NavigationSection[] = [
    {
      key: "pages",
      title: "Páginas",
      description: "Experiências e guias interativos",
      items: pages,
    },
    {
      key: "notes",
      title: "Notas",
      description: "Conteúdo em Markdown",
      items: notes,
    },
  ];
  const sections = navigationSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !normalizedFilter || item.title.toLowerCase().includes(normalizedFilter)
    ),
  }));

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      pages: group.pages.filter(
        (item) => !normalizedFilter || item.title.toLowerCase().includes(normalizedFilter)
      ),
      notes: group.notes.filter(
        (item) => !normalizedFilter || item.title.toLowerCase().includes(normalizedFilter)
      ),
    }))
    .filter(
      (group) =>
        group.pages.length > 0 ||
        group.notes.length > 0 ||
        (!normalizedFilter && groups.some((candidate) => candidate.key === group.key))
    );

  const filteredItemCount =
    sections.reduce((total, section) => total + section.items.length, 0) +
    filteredGroups.reduce((total, group) => total + group.pages.length + group.notes.length, 0);

  const toggleGroup = (key: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // No drawer mobile (mobileOpen), a sidebar deve ser exibida sempre expandida com títulos
  const showCollapsedUI = isCollapsed && !mobileOpen;

  return (
    <>
      {/* Botão Mobile Flutuante */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 shadow-xl backdrop-blur-md hover:text-white"
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
          showCollapsedUI ? "w-[72px]" : "w-80",
          "max-md:fixed max-md:top-0 max-md:left-0 max-md:w-80 max-md:h-full max-md:z-50",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* Topo / Voltar ao Catálogo e Ações */}
        <div className="p-3.5 border-b border-zinc-800/70 flex items-center justify-between min-h-[64px]">
          {showCollapsedUI ? (
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
        {!showCollapsedUI ? (
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
              <span className="font-bold text-zinc-200">{totalItems} itens</span>
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
        {!showCollapsedUI && (
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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 custom-scrollbar">
          {filteredItemCount === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              Nenhum conteúdo encontrado para &quot;{filterQuery}&quot;
            </div>
          ) : (
            sections.map((section) => {
              if (section.items.length === 0 && section.key !== "notes") return null;
              if (section.items.length === 0 && filteredGroups.length === 0) return null;

              const SectionIcon = section.key === "pages" ? Layers : FileText;

              return (
                <React.Fragment key={section.key}>
                  {section.key === "notes" && filteredGroups.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-zinc-800/70 pt-4">
                      {!showCollapsedUI && (
                        <div className="mb-2 flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <ChevronDown className={cn("h-3.5 w-3.5", meta.color)} />
                            <div>
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-300">
                                Submódulos
                              </h3>
                              <p className="text-[9px] text-zinc-600">Nichos específicos</p>
                            </div>
                          </div>
                          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500">
                            {filteredGroups.length}
                          </span>
                        </div>
                      )}

                      {filteredGroups.map((group) => {
                        const groupItems = [...group.pages, ...group.notes];
                        const hasActiveItem = groupItems.some((item) => {
                          const current = decodeURIComponent(pathname);
                          const href = decodeURIComponent(item.href);
                          return current === href || current.startsWith(`${href}/`);
                        });
                        const isOpen = normalizedFilter.length > 0 || openGroups.has(group.key) || hasActiveItem;

                        return (
                          <div key={group.key} className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30">
                            <button
                              type="button"
                              onClick={() => toggleGroup(group.key)}
                              className={cn(
                                "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-900",
                                hasActiveItem ? "text-cyan-300" : "text-zinc-300",
                                showCollapsedUI && "justify-center px-1"
                              )}
                              aria-expanded={isOpen}
                            >
                              {showCollapsedUI ? (
                                <span className="font-mono text-[10px] font-bold">G</span>
                              ) : (
                                <>
                                  <span className="truncate font-semibold">{group.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-zinc-600">{groupItems.length}</span>
                                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                                  </div>
                                </>
                              )}
                            </button>

                            {isOpen && (
                              <div className="space-y-1 border-t border-zinc-800/70 p-1.5">
                                {groupItems.map((item, index) => {
                                  const isPage = index < group.pages.length;
                                  const isActive = decodeURIComponent(pathname) === decodeURIComponent(item.href);
                                  return (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      title={item.title}
                                      className={cn(
                                        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors",
                                        isActive
                                          ? "bg-cyan-500/15 text-cyan-300"
                                          : "text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-200",
                                        !isPage && index === group.pages.length && "border-t border-zinc-800/70 pt-2"
                                      )}
                                    >
                                      <span className="shrink-0 font-mono text-[9px]">{isPage ? "P" : "N"}</span>
                                      {!showCollapsedUI && <span className="truncate">{item.title}</span>}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {section.items.length > 0 && <section
                  className={cn(
                    "space-y-1.5",
                    section.key === "notes" && "mt-auto border-t border-zinc-800/70 pt-4"
                  )}
                >
                  {showCollapsedUI ? (
                    <div
                      className="mb-1 flex justify-center text-zinc-600"
                      title={`${section.title}: ${section.description}`}
                    >
                      <SectionIcon className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="mb-2 flex items-center justify-between px-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <SectionIcon className={cn("h-3.5 w-3.5 shrink-0", meta.color)} />
                        <div className="min-w-0">
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-300">
                            {section.title}
                          </h3>
                          <p className="truncate text-[9px] text-zinc-600">{section.description}</p>
                        </div>
                      </div>
                      <span className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500">
                        {section.items.length}
                      </span>
                    </div>
                  )}

                  {section.items.map((item, index) => {
                    const decodedItemHref = decodeURIComponent(item.href);
                    const decodedCurrentPath = decodeURIComponent(pathname);
                    const isActive =
                      decodedCurrentPath === decodedItemHref ||
                      decodedCurrentPath.startsWith(`${decodedItemHref}/`);
                    const itemPrefix = section.key === "pages" ? "P" : "N";

                    if (showCollapsedUI) {
                      return (
                        <div key={item.href} className="flex justify-center py-0.5">
                          <Link
                            href={item.href}
                            className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all group relative border",
                              isActive
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border-transparent hover:border-zinc-800"
                            )}
                            title={`${section.title}: ${item.title}`}
                          >
                            <span>{itemPrefix}{String(index + 1).padStart(2, "0")}</span>
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
                            {itemPrefix}{String(index + 1).padStart(2, "0")}
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
                  })}
                  </section>}
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Rodapé da Sidebar: Atalho Global Ctrl + K */}
        <div className="p-3 border-t border-zinc-800/70 bg-zinc-950/60">
          {showCollapsedUI ? (
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
