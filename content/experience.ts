export type ExperienceAccentKey = "primary" | "secondary" | "tertiary";
export type ExperienceKind = "employment" | "freelance" | "project" | "education";

export interface ExperienceStat {
  value: string;
  label: string;
}

export interface ExperienceAchievement {
  id: string;
  category: string;
  title: string;
  summary: string;
  pointers?: string[];
  impact: string;
  technologies: string[];
}

export interface ExperienceLink {
  label: string;
  href: string;
}

export interface ExperienceCompany {
  id: string;
  company: string;
  roleShort: string;
  role: string;
  period: string;
  periodShort: string;
  duration: string;
  live?: boolean;
  kind: ExperienceKind;
  accentKey: ExperienceAccentKey;
  links?: ExperienceLink[];
  timeline: {
    start: string;
    end?: string;
    track: number;
    rowLabel: string;
    barLabel: string;
  };
  achievements: ExperienceAchievement[];
}

export interface ExperienceJourney {
  rootLabel: string;
  rootPrompt: string;
  eyebrow: string;
  heading: string;
  timelineStart: string;
  timelineEnd: string;
  stats: ExperienceStat[];
  companies: ExperienceCompany[];
}

export const EXPERIENCE_JOURNEY: ExperienceJourney = {
  rootLabel: "Aryan Vijaywargia",
  rootPrompt: "Select a chapter",
  eyebrow: "Experience",
  heading: "The journey so far.",
  timelineStart: "2019-07-01",
  timelineEnd: "2026-06-01",
  stats: [
    { value: "7+", label: "years coding" },
    { value: "171", label: "CDC pipelines" },
    { value: "2.8×", label: "MCP speedup" },
    { value: "80+", label: "ES indices" },
  ],
  companies: [
    {
      id: "gep-worldwide",
      company: "GEP Worldwide",
      roleShort: "Senior Software Engineer",
      role: "Senior Software Engineer · Go / C# / .NET / TypeScript / Elasticsearch",
      period: "Jul 2023 — Present",
      periodShort: "Jul '23 — now",
      duration: "34 mo",
      live: true,
      kind: "employment",
      accentKey: "primary",
      links: [
        {
          label: "Internship Certificate",
          href: "https://drive.google.com/file/d/1Cp8QSlrNSy8OahXCybXpa-KrO8zp2RDX/view?usp=sharing",
        },
      ],
      timeline: {
        start: "2023-07-01",
        track: 0,
        rowLabel: "GEP",
        barLabel: "Senior Software Engineer · current",
      },
      achievements: [
        {
          id: "gep-agentic-runtime",
          category: "Agentic Runtime",
          title: "Leo Agentic Runtime",
          summary:
            "Built the real-time and durable execution layer behind the Leo Agentic Runtime: streaming, pooled tool connectivity, and restart-safe human review.",
          pointers: [
            "Engineered the AG-UI streaming protocol adapter — a real-time SSE bridge translating LangGraph executions into typed AG-UI events; cut TTFT from ~5s batch to ~500ms streaming.",
            "Built session-scoped MCP client pooling with a 100-client LRU, 5-min idle TTL, and promise-chain mutex; measured 2.8× speedup on a 5-tool workflow.",
            "Architected the durable Human-in-the-Loop interrupt/resume subsystem with custom LangChain middleware and a MongoDB checkpointer; 100% in-flight survival across pod restarts, p95 < 500ms resume latency.",
          ],
          impact: "~500ms TTFT · 2.8× faster",
          technologies: ["LangGraph", "AG-UI", "MCP", "LangChain", "MongoDB"],
        },
        {
          id: "gep-elasticsearch-platform",
          category: "Elasticsearch",
          title: "Leo Search Platform",
          summary:
            "Designed the Elasticsearch layer spanning query orchestration, semantic search, and operational control for managed indices.",
          pointers: [
            "Architected a pluggable query runtime with 7 query types, a recursive predicate evaluator over 6 comparison operators, and 8 normalization strategies.",
            "Shipped semantic KNN search with configurable thresholds and multi-tenant pre-filters, backed by a 3-tier embedding cache that cut p95 vectorization latency from ~200ms to <10ms on hits.",
            "Designed SearchOps, a REST API for index lifecycle management, orchestrating ~1k bulk sync/reindex jobs per month across 80+ managed indices.",
          ],
          impact: "7 query types · 80+ indices",
          technologies: ["Elasticsearch", "KNN", "C#", ".NET", "REST"],
        },
        {
          id: "gep-cdc",
          category: "Data Platform",
          title: "Leo Storage CDC platform",
          summary:
            "Built and operated a Logstash fabric consuming secured Kafka CDC topics (SCRAM-SHA-512) across 171 pipelines spanning 28 business domains — per-domain filter chains with 3-retry / 50s-timeout HTTP transforms feed a sync-strategy apply layer translating each change event into the correct Elasticsearch mutation.",
          impact: "171 pipelines · 28 domains",
          technologies: ["Logstash", "Kafka", "Elasticsearch", "Azure", "AWS"],
        },
      ],
    },
    {
      id: "ihub-data",
      company: "IHub-Data, IIIT Hyderabad",
      roleShort: "ML Intern",
      role: "Machine Learning Intern · TensorFlow / PyTorch / OpenCV / Flask",
      period: "Jul 2022 — Jan 2023",
      periodShort: "Jul '22 — Jan '23",
      duration: "7 mo",
      kind: "employment",
      accentKey: "secondary",
      links: [
        {
          label: "Certificate",
          href: "https://drive.google.com/file/d/1IBy0mEoh8Ff2USNZMerSrLSoYFRCm1Id/view?usp=sharing",
        },
      ],
      timeline: {
        start: "2022-07-01",
        end: "2023-01-01",
        track: 1,
        rowLabel: "IHub-Data",
        barLabel: "ML Intern",
      },
      achievements: [
        {
          id: "ihub-roadex",
          category: "Computer Vision",
          title: "Roadex Flask web app",
          summary:
            "Built a Flask web app for the Roadex project running 3 YOLO-based CV pipelines (pothole, triple-rider, tree obstruction) on dash-cam video — streaming annotated MJPEG frames and persisting run metadata in SQLite.",
          impact: "~12 FPS · 3 pipelines",
          technologies: ["Flask", "YOLO", "OpenCV", "SQLite"],
        },
        {
          id: "ihub-triple-rider",
          category: "Deep Learning",
          title: "Triple-rider violation pipeline",
          summary:
            "Built the triple-rider violation pipeline cascading TensorFlow YOLOv4 (rider/motorcycle) with PyTorch YOLOv5 (helmet) — using IoU-based rider→motorcycle matching and Deep SORT tracking with frame interpolation.",
          impact: "0.83 mAP@0.5 · 91% helmet",
          technologies: ["TensorFlow", "PyTorch", "YOLOv4", "YOLOv5", "Deep SORT"],
        },
      ],
    },
    {
      id: "nit-agartala",
      company: "NIT Agartala",
      roleShort: "B.Tech CSE",
      role: "Bachelor of Technology in Computer Science & Engineering · CGPA 8.59",
      period: "Jul 2019 — Jul 2023",
      periodShort: "Jul '19 — Jul '23",
      duration: "4 yrs",
      kind: "education",
      accentKey: "primary",
      links: [
        {
          label: "GDSC Certificate",
          href: "https://drive.google.com/file/d/1RKPOSUSs8iFrDiuJr9A6C6-vN_c4Hmso/view?usp=sharing",
        },
      ],
      timeline: {
        start: "2019-07-01",
        end: "2023-07-01",
        track: 2,
        rowLabel: "NIT Agartala",
        barLabel: "B.Tech CSE",
      },
      achievements: [
        {
          id: "nit-degree",
          category: "Education",
          title: "B.Tech in Computer Science & Engineering",
          summary:
            "Completed a Bachelor of Technology in Computer Science & Engineering at NIT Agartala.",
          impact: "CGPA 8.59",
          technologies: ["CSE", "NIT Agartala"],
        },
        {
          id: "nit-gdsc-explore",
          category: "Leadership",
          title: "Google Developer Student Clubs lead",
          summary:
            "Led a chapter of 20+ members and organized GDSC Explore, the biggest development fest in Northeast India.",
          impact: "20+ members led",
          technologies: ["GDSC", "Community", "Events"],
        },
      ],
    },
    {
      id: "imd",
      company: "India Meteorological Dept.",
      roleShort: "Research Intern",
      role: "Research Intern · LSTM · Hailstorm severity prediction",
      period: "Nov 2021 — Jun 2022",
      periodShort: "Nov '21 — Jun '22",
      duration: "8 mo",
      kind: "employment",
      accentKey: "secondary",
      timeline: {
        start: "2021-11-01",
        end: "2022-06-01",
        track: 4,
        rowLabel: "IMD",
        barLabel: "Research Intern",
      },
      achievements: [
        {
          id: "imd-hailstorm",
          category: "Forecasting",
          title: "LSTM hailstorm severity prediction",
          summary:
            "Engineered an LSTM-based prediction model outputting a next-day hailstorm severity plot from meteorological inputs, with statistical reviews backing a peer-reviewed submission.",
          impact: "Next-day severity plot",
          technologies: ["LSTM", "TensorFlow", "Time Series"],
        },
      ],
    },
    {
      id: "omdena",
      company: "Omdena × EnergyHub",
      roleShort: "ML Engineer",
      role: "ML Engineer · Time-series clustering · EV charging optimization",
      period: "Dec 2021 — Feb 2022",
      periodShort: "Dec '21 — Feb '22",
      duration: "3 mo",
      kind: "employment",
      accentKey: "primary",
      links: [
        {
          label: "Certificate",
          href: "https://drive.google.com/file/d/1SYt1rdxIADb--8kRV2q0gdAaTgFfmBnX/view?usp=sharing",
        },
        {
          label: "Report",
          href: "https://drive.google.com/file/d/13oCGiC_5Vv1I7XZzzTuKP1u9VdWAciKA/view?usp=sharing",
        },
      ],
      timeline: {
        start: "2021-12-01",
        end: "2022-02-01",
        track: 5,
        rowLabel: "Omdena × EnergyHub",
        barLabel: "ML Engineer · EV charging",
      },
      achievements: [
        {
          id: "omdena-ev",
          category: "Clustering",
          title: "EV charging optimization for EnergyHub",
          summary:
            "Selected among 50 ML engineers from 20 countries for an Omdena resource project sponsored by EnergyHub — designed clustering algorithms over unlabelled time-series data, organizing EV charging profiles by electricity consumption.",
          impact: "20+ C4Net/EnergyHub partners impacted",
          technologies: ["Clustering", "Time Series", "Python"],
        },
      ],
    },
  ],
};
