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
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./CommandMenu";
import type { NoteMetadata } from "@/lib/content";

interface NavGroup {
  title: string;
  categoryKey: string;
  icon: React.ElementType;
  color: string;
  items: {
    title: string;
    href: string;
    badge?: string;
  }[];
}

interface ActiveFlyoutState {
  title: string;
  top: number;
  icon: React.ElementType;
  color: string;
  items: {
    title: string;
    href: string;
    badge?: string;
  }[];
}

const baseNavigationData: NavGroup[] = [
  {
    title: "Shell & Linux",
    categoryKey: "shell",
    icon: Terminal,
    color: "text-emerald-400",
    items: [
      { title: "Fundamentos Bash", href: "/shell/bash" },
      { title: "Comandos Essenciais", href: "/shell/comandos" },
      { title: "Scripts & Automação", href: "/shell/scripts" },
    ],
  },
  {
    title: "Desenvolvimento Web",
    categoryKey: "web",
    icon: Layers,
    color: "text-blue-400",
    items: [
      { title: "Next.js App Router", href: "/web/nextjs" },
      { title: "React 19 Hooks & Server", href: "/web/react" },
      { title: "Tailwind CSS v4", href: "/web/tailwind" },
    ],
  },
  {
    title: "DevOps & Ferramentas",
    categoryKey: "devops",
    icon: Container,
    color: "text-cyan-400",
    items: [
      { title: "Docker & Compose", href: "/devops/docker" },
      { title: "Git Workflow", href: "/devops/git" },
      { title: "Linux Servers", href: "/devops/linux" },
    ],
  },
];

interface SidebarProps {
  dynamicNotes?: NoteMetadata[];
}

export function Sidebar({ dynamicNotes = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [activeFlyout, setActiveFlyout] = React.useState<ActiveFlyoutState | null>(null);
  const flyoutRef = React.useRef<HTMLDivElement>(null);

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    "Shell & Linux": true,
    "Desenvolvimento Web": true,
    "DevOps & Ferramentas": true,
  });

  // Carregar preferência salva de recolhimento do menu no desktop
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

  // Fechar menu mobile e flyout ao mudar de rota
  React.useEffect(() => {
    setMobileOpen(false);
    setActiveFlyout(null);
  }, [pathname]);

  // Fechar flyout ao clicar fora ou pressionar Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(event.target as Node)
      ) {
        setActiveFlyout(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveFlyout(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setActiveFlyout(null);
      try {
        localStorage.setItem("technotes_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Combina as rotas base com todas as notas Markdown dinâmicas da pasta content/
  const navigationGroups = React.useMemo(() => {
    const baseGroups = baseNavigationData.map((group) => {
      const categoryNotes = dynamicNotes.filter(
        (note) => note.categorySlug.toLowerCase() === group.categoryKey.toLowerCase()
      );

      const dynamicItems = categoryNotes.map((note) => ({
        title: note.title,
        href: `/notes/${encodeURIComponent(note.categorySlug)}/${encodeURIComponent(note.slug)}`,
        badge: note.badge || "MD",
      }));

      const existingHrefs = new Set(group.items.map((i) => i.href));
      const filteredDynamic = dynamicItems.filter((i) => !existingHrefs.has(i.href));

      return {
        ...group,
        items: [...group.items, ...filteredDynamic],
      };
    });

    // Identifica e adiciona quaisquer novas pastas/categorias criadas em content/
    const baseCategoryKeys = new Set(baseNavigationData.map((g) => g.categoryKey.toLowerCase()));
    const customCategoriesMap = new Map<string, { name: string; notes: NoteMetadata[] }>();

    dynamicNotes.forEach((note) => {
      const key = note.categorySlug.toLowerCase();
      if (!baseCategoryKeys.has(key)) {
        const existing = customCategoriesMap.get(key);
        if (existing) {
          existing.notes.push(note);
        } else {
          customCategoriesMap.set(key, {
            name: note.category,
            notes: [note],
          });
        }
      }
    });

    const customGroups: NavGroup[] = Array.from(customCategoriesMap.entries()).map(([key, data]) => ({
      title: data.name,
      categoryKey: key,
      icon: BookOpen,
      color: "text-purple-400",
      items: data.notes.map((note) => ({
        title: note.title,
        href: `/notes/${encodeURIComponent(note.categorySlug)}/${encodeURIComponent(note.slug)}`,
        badge: note.badge || "MD",
      })),
    }));

    return [...baseGroups, ...customGroups];
  }, [dynamicNotes]);

  // Abre o flyout menu na posição exata do botão clicado
  const handleCollapsedCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    group: (typeof navigationGroups)[0]
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    if (activeFlyout?.title === group.title) {
      setActiveFlyout(null);
    } else {
      setActiveFlyout({
        title: group.title,
        top: rect.top,
        icon: group.icon,
        color: group.color,
        items: group.items,
      });
    }
  };

  // Se estiver na página inicial ou no Hub, oculta a renderização da Sidebar
  if (pathname === "/hub" || pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Botão Mobile Flutuante */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 shadow-xl backdrop-blur-md hover:text-white"
        aria-label="Abrir menu lateral"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay Backdrop Mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={cn(
          "bg-zinc-950/90 backdrop-blur-md border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 z-40 select-none transition-all duration-300 ease-in-out",
          // Largura Desktop: retrátil
          isCollapsed ? "w-[72px]" : "w-72",
          // Comportamento Mobile: gaveta deslizante
          "max-md:fixed max-md:top-0 max-md:left-0 max-md:w-72 max-md:h-full max-md:z-50",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* Brand Header com a Nova Logo TechNotes */}
        <div className="p-3 border-b border-zinc-800/60 flex items-center justify-between min-h-[65px]">
          {isCollapsed ? (
            /* Modo Recolhido: Logo centralizada com ação de clique para expandir */
            <div className="w-full flex items-center justify-center">
              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center p-1 rounded-xl hover:bg-zinc-900 transition-transform active:scale-95"
                title="Expandir menu lateral"
              >
                <Logo collapsed={true} size="md" />
              </button>
            </div>
          ) : (
            /* Modo Expandido: Logo completa + Botão de recolher */
            <>
              <Link href="/" className="overflow-hidden">
                <Logo collapsed={false} />
              </Link>

              {/* Botão de recolher (Desktop) */}
              <button
                onClick={toggleCollapse}
                className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors shrink-0"
                title="Recolher menu lateral"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>

              {/* Botão fechar (Mobile) */}
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Quick Search Button */}
        <div className="p-3 pb-1">
          {isCollapsed ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-center p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all group"
              title="Buscar anotações (Ctrl + K)"
            >
              <Search className="h-4 w-4 group-hover:text-cyan-400 transition-colors" />
            </button>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all text-xs shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                <span>Buscar anotações...</span>
              </div>
              <kbd className="flex items-center gap-0.5 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                Ctrl K
              </kbd>
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main Direct Link */}
          <div>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2.5 rounded-xl text-xs font-medium transition-colors",
                isCollapsed ? "justify-center p-2.5" : "px-3 py-2",
                pathname === "/"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              )}
              title={isCollapsed ? "Visão Geral & Destaques" : undefined}
            >
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Visão Geral & Destaques</span>}
            </Link>
          </div>

          {/* Categories Accordion & Collapsed Flyouts */}
          <div className="space-y-3">
            {navigationGroups.map((group) => {
              const Icon = group.icon;
              const isOpen = openGroups[group.title] ?? true;
              const isFlyoutOpen = activeFlyout?.title === group.title;
              const hasActiveChild = group.items.some((i) => pathname === i.href);

              if (isCollapsed) {
                // Modo Recolhido: Botão de Categoria com Ícone
                return (
                  <div key={group.title} className="flex flex-col items-center">
                    <button
                      onClick={(e) => handleCollapsedCategoryClick(e, group)}
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer group relative",
                        isFlyoutOpen || hasActiveChild
                          ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                      )}
                      title={`${group.title} (Clique para ver os ${group.items.length} tópicos)`}
                    >
                      <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", group.color)} />
                      {hasActiveChild && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950" />
                      )}
                    </button>
                  </div>
                );
              }

              // Modo Expandido: Sanfona embutida normal
              return (
                <div key={group.title} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", group.color)} />
                      <span className="text-[11px] font-mono truncate">{group.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 shrink-0",
                        isOpen ? "transform rotate-0" : "transform -rotate-90"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col space-y-0.5 pl-3 border-l border-zinc-800/80 ml-3">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all",
                              isActive
                                ? "text-cyan-400 bg-cyan-500/10 font-medium"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                            )}
                          >
                            <span className="truncate">{item.title}</span>
                            {item.badge && (
                              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded shrink-0 ml-1.5">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/40 text-[11px] text-zinc-500 flex items-center justify-between overflow-hidden">
          {isCollapsed ? (
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center p-1 text-zinc-500 hover:text-cyan-400 transition-colors"
              title="Expandir menu lateral"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">TechNotes Engine</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 shrink-0">
                {dynamicNotes.length} notas MD
              </span>
            </>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* POPOVER FLUTUANTE GLOBAL (RENDERIZADO FORA DO OVERFLOW PARA NÃO SER CORTADO) */}
      {/* ========================================================================= */}
      {isCollapsed && activeFlyout && (
        <div
          ref={flyoutRef}
          style={{
            top: `${Math.max(16, Math.min(typeof window !== "undefined" ? window.innerHeight - 380 : 300, activeFlyout.top))}px`,
          }}
          className="fixed left-[76px] z-50 min-w-[280px] max-w-[340px] rounded-2xl border border-zinc-700/80 bg-zinc-900/98 backdrop-blur-2xl p-3 shadow-2xl shadow-black/90 animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-white/10"
        >
          {/* Cabeçalho do Popover */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <activeFlyout.icon className={cn("h-4 w-4", activeFlyout.color)} />
              <span className="text-xs font-bold text-white font-mono">{activeFlyout.title}</span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
              {activeFlyout.items.length} tópicos
            </span>
          </div>

          {/* Lista de subtópicos com títulos completos e legíveis */}
          <div className="flex flex-col space-y-1 max-h-[360px] overflow-y-auto pr-1">
            {activeFlyout.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveFlyout(null)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all group/item",
                    isActive
                      ? "bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/30"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/80"
                  )}
                >
                  <span className="truncate pr-2 font-medium">{item.title}</span>
                  {item.badge ? (
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded shrink-0">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="h-3 w-3 text-zinc-600 group-hover/item:text-zinc-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Global search palette */}
      <CommandMenu
        open={searchOpen}
        setOpen={setSearchOpen}
        dynamicNotes={dynamicNotes}
      />
    </>
  );
}
