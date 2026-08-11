"use client";

import * as React from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import {
  ROADMAP,
  type LevelId,
  type TopicEntry,
  type TopicGroup,
  type TopicNode,
} from "./roadmap-view";

interface RoadmapNodeData extends Record<string, unknown> {
  label: string;
  kind: "root" | "milestone" | "topic" | "parent";
  level: LevelId;
  side?: "LEFT" | "RIGHT";
}

type RoadmapNode = Node<RoadmapNodeData>;

const elk = new ELK();
const NODE_SIZES = {
  root: { width: 224, height: 64 },
  milestone: { width: 204, height: 54 },
  parent: { width: 162, height: 48 },
  topic: { width: 140, height: 44 },
};

const LEVEL_CLASSES: Record<LevelId, string> = {
  iniciante: "border-cyan-500/50 bg-cyan-500/10 text-cyan-100 shadow-[0_0_24px_rgba(6,182,212,0.1)]",
  intermediario: "border-purple-500/50 bg-purple-500/10 text-purple-100 shadow-[0_0_24px_rgba(168,85,247,0.1)]",
  avancado: "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.1)]",
};

function normalizeTopic(topic: TopicEntry): TopicNode {
  return typeof topic === "string" ? { title: topic } : topic;
}

function createId(parentId: string, label: string, index: number): string {
  return `${parentId}-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function addTopicTree(
  topics: TopicEntry[],
  parentId: string,
  level: LevelId,
  nodes: RoadmapNode[],
  edges: Edge[]
) {
  topics.forEach((entry, index) => {
    const topic = normalizeTopic(entry);
    const id = createId(parentId, topic.title, index);
    const kind = topic.children?.length ? "parent" : "topic";
    const size = NODE_SIZES[kind];

    nodes.push({
      id,
      type: "roadmap",
      position: { x: 0, y: 0 },
      width: size.width,
      height: size.height,
      data: { label: topic.title, kind, level },
    });
    edges.push({
      id: `${parentId}->${id}`,
      source: parentId,
      target: id,
      type: "smoothstep",
      sourceHandle: "branch-source",
      targetHandle: "branch-target",
      style: { stroke: "rgba(34,211,238,0.48)", strokeWidth: 1.4, strokeDasharray: "4 4" },
    });

    if (topic.children?.length) {
      addTopicTree(topic.children, id, level, nodes, edges);
    }
  });
}

function createGraph() {
  const nodes: RoadmapNode[] = [
    {
      id: "javascript",
      type: "roadmap",
      position: { x: 0, y: 0 },
      width: NODE_SIZES.root.width,
      height: NODE_SIZES.root.height,
      data: { label: "JavaScript", kind: "root", level: "iniciante" },
    },
  ];
  const edges: Edge[] = [];
  let previousMilestone = "javascript";

  ROADMAP.forEach((level) => {
    level.groups.forEach((group, groupIndex) => {
      const id = `${level.id}-${groupIndex}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      nodes.push({
        id,
        type: "roadmap",
        position: { x: 0, y: 0 },
        width: NODE_SIZES.milestone.width,
        height: NODE_SIZES.milestone.height,
        data: { label: group.title, kind: "milestone", level: level.id },
      });
      edges.push({
        id: `${previousMilestone}=>${id}`,
        source: previousMilestone,
        target: id,
        type: "smoothstep",
        sourceHandle: "main-source",
        targetHandle: "main-target",
        style: { stroke: "rgb(34 211 238)", strokeWidth: 2.6 },
        zIndex: 2,
      });
      addTopicTree(group.topics, id, level.id, nodes, edges);
      previousMilestone = id;
    });
  });

  return { nodes, edges };
}

async function layoutGraph() {
  const graph = createGraph();
  const milestones = graph.nodes.filter((node) => node.data.kind === "milestone");
  const branchEdges = graph.edges.filter((edge) => edge.id.includes("->") && !edge.id.includes("=>"));
  const positionedNodes = new Map<string, RoadmapNode>();
  const centerX = 550;
  let cursorY = 150;

  const rootNode = graph.nodes.find((node) => node.id === "javascript")!;
  positionedNodes.set(rootNode.id, {
    ...rootNode,
    position: { x: centerX - NODE_SIZES.root.width / 2, y: 24 },
  });

  for (const [index, milestone] of milestones.entries()) {
    const side: "LEFT" | "RIGHT" = index % 2 === 0 ? "LEFT" : "RIGHT";
    const subtreeIds = new Set([milestone.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const edge of branchEdges) {
        if (subtreeIds.has(edge.source) && !subtreeIds.has(edge.target)) {
          subtreeIds.add(edge.target);
          changed = true;
        }
      }
    }

    const subtreeNodes = graph.nodes.filter((node) => subtreeIds.has(node.id));
    const subtreeEdges = branchEdges.filter(
      (edge) => subtreeIds.has(edge.source) && subtreeIds.has(edge.target)
    );
    const layout = await elk.layout({
      id: `tree-${milestone.id}`,
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": side,
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.spacing.nodeNode": "18",
        "elk.layered.spacing.nodeNodeBetweenLayers": "44",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      },
      children: subtreeNodes.map((node) => ({
        id: node.id,
        width: node.width ?? NODE_SIZES.topic.width,
        height: node.height ?? NODE_SIZES.topic.height,
      })),
      edges: subtreeEdges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    });

    const localNodes = layout.children ?? [];
    const localMilestone = localNodes.find((node) => node.id === milestone.id)!;
    const minY = Math.min(...localNodes.map((node) => node.y ?? 0));
    const maxY = Math.max(...localNodes.map((node) => (node.y ?? 0) + (node.height ?? 0)));
    const translateX = centerX - NODE_SIZES.milestone.width / 2 - (localMilestone.x ?? 0);
    const translateY = cursorY - minY;

    for (const localNode of localNodes) {
      const original = graph.nodes.find((node) => node.id === localNode.id)!;
      positionedNodes.set(original.id, {
        ...original,
        data: { ...original.data, side },
        position: {
          x: (localNode.x ?? 0) + translateX,
          y: (localNode.y ?? 0) + translateY,
        },
      });
    }

    cursorY += maxY - minY + 92;
  }

  return {
    nodes: graph.nodes.map((node) => positionedNodes.get(node.id) ?? node),
    edges: graph.edges,
    height: Math.ceil((cursorY + 80) * 0.96),
  };
}

function RoadmapNode({ data }: NodeProps<RoadmapNode>) {
  const isRoot = data.kind === "root";
  const isMilestone = data.kind === "milestone";
  const isParent = data.kind === "parent";

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-xl border px-3 text-center font-semibold leading-tight backdrop-blur-md",
        isRoot && "border-yellow-400/60 bg-yellow-400 text-lg font-black text-zinc-950 shadow-[0_0_32px_rgba(250,204,21,0.2)]",
        isMilestone && LEVEL_CLASSES[data.level],
        isParent && "border-blue-500/40 bg-blue-500/10 text-xs text-blue-100",
        !isRoot && !isMilestone && !isParent && "border-zinc-700 bg-zinc-900/95 text-[11px] text-zinc-300 shadow-lg"
      )}
    >
      <Handle id="main-target" type="target" position={Position.Top} className="!h-2 !w-2 !border-2 !border-zinc-950 !bg-cyan-400" />
      <Handle id="branch-target" type="target" position={data.side === "LEFT" ? Position.Right : Position.Left} className="!h-2 !w-2 !border-2 !border-zinc-950 !bg-cyan-400" />
      {data.label}
      <Handle id="main-source" type="source" position={Position.Bottom} className="!h-2 !w-2 !border-2 !border-zinc-950 !bg-cyan-400" />
      <Handle id="branch-source" type="source" position={data.side === "LEFT" ? Position.Left : Position.Right} className="!h-2 !w-2 !border-2 !border-zinc-950 !bg-cyan-400" />
    </div>
  );
}

const nodeTypes = { roadmap: RoadmapNode };

function MobileTopicTree({ topic, level }: { topic: TopicEntry; level: LevelId }) {
  const node = normalizeTopic(topic);
  const hasChildren = Boolean(node.children?.length);

  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-0 h-5 w-5 rounded-bl-xl border-b border-l border-zinc-700" />
      <div
        className={cn(
          "relative rounded-xl border px-3 py-2.5 text-xs leading-snug",
          hasChildren
            ? "border-blue-500/35 bg-blue-500/10 font-semibold text-blue-100"
            : "border-zinc-800 bg-zinc-900/90 text-zinc-300"
        )}
      >
        {node.title}
      </div>

      {hasChildren && (
        <div className="ml-3 space-y-2 border-l border-zinc-700 pt-2">
          {node.children!.map((child) => (
            <MobileTopicTree
              key={normalizeTopic(child).title}
              topic={child}
              level={level}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ group, level }: { group: TopicGroup; level: LevelId }) {
  return (
    <section className="relative pl-8">
      <span className="absolute left-[7px] top-0 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-cyan-500/45" />
      <div className={cn("rounded-2xl border px-4 py-3 text-sm font-bold", LEVEL_CLASSES[level])}>
        {group.title}
      </div>
      <div className="ml-4 mt-2 space-y-2 border-l border-dashed border-cyan-500/35 pt-1">
        {group.topics.map((topic) => (
          <MobileTopicTree
            key={normalizeTopic(topic).title}
            topic={topic}
            level={level}
          />
        ))}
      </div>
    </section>
  );
}

function MobileRoadmap() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 px-3 py-6 shadow-2xl">
      <BackgroundPattern />
      <div className="relative">
        <div className="ml-8 inline-flex rounded-xl border border-yellow-400/50 bg-yellow-400 px-5 py-3 text-base font-black text-zinc-950 shadow-[0_0_24px_rgba(250,204,21,0.15)]">
          JavaScript
        </div>
        <div className="ml-[39px] h-8 border-l-2 border-cyan-500/50" />

        <div className="relative space-y-6 border-l-2 border-cyan-500/40 pb-3 pl-0 ml-[39px]">
          {ROADMAP.flatMap((level) =>
            level.groups.map((group) => (
              <MobileGroup key={`${level.id}-${group.title}`} group={group} level={level.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(113,113,122,0.18)_1px,transparent_1px)] bg-[size:20px_20px]" />
  );
}

export function JavaScriptRoadmap() {
  const [graph, setGraph] = React.useState<{ nodes: RoadmapNode[]; edges: Edge[]; height: number } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    layoutGraph().then((layout) => {
      if (!cancelled) setGraph(layout);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article className="w-full space-y-5 pb-20">
      <header className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">TechNotes / mapa técnico</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">JavaScript Roadmap</h1>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-zinc-500">
          Explore as relações entre fundamentos, mecanismos e APIs da linguagem.
        </p>
      </header>

      <div className="md:hidden">
        <MobileRoadmap />
      </div>

      <div className="hidden overflow-x-auto rounded-3xl md:block">
      <div
        className="min-h-[720px] min-w-[1040px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        style={{ height: graph?.height ?? 720 }}
      >
        {graph ? (
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
            nodeTypes={nodeTypes}
            defaultViewport={{ x: 20, y: 16, zoom: 0.94 }}
            minZoom={0.6}
            maxZoom={1.2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnDoubleClick={false}
            zoomOnScroll={false}
            panOnScroll={false}
            panOnDrag={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(113,113,122,0.28)" />
          </ReactFlow>
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-zinc-600">
            organizando o mapa...
          </div>
        )}
      </div>
      </div>
    </article>
  );
}
