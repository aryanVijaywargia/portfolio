import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { EXPERIENCE_JOURNEY, ExperienceAchievement, ExperienceAccentKey, ExperienceCompany } from "content/experience";
import Head from "next/head";
import { Background, BackgroundVariant, Handle, Position, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback, useEffect, useMemo } from "react";

type AccentStyle = { bg: string; text: string; border: string; dot: string };

type ExperienceGraphProps = {
  accentColors: Record<ExperienceAccentKey, AccentStyle>;
  graphExpanded: boolean;
  selectedCompanyId: string | null;
  expandedAchievementId: string | null;
  onRootClick: () => void;
  onCompanyClick: (id: string) => void;
  onAchievementClick: (id: string) => void;
  onCloseAchievement: () => void;
};

const FALLBACK_ACCENTS: Record<ExperienceAccentKey, AccentStyle> = {
  primary: {
    bg: "bg-sky-500/12 d:bg-sky-500/10",
    text: "text-sky-700 d:text-sky-400",
    border: "border-sky-500/70",
    dot: "#0ea5e9",
  },
  secondary: {
    bg: "bg-indigo-500/12 d:bg-indigo-500/10",
    text: "text-indigo-700 d:text-indigo-400",
    border: "border-indigo-500/70",
    dot: "#818cf8",
  },
  tertiary: {
    bg: "bg-violet-500/12 d:bg-violet-500/10",
    text: "text-violet-700 d:text-violet-400",
    border: "border-violet-500/70",
    dot: "#a78bfa",
  },
};

let ACCENT_COLORS = FALLBACK_ACCENTS;

const KIND_LABELS: Record<ExperienceCompany["kind"], string> = {
  employment: "Employment",
  freelance: "Freelance",
  project: "Open Source",
  education: "Education",
};

const AMBIENT_TECH_CHIPS: Array<{ label: string; x: string; y: string; delay: number }> = [
  { label: "React", x: "8%", y: "24%", delay: 0.3 },
  { label: "TypeScript", x: "84%", y: "20%", delay: 0.45 },
  { label: "Next.js", x: "14%", y: "68%", delay: 0.6 },
  { label: "AWS", x: "80%", y: "70%", delay: 0.75 },
  { label: "Node.js", x: "4%", y: "46%", delay: 0.9 },
  { label: "Python", x: "90%", y: "48%", delay: 1.05 },
];

const nodeSpring = { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.8 };
const nodeStaggerBase = 0.08;

function RootNode({ data }: { data: { label: string; prompt: string; expanded: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...nodeSpring, delay: 0 }}
      className={clsx(
        "cursor-pointer rounded-2xl border px-8 py-5 text-center shadow-[var(--experience-shadow)] backdrop-blur-md transition-colors",
        "bg-[var(--experience-panel)]",
        data.expanded
          ? "border-sky-500 shadow-[0_0_24px_rgba(14,165,233,0.25)]"
          : "[border-color:var(--experience-border)] hover:border-sky-500/40 hover:bg-[var(--experience-panel-selected)]"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="text-lg font-bold text-[var(--experience-text)]">{data.label}</div>
      <div className="mt-1 text-xs text-[var(--experience-text-subtle)]">{data.prompt}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2"
        style={{
          backgroundColor: ACCENT_COLORS.primary.dot,
          borderColor: "var(--experience-shell-strong)",
        }}
      />
    </motion.div>
  );
}

function CompanyNode({
  data,
}: {
  data: { company: ExperienceCompany; selected: boolean; index: number };
}) {
  const accent = ACCENT_COLORS[data.company.accentKey];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...nodeSpring, delay: nodeStaggerBase * (data.index + 1) }}
      className={clsx(
        "min-w-[180px] cursor-pointer rounded-xl border px-5 py-3 shadow-[var(--experience-shadow)] backdrop-blur-md transition-colors",
        "bg-[var(--experience-panel)]",
        data.selected
          ? `${accent.border} bg-[var(--experience-panel-selected)]`
          : "[border-color:var(--experience-border)] hover:bg-[var(--experience-panel-selected)] hover:[border-color:var(--experience-border-strong)]"
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2"
        style={{
          backgroundColor: "var(--experience-border-strong)",
          borderColor: "var(--experience-shell-strong)",
        }}
      />
      <div className="flex items-center gap-2">
        <motion.div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: accent.dot }}
          animate={
            data.selected
              ? { scale: [1, 1.4, 1], boxShadow: `0 0 12px ${accent.dot}` }
              : { scale: 1 }
          }
          transition={{ duration: 0.5, repeat: data.selected ? Infinity : 0, repeatDelay: 2 }}
        />
        <span className="text-sm font-semibold text-[var(--experience-text)]">
          {data.company.company}
        </span>
      </div>
      <div className="mt-1 text-xs text-[var(--experience-text-subtle)]">{data.company.role}</div>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            accent.bg,
            accent.text
          )}
        >
          {KIND_LABELS[data.company.kind]}
        </span>
        <span className="text-[10px] text-[var(--experience-text-subtle)]">
          {data.company.achievements.length} achievements
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2"
        style={{
          backgroundColor: "var(--experience-border-strong)",
          borderColor: "var(--experience-shell-strong)",
        }}
      />
    </motion.div>
  );
}

function AchievementNode({
  data,
}: {
  data: { achievement: ExperienceAchievement; accentKey: ExperienceAccentKey; index: number };
}) {
  const accent = ACCENT_COLORS[data.accentKey];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...nodeSpring, delay: 0.15 + nodeStaggerBase * data.index }}
      className={clsx(
        "min-w-[160px] max-w-[200px] cursor-pointer rounded-lg border px-4 py-2.5 shadow-[var(--experience-shadow)] backdrop-blur-md transition-colors",
        "bg-[var(--experience-panel)] [border-color:var(--experience-border)] hover:bg-[var(--experience-panel-selected)] hover:[border-color:var(--experience-border-strong)]"
      )}
      whileHover={{ scale: 1.07, y: -3 }}
      whileTap={{ scale: 0.93 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2"
        style={{
          backgroundColor: "var(--experience-border-strong)",
          borderColor: "var(--experience-shell-strong)",
        }}
      />
      <span
        className={clsx(
          "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase",
          accent.bg,
          accent.text
        )}
      >
        {data.achievement.category}
      </span>
      <div className="mt-1 text-xs font-medium leading-snug text-[var(--experience-text)]">
        {data.achievement.title}
      </div>
      <div className="mt-1 truncate text-[10px] text-[var(--experience-text-subtle)]">
        {data.achievement.impact}
      </div>
    </motion.div>
  );
}

const nodeTypes = {
  root: RootNode,
  company: CompanyNode,
  achievement: AchievementNode,
};

function buildGraphData(
  graphExpanded: boolean,
  selectedCompanyId: string | null
): { nodes: Node[]; edges: Edge[] } {
  const companies = EXPERIENCE_JOURNEY.companies;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: "root",
    type: "root",
    position: { x: 300, y: 0 },
    data: {
      label: EXPERIENCE_JOURNEY.rootLabel,
      prompt: graphExpanded ? "Select a company below" : EXPERIENCE_JOURNEY.rootPrompt,
      expanded: graphExpanded,
    },
    draggable: false,
  });

  if (!graphExpanded) return { nodes, edges };

  const companySpacing = 220;
  const totalWidth = (companies.length - 1) * companySpacing;
  const startX = 300 - totalWidth / 2;

  companies.forEach((company, i) => {
    const isSelected = selectedCompanyId === company.id;
    const x = startX + i * companySpacing;
    const y = 130;

    nodes.push({
      id: company.id,
      type: "company",
      position: { x, y },
      data: {
        company,
        selected: isSelected,
        index: i,
      },
      draggable: false,
    });

    edges.push({
      id: `root-${company.id}`,
      source: "root",
      target: company.id,
      animated: isSelected,
      style: {
        stroke: isSelected ? ACCENT_COLORS[company.accentKey].dot : "var(--experience-edge)",
        strokeWidth: isSelected ? 2 : 1,
      },
    });

    if (isSelected) {
      const achSpacing = 185;
      const achTotalWidth = (company.achievements.length - 1) * achSpacing;
      const achStartX = x - achTotalWidth / 2;

      company.achievements.forEach((ach, j) => {
        const achX = achStartX + j * achSpacing;
        const achY = y + 170;

        nodes.push({
          id: ach.id,
          type: "achievement",
          position: { x: achX, y: achY },
          data: {
            achievement: ach,
            accentKey: company.accentKey,
            index: j,
          },
          draggable: false,
        });

        edges.push({
          id: `${company.id}-${ach.id}`,
          source: company.id,
          target: ach.id,
          animated: true,
          style: {
            stroke: ACCENT_COLORS[company.accentKey].dot,
            strokeWidth: 1.5,
            strokeDasharray: "5 5",
          },
        });
      });
    }
  });

  return { nodes, edges };
}

function AchievementDetail({
  achievement,
  accentKey,
  companyName,
  onClose,
}: {
  achievement: ExperienceAchievement;
  accentKey: ExperienceAccentKey;
  companyName: string;
  onClose: () => void;
}) {
  const accent = ACCENT_COLORS[accentKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={clsx(
        "rounded-xl border p-5 shadow-[var(--experience-shadow)] backdrop-blur-md",
        "bg-[var(--experience-panel-selected)]",
        accent.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              accent.bg,
              accent.text
            )}
          >
            {achievement.category}
          </span>
          <span className="rounded-full bg-[var(--experience-shell)] px-2 py-0.5 text-[10px] text-[var(--experience-text-subtle)]">
            {companyName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-[var(--experience-text-subtle)] transition-colors hover:bg-[var(--experience-shell)] hover:text-[var(--experience-text)]"
          aria-label="Close"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <h4 className="mt-3 text-base font-semibold text-[var(--experience-text)]">
        {achievement.title}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--experience-text-muted)]">
        {achievement.summary}
      </p>
      <div
        className={clsx(
          "mt-3 rounded-lg border-l-2 bg-[var(--experience-shell)] px-3 py-2",
          accent.border
        )}
      >
        <span className="text-xs font-medium text-[var(--experience-text-muted)]">Impact: </span>
        <span className={clsx("text-xs font-semibold", accent.text)}>{achievement.impact}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {achievement.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-[var(--experience-shell)] px-2.5 py-1 text-[11px] text-[var(--experience-text-muted)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function AmbientOverlay() {
  const current = EXPERIENCE_JOURNEY.companies[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute inset-0 z-[5]"
    >
      <motion.div
        initial={{ opacity: 0, x: -10, y: -6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="absolute left-6 top-6 max-w-[260px] rounded-2xl border bg-[var(--experience-panel)] px-5 py-4 shadow-[var(--experience-shadow)] backdrop-blur-md [border-color:var(--experience-border)]"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--experience-text-subtle)]">
            Currently
          </span>
        </div>
        <div className="mt-3 text-[15px] font-semibold leading-tight text-[var(--experience-text)]">
          {current.role}
        </div>
        <div className="mt-0.5 text-[13px] text-[var(--experience-text-muted)]">
          {current.company}
        </div>
        <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--experience-text-subtle)]">
          {current.period}
        </div>
      </motion.div>

      {AMBIENT_TECH_CHIPS.map((chip) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 0.8,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: chip.delay, duration: 0.5 },
            scale: { delay: chip.delay, duration: 0.5 },
            y: {
              delay: chip.delay + 0.5,
              duration: 4 + (chip.delay % 1),
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="bg-[var(--experience-panel)]/70 absolute rounded-full border px-3 py-1 text-[11px] font-medium text-[var(--experience-text-muted)] shadow-[var(--experience-shadow)] backdrop-blur-md [border-color:var(--experience-border)]"
          style={{ left: chip.x, top: chip.y }}
        >
          {chip.label}
        </motion.div>
      ))}
    </motion.div>
  );
}

function ExperienceGraphCanvas({
  graphExpanded,
  selectedCompanyId,
  expandedAchievementId,
  onRootClick,
  onCompanyClick,
  onAchievementClick,
  onCloseAchievement,
}: Omit<ExperienceGraphProps, "accentColors">) {
  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => buildGraphData(graphExpanded, selectedCompanyId),
    [graphExpanded, selectedCompanyId]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const { fitView } = useReactFlow();

  const handleNodeClick = useCallback((_: any, node: Node) => {
    if (node.type === "root") onRootClick();
    else if (node.type === "company") onCompanyClick(node.id);
    else if (node.type === "achievement") onAchievementClick(node.id);
  }, [onRootClick, onCompanyClick, onAchievementClick]);

  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
    const timer = setTimeout(() => fitView({ padding: 0.15, duration: 400, maxZoom: 1 }), 50);
    return () => clearTimeout(timer);
  }, [graphNodes, graphEdges, setNodes, setEdges, fitView]);

  const expandedAch = useMemo(() => {
    if (!expandedAchievementId) return null;
    for (const c of EXPERIENCE_JOURNEY.companies) {
      const ach = c.achievements.find((a) => a.id === expandedAchievementId);
      if (ach) return { achievement: ach, accentKey: c.accentKey, companyName: c.company };
    }
    return null;
  }, [expandedAchievementId]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-[1.5rem] border bg-[var(--experience-shell)] shadow-[var(--experience-shadow)] [border-color:var(--experience-border)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        panOnDrag
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        minZoom={0.5}
        maxZoom={1.2}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--experience-grid)"
        />
      </ReactFlow>

      <AnimatePresence>{!graphExpanded && <AmbientOverlay />}</AnimatePresence>

      <AnimatePresence>
        {expandedAch && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <AchievementDetail
              achievement={expandedAch.achievement}
              accentKey={expandedAch.accentKey}
              companyName={expandedAch.companyName}
              onClose={onCloseAchievement}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ExperienceGraph({ accentColors, ...props }: ExperienceGraphProps) {
  ACCENT_COLORS = accentColors;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/reactflow.css" />
      </Head>
      <ReactFlowProvider>
        <ExperienceGraphCanvas {...props} />
      </ReactFlowProvider>
    </>
  );
}
