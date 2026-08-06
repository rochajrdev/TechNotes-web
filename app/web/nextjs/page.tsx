import Link from "next/link";
import {
  Layers,
  ChevronRight,
  Cpu,
  Zap,
  Server,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Next.js 16 & Server Components - TechNotes",
  description: "Guia completo sobre React Server Components, Server Actions e Caching no Next.js.",
};

export default function NextjsGuidePage() {
  return (
    <article className="space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Desenvolvimento Web</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-blue-400 font-medium">Next.js App Router</span>
      </nav>

      {/* Header Section */}
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">#nextjs16</Badge>
          <Badge variant="purple">#rsc</Badge>
          <Badge variant="success">#react19</Badge>
          <Badge variant="outline">#server-actions</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Next.js 16 & Server Components
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Entenda a fundo a divisão entre React Server Components (RSC) e Client Components,
          como buscar dados diretamente no servidor sem APIs intermediárias e como usar Server Actions de forma segura.
        </p>
      </header>

      {/* Section 1: RSC vs Client Components */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Server Components vs Client Components
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          No App Router, <strong className="text-white">todos os componentes são Server Components por padrão</strong>. Eles só se tornam componentes de cliente quando você declara explicitamente a diretiva <code className="text-blue-400 font-mono">"use client"</code> no topo do arquivo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400 font-mono">
              <Server className="h-4 w-4" />
              <span>Server Component (Padrão)</span>
            </div>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              <li>Acessa banco de dados e APIs diretamente</li>
              <li>Mantém chaves e tokens secretos protegidos</li>
              <li>Envia zero bundle JavaScript ao navegador</li>
              <li>Não pode usar hooks (<code className="text-zinc-400 font-mono">useState</code>, <code className="text-zinc-400 font-mono">useEffect</code>)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 font-mono">
              <Monitor className="h-4 w-4" />
              <span>Client Component ("use client")</span>
            </div>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              <li>Interatividade imediata do usuário (onClick, onChange)</li>
              <li>Uso de hooks React de estado e efeitos</li>
              <li>Acesso a APIs do browser (localStorage, navigator)</li>
              <li>Animações interativas (Framer Motion)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Async Data Fetching in RSC */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Busca Direta de Dados no Servidor (Async RSC)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Com React Server Components, funções de página podem ser funções assíncronas normais (<code className="text-emerald-400 font-mono">async/await</code>), consultando o banco ou fontes de dados sem carregar spinners de loading desnecessários no cliente:
        </p>

        <CodeBlock
          filename="app/notes/page.tsx"
          language="tsx"
          showLineNumbers={true}
          code={`// Server Component puro: busca dados direto no servidor
import { db } from "@/lib/db";

export default async function NotesPage() {
  // Executa exclusivamente no Node.js do servidor durante o SSR/SSG
  const notes = await db.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Minhas Anotações</h1>
      <ul className="divide-y divide-zinc-800">
        {notes.map((note) => (
          <li key={note.id} className="py-3">
            <h2 className="font-semibold text-blue-400">{note.title}</h2>
            <p className="text-xs text-zinc-400">{note.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`}
        />
      </section>

      {/* Section 3: Server Actions */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Server Actions & Revalidação de Cache
          </h2>
        </div>

        <CodeBlock
          filename="app/actions.ts"
          language="typescript"
          code={`"use server";

import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // 1. Salvar no banco
  // await db.note.create({ data: { title, content } });

  // 2. Limpar o cache da página para atualizar a lista instantaneamente
  revalidatePath("/notes");
}`}
        />
      </section>
    </article>
  );
}
