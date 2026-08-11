import type { ElementType } from "react";
import { Compass, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type LevelId = "iniciante" | "intermediario" | "avancado";

export interface TopicNode {
  title: string;
  children?: TopicEntry[];
}

export type TopicEntry = string | TopicNode;

export interface TopicGroup {
  title: string;
  description: string;
  topics: TopicEntry[];
}

interface RoadmapLevel {
  id: LevelId;
  eyebrow: string;
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
  border: string;
  glow: string;
  groups: TopicGroup[];
}

export const ROADMAP: RoadmapLevel[] = [
  {
    id: "iniciante",
    eyebrow: "Comece por aqui",
    title: "Fundamentos",
    description: "Construa um modelo mental sólido da linguagem antes de avançar para abstrações.",
    icon: Compass,
    accent: "text-emerald-300",
    border: "border-emerald-500/30",
    glow: "from-emerald-500/15 via-emerald-500/[0.03] to-transparent",
    groups: [
      {
        title: "Introdução ao JavaScript",
        description: "Origem, evolução e formas de executar a linguagem.",
        topics: ["O que é JavaScript", "História do JavaScript", "Versões do JavaScript", "Como executar JavaScript"].map((title) => ({ title })),
      },
      {
        title: "Variáveis e escopos",
        description: "Entenda onde os valores vivem e quando podem ser acessados.",
        topics: [
          {
            title: "Declarações de variáveis",
            children: [{ title: "var" }, { title: "let" }, { title: "const" }],
          },
          { title: "Hoisting" },
          { title: "Regras de nomeação" },
          {
            title: "Escopos de variáveis",
            children: [
              { title: "Escopo de bloco" },
              { title: "Escopo de função" },
              { title: "Escopo global" },
            ],
          },
          { title: "Tudo sobre variáveis" },
        ],
      },
      {
        title: "Tipos de dados",
        description: "Os blocos fundamentais usados para representar informação.",
        topics: [
          {
            title: "Tipos primitivos",
            children: ["string", "undefined", "number", "bigint", "boolean", "null", "Symbol"].map((title) => ({ title })),
          },
          {
            title: "Object",
            children: ["Object Prototype", "Herança prototípica", "Operador typeof", "Built-in Objects"].map((title) => ({ title })),
          },
        ],
      },
      {
        title: "Conversão de tipos",
        description: "Como valores mudam de representação explícita ou implicitamente.",
        topics: [
          {
            title: "Type Casting",
            children: ["Conversão vs coerção", "Conversão explícita", "Conversão implícita"].map((title) => ({ title })),
          },
        ],
      },
      {
        title: "Estruturas de dados",
        description: "Coleções para organizar, acessar e transportar dados.",
        topics: [
          { title: "Coleções chaveadas", children: ["Map", "WeakMap", "Set", "WeakSet"].map((title) => ({ title })) },
          { title: "Coleções indexadas", children: ["Arrays", "Typed Arrays"].map((title) => ({ title })) },
          { title: "Dados estruturados", children: [{ title: "JSON" }] },
        ],
      },
      {
        title: "Igualdade e comparação",
        description: "Descubra o que realmente significa dois valores serem iguais.",
        topics: [
          { title: "Operadores de comparação", children: ["==", "===", "Object.is"].map((title) => ({ title })) },
          { title: "Algoritmos de igualdade", children: ["isLooselyEqual", "isStrictlyEqual", "SameValueZero", "SameValue"].map((title) => ({ title })) },
        ],
      },
      {
        title: "Loops e iterações",
        description: "Repita tarefas e percorra diferentes coleções.",
        topics: ["for", "do...while", "while", "for...in", "for...of", "break e continue"],
      },
      {
        title: "Controle de fluxo",
        description: "Modele decisões, caminhos alternativos e falhas.",
        topics: [
          { title: "Declarações condicionais", children: [{ title: "if...else" }, { title: "switch" }] },
          { title: "Tratamento de exceções", children: ["throw", "try/catch/finally", "Error Objects"].map((title) => ({ title })) },
        ],
      },
      {
        title: "Expressões e operadores",
        description: "Combine e transforme valores usando a sintaxe da linguagem.",
        topics: ["Atribuição", "Comparação", "Aritméticos", "Bitwise", "Lógicos", "BigInt", "Strings", "Ternário", "Vírgula", "Unários"],
      },
    ],
  },
  {
    id: "intermediario",
    eyebrow: "Escolha estes a seguir",
    title: "Domínio da linguagem",
    description: "Aprenda a compor comportamentos, controlar contexto e trabalhar com assincronismo.",
    icon: Zap,
    accent: "text-amber-300",
    border: "border-amber-500/30",
    glow: "from-amber-500/15 via-amber-500/[0.03] to-transparent",
    groups: [
      {
        title: "Funções",
        description: "A principal unidade de composição do JavaScript.",
        topics: [
          { title: "Parâmetros de função", children: [{ title: "Parâmetros padrão" }, { title: "Parâmetros rest" }] },
          "Arrow functions", "IIFEs", "Objeto arguments", "Built-in functions", "Strict mode",
          { title: "Escopo e pilha de chamadas", children: ["Recursão", "Escopo léxico", "Closures"].map((title) => ({ title })) },
        ],
      },
      {
        title: "A palavra-chave this",
        description: "Entenda como o contexto de execução é determinado.",
        topics: [
          "this em um método", "this em uma função", "this usado sozinho", "this em event handlers", "this em arrow functions", "Function borrowing",
          { title: "Explicit binding", children: ["call", "apply", "bind"].map((title) => ({ title })) },
        ],
      },
      {
        title: "JavaScript assíncrono",
        description: "Coordene tarefas que não terminam imediatamente.",
        topics: [
          "Event Loop",
          { title: "Timers", children: [{ title: "setTimeout" }, { title: "setInterval" }] },
          { title: "Callbacks e Promises", children: ["Callbacks", "Promises", "Callback Hell", "async/await"].map((title) => ({ title })) },
        ],
      },
      {
        title: "Trabalhando com APIs",
        description: "Conecte sua aplicação a serviços e dados externos.",
        topics: ["Fetch API", "XMLHttpRequest"],
      },
    ],
  },
  {
    id: "avancado",
    eyebrow: "Deixe estes por último",
    title: "Engenharia JavaScript",
    description: "Aprofunde arquitetura, execução, memória e diagnóstico de aplicações reais.",
    icon: Trophy,
    accent: "text-violet-300",
    border: "border-violet-500/30",
    glow: "from-violet-500/15 via-violet-500/[0.03] to-transparent",
    groups: [
      {
        title: "Abstrações avançadas",
        description: "Recursos para construir APIs e fluxos mais expressivos.",
        topics: ["Classes", "Iteradores", "Geradores"],
      },
      {
        title: "Módulos em JavaScript",
        description: "Organize código e compreenda os ecossistemas de módulos.",
        topics: ["CommonJS", "ESM (ECMAScript Modules)"],
      },
      {
        title: "Gerenciamento de memória",
        description: "Entenda alocação, liberação e comportamento do coletor.",
        topics: ["Ciclo de vida da memória", "Garbage Collection"],
      },
      {
        title: "Browser e DOM",
        description: "Use as APIs que conectam JavaScript à página e ao navegador.",
        topics: ["DOM APIs", "Browser DevTools"],
      },
      {
        title: "Debugging e performance",
        description: "Encontre problemas difíceis e mantenha aplicações saudáveis.",
        topics: ["Debugging de problemas", "Debugging de memory leaks", "Debugging de performance"],
      },
    ],
  },
];

const LEVEL_STYLES: Record<LevelId, { node: string; label: string; line: string; dot: string; glow: string }> = {
  iniciante: {
    node: "border-cyan-500/45 bg-cyan-500/10 text-cyan-200",
    label: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    line: "bg-cyan-500/45",
    dot: "border-cyan-400 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.55)]",
    glow: "shadow-[0_0_24px_rgba(6,182,212,0.08)]",
  },
  intermediario: {
    node: "border-purple-500/45 bg-purple-500/10 text-purple-200",
    label: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    line: "bg-purple-500/45",
    dot: "border-purple-400 bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.55)]",
    glow: "shadow-[0_0_24px_rgba(168,85,247,0.08)]",
  },
  avancado: {
    node: "border-emerald-500/45 bg-emerald-500/10 text-emerald-200",
    label: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    line: "bg-emerald-500/45",
    dot: "border-emerald-400 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.08)]",
  },
};

interface PositionedGroup {
  group: TopicGroup;
  level: LevelId;
  x: number;
  y: number;
  width: number;
  height: number;
}

const GROUP_ORDER = [
  "Introdução ao JavaScript",
  "Variáveis e escopos",
  "Tipos de dados",
  "Conversão de tipos",
  "Estruturas de dados",
  "Igualdade e comparação",
  "Loops e iterações",
  "Controle de fluxo",
  "Expressões e operadores",
  "Funções",
  "A palavra-chave this",
  "JavaScript assíncrono",
  "Trabalhando com APIs",
  "Módulos em JavaScript",
  "Abstrações avançadas",
  "Browser e DOM",
  "Gerenciamento de memória",
  "Debugging e performance",
];

const X_POSITIONS = [390, 650, 170, 390, 680, 190, 690, 520, 150, 390, 150, 650, 690, 110, 390, 650, 140, 600];
const NODE_WIDTH = 340;

function normalizeTopic(topic: TopicEntry): TopicNode {
  return typeof topic === "string" ? { title: topic } : topic;
}

function countTopicNodes(topics: TopicEntry[]): number {
  return topics.reduce((total, topic) => {
    const node = normalizeTopic(topic);
    return total + 1 + (node.children ? countTopicNodes(node.children) : 0);
  }, 0);
}

function topicDepth(topics: TopicEntry[]): number {
  if (topics.length === 0) return 0;
  return Math.max(
    ...topics.map((topic) => {
      const node = normalizeTopic(topic);
      return 1 + (node.children ? topicDepth(node.children) : 0);
    })
  );
}

function buildPositionedGroups(): PositionedGroup[] {
  const allGroups = ROADMAP.flatMap((level) =>
    level.groups.map((group) => ({ group, level: level.id }))
  );
  const byTitle = new Map(allGroups.map((item) => [item.group.title, item]));
  let y = 90;

  return GROUP_ORDER.flatMap((title, index) => {
    const item = byTitle.get(title);
    if (!item) return [];
    const nodeCount = countTopicNodes(item.group.topics);
    const height = 92 + Math.ceil(nodeCount / 3) * 48 + topicDepth(item.group.topics) * 24;
    const positioned = { ...item, x: X_POSITIONS[index], y, width: NODE_WIDTH, height };
    y += height + 54;
    return [positioned];
  });
}

function TopicTree({ topic }: { topic: TopicEntry }) {
  const node = normalizeTopic(topic);
  const hasChildren = Boolean(node.children?.length);

  return (
    <div className={cn("relative flex min-w-0 flex-col items-center", hasChildren && "col-span-2")}>
      <div className={cn(
        "relative z-10 flex min-h-9 w-full items-center justify-center rounded-lg border px-2.5 py-1.5 text-center text-[10px] font-medium leading-tight shadow-lg",
        hasChildren
          ? "border-blue-500/35 bg-blue-500/10 text-blue-200"
          : "border-zinc-800 bg-zinc-900/95 text-zinc-300"
      )}>
        <span className="absolute -top-4 left-1/2 h-4 -translate-x-1/2 border-l border-dashed border-cyan-500/45" />
        {node.title}
      </div>

      {hasChildren && (
        <>
          <div className="h-4 border-l border-dashed border-cyan-500/45" />
          <div
            className="relative grid w-full gap-2 border-t border-dashed border-cyan-500/45 pt-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(3, node.children!.length)}, minmax(0, 1fr))` }}
          >
            {node.children!.map((child) => (
              <TopicTree key={normalizeTopic(child).title} topic={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function buildMainPath(nodes: PositionedGroup[]): string {
  return nodes.slice(1).reduce((path, node, index) => {
    const previous = nodes[index];
    const previousY = previous.y + 20;
    const currentX = node.x + node.width / 2;
    const currentY = node.y + 20;
    const bendY = Math.round((previousY + currentY) / 2);
    return `${path} V ${bendY} H ${currentX} V ${currentY}`;
  }, `M ${nodes[0].x + nodes[0].width / 2} ${nodes[0].y + 20}`);
}

function MapNode({ node }: { node: PositionedGroup }) {
  const style = LEVEL_STYLES[node.level];

  return (
    <div className="absolute" style={{ left: node.x, top: node.y, width: node.width }}>
      <div className={cn("relative z-10 mx-auto w-[72%] rounded-xl border px-4 py-2.5 text-center text-[12px] font-extrabold leading-tight backdrop-blur", style.node, style.glow)}>
        <span className={cn("absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-zinc-950", style.dot)} />
        {node.group.title}
      </div>

      <div className="relative mx-auto h-5 w-px bg-cyan-500/45" />
      <div className="relative grid grid-cols-2 gap-x-2 gap-y-2 border-t border-dashed border-cyan-500/45 pt-4">
        {node.group.topics.map((topic) => (
          <TopicTree key={normalizeTopic(topic).title} topic={topic} />
        ))}
      </div>
    </div>
  );
}

export function JavaScriptRoadmap() {
  const nodes = buildPositionedGroups();
  const canvasHeight = Math.max(...nodes.map((node) => node.y + node.height)) + 100;
  const mainPath = buildMainPath(nodes);

  return (
    <article className="w-full pb-20">
      <header className="mx-auto mb-5 max-w-4xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">TechNotes / mapa técnico</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">JavaScript Roadmap</h1>
      </header>

      <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="relative mx-auto min-w-[1280px] max-w-[1280px] overflow-hidden px-12 py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.07),transparent_26%),linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px]" />

          <div className="relative mb-12 flex items-start justify-between border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 shadow-[0_0_28px_rgba(250,204,21,0.08)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-300 font-mono text-sm font-black text-zinc-950">JS</span>
                <span className="text-2xl font-black text-white">JavaScript</span>
              </div>
              <p className="mt-4 max-w-lg text-xs leading-relaxed text-zinc-500">Mapa dos fundamentos, mecanismos e APIs essenciais da linguagem.</p>
            </div>
            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-[10px] font-semibold text-zinc-400">
              {ROADMAP.map((level) => (
                <div key={level.id} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-5 rounded-full border", LEVEL_STYLES[level.id].node)} />
                  <span>{level.eyebrow}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" style={{ height: canvasHeight }}>
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 1160 ${canvasHeight}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={mainPath} fill="none" stroke="rgba(34,211,238,0.72)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>

            <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-yellow-300">
              início
            </div>

            {nodes.map((node) => (
              <MapNode key={node.group.title} node={node} />
            ))}
          </div>

          <div className="relative mt-10 border-t border-zinc-800 pt-4 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">fundamentos → domínio da linguagem → engenharia</div>
        </div>
      </div>
    </article>
  );
}
