"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import { Info, ExternalLink } from "lucide-react";
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-8 mb-4 border-b border-zinc-800 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-3 flex items-center gap-2">
              <span className="text-blue-500 font-mono text-base select-none">#</span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-zinc-300 leading-relaxed mb-4 text-sm sm:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 list-disc list-inside my-4 pl-2 text-zinc-300 text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 list-decimal list-inside my-4 pl-2 text-zinc-300 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 my-4 flex gap-3 text-xs leading-relaxed text-blue-200">
              <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 [&>p]:mb-0">{children}</div>
            </div>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
              <table className="w-full text-left text-xs border-collapse font-sans">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-900/80 text-zinc-200 font-mono border-b border-zinc-800">
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
            <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[11px] text-zinc-400">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-zinc-300">
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
              <span className="block my-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={alt || "Imagem da nota"}
                  className="w-full h-auto rounded-xl object-contain max-h-[600px] mx-auto bg-zinc-950/80"
                  loading="lazy"
                />
                {alt && alt !== "alt text" && (
                  <span className="block text-center text-xs text-zinc-400 mt-2 font-mono">
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
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 inline-flex items-center gap-1"
                >
                  {children}
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
              );
            }
            return (
              <Link
                href={href || "#"}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
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
                <code className="rounded bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 text-xs font-mono text-zinc-200 text-blue-300">
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
