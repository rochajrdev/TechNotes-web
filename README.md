# TechNotes Web

**TechNotes** é uma plataforma moderna de gerenciamento de conhecimento técnico e visualizador de documentação em Markdown. Desenvolvida para organizar notas de estudo, cheatsheets, guias e referências técnicas de forma rápida, elegante e dinamicamente categorizada.

---

## ⚡ Principais Recursos

- **Leitor de Markdown Dinâmico**: Renderiza notas escritas em Markdown diretamente do sistema de arquivos local (`content/`).
- **Navegação Inteligente**: Organização automática por categorias e tópicos com breadcrumbs e estatísticas de leitura.
- **Menu de Comandos (`Ctrl + K`)**: Busca global rápida por notas e categorias em tempo real.
- **Visual Moderno & Dark Mode**: Interface construída com Tailwind CSS v4, suporte a blocos de código formatados e realce visual por badges de tecnologia.
- **Geração Estática (SSG/SSR)**: Desempenho otimizado usando Next.js App Router e pré-renderização estática de rotas (`generateStaticParams`).

---

## 🚀 Stack Tecnológica

| Categoria | Tecnologias Utilizadas |
| :--- | :--- |
| **Framework Base** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Estilização** | Tailwind CSS v4, PostCSS, Lucide React (Ícones) |
| **Animações & UI** | Framer Motion, Radix UI (Accordion, Dialog, Tooltip), `cmdk` |
| **Processamento Markdown** | `gray-matter`, `react-markdown`, `remark-gfm` |

---

## 📁 Estrutura de Arquivos

```bash
TechNotes-web/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Layout Raiz (Sidebar, Temas, Fontes Geist)
│   ├── page.tsx                # Dashboard principal (Hub de Aprendizado)
│   └── notes/[category]/[slug]/ # Rota dinâmica SSG para renderização individual de cada nota
├── components/                 # Componentes React Reutilizáveis
│   ├── Sidebar.tsx             # Menu de navegação lateral com busca e filtro por categoria
│   ├── CommandMenu.tsx         # Modal de busca rápida (Ctrl+K)
│   ├── MarkdownRenderer.tsx    # Componente de renderização customizado de Markdown
│   └── ui/                     # Componentes primitivos (Badge, Button, CodeBlock)
├── content/                    # Base de Notas em Markdown (.md)
│   ├── algoritmos-estrutura-dados/ # Notas de Algoritmos
│   ├── banco-de-dados-fundamentos/ # Notas de Banco de Dados
│   ├── devops/                 # Conteúdo DevOps
│   ├── shell/                  # Comandos e scripts Shell/Linux
│   └── web/                    # Desenvolvimento Web (React, Next.js, etc.)
├── lib/
│   ├── content.ts              # Engine de leitura e extração de metadados dos arquivos Markdown
│   └── utils.ts                # Utilitários Tailwind (clsx + tailwind-merge)
└── README.md
```

---

## 📝 Como Adicionar Novas Notas

Para adicionar uma nova anotação ou tutorial à plataforma, basta criar um arquivo `.md` dentro da subpasta correspondente em `content/`.

### 1. Diretórios de Categoria em `content/`
Sempre utilize **slugs em caixa baixa, sem acentos ou espaços** para os nomes das pastas e dos arquivos.

Exemplo:
- `content/web/meu-novo-post.md`
- `content/algoritmos-estrutura-dados/arvores-binarias.md`

### 2. Formato e Frontmatter Recomendado

Você pode incluir metadados no início do arquivo usando formato YAML Frontmatter (`---`):

```markdown
---
title: "Introdução ao Docker"
description: "Aprenda a criar contêineres e gerenciar aplicações isoladas."
category: "DevOps & Ferramentas"
tags: ["#docker", "#devops", "#containers"]
date: "2026-08-06"
badge: "Docker"
status: "concluido"
---

# Introdução ao Docker

Escreva seu conteúdo em Markdown aqui...
```

*Nota: Se o frontmatter `title` ou `description` não forem especificados, a plataforma extrairá automaticamente o primeiro título `#` e o primeiro parágrafo do texto.*

### Criando um novo módulo

Use a mesma chave para a pasta da aplicação, a pasta de conteúdo e o registro do módulo. Por exemplo, para criar o módulo `redes`:

```text
app/redes/fundamentos/page.tsx
content/redes/modelo-osi.md
config/modules.ts
```

As notas em `content/redes/` são descobertas automaticamente. Para exibir páginas TSX no topo do sidebar, registre o módulo e suas páginas em `config/modules.ts`:

```ts
redes: {
  key: "redes",
  name: "Redes de Computadores",
  icon: Network,
  color: "text-sky-400",
  badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  borderColor: "border-sky-500/40",
  pages: [
    {
      title: "Fundamentos de Redes",
      href: "/redes/fundamentos",
      badge: "Redes",
    },
  ],
},
```

No sidebar, as páginas TSX ficam na seção superior **Páginas**, enquanto as notas Markdown permanecem na seção inferior **Notas**.

---

## ⚙️ Comandos de Desenvolvimento

### Instalação de Dependências
```bash
npm install
```

### Executar Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Compilação de Produção
```bash
npm run build
```

### Iniciar Servidor de Produção
```bash
npm run start
```

### Linters e Checagens
```bash
npm run lint
```
