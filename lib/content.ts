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
  status?: "concluido" | "em_progresso" | "rascunho" | "revisao" | string;
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
 * Extrai o primeiro título (# ou ## ou ###) do markdown se o frontmatter não tiver title
 */
function extractTitleFromContent(content: string, fallback: string): string {
  // Procura por # Título ou ## **Título**
  const match = content.match(/^#{1,3}\s+\*?\*?([^*\r\n]+)\*?\*?/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Formata o slug fallback: introducao-a-algoritmos -> Introducao A Algoritmos
  return fallback
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
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

  const firstParagraph = clean.split(/\n\s*\n/)[0] || "";
  return firstParagraph.replace(/\*\*/g, "").slice(0, 160).trim();
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
      const categoryName = data.category || CATEGORY_NAMES[category.toLowerCase()] || category;

      allNotes.push({
        title,
        description,
        category: categoryName,
        categorySlug: category,
        slug,
        tags: data.tags || [`#${category.toLowerCase().replace(/\s+/g, "-")}`],
        readingTime,
        date: data.date || "Atualizado recentemente",
        badge: data.badge || "MD",
        featured: data.featured || false,
        status: data.status || "concluido",
      });
    }
  }

  return allNotes.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Busca uma nota específica pelo categorySlug e slug do arquivo
 */
export function getNoteBySlug(categorySlug: string, slug: string): NoteItem | null {
  if (!fs.existsSync(contentDirectory)) {
    return null;
  }

  const decodedCategory = decodeURIComponent(categorySlug).toLowerCase().trim();
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  // Encontra a pasta correspondente (case-insensitive e decodificada)
  const categories = fs.readdirSync(contentDirectory);
  const matchedCategory = categories.find(
    (cat) =>
      cat.toLowerCase().trim() === decodedCategory ||
      encodeURIComponent(cat).toLowerCase() === categorySlug.toLowerCase()
  );

  if (!matchedCategory) {
    return null;
  }

  const categoryPath = path.join(contentDirectory, matchedCategory);
  if (!fs.statSync(categoryPath).isDirectory()) {
    return null;
  }

  const files = fs.readdirSync(categoryPath);
  const matchedFile = files.find((file) => {
    if (!file.endsWith(".md")) return false;
    const fileSlug = file.replace(/\.md$/, "");
    return (
      fileSlug.toLowerCase().trim() === decodedSlug ||
      encodeURIComponent(fileSlug).toLowerCase() === slug.toLowerCase()
    );
  });

  if (!matchedFile) {
    return null;
  }

  const fullPath = path.join(categoryPath, matchedFile);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const fileSlug = matchedFile.replace(/\.md$/, "");
  const title = data.title || extractTitleFromContent(content, fileSlug);
  const description = data.description || extractDescription(content);
  const readingTime = data.readingTime || calculateReadingTime(content);
  const categoryName = data.category || CATEGORY_NAMES[matchedCategory.toLowerCase()] || matchedCategory;

  // Remove o título inicial (# ou ##) se presente no corpo para não duplicar com o cabeçalho
  const cleanContent = content.replace(/^#{1,3}\s+.+(\r?\n)?/, "").trim();

  return {
    title,
    description,
    category: categoryName,
    categorySlug: matchedCategory,
    slug: fileSlug,
    tags: data.tags || [`#${matchedCategory.toLowerCase().replace(/\s+/g, "-")}`],
    readingTime,
    date: data.date || "Atualizado recentemente",
    badge: data.badge,
    featured: data.featured || false,
    status: data.status || "concluido",
    content: cleanContent,
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
