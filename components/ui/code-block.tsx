"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "bash",
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "group relative my-4 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/90 shadow-2xl font-mono text-sm break-inside-avoid",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-medium text-zinc-300 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            {filename || language}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" />
              <span className="text-emerald-400 font-sans">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="font-sans">Copiar</span>
            </>
          )}
        </Button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4 text-zinc-200">
        <pre className="text-xs leading-relaxed">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none pr-4 text-right text-zinc-600">
                    {idx + 1}
                  </span>
                )}
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
