import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface NoteMetadata {
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  group?: string;
  groupSlug?: string;
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
  "algoritmos-estrutura-dados": "Algoritmos & Estrutura de Dados",
  "banco-de-dados-fundamentos": "Banco de Dados - Fundamentos",
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

function formatSlug(slug: string): string {
  return slug
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readNoteMetadata(
  fullPath: string,
  categorySlug: string,
  slug: string,
  groupSlug?: string
): NoteMetadata {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || extractTitleFromContent(content, slug),
    description: data.description || extractDescription(content),
    category: data.category || CATEGORY_NAMES[categorySlug.toLowerCase()] || categorySlug,
    categorySlug,
    group: groupSlug ? data.group || formatSlug(groupSlug) : undefined,
    groupSlug,
    slug,
    tags: data.tags || [`#${categorySlug.toLowerCase().replace(/\s+/g, "-")}`],
    readingTime: data.readingTime || calculateReadingTime(content),
    date: data.date || "Atualizado recentemente",
    badge: data.badge || "MD",
    featured: data.featured || false,
    status: data.status || "concluido",
  };
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

    const entries = fs.readdirSync(categoryPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const slug = entry.name.replace(/\.md$/, "");
        allNotes.push(readNoteMetadata(path.join(categoryPath, entry.name), category, slug));
        continue;
      }

      if (!entry.isDirectory()) continue;
      const groupSlug = entry.name;
      const groupPath = path.join(categoryPath, groupSlug);
      const groupFiles = fs.readdirSync(groupPath, { withFileTypes: true });

      for (const groupFile of groupFiles) {
        if (!groupFile.isFile() || !groupFile.name.endsWith(".md")) continue;
        const slug = groupFile.name.replace(/\.md$/, "");
        allNotes.push(
          readNoteMetadata(path.join(groupPath, groupFile.name), category, slug, groupSlug)
        );
      }
    }
  }

  return allNotes.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Busca uma nota específica pelo categorySlug e slug do arquivo
 */
export function getNoteByPath(categorySlug: string, segments: string[]): NoteItem | null {
  if (!fs.existsSync(contentDirectory)) {
    return null;
  }

  const decodedCategory = decodeURIComponent(categorySlug).toLowerCase().trim();
  if (segments.length < 1 || segments.length > 2) return null;
  const decodedSegments = segments.map((segment) => decodeURIComponent(segment).toLowerCase().trim());
  const groupSlug = decodedSegments.length === 2 ? decodedSegments[0] : undefined;
  const decodedSlug = decodedSegments.at(-1)!;

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

  let notesPath = categoryPath;
  let matchedGroup: string | undefined;
  if (groupSlug) {
    const groups = fs.readdirSync(categoryPath, { withFileTypes: true });
    matchedGroup = groups.find(
      (entry) => entry.isDirectory() && entry.name.toLowerCase().trim() === groupSlug
    )?.name;
    if (!matchedGroup) return null;
    notesPath = path.join(categoryPath, matchedGroup);
  }

  const files = fs.readdirSync(notesPath);
  const matchedFile = files.find((file) => {
    if (!file.endsWith(".md")) return false;
    const fileSlug = file.replace(/\.md$/, "");
    return (
      fileSlug.toLowerCase().trim() === decodedSlug ||
      encodeURIComponent(fileSlug).toLowerCase() === segments.at(-1)!.toLowerCase()
    );
  });

  if (!matchedFile) {
    return null;
  }

  const fullPath = path.join(notesPath, matchedFile);
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
    group: matchedGroup ? data.group || formatSlug(matchedGroup) : undefined,
    groupSlug: matchedGroup,
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
    segments: note.groupSlug ? [note.groupSlug, note.slug] : [note.slug],
  }));
}
