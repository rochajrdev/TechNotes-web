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
      {/* 
        body: Corpo da página inteira.
        antialiased: Deixa as fontes mais suaves e legíveis.
        flex: Transforma o body em um contêiner Flexbox (permite colocar itens lado a lado).
        min-h-screen: Garante que a tela ocupe no mínimo 100% da altura do monitor.
        bg-zinc-950: Define a cor de fundo como um cinza quase preto.
        text-zinc-50: Define a cor da fonte padrão como um cinza quase branco.
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-zinc-950 text-zinc-50`}>
        
        {/* 
          aside: Tag semântica HTML para menus laterais.
          w-64: Define a largura fixa de 16rem (256px).
          bg-zinc-900: Fundo um pouco mais claro que o body para criar profundidade.
          border-r border-zinc-800: Cria uma linha divisória à direita.
          p-6: Aplica padding (espaço interno) em todos os lados.
          flex flex-col: Organiza os itens de cima para baixo.
        */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
          
          {/* Título do menu com cor azul */}
          <h2 className="text-xl font-bold mb-6 text-blue-500">Meus Estudos</h2>
          
          {/* nav: Tag semântica para navegação. gap-3 cria um espaço entre os itens. */}
          <nav className="flex flex-col gap-3">
            
            {/* transition-colors: Faz com que a mudança de cor no hover não seja seca, mas suave. */}
            <a href="/" className="hover:text-blue-400 font-medium transition-colors">Início</a>
            
            {/* mt-4: Margin-top. Empurra a categoria para baixo, separando do Início. */}
            <div className="mt-4">
              
              {/* uppercase tracking-wider: Letras maiúsculas e mais espaçadas (Visual de categoria). */}
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Shell</h3>
              
              {/* border-l: Cria a linha vertical à esquerda. pl-2 afasta o texto dessa linha. */}
              <div className="flex flex-col gap-2 pl-2 border-l border-zinc-700">
                <a href="/shell/bash" className="hover:text-blue-400 text-zinc-400 text-sm transition-colors">
                  Fundamentos Bash
                </a>
              </div>
            </div>
            
          </nav>
        </aside>

        {/* 
          main: Tag semântica para o conteúdo principal da página.
          flex-1: Faz o conteúdo principal preencher todo o espaço restante da tela que o menu não usou.
          p-10: Espaço interno generoso para a leitura ficar confortável.
          max-w-4xl: Impede que as linhas de texto fiquem longas demais em monitores ultrawide.
        */}
        <main className="flex-1 p-10 max-w-4xl">
          
          {/* Onde o Next.js vai injetar o conteúdo dos seus arquivos page.tsx */}
          {children}
          
        </main>

      </body>
    </html>
  );
}
