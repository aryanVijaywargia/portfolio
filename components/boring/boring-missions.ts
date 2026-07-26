import { BORING_FACTS } from "content/boring/mission-facts";

export type BoringMission = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  route: string;
  duration: string;
  summary: string;
  briefing: string;
  startObjective: string;
  activeObjective: string;
  anchorId: string;
  completionAnchorId: string;
  accent: string;
  factHeading: string;
  facts: string[];
  reward: string;
};

export const BORING_MISSIONS: BoringMission[] = [
  {
    id: "home-circuit",
    number: "01",
    title: "Home Circuit: Meet the Builder",
    shortTitle: "HOME CIRCUIT",
    route: "Kamla Park → Lakefront → Shyamla Hills",
    duration: "5–7 MIN",
    summary:
      "Put the builder story in order, ask for a ride with respect, and carry a research notebook along the lakefront.",
    briefing:
      "Portfolio Dispatch found a set of mixed-up story cards. Start at the fictional curbside kiosk, follow the safe public-road route, and deliver the research notebook near the Shyamla Hills cultural corridor.",
    startObjective: "Reach Portfolio Dispatch near Kamla Park",
    activeObjective: "Carry the builder notebook to Shyamla Hills",
    anchorId: "mission-home-circuit",
    completionAnchorId: "recovery-shyamla-hills",
    accent: "#e9b949",
    factHeading: "ORIGIN & RESEARCH",
    facts: [
      `${BORING_FACTS.profile.name} · ${BORING_FACTS.profile.title}`,
      `${BORING_FACTS.education.role} · ${BORING_FACTS.education.period}`,
      `${BORING_FACTS.education.leadershipImpact} · ${BORING_FACTS.education.leadership}`,
      `${BORING_FACTS.research.roadexImpact} · ${BORING_FACTS.research.riderImpact}`,
      BORING_FACTS.research.earthquake,
    ],
    reward: "Origin & Research dossier",
  },
  {
    id: "runtime-relay",
    number: "02",
    title: "Runtime Relay",
    shortTitle: "RUNTIME RELAY",
    route: "Rani Kamlapati → Shaurya Smarak → New Market",
    duration: "6–8 MIN",
    summary:
      "Carry a harmless debug signal through the agent runtime, search platform, and CDC fabric.",
    briefing:
      "Three fictional runtime relays in New Bhopal lost their connection. Reorder the stream, route the query, connect the data lanes, and return the restored signal.",
    startObjective: "Find the runtime relay near DB Mall",
    activeObjective: "Deliver the restored signal to the Old City safe road",
    anchorId: "mission-runtime-relay",
    completionAnchorId: "recovery-old-city",
    accent: "#df604f",
    factHeading: "RUNTIME SYSTEMS",
    facts: [
      BORING_FACTS.runtime.agentic[0],
      BORING_FACTS.runtime.agentic[1],
      BORING_FACTS.runtime.agentic[2],
      BORING_FACTS.runtime.search[1],
      `${BORING_FACTS.runtime.searchImpact} · ${BORING_FACTS.runtime.cdcImpact}`,
    ],
    reward: "Runtime Systems dossier",
  },
  {
    id: "continue-long-run",
    number: "03",
    title: "Continue the Long Run",
    shortTitle: "LONG RUN",
    route: "Workflow Studio → Project Promenade → Lake Overlook",
    duration: "6–8 MIN",
    summary:
      "Record, replay, and recover a durable workflow, then bring the completed trace to the lake overlook.",
    briefing:
      "A fictional lakefront studio paused safely after losing a signal. Visit record, replay, and recovery checkpoints, then choose the next real-world action explicitly.",
    startObjective: "Reach the fictional Workflow Studio",
    activeObjective: "Bring the recovered trace to the lake overlook",
    anchorId: "mission-continue-long-run",
    completionAnchorId: "lake-overlook-finale",
    accent: "#5ca7a2",
    factHeading: "CONTINUA & PROJECTS",
    facts: [
      BORING_FACTS.continua.description,
      "React debugger: virtualized 1K+ span waterfall and JSON search across 5K-node trace trees.",
      "Python SDK: decorator tracing, lease heartbeats, graceful drain, and remote activities.",
      "Also featured: Earthquake Precursor Detection and the Forex Trading Recommendation System.",
    ],
    reward: "Complete portfolio archive & free roam",
  },
];

export const GAME_LINKS = [
  { label: "GitHub profile", href: BORING_FACTS.contact.github },
  { label: "Résumé (PDF)", href: BORING_FACTS.contact.resume },
  { label: "Email Aryan", href: `mailto:${BORING_FACTS.contact.email}` },
  { label: "LinkedIn", href: BORING_FACTS.contact.linkedin },
  { label: "Continua", href: BORING_FACTS.continua.site },
  { label: "Continua repository", href: BORING_FACTS.continua.repository },
] as const;
