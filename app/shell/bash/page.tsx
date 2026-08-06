import Link from "next/link";
import {
  Terminal,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  FileCode,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Fundamentos Shell & Bash - TechNotes",
  description: "Guia completo e prático sobre Streams, Pipes, Redirecionamento, Permissões e Scripts Bash.",
};

export default function BashFundamentalsPage() {
  return (
    <article className="space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Shell & Linux</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-blue-400 font-medium">Fundamentos Bash</span>
      </nav>

      {/* Header Section */}
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">#shell</Badge>
          <Badge variant="blue">#linux</Badge>
          <Badge variant="outline">#automacao</Badge>
          <Badge variant="purple">#guia-pratico</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Fundamentos Shell & Bash
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Guia completo sobre os conceitos fundamentais da linha de comando: manipulação de
          fluxos de entrada e saída (streams), encadeamento com pipes, permissões de arquivos e boas
          práticas na escrita de scripts.
        </p>
      </header>

      {/* Section 1: Standard Streams */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Os 3 Fluxos Padrão (Standard Streams)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          No ecossistema Unix/Linux, todo processo que é executado no terminal nasce conectado a
          três canais básicos de comunicação (file descriptors):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-blue-400">STDIN (0)</span>
              <span className="text-[10px] font-mono text-zinc-500">Entrada</span>
            </div>
            <p className="text-xs text-zinc-400">
              O fluxo de onde o comando lê dados (normalmente o teclado ou o redirecionamento de um arquivo).
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">STDOUT (1)</span>
              <span className="text-[10px] font-mono text-zinc-500">Saída Padrão</span>
            </div>
            <p className="text-xs text-zinc-400">
              O fluxo onde o comando imprime suas respostas e resultados normais de execução.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-red-400">STDERR (2)</span>
              <span className="text-[10px] font-mono text-zinc-500">Saída de Erro</span>
            </div>
            <p className="text-xs text-zinc-400">
              O fluxo separado e dedicado exclusivamente para exibir avisos e mensagens de erro.
            </p>
          </div>
        </div>

        {/* Redirection Code Examples */}
        <h3 className="text-base font-semibold text-zinc-200 pt-2">
          Redirecionamentos Comuns
        </h3>

        <CodeBlock
          filename="streams-redirection.sh"
          language="bash"
          code={`# 1. Redirecionar a saída padrão para um arquivo (sobrescrevendo)
echo "Servidor iniciado" > logs.txt

# 2. Anexar na saída padrão sem apagar o conteúdo existente (append)
echo "Nova requisição recebida" >> logs.txt

# 3. Descartar mensagens de erro enviando para o buraco negro /dev/null
find /var/www -name "*.conf" 2> /dev/null

# 4. Redirecionar STDOUT e STDERR para o mesmo arquivo de log
node server.js > app.log 2>&1
# Equivalente moderno no Bash:
node server.js &> app.log`}
        />
      </section>

      {/* Section 2: Pipes & Filters */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Encadeamento com Pipes (|)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          O pipe (<code className="text-emerald-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">|</code>) conecta o <strong className="text-white">STDOUT</strong> do comando à esquerda diretamente ao <strong className="text-white">STDIN</strong> do comando à direita, permitindo criar pipelines poderosos de processamento sem salvar arquivos temporários em disco.
        </p>

        <CodeBlock
          filename="pipeline-analise-logs.sh"
          language="bash"
          code={`# Exemplo: Descobrir os 5 IPs que mais fizeram requisições em um log Nginx
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5

# Exemplo: Localizar processos NodeJS consumindo muita memória
ps aux | grep node | grep -v grep | sort -k4 -nr`}
        />

        {/* Callout Tip */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-xs leading-relaxed text-blue-200">
          <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-blue-300">Dica de Performance:</strong> Em vez de rodar <code className="font-mono text-zinc-300">cat arquivo | grep termo</code>, use diretamente <code className="font-mono text-zinc-300">grep termo arquivo</code> para evitar a criação de um processo extra desnecessário (conhecido como <em>"Useless Use of Cat"</em>).
          </div>
        </div>
      </section>

      {/* Section 3: Permissions chmod & chown */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Permissões de Arquivo (chmod & chown)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          As permissões no Linux são divididas em 3 níveis: <strong className="text-white">Owner (u)</strong>, <strong className="text-white">Group (g)</strong> e <strong className="text-white">Others (o)</strong>. Cada um possui três tipos de acesso com valores numéricos:
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono my-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="text-emerald-400 font-bold text-sm">4 (r)</div>
            <div className="text-zinc-400 text-[11px]">Read (Leitura)</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="text-amber-400 font-bold text-sm">2 (w)</div>
            <div className="text-zinc-400 text-[11px]">Write (Escrita)</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="text-blue-400 font-bold text-sm">1 (x)</div>
            <div className="text-zinc-400 text-[11px]">Execute (Execução)</div>
          </div>
        </div>

        <CodeBlock
          filename="permissoes.sh"
          language="bash"
          code={`# Tornar um script executável apenas pelo proprietário
chmod 700 deploy.sh

# Permissão padrão para scripts compartilhados (rwxr-xr-x)
chmod 755 build.sh
# Equivalente com sintaxe simbólica:
chmod +x build.sh

# Alterar o dono do arquivo para o usuário atual
sudo chown usuario:grupo arquivo.txt`}
        />
      </section>

      {/* Section 4: Safe Script Template */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            4. Template Seguro para Scripts de Automação
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Ao escrever scripts Bash em produção, utilize sempre o modo estrito (<code className="text-purple-300 font-mono">set -euo pipefail</code>) para interromper a execução imediatamente ao encontrar erros ou variáveis indefinidas:
        </p>

        <CodeBlock
          filename="automacao-segura.sh"
          language="bash"
          showLineNumbers={true}
          code={`#!/usr/bin/env bash
# ==============================================================================
# Script de Backup e Deploy Automatizado
# ==============================================================================

# Modo estrito para robustez:
set -euo pipefail

# Constantes e variáveis:
readonly BACKUP_DIR="/tmp/backups"
readonly TARGET_FILE="dados_$(date +%Y%m%d_%H%M%S).tar.gz"

echo "➜ Iniciando rotina de backup..."
mkdir -p "$BACKUP_DIR"

if [ -d "/var/www/app" ]; then
    tar -czf "$BACKUP_DIR/$TARGET_FILE" /var/www/app
    echo "✓ Backup concluído com sucesso em: $BACKUP_DIR/$TARGET_FILE"
else
    echo "✗ Erro: Diretório /var/www/app não encontrado!" >&2
    exit 1
fi`}
        />
      </section>

      {/* Summary Footer */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Próximo Passo Recomendado</span>
          </div>
          <p className="text-xs text-zinc-400">
            Pratique executando os pipelines no seu terminal local ou use a busca para explorar mais comandos.
          </p>
        </div>
        <Link href="/">
          <button className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white text-xs font-medium transition-colors whitespace-nowrap">
            Voltar para o Dashboard
          </button>
        </Link>
      </div>
    </article>
  );
}
