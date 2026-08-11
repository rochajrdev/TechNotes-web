import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllNoteParams, getNoteByPath } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ArticleLayout } from "@/components/ArticleLayout";

interface NotePageProps {
  params: Promise<{
    category: string;
    segments: string[];
  }>;
}

export async function generateStaticParams() {
  return getAllNoteParams();
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { category, segments } = await params;
  const note = getNoteByPath(category, segments);

  if (!note) {
    return { title: "Nota não encontrada - TechNotes" };
  }

  return {
    title: `${note.title} - TechNotes`,
    description: note.description,
  };
}

export default async function DynamicNotePage({ params }: NotePageProps) {
  const { category, segments } = await params;
  const note = getNoteByPath(category, segments);

  if (!note) notFound();

  const mediaBasePath = [note.categorySlug, note.groupSlug].filter(Boolean).join("/");

  return (
    <ArticleLayout
      breadcrumbs={[
        { label: note.category },
        ...(note.group ? [{ label: note.group }] : []),
        { label: note.title },
      ]}
      markdownContent={note.content}
      exportFilename={note.slug}
    >
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

      <section className="mt-6">
        <MarkdownRenderer content={note.content} mediaBasePath={mediaBasePath} />
      </section>
    </ArticleLayout>
  );
}
