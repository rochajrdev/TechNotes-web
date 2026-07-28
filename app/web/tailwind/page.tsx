import Link from "next/link";
import { Zap, ChevronRight, Clock, Calendar, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Tailwind CSS v4 Engine - TechNotes",
  description: "Novidades do Tailwind CSS v4: novo compilador em Rust, @theme inline e sem tailwind.config.js.",
};

export default function TailwindV4Page() {
  return (
    <article className="space-y-10 pb-20">
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Desenvolvimento Web</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-purple-400 font-medium">Tailwind CSS v4</span>
      </nav>

      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="purple">#tailwind4</Badge>
          <Badge variant="blue">#css</Badge>
          <Badge variant="outline">#design-system</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Tailwind CSS v4: A Nova Engine
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Entenda as mudanças do Tailwind CSS v4: compilação ultrarrápida com Lightning CSS,
          configuração direta no arquivo CSS com <code className="text-purple-400 font-mono">@theme</code> e eliminação do arquivo de config JavaScript.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Configuração via @theme no CSS
          </h2>
        </div>

        <CodeBlock
          filename="app/globals.css"
          language="css"
          code={`@import "tailwindcss";

@theme inline {
  --color-brand-primary: #3b82f6;
  --font-mono: var(--font-geist-mono), monospace;
}`}
        />
      </section>
    </article>
  );
}
