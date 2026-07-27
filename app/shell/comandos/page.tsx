import Link from "next/link";
import { Terminal, ChevronRight, Clock, Calendar, Zap, Search, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Comandos Essenciais Linux/Shell - TechNotes",
  description: "Cheatsheet de comandos de busca, disco, processos e rede no terminal.",
};

export default function ShellComandosPage() {
  return (
    <article className="space-y-10 pb-20">
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Shell & Linux</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-emerald-400 font-medium">Comandos Essenciais</span>
      </nav>

      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">#shell</Badge>
          <Badge variant="blue">#cheatsheet</Badge>
          <Badge variant="outline">#produtividade</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Comandos Essenciais de Terminal
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Referência rápida com os comandos mais utilizados no dia a dia para inspeção de arquivos,
          gerenciamento de processos, monitoramento de disco e rede.
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            6 min de leitura
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            Cheatsheet Rápido
          </span>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Busca & Filtros (grep, find, ripgrep)
          </h2>
        </div>

        <CodeBlock
          filename="busca.sh"
          language="bash"
          code={`# Buscar texto recursivamente ignorando maiúsculas/minúsculas
grep -rni "DATABASE_URL" .

# Encontrar arquivos modificados nos últimos 2 dias
find . -type f -mtime -2

# Localizar arquivos maiores que 100MB
find / -type f -size +100M 2>/dev/null`}
        />
      </section>

      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Espaço em Disco & Memória
          </h2>
        </div>

        <CodeBlock
          filename="disco-memoria.sh"
          language="bash"
          code={`# Espaço livre em disco em formato legível (GB/MB)
df -h

# Tamanho das 10 maiores pastas no diretório atual
du -sh * | sort -hr | head -n 10

# Memória RAM livre e utilizada em Megabytes
free -m -h`}
        />
      </section>
    </article>
  );
}
