import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechNotes",
  description: "Meu espaço para anotações e recursos técnicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-gray-50 text-gray-900`}>
        
        {/* MENU LATERAL */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-blue-600">Meus Estudos</h2>
          <nav className="flex flex-col gap-3">
            <a href="/" className="hover:text-blue-500 font-medium">Início</a>
            
            {/* Categoria Shell */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Shell</h3>
              <div className="flex flex-col gap-2 pl-2 border-l-2 border-gray-100">
                <a href="/shell/bash" className="hover:text-blue-500 text-gray-600">Fundamentos Bash</a>
              </div>
            </div>
          </nav>
        </aside>
        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-10 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
