# TechNotes Web

TechNotes é um caderno técnico pessoal para estudar, registrar descobertas e transformar conhecimento em experiências interativas.

O projeto une a velocidade das anotações em Markdown com a liberdade criativa de páginas TSX. Um assunto pode começar como uma nota rápida, ganhar estrutura durante os estudos e, quando merecer uma explicação mais rica, evoluir para uma página com diagramas, animações, exemplos executáveis ou outros recursos visuais.

```text
Nota rápida → Nota estruturada → Submódulo de estudo → Página interativa
```

Mais do que um visualizador de documentação, o TechNotes funciona como uma combinação de caderno de estudos, base pessoal de conhecimento, biblioteca de referências e laboratório técnico.

## Propósito

O TechNotes foi criado para tornar natural o processo de aprender e registrar conhecimento sem exigir que todo conteúdo tenha o mesmo nível de acabamento.

- **Capturar rapidamente:** registrar comandos, ideias, erros e descobertas em Markdown sem interromper o estudo.
- **Organizar progressivamente:** agrupar conteúdos por módulos e submódulos conforme o caderno cresce.
- **Aprofundar assuntos importantes:** transformar uma anotação recorrente em uma página TSX elaborada e interativa.
- **Construir memória técnica:** manter uma fonte pessoal, pesquisável e duradoura de conhecimento.
- **Aprender criando:** usar componentes, visualizações e interações como parte da explicação.

## Modelo de conteúdo

Cada módulo pode combinar páginas produzidas manualmente e notas descobertas automaticamente:

```text
JavaScript
├── Páginas interativas
│   ├── Fundamentos da linguagem
│   └── Visualizador do Event Loop
├── Assincronismo
│   ├── Páginas
│   │   └── Laboratório de Promises
│   └── Notas
│       ├── Async/Await
│       └── Tratamento de erros
└── Notas gerais
    ├── Métodos de Array
    └── Coerção de tipos
```

### Páginas TSX

São conteúdos autorais e elaborados dentro de `app/`. Podem usar todo o potencial do React para criar diagramas, simuladores, animações, exercícios e layouts próprios. Elas aparecem na parte superior do sidebar.

### Notas Markdown

São registros rápidos ou artigos escritos em `content/`. O sistema extrai seus metadados, calcula o tempo de leitura e cria as rotas automaticamente. As notas gerais ficam na parte inferior do sidebar.

### Submódulos

São nichos específicos dentro de um módulo. Eles aparecem como dropdowns e podem reunir suas próprias páginas TSX e notas Markdown. O projeto mantém deliberadamente dois níveis de organização: módulo e submódulo.

## Principais recursos

- Leitura automática de Markdown a partir do sistema de arquivos.
- Módulos com páginas TSX e notas independentes.
- Submódulos automáticos baseados nas pastas de conteúdo.
- Dropdowns contextuais no sidebar.
- Busca global com `Ctrl + K` ou `⌘K`.
- Frontmatter, tabelas GFM, alertas, imagens e blocos de código.
- Exportação de notas em Markdown e impressão em PDF.
- Rotas pré-renderizadas com o App Router.
- Interface responsiva em dark mode.

## Stack

| Área | Tecnologias |
| :--- | :--- |
| Framework | Next.js 16, React 19 e TypeScript 5 |
| Estilização | Tailwind CSS 4 e PostCSS |
| Interface | Radix UI, Lucide React, Framer Motion e cmdk |
| Markdown | gray-matter, react-markdown e remark-gfm |

## Estrutura do projeto

```text
TechNotes-web/
├── app/
│   ├── <modulo>/                         # Páginas TSX criativas
│   ├── notes/[category]/[...segments]/   # Notas gerais e aninhadas
│   ├── layout.tsx
│   └── page.tsx                          # Hub de aprendizado
├── components/
│   ├── Sidebar.tsx
│   ├── CommandMenu.tsx
│   ├── MarkdownRenderer.tsx
│   └── ui/
├── config/
│   └── modules.ts                        # Módulos, páginas e submódulos
├── content/
│   └── <modulo>/
│       ├── nota-geral.md
│       └── <submodulo>/
│           └── nota-especifica.md
├── lib/
│   ├── content.ts                        # Descoberta e leitura das notas
│   ├── note-path.ts                      # Geração centralizada de URLs
│   └── utils.ts
└── README.md
```

## Como registrar conhecimento

### Nota rápida

Crie um Markdown diretamente na pasta do módulo:

```text
content/javascript/metodos-de-array.md
```

Ela será descoberta automaticamente e ficará na seção inferior **Notas**.

### Nota dentro de um submódulo

Crie uma pasta adicional para o nicho desejado:

```text
content/javascript/assincronismo/async-await.md
```

O dropdown **Assincronismo** e a rota abaixo serão criados automaticamente:

```text
/notes/javascript/assincronismo/async-await
```

Não é necessário cadastrar submódulos que possuem somente notas.

### Frontmatter recomendado

```markdown
---
title: "Async/Await na prática"
description: "Padrões para escrever e tratar operações assíncronas."
category: "JavaScript"
group: "Programação Assíncrona"
tags: ["#javascript", "#async-await", "#promises"]
date: "2026-08-11"
badge: "JS"
status: "concluido"
---

# Async/Await na prática

Escreva o conteúdo da nota aqui.
```

`title` e `description` são extraídos automaticamente do conteúdo quando não forem informados. O campo `group` permite personalizar o nome exibido para um submódulo descoberto pelo diretório.

Use slugs em caixa baixa, sem espaços ou acentos, para diretórios e arquivos.

## Criando um módulo

Use a mesma chave em `app/`, `content/` e `config/modules.ts`:

```text
app/redes/fundamentos/page.tsx
content/redes/modelo-osi.md
```

Registre sua apresentação e suas páginas TSX em [config/modules.ts](config/modules.ts):

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
  groups: [],
},
```

Importe também o ícone escolhido de `lucide-react` no início da configuração.

## Criando um submódulo com páginas TSX

Notas já criam submódulos automaticamente. O cadastro em `groups` é necessário apenas para personalizar a ordem/nome ou adicionar páginas TSX:

```ts
groups: [
  {
    key: "assincronismo",
    name: "Assincronismo",
    pages: [
      {
        title: "Visualizador do Event Loop",
        href: "/javascript/assincronismo/event-loop",
        badge: "JS",
      },
    ],
  },
],
```

Correspondendo à página:

```text
app/javascript/assincronismo/event-loop/page.tsx
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Outros comandos disponíveis:

```bash
npm run lint
npm run build
npm run start
```

## Visão de longo prazo

O objetivo do TechNotes é crescer junto com o aprendizado: continuar simples o bastante para receber uma anotação em poucos segundos, mas flexível o bastante para transformar conhecimento importante em uma experiência memorável.

O caderno não precisa nascer organizado ou completo. Ele deve evoluir conforme o conhecimento evolui.
