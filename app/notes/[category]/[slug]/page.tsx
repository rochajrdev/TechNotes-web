import { notFound } from "next/navigation";
import { getAllNoteParams, getNoteBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ArticleLayout } from "@/components/ArticleLayout";
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
    <ArticleLayout
      breadcrumbs={[
        { label: note.category },
        { label: note.title },
      ]}
    >
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
        <MarkdownRenderer content={note.content} categorySlug={note.categorySlug} />
      </section>
    </ArticleLayout>
  );
}
