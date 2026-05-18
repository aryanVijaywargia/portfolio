import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type CaseEntry = {
  id: string;
  title: string;
  organization: string;
  period: string;
  type: "employment" | "education" | "project" | "freelance";
  description: string;
  details: string[];
  technologies: string[];
};

const caseEntries: CaseEntry[] = [
  {
    id: "cf-001",
    title: "Senior Software Engineer",
    organization: "GEP Worldwide",
    period: "Jul 2025 — Present",
    type: "employment",
    description:
      "Leading work on the Leo Agentic Runtime — streaming protocols, MCP pooling, durable HITL",
    details: [
      "Engineered the AG-UI streaming protocol adapter — cut time-to-first-token from ~5s batch to ~500ms streaming",
      "Built session-scoped MCP client pooling (100-client LRU + promise-chain mutex) → measured 2.8× speedup on 5-tool workflows",
      "Architected the durable Human-in-the-Loop interrupt/resume subsystem — 100% restart survival, P95 < 500ms resume",
    ],
    technologies: ["TypeScript", "LangGraph", "LangChain", "MCP", "MongoDB", "Kubernetes"],
  },
  {
    id: "cf-002",
    title: "Software Engineer",
    organization: "GEP Worldwide",
    period: "Jul 2023 — Jul 2025",
    type: "employment",
    description: "Built the Leo search platform and CDC fabric across Azure and AWS",
    details: [
      "Architected the Leo Search Runtime — 7 query types, 8 normalization strategies, 6 comparison operators",
      "Built the Leo Storage CDC platform — Logstash + secured Kafka, 171 pipelines across 28 business domains",
      "Shipped semantic search with a 3-tier embedding cache — p95 vectorization ~200ms → <10ms on cache hits",
      "Designed SearchOps — orchestrates ~1k bulk sync/reindex jobs/month across 80+ managed indices",
    ],
    technologies: ["C#", ".NET", "Elasticsearch", "Kafka", "Logstash", "Azure", "AWS"],
  },
  {
    id: "cf-003",
    title: "Founder / Builder",
    organization: "Continua",
    period: "Sep 2025 — Present",
    type: "project",
    description: "Go/Postgres durable execution engine purpose-built for AI agents",
    details: [
      "Event-sourced replay with byte-exact divergence detection; lease-based crash recovery via FOR UPDATE SKIP LOCKED",
      "p99 < 50ms round-trip; recovery within one poll interval",
      "React time-travel trace debugger: virtualized 1K+ span waterfall, JSON search across 5K-node trees",
      "Python SDK with decorator-based agent tracing and a remote activity worker; River-backed ingest sustains p95 < 150ms on 1MB batches",
    ],
    technologies: ["Go", "PostgreSQL", "React", "TypeScript", "Python", "River"],
  },
  {
    id: "cf-004",
    title: "Machine Learning Intern",
    organization: "IHub-Data, IIIT Hyderabad",
    period: "Jul 2022 — Dec 2022",
    type: "employment",
    description: "Built YOLO-based CV pipelines on dash-cam video for the Roadex project",
    details: [
      "Flask web app running 3 YOLO pipelines (pothole, triple-rider, tree obstruction) at ~12 FPS with MJPEG streaming + SQLite",
      "Triple-rider violation pipeline cascading YOLOv4 (rider/motorcycle) with YOLOv5 (helmet) — 0.83 mAP@0.5, 91% helmet accuracy",
      "IoU-based rider→motorcycle matching with Deep SORT tracking and frame interpolation",
    ],
    technologies: ["TensorFlow", "PyTorch", "YOLO", "OpenCV", "Flask", "SQLite"],
  },
  {
    id: "cf-005",
    title: "Research Assistant",
    organization: "ISRO-NESAC",
    period: "Sep 2021 — Jan 2022",
    type: "employment",
    description: "Earthquake precursor research — deep learning on ionospheric parameters",
    details: [
      "Stacked LSTM and LSTM-CNN for multivariate time-series forecasting of ionospheric parameters (RMSE 0.22)",
      "LSTM-autoencoder anomaly detection of earthquake precursors (F1 0.78)",
      "Mini-SOM clusters for 1-day forecasts at 53% accuracy; Dash-framework web UI automating the project pipeline",
    ],
    technologies: ["LSTM", "LSTM-CNN", "Mini SOM", "TensorFlow", "Dash", "Python"],
  },
  {
    id: "cf-006",
    title: "Research Intern",
    organization: "India Meteorological Department (IMD)",
    period: "Nov 2021 — Jun 2022",
    type: "employment",
    description: "LSTM-based hailstorm severity prediction",
    details: [
      "Engineered an LSTM model outputting the next-day severity plot of a hailstorm from meteorological inputs",
      "Implemented statistical reviews and reports backing a peer-reviewed journal submission",
    ],
    technologies: ["LSTM", "TensorFlow", "Time Series", "Python"],
  },
  {
    id: "cf-007",
    title: "Machine Learning Engineer",
    organization: "Omdena × EnergyHub",
    period: "Dec 2021 — Feb 2022",
    type: "freelance",
    description: "Clustering EV charging profiles for distributed network optimization",
    details: [
      "Selected among 50 ML engineers from 20 countries for an Omdena resource project sponsored by EnergyHub",
      "Designed clustering algorithms organizing unlabelled time-series EV charging data by consumption profile",
      "Impacted 20+ business partners of C4Net and EnergyHub",
    ],
    technologies: ["Clustering", "Time Series", "Python", "Scikit-Learn"],
  },
  {
    id: "cf-008",
    title: "B.Tech CSE + GDSC Lead",
    organization: "NIT Agartala",
    period: "Jul 2019 — Jul 2023",
    type: "education",
    description:
      "Bachelor of Technology in Computer Science & Engineering (CGPA 8.59) — GDSC Lead 2021–2022",
    details: [
      "GDSC Lead — led a chapter of 20+ members; hosted GDSC Explore, the biggest dev fest in Northeast India",
      "Co-authored 2 papers on seismic perturbation forecasting (IJPRAI under review, AGU Earth & Space in communication)",
      "Dockship.io Bike Sharing Prediction: 6th of 250+ participants",
      "HakinCodes Contributor's Hack 2020: 23rd of 500+ contributors",
    ],
    technologies: ["C/C++", "Python", "Algorithms", "Systems"],
  },
];

const typeLabels: Record<string, string> = {
  employment: "EMPLOYMENT",
  education: "EDUCATION",
  project: "OPEN SOURCE",
  freelance: "FREELANCE",
};

export const BatCasefile: FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="bat-casefile" className="bat-section">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Section Label */}
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--bat-primary)", fontFamily: "var(--bat-sans)" }}
          >
            Case File
          </motion.p>

          <motion.h2 variants={fadeIn} transition={{ duration: 0.6 }} className="bat-heading mb-16">
            Experience &amp; Qualifications
          </motion.h2>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[7px] top-0 hidden h-full w-px md:block"
              style={{ background: "var(--bat-border)" }}
            />

            <div className="space-y-0">
              {caseEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  variants={fadeIn}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative"
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 top-8 hidden md:block">
                    <div className="bat-timeline-node" />
                  </div>

                  {/* Entry card */}
                  <div
                    className="cursor-pointer border-b py-8 transition-all md:ml-10"
                    style={{
                      borderColor: "var(--bat-border)",
                    }}
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        {/* Type badge */}
                        <span
                          className="mb-2 inline-block rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-widest"
                          style={{
                            background: "var(--bat-accent)",
                            color: "var(--bat-fg-muted)",
                            border: "1px solid var(--bat-border)",
                          }}
                        >
                          {typeLabels[entry.type]}
                        </span>

                        <h3
                          className="mt-2 text-xl font-bold"
                          style={{
                            color: "var(--bat-fg)",
                            fontFamily: "var(--bat-serif)",
                          }}
                        >
                          {entry.title}
                        </h3>
                        <p className="mt-1 text-sm" style={{ color: "var(--bat-fg-muted)" }}>
                          {entry.organization}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="text-sm"
                          style={{ color: "var(--bat-fg-dim)", fontFamily: "var(--bat-mono)" }}
                        >
                          {entry.period}
                        </span>
                        <motion.span
                          animate={{ rotate: expandedId === entry.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ color: "var(--bat-primary)" }}
                        >
                          &#8964;
                        </motion.span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm" style={{ color: "var(--bat-fg-dim)" }}>
                      {entry.description}
                    </p>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {expandedId === entry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-4">
                            {/* Achievements */}
                            <ul className="space-y-2">
                              {entry.details.map((detail, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                  style={{ color: "var(--bat-fg-muted)" }}
                                >
                                  <span style={{ color: "var(--bat-primary)" }}>&#9656;</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2">
                              {entry.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-sm px-2 py-1 text-xs"
                                  style={{
                                    background: "var(--bat-muted)",
                                    color: "var(--bat-fg-muted)",
                                    border: "1px solid var(--bat-border)",
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
