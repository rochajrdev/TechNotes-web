import { Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ArticleLayout } from "@/components/ArticleLayout";

export const metadata = {
  title: "Tailwind CSS v4 Engine - TechNotes",
  description: "Novidades do Tailwind CSS v4: novo compilador em Rust, @theme inline e sem tailwind.config.js.",
};

export default function TailwindV4Page() {
  return (
    <ArticleLayout
      breadcrumbs={[
        { label: "Desenvolvimento Web" },
        { label: "Tailwind CSS v4" },
      ]}
    >
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
    </ArticleLayout>
  );
}
