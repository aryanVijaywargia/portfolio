import { useAchievements } from "components/achievements";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import clsx from "clsx";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  EXPERIENCE_JOURNEY,
  ExperienceCompany,
  ExperienceAchievement,
  ExperienceAccentKey,
} from "content/experience";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
} from "@xyflow/react";

// ─── Accent color helpers ────────────────────────────────────────────

type AccentStyle = { bg: string; text: string; border: string; dot: string };

const DEFAULT_ACCENTS: Record<ExperienceAccentKey, AccentStyle> = {
  primary: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500", dot: "#0ea5e9" },
  secondary: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500", dot: "#818cf8" },
  tertiary: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500", dot: "#a78bfa" },
};

const BATMAN_ACCENTS: Record<ExperienceAccentKey, AccentStyle> = {
  primary: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500", dot: "#00a692" },
  secondary: { bg: "bg-emerald-600/10", text: "text-emerald-500", border: "border-emerald-600", dot: "#047857" },
  tertiary: { bg: "bg-cyan-400/10", text: "text-cyan-300", border: "border-cyan-400", dot: "#a3dbcf" },
};

function useAccentColors(): Record<ExperienceAccentKey, AccentStyle> {
  const { mode } = usePortfolioMode();
  return mode === "batman" ? BATMAN_ACCENTS : DEFAULT_ACCENTS;
}

// Default for contexts outside React (graph builder uses this as fallback)
let ACCENT_COLORS = DEFAULT_ACCENTS;

const KIND_LABELS: Record<ExperienceCompany["kind"], string> = {
  employment: "Employment",
  freelance: "Freelance",
  project: "Open Source",
  education: "Education",
};

// ─── Framer variants ─────────────────────────────────────────────────

const railItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const graphContainerVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const accordionVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
};

// ─── Spring animation config (matching mannan.io-style bouncy reveal) ─

const nodeSpring = { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.8 };
const nodeStaggerBase = 0.08; // seconds between each node reveal

// ─── Custom graph nodes with scale-up spring animations ──────────────

function RootNode({ data }: { data: { label: string; prompt: string; expanded: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...nodeSpring, delay: 0 }}
      className={clsx(
        "cursor-pointer rounded-2xl border-2 px-8 py-5 text-center",
        "bg-gray-900/80 backdrop-blur-sm",
        data.expanded
          ? "border-sky-500 shadow-[0_0_24px_rgba(14,165,233,0.25)]"
          : "border-gray-600 hover:border-sky-500/50 hover:shadow-[0_0_16px_rgba(14,165,233,0.15)]"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="text-lg font-bold text-white">{data.label}</div>
      <div className="mt-1 text-xs text-gray-400">{data.prompt}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-3 !h-3 !border-2 !border-gray-900" />
    </motion.div>
  );
}

function CompanyNode({ data }: { data: { company: ExperienceCompany; selected: boolean; index: number } }) {
  const accent = ACCENT_COLORS[data.company.accentKey];
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...nodeSpring, delay: nodeStaggerBase * (data.index + 1) }}
      className={clsx(
        "cursor-pointer rounded-xl border-2 px-5 py-3 min-w-[180px]",
        "bg-gray-900/80 backdrop-blur-sm",
        data.selected
          ? `${accent.border} shadow-lg`
          : "border-gray-700 hover:border-gray-500"
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600 !w-2.5 !h-2.5 !border-2 !border-gray-900" />
      <div className="flex items-center gap-2">
        <motion.div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: accent.dot }}
          animate={data.selected ? { scale: [1, 1.4, 1], boxShadow: `0 0 12px ${accent.dot}` } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: data.selected ? Infinity : 0, repeatDelay: 2 }}
        />
        <span className="font-semibold text-white text-sm">{data.company.company}</span>
      </div>
      <div className="mt-1 text-xs text-gray-400">{data.company.role}</div>
      <div className="mt-1.5 flex items-center gap-2">
        <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-medium", accent.bg, accent.text)}>
          {KIND_LABELS[data.company.kind]}
        </span>
        <span className="text-[10px] text-gray-500">{data.company.achievements.length} achievements</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600 !w-2.5 !h-2.5 !border-2 !border-gray-900" />
    </motion.div>
  );
}

function AchievementNode({ data }: { data: { achievement: ExperienceAchievement; accentKey: ExperienceAccentKey; index: number } }) {
  const accent = ACCENT_COLORS[data.accentKey];
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: -15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ ...nodeSpring, delay: 0.15 + nodeStaggerBase * data.index }}
      className={clsx(
        "cursor-pointer rounded-lg border px-4 py-2.5 min-w-[160px] max-w-[200px]",
        "bg-gray-900/70 backdrop-blur-sm border-gray-700/50 hover:border-gray-600"
      )}
      whileHover={{ scale: 1.07, y: -3 }}
      whileTap={{ scale: 0.93 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-600 !w-2 !h-2 !border-2 !border-gray-900" />
      <span className={clsx("rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase", accent.bg, accent.text)}>
        {data.achievement.category}
      </span>
      <div className="mt-1 text-xs font-medium text-gray-200 leading-snug">{data.achievement.title}</div>
      <div className="mt-1 text-[10px] text-gray-500 truncate">{data.achievement.impact}</div>
    </motion.div>
  );
}

const nodeTypes = {
  root: RootNode,
  company: CompanyNode,
  achievement: AchievementNode,
};

// ─── Graph builder ───────────────────────────────────────────────────

function buildGraphData(
  graphExpanded: boolean,
  selectedCompanyId: string | null,
): { nodes: Node[]; edges: Edge[] } {
  const companies = EXPERIENCE_JOURNEY.companies;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node
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

  // Company nodes - arranged in a horizontal arc
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
        stroke: isSelected ? ACCENT_COLORS[company.accentKey].dot : "#374151",
        strokeWidth: isSelected ? 2 : 1,
      },
    });

    // Achievement nodes for selected company
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

// ─── Achievement detail card ─────────────────────────────────────────

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
        "rounded-xl border bg-gray-900/90 backdrop-blur-md p-5",
        accent.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", accent.bg, accent.text)}>
            {achievement.category}
          </span>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
            {companyName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <h4 className="mt-3 text-base font-semibold text-white">{achievement.title}</h4>
      <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">{achievement.summary}</p>
      <div className={clsx("mt-3 rounded-lg border-l-2 bg-gray-800/50 px-3 py-2", accent.border)}>
        <span className="text-xs font-medium text-gray-300">Impact: </span>
        <span className={clsx("text-xs font-semibold", accent.text)}>{achievement.impact}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {achievement.technologies.map((tech) => (
          <span key={tech} className="rounded-full bg-gray-800 px-2.5 py-1 text-[11px] text-gray-300">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Desktop graph component ─────────────────────────────────────────

function ExperienceGraph({
  graphExpanded,
  selectedCompanyId,
  expandedAchievementId,
  onRootClick,
  onCompanyClick,
  onAchievementClick,
  onCloseAchievement,
}: {
  graphExpanded: boolean;
  selectedCompanyId: string | null;
  expandedAchievementId: string | null;
  onRootClick: () => void;
  onCompanyClick: (id: string) => void;
  onAchievementClick: (id: string) => void;
  onCloseAchievement: () => void;
}) {
  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => buildGraphData(graphExpanded, selectedCompanyId),
    [graphExpanded, selectedCompanyId]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const { fitView } = useReactFlow();

  // Handle clicks on the entire node wrapper (not just inner content)
  const handleNodeClick = useCallback((_: any, node: Node) => {
    if (node.type === "root") onRootClick();
    else if (node.type === "company") onCompanyClick(node.id);
    else if (node.type === "achievement") onAchievementClick(node.id);
  }, [onRootClick, onCompanyClick, onAchievementClick]);

  // Sync when graph data changes and re-fit
  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
    // Small delay to let ReactFlow render new nodes before fitting
    const timer = setTimeout(() => fitView({ padding: 0.15, duration: 400, maxZoom: 1 }), 50);
    return () => clearTimeout(timer);
  }, [graphNodes, graphEdges, setNodes, setEdges, fitView]);

  // Find expanded achievement for detail overlay
  const expandedAch = useMemo(() => {
    if (!expandedAchievementId) return null;
    for (const c of EXPERIENCE_JOURNEY.companies) {
      const ach = c.achievements.find((a) => a.id === expandedAchievementId);
      if (ach) return { achievement: ach, accentKey: c.accentKey, companyName: c.company };
    }
    return null;
  }, [expandedAchievementId]);

  return (
    <div className="relative h-[600px] w-full rounded-xl border border-gray-700/30 bg-[#0a0f1a] overflow-hidden">
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
      </ReactFlow>

      {/* Achievement detail overlay */}
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

// ─── Mobile accordion ────────────────────────────────────────────────

function MobileAccordion({
  mobileOpenCompanyId,
  expandedAchievementId,
  onCompanyToggle,
  onAchievementToggle,
}: {
  mobileOpenCompanyId: string | null;
  expandedAchievementId: string | null;
  onCompanyToggle: (id: string) => void;
  onAchievementToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3 lg:hidden">
      {EXPERIENCE_JOURNEY.companies.map((company) => {
        const isOpen = mobileOpenCompanyId === company.id;
        const accent = ACCENT_COLORS[company.accentKey];

        return (
          <div key={company.id} className="rounded-xl border border-gray-700/50 bg-gray-900/30 overflow-hidden">
            <button
              onClick={() => onCompanyToggle(company.id)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-800/30"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: accent.dot }} />
                <div>
                  <div className="font-semibold text-white">{company.company}</div>
                  <div className="text-sm text-gray-400">{company.role}</div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">{company.period}</span>
                    <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-medium", accent.bg, accent.text)}>
                      {KIND_LABELS[company.kind]}
                    </span>
                  </div>
                </div>
              </div>
              {isOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-4 pb-4">
                    {company.achievements.map((ach) => {
                      const isExpanded = expandedAchievementId === ach.id;

                      return (
                        <div key={ach.id} className="rounded-lg border border-gray-700/30 bg-gray-800/20 overflow-hidden">
                          <button
                            onClick={() => onAchievementToggle(ach.id)}
                            className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-800/40"
                            aria-expanded={isExpanded}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={clsx("rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase flex-shrink-0", accent.bg, accent.text)}>
                                {ach.category}
                              </span>
                              <span className="text-sm text-white truncate">{ach.title}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="text-[10px] text-gray-500">{ach.technologies.length} tech</span>
                              {isExpanded ? (
                                <ChevronUpIcon className="h-3.5 w-3.5 text-gray-400" />
                              ) : (
                                <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                variants={accordionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 space-y-2">
                                  <p className="text-sm text-gray-400 leading-relaxed">{ach.summary}</p>
                                  <div className={clsx("rounded-lg border-l-2 bg-gray-800/50 px-3 py-2", accent.border)}>
                                    <span className="text-xs font-medium text-gray-300">Impact: </span>
                                    <span className={clsx("text-xs font-semibold", accent.text)}>{ach.impact}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ach.technologies.map((tech) => (
                                      <span key={tech} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-300">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Left rail ───────────────────────────────────────────────────────

function LeftRail({
  selectedCompanyId,
  onCompanyClick,
}: {
  selectedCompanyId: string | null;
  onCompanyClick: (id: string) => void;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <div ref={sectionRef} className="hidden lg:block w-[320px] flex-shrink-0">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gray-700/50" />

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="space-y-1"
        >
          {EXPERIENCE_JOURNEY.companies.map((company) => {
            const isSelected = selectedCompanyId === company.id;
            const accent = ACCENT_COLORS[company.accentKey];

            return (
              <motion.div key={company.id} variants={railItemVariants}>
                <button
                  onClick={() => onCompanyClick(company.id)}
                  className={clsx(
                    "relative flex w-full items-start gap-4 rounded-lg px-3 py-3 text-left transition-all duration-200",
                    isSelected
                      ? "bg-gray-800/50"
                      : "hover:bg-gray-800/20"
                  )}
                  aria-expanded={isSelected}
                >
                  {/* Dot on the timeline */}
                  <div
                    className={clsx(
                      "relative z-10 mt-1 h-6 w-6 flex-shrink-0 rounded-full border-[3px] transition-all duration-300",
                      isSelected ? "scale-110" : "scale-100"
                    )}
                    style={{
                      backgroundColor: isSelected ? accent.dot : "#1f2937",
                      borderColor: isSelected ? accent.dot : "#374151",
                    }}
                  />

                  <div className="min-w-0">
                    <div className="font-mono text-xs text-gray-500">{company.period}</div>
                    <div className={clsx("font-bold transition-colors", isSelected ? "text-white" : "text-gray-300")}>
                      {company.company}
                    </div>
                    <div className="text-sm text-gray-400">{company.role}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-medium", accent.bg, accent.text)}>
                        {KIND_LABELS[company.kind]}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {company.achievements.length} achievements
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main section ────────────────────────────────────────────────────

export const Experience = () => {
  const [graphExpanded, setGraphExpanded] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);
  const [mobileOpenCompanyId, setMobileOpenCompanyId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { trackAchievementEvent } = useAchievements();

  // Theme-aware accent colors - update module-level variable so child components pick it up
  const accentColors = useAccentColors();
  ACCENT_COLORS = accentColors;

  const handleRootClick = useCallback(() => {
    setGraphExpanded(true);
  }, []);

  const handleCompanyClick = useCallback((id: string) => {
    setSelectedCompanyId((prev) => (prev === id ? null : id));
    setExpandedAchievementId(null);
  }, []);

  const handleAchievementClick = useCallback(
    (id: string) => {
      const next = expandedAchievementId === id ? null : id;
      setExpandedAchievementId(next);
      if (next) {
        trackAchievementEvent({ type: "experience:expanded", id: next });
      }
    },
    [expandedAchievementId, trackAchievementEvent]
  );

  const handleCloseAchievement = useCallback(() => {
    setExpandedAchievementId(null);
  }, []);

  const handleMobileCompanyToggle = useCallback((id: string) => {
    setMobileOpenCompanyId((prev) => (prev === id ? null : id));
    setExpandedAchievementId(null);
  }, []);

  const handleMobileAchievementToggle = useCallback(
    (id: string) => {
      const next = expandedAchievementId === id ? null : id;
      setExpandedAchievementId(next);
      if (next) {
        trackAchievementEvent({ type: "experience:expanded", id: next });
      }
    },
    [expandedAchievementId, trackAchievementEvent]
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
    >
      {/* Section Header */}
      <header className="mx-auto mb-12 grid w-full max-w-6xl px-4 md:mb-16 md:px-8">
        <div className="heading-pre">Experience</div>
        <h1 className="heading-2xl -ml-1">My Journey</h1>
      </header>

      {/* Desktop: Rail + Graph */}
      <div className="hidden lg:flex lg:gap-8">
        <LeftRail
          selectedCompanyId={selectedCompanyId}
          onCompanyClick={(id) => {
            if (!graphExpanded) setGraphExpanded(true);
            handleCompanyClick(id);
          }}
        />
        <motion.div
          variants={graphContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex-1 min-w-0"
        >
          <ReactFlowProvider>
          <ExperienceGraph
            graphExpanded={graphExpanded}
            selectedCompanyId={selectedCompanyId}
            expandedAchievementId={expandedAchievementId}
            onRootClick={handleRootClick}
            onCompanyClick={(id) => {
              if (!graphExpanded) setGraphExpanded(true);
              handleCompanyClick(id);
            }}
            onAchievementClick={handleAchievementClick}
            onCloseAchievement={handleCloseAchievement}
          />
          </ReactFlowProvider>
        </motion.div>
      </div>

      {/* Mobile: Accordion */}
      <MobileAccordion
        mobileOpenCompanyId={mobileOpenCompanyId}
        expandedAchievementId={expandedAchievementId}
        onCompanyToggle={handleMobileCompanyToggle}
        onAchievementToggle={handleMobileAchievementToggle}
      />
    </section>
  );
};
