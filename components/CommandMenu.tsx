"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Terminal,
  FolderGit2,
  Container,
  Layers,
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";
import type { NoteMetadata } from "@/lib/content";
import { getNoteHref } from "@/lib/note-path";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dynamicNotes?: NoteMetadata[];
}

export function CommandMenu({ open, setOpen, dynamicNotes = [] }: CommandMenuProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  // Separa as notas dinâmicas por categoria
  const shellNotes = dynamicNotes.filter((n) => n.categorySlug.toLowerCase() === "shell");
  const webNotes = dynamicNotes.filter((n) => n.categorySlug.toLowerCase() === "web");
  const devopsNotes = dynamicNotes.filter((n) => n.categorySlug.toLowerCase() === "devops");
  const baseCategoryKeys = new Set(["shell", "web", "devops"]);
  const customNotes = dynamicNotes.filter((n) => !baseCategoryKeys.has(n.categorySlug.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm pt-[15vh] p-4 animate-in fade-in-0 duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl shadow-blue-500/10 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full">
          <div className="flex items-center border-b border-zinc-800 px-4 py-3">
            <Search className="mr-3 h-5 w-5 text-zinc-400" />
            <Command.Input
              placeholder="Buscar anotações, comandos, categorias..."
              className="flex-1 bg-transparent text-sm placeholder:text-zinc-500 outline-none text-zinc-100 font-sans"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-sm">
            <Command.Empty className="py-6 text-center text-xs text-zinc-500">
              Nenhuma anotação ou comando encontrado.
            </Command.Empty>

            <Command.Group heading="Navegação Geral" className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>Página Inicial (Dashboard)</span>
                </div>
                <ArrowRight className="h-3 w-3 text-zinc-600" />
              </Command.Item>
            </Command.Group>

            {/* Shell & Linux */}
            <Command.Group heading="Shell & Linux" className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/shell/bash"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>Fundamentos Bash & Streams</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                  #shell
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/shell/comandos"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span>Comandos Essenciais de Terminal</span>
                </div>
              </Command.Item>

              {shellNotes.map((note) => (
                <Command.Item
                  key={getNoteHref(note)}
                  onSelect={() => runCommand(() => router.push(getNoteHref(note)))}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-emerald-600/20 hover:text-emerald-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">{note.title}</div>
                      {note.description && (
                        <div className="text-[11px] text-zinc-500 truncate max-w-sm">{note.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                    MD
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Desenvolvimento Web */}
            <Command.Group heading="Desenvolvimento Web" className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/web/nextjs"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span>Next.js 16 App Router & Server Components</span>
                </div>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                  #nextjs
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/web/react"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>React 19 Hooks (useActionState)</span>
                </div>
              </Command.Item>

              {webNotes.map((note) => (
                <Command.Item
                  key={getNoteHref(note)}
                  onSelect={() => runCommand(() => router.push(getNoteHref(note)))}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-blue-600/20 hover:text-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="font-medium">{note.title}</div>
                      {note.description && (
                        <div className="text-[11px] text-zinc-500 truncate max-w-sm">{note.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                    MD
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* DevOps & Ferramentas */}
            <Command.Group heading="DevOps & Ferramentas" className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/devops/git"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="h-4 w-4 text-amber-400" />
                  <span>Git Workflow, Rebase & Commits Semânticos</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/devops/docker"))}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Container className="h-4 w-4 text-cyan-400" />
                  <span>Docker Multi-stage & Compose</span>
                </div>
              </Command.Item>

              {devopsNotes.map((note) => (
                <Command.Item
                  key={getNoteHref(note)}
                  onSelect={() => runCommand(() => router.push(getNoteHref(note)))}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-cyan-600/20 hover:text-cyan-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="font-medium">{note.title}</div>
                      {note.description && (
                        <div className="text-[11px] text-zinc-500 truncate max-w-sm">{note.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                    MD
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Outras Categorias Customizadas */}
            {customNotes.length > 0 && (
              <Command.Group heading="Outras Categorias & Tópicos" className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-2">
                {customNotes.map((note) => (
                  <Command.Item
                    key={getNoteHref(note)}
                    onSelect={() => runCommand(() => router.push(getNoteHref(note)))}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-zinc-300 hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="font-medium">{note.title}</div>
                        <div className="text-[10px] text-zinc-500">{note.category}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                      MD
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/60 px-4 py-2 text-[11px] text-zinc-500 font-mono">
            <span>Navegue com as setas ↑ ↓</span>
            <span>Pressione ENTER para abrir</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
