import Link from "next/link";
import { Cpu, ChevronRight, Clock, Calendar, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "React 19 Hooks & Server Actions - TechNotes",
  description: "Novidades do React 19: useActionState, useOptimistic, use e Server Actions.",
};

export default function React19Page() {
  return (
    <article className="space-y-10 pb-20">
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">Desenvolvimento Web</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-blue-400 font-medium">React 19</span>
      </nav>

      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">#react19</Badge>
          <Badge variant="success">#hooks</Badge>
          <Badge variant="purple">#optimistic</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          React 19: Novos Hooks e Recursos
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Guia sobre as principais adições do React 19, incluindo a simplificação de formulários com
          <code className="text-blue-400 font-mono"> useActionState</code> e atualizações otimistas com
          <code className="text-blue-400 font-mono"> useOptimistic</code>.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. useActionState para Formulários
          </h2>
        </div>

        <CodeBlock
          filename="ContactForm.tsx"
          language="tsx"
          showLineNumbers={true}
          code={`"use client";

import { useActionState } from "react";
import { submitMessage } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitMessage, { success: false });

  return (
    <form action={formAction} className="space-y-4">
      <input name="email" type="email" placeholder="seu@email.com" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar Mensagem"}
      </button>
      {state.error && <p className="text-red-400">{state.error}</p>}
    </form>
  );
}`}
        />
      </section>
    </article>
  );
}
