export type ExperienceAccentKey = 'primary' | 'secondary' | 'tertiary';
export type ExperienceKind = 'employment' | 'freelance' | 'project' | 'education';

export interface ExperienceStat {
  value: string;
  label: string;
}

export interface ExperienceAchievement {
  id: string;
  category: string;
  title: string;
  summary: string;
  impact: string;
  technologies: string[];
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
  heading: "Six years, five chapters.",
  timelineStart: "2019-06-01",
  timelineEnd: "2026-05-01",
  stats: [
    { value: "10k+", label: "users" },
    { value: "$1.5M+", label: "processed" },
    { value: "40%", label: "faster" },
    { value: "16", label: "shipped" },
  ],
  companies: [
    {
      id: "flext",
      company: "Flext Solutions",
      roleShort: "Senior Full Stack",
      role: "Senior Full Stack Developer · React / Next.js / TypeScript / AWS",
      period: "Jan 2023 — Present",
      periodShort: "Jan '23 — now",
      duration: "40 mo",
      live: true,
      kind: "employment",
      accentKey: "primary",
      timeline: {
        start: "2023-01-01",
        track: 3,
        rowLabel: "Flext",
        barLabel: "Senior Full Stack · current",
      },
      achievements: [
        {
          id: "flext-arch",
          category: "Architecture",
          title: "Production app suite",
          summary: "Shipped 5+ production apps on a unified React/Next/TypeScript/AWS stack with shared auth, billing, and observability.",
          impact: "10k+ users",
          technologies: ["React", "Next.js", "TypeScript", "AWS"],
        },
        {
          id: "flext-perf",
          category: "Performance",
          title: "Load-time optimization",
          summary: "Cut p75 page load by 40% via route-level code splitting, edge-cached responses, and Redis on the hot path.",
          impact: "-40% load",
          technologies: ["Webpack", "React", "CDN", "Redis"],
        },
        {
          id: "flext-lead",
          category: "Leadership",
          title: "Team mentorship",
          summary: "Mentored 3 junior engineers from onboarding to first solo ship. Established the team's code-review rubric.",
          impact: "3 mentees",
          technologies: ["Git", "GitHub Actions", "Code Review"],
        },
        {
          id: "flext-devops",
          category: "DevOps",
          title: "CI/CD pipeline",
          summary: "Built CI/CD from scratch with automated tests, Terraform environments, and blue/green rollouts.",
          impact: "-60% deploy",
          technologies: ["Docker", "GitHub Actions", "AWS", "Terraform"],
        },
      ],
    },
    {
      id: "techcorp",
      company: "TechCorp Inc",
      roleShort: "Full Stack",
      role: "Full Stack Developer · React / Vue / Node",
      period: "Mar 2021 — Dec 2022",
      periodShort: "Mar '21 — Dec '22",
      duration: "22 mo",
      kind: "employment",
      accentKey: "secondary",
      timeline: {
        start: "2021-03-01",
        end: "2022-12-01",
        track: 2,
        rowLabel: "TechCorp",
        barLabel: "Full Stack",
      },
      achievements: [
        {
          id: "tc-enterprise",
          category: "Development",
          title: "Enterprise web apps",
          summary: "Built responsive web applications used by 50+ enterprise clients with complex data requirements.",
          impact: "50+ clients",
          technologies: ["React", "Vue.js", "TypeScript"],
        },
        {
          id: "tc-payments",
          category: "Integration",
          title: "Payment systems",
          summary: "Integrated payment systems processing $1M+ monthly transactions with PCI compliance.",
          impact: "$1M+ / mo",
          technologies: ["Stripe", "Node.js", "PostgreSQL"],
        },
        {
          id: "tc-db",
          category: "Performance",
          title: "Database optimization",
          summary: "Optimized database queries improving response times by 35% across critical endpoints.",
          impact: "-35% latency",
          technologies: ["MySQL", "Redis", "Elasticsearch"],
        },
        {
          id: "tc-migration",
          category: "Architecture",
          title: "Stack migration",
          summary: "Led migration from legacy PHP to modern React stack, improving developer productivity.",
          impact: "PHP to React",
          technologies: ["React", "PHP", "Docker", "GCP"],
        },
      ],
    },
    {
      id: "freelance",
      company: "Freelance",
      roleShort: "15 projects",
      role: "Full Stack Developer · solo client work",
      period: "Jan 2020 — Feb 2021",
      periodShort: "Jan '20 — Feb '21",
      duration: "14 mo",
      kind: "freelance",
      accentKey: "tertiary",
      timeline: {
        start: "2020-01-01",
        end: "2021-02-01",
        track: 1,
        rowLabel: "Freelance",
        barLabel: "Solo · 15 projects",
      },
      achievements: [
        {
          id: "fl-projects",
          category: "Delivery",
          title: "Client projects",
          summary: "Completed 15+ projects with 100% client satisfaction rate across diverse industries.",
          impact: "100% satisfaction",
          technologies: ["JavaScript", "Python", "WordPress"],
        },
        {
          id: "fl-ecommerce",
          category: "E-commerce",
          title: "Online stores",
          summary: "Developed e-commerce solutions generating $500k+ in collective sales for clients.",
          impact: "$500k+ GMV",
          technologies: ["Shopify", "Stripe", "React"],
        },
        {
          id: "fl-cms",
          category: "Development",
          title: "Custom CMS systems",
          summary: "Created custom CMS systems for content management tailored to client needs.",
          impact: "5 partnerships",
          technologies: ["WordPress", "PHP", "MySQL"],
        },
      ],
    },
    {
      id: "bootcamp",
      company: "Code Academy",
      roleShort: "Bootcamp",
      role: "Full Stack Web Development",
      period: "Jun 2019 — Dec 2019",
      periodShort: "Jun '19 — Dec '19",
      duration: "6 mo",
      kind: "education",
      accentKey: "primary",
      timeline: {
        start: "2019-06-01",
        end: "2019-12-01",
        track: 0,
        rowLabel: "Code Acad",
        barLabel: "Bootcamp",
      },
      achievements: [
        {
          id: "bc-grad",
          category: "Achievement",
          title: "Top graduate",
          summary: "Graduated top 10% of cohort with distinction after intensive 6-month program.",
          impact: "Top 10% of cohort",
          technologies: ["HTML", "CSS", "JavaScript"],
        },
        {
          id: "bc-projects",
          category: "Development",
          title: "Capstone projects",
          summary: "Built 8 full-stack projects including final capstone presented to industry professionals.",
          impact: "8 capstones",
          technologies: ["React", "Node.js", "MongoDB"],
        },
      ],
    },
    {
      id: "opensource",
      company: "Open Source",
      roleShort: "Contributor",
      role: "Contributor & Maintainer",
      period: "Jan 2020 — Present",
      periodShort: "Jan '20 — now",
      duration: "76 mo",
      live: true,
      kind: "project",
      accentKey: "secondary",
      timeline: {
        start: "2020-01-01",
        track: 4,
        rowLabel: "OSS",
        barLabel: "Contributor & Maintainer · ongoing",
      },
      achievements: [
        {
          id: "oss-contrib",
          category: "Community",
          title: "Repository contributions",
          summary: "Contributed to 20+ open source repositories across various ecosystems.",
          impact: "20+ repos",
          technologies: ["TypeScript", "Rust", "Go"],
        },
        {
          id: "oss-tools",
          category: "Development",
          title: "Developer tools",
          summary: "Maintained CLI tools with 1k+ weekly downloads and VS Code extensions.",
          impact: "1k+ DL / wk",
          technologies: ["TypeScript", "WebAssembly", "GitHub Actions"],
        },
        {
          id: "oss-speaking",
          category: "Speaking",
          title: "Tech meetups",
          summary: "Spoke at 3 local tech meetups about web performance and developer tooling.",
          impact: "3 talks",
          technologies: ["Web Performance", "DevTools"],
        },
      ],
    },
  ],
};
