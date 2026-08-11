export interface NotePathParts {
  categorySlug: string;
  groupSlug?: string;
  slug: string;
}

export function getNoteHref(note: NotePathParts): string {
  const segments = [note.categorySlug, note.groupSlug, note.slug].filter(
    (segment): segment is string => Boolean(segment)
  );
  return `/notes/${segments.map(encodeURIComponent).join("/")}`;
}
