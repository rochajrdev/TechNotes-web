import Link from "next/link";
import {
  Terminal,
  BookOpen,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react";
import { AnimatedTerminal } from "@/components/magicui/animated-terminal";
import { BentoGrid } from "@/components/BentoGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllNotes } from "@/lib/content";

export default function Home() {
  const dynamicNotes = getAllNotes();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-400 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Base de Conhecimento & Cheatsheets Técnicos</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Documentação prática para{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Devs & Engenheiros
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Um repositório estruturado de anotações técnicas, linhas de comando, snippets prontos e
            guias essenciais de Shell/Linux, Next.js, Git e DevOps.
          </p>
        </div>

        {/* Action Buttons & Quick Stats */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link href="/shell/bash">
            <Button variant="neon" size="default" className="gap-2">
              <Terminal className="h-4 w-4" />
              <span>Explorar Fundamentos Bash</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pl-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {dynamicNotes.length + 9} Guias & Notas
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              Markdown Dinâmico Ativo
            </span>
          </div>
        </div>
      </section>

      {/* Dynamic Markdown Notes Section */}
      {dynamicNotes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                Notas & Artigos em Markdown (.md)
              </h2>
              <p className="text-xs text-zinc-400">
                Arquivos detectados e carregados automaticamente da pasta <code className="font-mono text-zinc-300">content/</code>.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {dynamicNotes.length} notas carregadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicNotes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.categorySlug}/${note.slug}`}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                      {note.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {note.readingTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {note.title}
                  </h3>

                  {note.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {note.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-blue-400 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Ler nota
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Terminal Demo */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wider">
              Terminal Interativo & Simulador de Comandos
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Clique nas abas para alternar
          </span>
        </div>

        <AnimatedTerminal />
      </section>

      {/* Bento Grid: Topics & Modules */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-400" />
              Módulos de Estudo & Tópicos
            </h2>
            <p className="text-xs text-zinc-400">
              Selecione um tópico para acessar comandos, explicações detalhadas e cheatsheets.
            </p>
          </div>
        </div>

        <BentoGrid />
      </section>

      {/* Quick Tips / Callout */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-blue-950/20 via-zinc-900/40 to-zinc-950 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Navegação Rápida com Teclado</span>
          </div>
          <p className="text-xs text-zinc-400">
            Use o atalho <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[11px] font-mono text-zinc-300">Ctrl + K</kbd> em qualquer tela para abrir a busca instantânea de notas.
          </p>
        </div>
      </section>
    </div>
  );
}
