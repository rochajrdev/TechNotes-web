@AGENTS.md
 Analisei a estrutura, o código, a documentação local do Next.js 16.2.9 e executei as verificações do projeto. O repositório está bem encaminhado,
  mas ainda não está pronto para uma entrega com CI confiável.

  ## Resumo

  - TypeScript: aprovado (tsc --noEmit)
  - ESLint: reprovado — 19 erros e 32 avisos
  - Build: inconclusivo — falhou porque o ambiente não conseguiu baixar as fontes Geist do Google
  - Testes automatizados: inexistentes
  - Git: árvore de trabalho limpa; não alterei arquivos

  ## Principais problemas

  1. A rota de mídia precisa ser endurecida

  Em app/api/content-media/[...path]/route.ts:23, a contenção usa:

  normalizedPath.startsWith(contentDir)

  Essa comparação textual não é uma verificação robusta de pertencimento ao diretório. O recomendado é validar path.relative() e rejeitar caminhos
  absolutos ou iniciados por ...

  Além disso, a rota entrega qualquer arquivo dentro de content/, usando application/octet-stream para extensões desconhecidas. O ideal é permitir
  somente as extensões declaradas em MIME_TYPES. Como SVG é servido no mesmo domínio, também vale definir Content-Disposition, X-Content-Type-
  Options: nosniff e uma política explícita para SVG.

  Prioridade: alta.

  2. Existem links visivelmente quebrados no catálogo

  O catálogo aponta para páginas que não existem:

  - /web/javascript
  - /web/nodejs
  - /web/python
  - /web/csharp
  - /devops/sql
  - /notes/web/python-data-science

  Eles estão em components/TopicCatalog.tsx:39. Atualmente, esses cards levam a 404.

  Também há uma inconsistência conceitual: vários tópicos diferentes usam categoryKey: "web", então todos recebem a mesma contagem real de notas da
  categoria Web, mesmo representando JavaScript, Node, Python ou C#.

  Prioridade: alta para experiência do usuário.

  3. O lint impede uma CI saudável

  Foram encontrados 19 erros. Os grupos principais são:

  - Aspas não escapadas em JSX nas páginas de Git, Bash e Next.js.
  - Atualizações síncronas de estado dentro de efeitos em components/Sidebar.tsx:170.
  - O mesmo padrão no terminal animado.
  - 32 imports, parâmetros e variáveis sem uso.

  O problema da Sidebar não é apenas cosmético: o estado persistido começa sempre como false e só depois é restaurado do localStorage, podendo causar
  mudança visual após a hidratação.

  Prioridade: alta.

  4. O build depende da rede

  next/font/google (https://nextjs.org/docs/app/getting-started/fonts) tenta baixar Geist durante o build. Neste ambiente, isso fez npm run build
  falhar.

  Não consegui confirmar se existiriam erros posteriores no build. Para builds herméticos, previews e CI sem acesso externo, recomendo hospedar as
  fontes localmente com next/font/local.

  Prioridade: média.

  5. Não há testes

  Não encontrei testes unitários, de integração ou end-to-end. As áreas mais importantes para cobertura inicial são:

  - extração de título, descrição e tempo de leitura;
  - frontmatter inválido ou com tipos inesperados;
  - geração dos slugs;
  - proteção contra traversal na rota de mídia;
  - links do catálogo;
  - renderização de alertas, imagens e links Markdown.

  Prioridade: média.

  ## Pontos positivos

  - Boa separação entre conteúdo, leitura de dados e apresentação.
  - Uso apropriado de Server Components nas páginas que leem o filesystem.
  - params assíncrono está alinhado ao Next.js 16.
  - generateStaticParams() e generateMetadata() estão corretamente estruturados.
  - A renderização Markdown não habilita HTML cru, reduzindo a superfície de XSS.
  - Links externos usam noopener noreferrer.
  - TypeScript está consistente e passa sem erros.
  - A experiência de leitura, exportação e navegação está bem organizada.

  ## Melhorias estruturais

  A engine em lib/content.ts:77 lê e processa todos os arquivos mais de uma vez durante o build: layout, home, parâmetros estáticos, metadata e
  páginas. Com o volume atual isso é irrelevante, mas crescerá linearmente. Uma camada memoizada ou índice de conteúdo evitaria leituras repetidas.

  Os dados do frontmatter entram como any. A interface TypeScript não valida dados em runtime. Um schema com Zod ou validação manual impediria tags,
  date ou featured com formatos inválidos.

  Também há duas fontes de conteúdo concorrentes:

  - páginas TSX fixas, como /web/nextjs;
  - notas Markdown dinâmicas em /notes/....

  Isso funciona, mas tende a duplicar navegação, conteúdo e manutenção. Seria bom definir claramente quais materiais são “landing pages” e quais são
  notas.

  ## Ordem recomendada

  1. Corrigir e restringir a rota de mídia.
  2. Fazer npm run lint passar.
  3. Remover ou redirecionar os links inexistentes.
  4. Tornar o build independente do Google Fonts.
  5. Adicionar testes para lib/content.ts e para a rota de mídia.
  6. Acrescentar not-found.tsx, error.tsx, sitemap, robots e metadata social antes da publicação.