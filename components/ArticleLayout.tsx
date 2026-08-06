"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Bookmark, ArrowLeft, Download, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ArticleLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  markdownContent?: string;
  exportFilename?: string;
  showFooter?: boolean;
  className?: string;
}

export function ArticleLayout({
  children,
  breadcrumbs,
  markdownContent,
  exportFilename,
  showFooter = true,
  className,
}: ArticleLayoutProps) {
  const handleDownloadPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadMD = () => {
    if (!markdownContent || typeof window === "undefined") return;

    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const safeFilename = (exportFilename || "nota")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-");

    link.setAttribute("download", `${safeFilename}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <article className={cn("max-w-4xl xl:max-w-5xl mx-auto space-y-10 pb-20", className)}>
      {/* Printable Document Header (Visível apenas ao gerar PDF / Imprimir) */}
      <div className="hidden print:block mb-8 border-b border-zinc-300 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">TechNotes - Documentação Técnica</h1>
            <p className="text-xs text-zinc-600">Base de Conhecimento e Referências de Código</p>
          </div>
          <div className="text-right text-xs font-mono text-zinc-500">
            {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>

      {/* Top Action & Breadcrumbs Bar (Escondida no PDF/Impressão) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4 print:hidden">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 overflow-x-auto custom-scrollbar py-1">
            <Link href="/" className="hover:text-zinc-300 transition-colors shrink-0">
              Início
            </Link>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <ChevronRight className="h-3 w-3 text-zinc-600 shrink-0" />
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-zinc-300 transition-colors shrink-0">
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        isLast
                          ? "text-blue-400 font-medium truncate max-w-[200px] sm:max-w-none"
                          : "text-zinc-400 shrink-0"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        ) : (
          <div />
        )}

        {/* Grupo de Ações de Download (Mobile: Grid de 2 Colunas de Largura Total | Desktop: Flex Inline) */}
        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto shrink-0">
          {markdownContent && (
            <button
              onClick={handleDownloadMD}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-md group active:scale-95 cursor-pointer w-full md:w-auto"
              title="Exportar anotação em formato Markdown (.md)"
              type="button"
            >
              <FileCode className="h-3.5 w-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Exportar MD</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-md group active:scale-95 cursor-pointer w-full md:w-auto"
            title="Baixar página em formato PDF"
            type="button"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal do Artigo */}
      {children}

      {/* Navigation Footer */}
      {showFooter && (
        <footer className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">TechNotes Documentation Engine</div>
              <p className="text-[11px] text-zinc-400">
                Renderizado via Next.js App Router & React 19
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </footer>
      )}
    </article>
  );
}
