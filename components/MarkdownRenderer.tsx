"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Info,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  AlertOctagon,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  categorySlug?: string;
  className?: string;
}

export function MarkdownRenderer({ content, categorySlug, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content space-y-6 text-sm leading-relaxed text-zinc-300", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-10 mb-4 border-b border-zinc-800 pb-3 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-10 mb-4 flex items-center gap-2.5 border-b border-zinc-800/80 pb-2.5">
              <span className="text-cyan-400 font-mono text-lg font-extrabold select-none">#</span>
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight mt-7 mb-3 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-purple-400 shrink-0" />
              <span>{children}</span>
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-zinc-300 leading-relaxed mb-4 text-sm sm:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2.5 my-5 pl-5 text-zinc-300 text-sm list-disc marker:text-cyan-400 [&>li]:pl-1.5 [&>li]:leading-relaxed">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 my-5 pl-5 text-zinc-300 text-sm list-decimal marker:text-cyan-400 marker:font-mono marker:font-bold [&>li]:pl-1.5 [&>li]:leading-relaxed">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => {
            // Extrai texto para identificar alertas no estilo GitHub: > [!NOTE], [!WARNING], etc.
            const rawChildren = React.Children.toArray(children);
            let alertType: "note" | "tip" | "important" | "warning" | "caution" | null = null;
            let cleanChildren = children;

            const firstChild = rawChildren[0];
            if (firstChild && typeof firstChild === "object" && "props" in firstChild) {
              const pProps = (firstChild as React.ReactElement<{ children?: React.ReactNode }>).props;
              if (pProps && pProps.children) {
                const text = Array.isArray(pProps.children)
                  ? String(pProps.children[0] || "")
                  : String(pProps.children || "");

                const match = text.match(/^\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
                if (match) {
                  const typeStr = match[1].toLowerCase();
                  if (
                    typeStr === "note" ||
                    typeStr === "tip" ||
                    typeStr === "important" ||
                    typeStr === "warning" ||
                    typeStr === "caution"
                  ) {
                    alertType = typeStr;

                    // Remove o prefixo [!TYPE] do parágrafo
                    const cleanedText = text.replace(/^\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "");
                    cleanChildren = React.Children.map(children, (child, idx) => {
                      if (idx === 0 && React.isValidElement<{ children?: React.ReactNode }>(child)) {
                        return React.cloneElement(child, {
                          children: cleanedText,
                        });
                      }
                      return child;
                    });
                  }
                }
              }
            }

            // Configuração dos cartões de alerta por tipo
            const alertConfigs = {
              note: {
                icon: Info,
                iconColor: "text-blue-400",
                badge: "Nota",
                styles: "border-blue-500/30 bg-blue-500/5 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.08)]",
              },
              tip: {
                icon: Sparkles,
                iconColor: "text-emerald-400",
                badge: "Dica Prática",
                styles: "border-emerald-500/30 bg-emerald-500/5 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.08)]",
              },
              important: {
                icon: Bookmark,
                iconColor: "text-purple-400",
                badge: "Importante",
                styles: "border-purple-500/30 bg-purple-500/5 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.08)]",
              },
              warning: {
                icon: AlertTriangle,
                iconColor: "text-amber-400",
                badge: "Atenção",
                styles: "border-amber-500/30 bg-amber-500/5 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.08)]",
              },
              caution: {
                icon: AlertOctagon,
                iconColor: "text-rose-400",
                badge: "Cuidado / Regra de Ouro",
                styles: "border-rose-500/30 bg-rose-500/5 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.08)]",
              },
            };

            const activeConfig = alertType ? alertConfigs[alertType] : alertConfigs.note;
            const IconComponent = activeConfig.icon;

            return (
              <div
                className={cn(
                  "rounded-2xl border p-5 my-6 space-y-2 backdrop-blur-md transition-all",
                  activeConfig.styles
                )}
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <IconComponent className={cn("h-4 w-4 shrink-0", activeConfig.iconColor)} />
                  <span>{activeConfig.badge}</span>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed [&>p]:mb-0 font-sans">
                  {cleanChildren}
                </div>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl backdrop-blur-md">
              <table className="w-full text-left text-xs border-collapse font-sans">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-900/90 text-zinc-200 font-mono border-b border-zinc-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-800/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3.5 font-semibold uppercase tracking-wider text-[11px] text-zinc-400">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3.5 text-zinc-300 leading-relaxed">
              {children}
            </td>
          ),
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;

            let imageSrc: string = src;
            const isExternal = src.startsWith("http://") || src.startsWith("https://");

            if (!isExternal) {
              const cleanSrc = src.replace(/^\.\//, "");
              if (src.startsWith("/")) {
                imageSrc = src.startsWith("/api/content-media")
                  ? src
                  : `/api/content-media${src}`;
              } else if (categorySlug) {
                imageSrc = `/api/content-media/${encodeURIComponent(categorySlug)}/${cleanSrc}`;
              } else {
                imageSrc = `/api/content-media/${cleanSrc}`;
              }
            }

            return (
              <span className="block my-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2.5 shadow-2xl backdrop-blur-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={alt || "Imagem da nota"}
                  className="w-full h-auto rounded-xl object-contain max-h-[600px] mx-auto bg-zinc-950/80"
                  loading="lazy"
                />
                {alt && alt !== "alt text" && (
                  <span className="block text-center text-xs text-zinc-400 mt-2.5 font-mono">
                    {alt}
                  </span>
                )}
              </span>
            );
          },
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {children}
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
              );
            }
            return (
              <Link
                href={href || "#"}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-medium transition-colors"
              >
                {children}
              </Link>
            );
          },
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && typeof children === "string" && !children.includes("\n");

            if (isInline) {
              return (
                <code className="rounded-md bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-xs font-mono text-blue-300 shadow-sm">
                  {children}
                </code>
              );
            }

            const codeString = String(children).replace(/\n$/, "");
            const language = match ? match[1] : "bash";

            return (
              <CodeBlock
                code={codeString}
                language={language}
                showLineNumbers={codeString.split("\n").length > 3}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
