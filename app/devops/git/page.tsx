import {
  FolderGit2,
  GitBranch,
  GitMerge,
  GitCommit,
  GitPullRequest,
  CheckCircle,
  AlertOctagon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ArticleLayout } from "@/components/ArticleLayout";

export const metadata = {
  title: "Git Workflow & Boas Práticas - TechNotes",
  description: "Guia completo sobre Rebase Interativo, Squash, Cherry-pick e Commits Semânticos.",
};

export default function GitWorkflowPage() {
  return (
    <ArticleLayout
      breadcrumbs={[
        { label: "DevOps & Ferramentas" },
        { label: "Git Workflow" },
      ]}
    >

      {/* Header Section */}
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="warning">#git</Badge>
          <Badge variant="blue">#workflow</Badge>
          <Badge variant="purple">#rebase</Badge>
          <Badge variant="outline">#boas-praticas</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Git Workflow & Boas Práticas
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Estratégias para manter um histórico de commits limpo, linear e sem ruídos em equipes.
          Domine o rebase interativo, squash, cherry-pick e a convenção de commits semânticos.
        </p>
      </header>

      {/* Section 1: Git Merge vs Rebase */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Git Merge vs Git Rebase
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Ambos os comandos integram alterações de uma branch para outra, mas com filosofias bem diferentes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400 font-mono">
              <GitMerge className="h-4 w-4" />
              <span>git merge</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cria um novo commit de merge extra. Preserva a linha do tempo exata de quando as coisas aconteceram, mas polui o histórico com commits como <em>"Merge branch 'main' into feature"</em>.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400 font-mono">
              <GitPullRequest className="h-4 w-4" />
              <span>git rebase (Recomendado)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Reescreve o ponto de partida da sua branch de feature no topo da branch principal. O histórico fica 100% linear, facilitando <code className="text-amber-300 font-mono">git bisect</code> e auditoria.
            </p>
          </div>
        </div>

        <CodeBlock
          filename="rebase-workflow.sh"
          language="bash"
          code={`# 1. Atualize sua cópia local da main
git checkout main
git pull origin main

# 2. Volte para sua feature branch e faça o rebase
git checkout feature/nova-tela
git rebase main

# 3. Se houver conflitos, resolva nos arquivos e continue:
git add .
git rebase --continue

# 4. Envie para o repositório remoto com force seguro:
git push origin feature/nova-tela --force-with-lease`}
        />
      </section>

      {/* Section 2: Interactive Rebase & Squash */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <GitCommit className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Rebase Interativo & Squash de Commits
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Antes de abrir um Pull Request, você pode agrupar múltiplos commits de teste (ex: <em>"ajuste"</em>, <em>"fix typo"</em>, <em>"wip"</em>) em um único commit coeso e profissional utilizando <strong className="text-white">squash</strong>.
        </p>

        <CodeBlock
          filename="interactive-squash.sh"
          language="bash"
          code={`# Iniciar rebase interativo dos últimos 4 commits
git rebase -i HEAD~4

# No editor que abrir:
# p, pick 1a2b3c4 feat: adicionar componente de busca
# s, squash 5d6e7f8 fix: corrigir padding do input
# s, squash 9g0h1i2 chore: remover console.log
# s, squash 3j4k5l6 style: ajustar cores dark mode

# Salve e feche o editor. O Git juntará todos no primeiro commit!`}
        />
      </section>

      {/* Section 3: Conventional Commits */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Padrão de Commits Semânticos (Conventional Commits)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Estrutura recomendada: <code className="text-purple-400 font-mono font-semibold">tipo(escopo opcional): descrição curta</code>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono my-3">
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold">feat:</span> Nova funcionalidade
            </div>
            <span className="text-zinc-500 text-[11px]">feat(auth): login com google</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-red-400 font-bold">fix:</span> Correção de bug
            </div>
            <span className="text-zinc-500 text-[11px]">fix(api): tratar timeout</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-blue-400 font-bold">refactor:</span> Refatoração sem mudar regra
            </div>
            <span className="text-zinc-500 text-[11px]">refactor(ui): isolar sidebar</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-amber-400 font-bold">perf:</span> Melhoria de desempenho
            </div>
            <span className="text-zinc-500 text-[11px]">perf(db): adicionar índices</span>
          </div>
        </div>
      </section>

      {/* Section 4: Golden Rules / Callout */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-2">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <AlertOctagon className="h-4 w-4" />
          <span>Regra de Ouro do Rebase:</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-white">NUNCA</strong> faça rebase em branches públicas compartilhadas (como a <code className="text-zinc-200 font-mono">main</code> ou <code className="text-zinc-200 font-mono">develop</code>). Use o rebase apenas na sua própria branch de trabalho privada antes de mergear.
        </p>
      </div>
    </ArticleLayout>
  );
}
