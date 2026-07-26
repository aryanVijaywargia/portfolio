import { CONTACT } from "content/contact";
import { EXPERIENCE_JOURNEY } from "content/experience";
import { PROJECTS } from "content/projects";

const company = (id: string) => {
  const value = EXPERIENCE_JOURNEY.companies.find((entry) => entry.id === id);
  if (!value) throw new Error(`Missing canonical experience company: ${id}`);
  return value;
};

const achievement = (companyId: string, achievementId: string) => {
  const value = company(companyId).achievements.find((entry) => entry.id === achievementId);
  if (!value) throw new Error(`Missing canonical achievement: ${companyId}/${achievementId}`);
  return value;
};

const project = (name: string) => {
  const value = PROJECTS.find((entry) => entry.name === name);
  if (!value) throw new Error(`Missing canonical project: ${name}`);
  return value;
};

const nit = company("nit-agartala");
const runtime = achievement("gep-worldwide", "gep-agentic-runtime");
const search = achievement("gep-worldwide", "gep-elasticsearch-platform");
const cdc = achievement("gep-worldwide", "gep-cdc");
const roadex = achievement("ihub-data", "ihub-roadex");
const rider = achievement("ihub-data", "ihub-triple-rider");
const earthquake = project("Earthquake Precursor Detection - ISRO-NESAC");
const continua = project("Continua");

export const BORING_FACTS = {
  profile: {
    name: EXPERIENCE_JOURNEY.rootLabel,
    title: company("gep-worldwide").roleShort,
    summary:
      "Backend and systems builder focused on AI agent infrastructure, enterprise search, and data systems.",
  },
  education: {
    role: nit.role,
    period: nit.period,
    leadership: achievement("nit-agartala", "nit-gdsc-explore").summary,
    leadershipImpact: achievement("nit-agartala", "nit-gdsc-explore").impact,
  },
  research: {
    roadex: roadex.summary,
    roadexImpact: roadex.impact,
    rider: rider.summary,
    riderImpact: rider.impact,
    earthquake: earthquake.description,
    earthquakeRepository: earthquake.repository,
    imd: achievement("imd", "imd-hailstorm").summary,
    omdena: achievement("omdena", "omdena-ev").summary,
  },
  runtime: {
    agentic: runtime.pointers ?? [],
    agenticImpact: runtime.impact,
    search: search.pointers ?? [],
    searchImpact: search.impact,
    cdc: cdc.summary,
    cdcImpact: cdc.impact,
  },
  continua: {
    description: continua.description,
    repository: continua.repository,
    site: continua.url,
  },
  contact: {
    email: CONTACT.contactInfo.email,
    github: CONTACT.socialLinks.github,
    linkedin: CONTACT.socialLinks.linkedin,
    resume: "/resume/aryan-vijaywargia-resume.pdf",
  },
} as const;
