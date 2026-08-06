import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Bookmark, ArrowLeft } from "lucide-react";
import { getAllNoteParams, getNoteBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import type { Metadata } from "next";

interface NotePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllNoteParams();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const note = getNoteBySlug(category, slug);

  if (!note) {
    return {
      title: "Nota não encontrada - TechNotes",
    };
  }

  return {
    title: `${note.title} - TechNotes`,
    description: note.description,
  };
}

export default async function DynamicNotePage({ params }: NotePageProps) {
  const { category, slug } = await params;
  const note = getNoteBySlug(category, slug);

  if (!note) {
    notFound();
  }

  return (
    <article className="space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400 capitalize">{note.category}</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-blue-400 font-medium truncate max-w-[200px] sm:max-w-none">
          {note.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="blue">
              {tag}
            </Badge>
          ))}
          {note.badge && <Badge variant="purple">{note.badge}</Badge>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {note.title}
        </h1>

        {note.description && (
          <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
            {note.description}
          </p>
        )}
      </header>

      {/* Markdown Content Body */}
      <section className="mt-6">
        <MarkdownRenderer content={note.content} />
      </section>

      {/* Navigation Footer */}
      <footer className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">TechNotes Markdown Engine</div>
            <p className="text-[11px] text-zinc-400">Renderizado dinamicamente via Markdown & React 19</p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao Dashboard</span>
        </Link>
      </footer>
    </article>
  );
}
