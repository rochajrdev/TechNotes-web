import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getAllNotes } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechNotes - Base de Conhecimento Técnico",
  description: "Anotações práticas, cheatsheets de comandos e documentação para desenvolvedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lê todas as notas em Markdown da pasta content/ em tempo de execução no servidor
  const dynamicNotes = getAllNotes();

  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-200`}
      >
        {/* Sidebar com busca dinâmica Ctrl+K e navegação SPA */}
        <Sidebar dynamicNotes={dynamicNotes} />

        {/* Área de conteúdo principal */}
        <main className="flex-1 min-w-0 px-4 pt-16 pb-6 md:p-8 xl:p-10 w-full max-w-[1536px] mx-auto overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
