import { getAllNotes } from "@/lib/content";
import { HubClientView } from "@/components/HubClientView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hub de Estudos - Agregador TechNotes",
  description: "Central e agregador de todos os tópicos de estudo, notas em Markdown, cheatsheets e comandos.",
};

export default function HubPage() {
  const notes = getAllNotes();

  return <HubClientView notes={notes} />;
}
