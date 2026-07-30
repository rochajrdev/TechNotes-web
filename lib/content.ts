import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface NoteMetadata {
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  slug: string;
  tags: string[];
  readingTime: string;
  date: string;
  badge?: string;
  featured?: boolean;
}

export interface NoteItem extends NoteMetadata {
  content: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  shell: "Shell & Linux",
  web: "Desenvolvimento Web",
  devops: "DevOps & Ferramentas",
};

/**
 * Extrai o primeiro título # do markdown se o frontmatter não tiver title
 */
function extractTitleFromContent(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Formata o slug: como-a-web-funciona -> Como a Web Funciona
  return fallback
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extrai a primeira descrição ou parágrafo do markdown
 */
function extractDescription(content: string): string {
  const clean = content
    .replace(/^#+.*$/gm, "") // remove títulos
    .replace(/```[\s\S]*?```/g, "") // remove blocos de código
    .replace(/<!--[\s\S]*?-->/g, "") // remove comentários
    .trim();

  const firstParagraph = clean.split("\n\n")[0] || "";
  return firstParagraph.slice(0, 160).trim();
}

/**
 * Calcula tempo estimado de leitura (200 palavras por minuto)
 */
function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

/**
 * Lê todas as notas em Markdown da pasta content/ recursivamente
 */
export function getAllNotes(): NoteMetadata[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const categories = fs.readdirSync(contentDirectory);
  const allNotes: NoteMetadata[] = [];

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath);
    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const title = data.title || extractTitleFromContent(content, slug);
      const description = data.description || extractDescription(content);
      const readingTime = data.readingTime || calculateReadingTime(content);
      const categoryName = data.category || CATEGORY_NAMES[category] || category;

      allNotes.push({
        title,
        description,
        category: categoryName,
        categorySlug: category,
        slug,
        tags: data.tags || [`#${category}`],
        readingTime,
        date: data.date || "Atualizado recentemente",
        badge: data.badge || "MD",
        featured: data.featured || false,
      });
    }
  }

  return allNotes.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Busca uma nota específica pelo categorySlug e slug do arquivo
 */
export function getNoteBySlug(categorySlug: string, slug: string): NoteItem | null {
  const fullPath = path.join(contentDirectory, categorySlug, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const title = data.title || extractTitleFromContent(content, slug);
  const description = data.description || extractDescription(content);
  const readingTime = data.readingTime || calculateReadingTime(content);
  const categoryName = data.category || CATEGORY_NAMES[categorySlug] || categorySlug;

  return {
    title,
    description,
    category: categoryName,
    categorySlug,
    slug,
    tags: data.tags || [`#${categorySlug}`],
    readingTime,
    date: data.date || "Atualizado recentemente",
    badge: data.badge,
    featured: data.featured || false,
    content,
  };
}

/**
 * Obtém os parâmetros estáticos para todas as rotas dinâmicas
 */
export function getAllNoteParams() {
  const notes = getAllNotes();
  return notes.map((note) => ({
    category: note.categorySlug,
    slug: note.slug,
  }));
}
