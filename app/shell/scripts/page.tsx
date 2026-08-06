import Link from "next/link";
import { Terminal, ChevronRight, Code2, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Scripts & Automação Shell - TechNotes",
  description: "Criação de scripts com passagem de argumentos, condicionais e loops no Bash.",
};

export default function ShellScriptsPage() {
  return (
    <article className="space-y-10 pb-20">
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Shell & Linux</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-emerald-400 font-medium">Scripts & Automação</span>
      </nav>

      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">#bash</Badge>
          <Badge variant="purple">#automacao</Badge>
          <Badge variant="outline">#scripts</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Scripts & Automação Shell
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Aprenda a estruturar scripts profissionais com tratamento de argumentos ($1, $@),
          estruturas condicionais com [[ ... ]] e loops com paralelismo controlado.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Loops e Argumentos
          </h2>
        </div>

        <CodeBlock
          filename="processar_arquivos.sh"
          language="bash"
          showLineNumbers={true}
          code={`#!/usr/bin/env bash
set -euo pipefail

# Verificar se um diretório foi passado como argumento
if [ $# -eq 0 ]; then
    echo "Uso: $0 <diretorio_alvo>" >&2
    exit 1
fi

TARGET_DIR="$1"

for file in "$TARGET_DIR"/*.png; do
    [ -e "$file" ] || continue
    echo "➜ Otimizando imagem: $file"
    # cwebp -q 80 "$file" -o "\${file%.png}.webp"
done

echo "✓ Todas as imagens foram processadas com sucesso!"`}
        />
      </section>
    </article>
  );
}
