import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ArticleLayout } from "@/components/ArticleLayout";

export const metadata = {
  title: "React 19 Hooks & Server Actions - TechNotes",
  description: "Novidades do React 19: useActionState, useOptimistic, use e Server Actions.",
};

export default function React19Page() {
  return (
    <ArticleLayout
      breadcrumbs={[
        { label: "Desenvolvimento Web" },
        { label: "React 19" },
      ]}
    >
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
          Guia sobre as principais adições do React 19, incluindo a simplificação de formulários com{" "}
          <code className="text-blue-400 font-mono">useActionState</code> e atualizações otimistas com{" "}
          <code className="text-blue-400 font-mono">useOptimistic</code>.
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
    </ArticleLayout>
  );
}
