import * as React from "react";
import Link from "next/link";
import { ChevronRight, Bookmark, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ArticleLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showFooter?: boolean;
  className?: string;
}

export function ArticleLayout({
  children,
  breadcrumbs,
  showFooter = true,
  className,
}: ArticleLayoutProps) {
  return (
    <article className={cn("max-w-4xl xl:max-w-5xl mx-auto space-y-10 pb-20", className)}>
      {/* Navigation Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Início
          </Link>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="h-3 w-3 text-zinc-600" />
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-zinc-300 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      isLast
                        ? "text-blue-400 font-medium truncate max-w-[200px] sm:max-w-none"
                        : "text-zinc-400"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Conteúdo Principal do Artigo */}
      {children}

      {/* Navigation Footer */}
      {showFooter && (
        <footer className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
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
