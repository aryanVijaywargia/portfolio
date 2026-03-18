export type ExperienceAccentKey = 'primary' | 'secondary' | 'tertiary';

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
  role: string;
  period: string;
  kind: 'employment' | 'freelance' | 'project' | 'education';
  accentKey: ExperienceAccentKey;
  achievements: ExperienceAchievement[];
}

export interface ExperienceJourney {
  rootLabel: string;
  rootPrompt: string;
  companies: ExperienceCompany[];
}

export const EXPERIENCE_JOURNEY: ExperienceJourney = {
  rootLabel: "Aryan Vijaywargia",
  rootPrompt: "Click to explore career",
  companies: [
    {
      id: "flext",
      company: "Flext Solutions",
      role: "Senior Full Stack Developer",
      period: "Jan 2023 — Present",
      kind: "employment",
      accentKey: "primary",
      achievements: [
        {
          id: "flext-arch",
          category: "Architecture",
          title: "Production App Suite",
          summary: "Architected and built 5+ production applications serving 10k+ users with modern stack.",
          impact: "10k+ users served across 5 apps",
          technologies: ["React", "Next.js", "TypeScript", "AWS"],
        },
        {
          id: "flext-perf",
          category: "Performance",
          title: "Load Time Optimization",
          summary: "Reduced application load times by 40% through code splitting, lazy loading, and caching strategies.",
          impact: "40% faster load times",
          technologies: ["Webpack", "React", "CDN", "Redis"],
        },
        {
          id: "flext-lead",
          category: "Leadership",
          title: "Team Mentorship",
          summary: "Mentored 3 junior developers and established code review processes across the team.",
          impact: "3 developers mentored",
          technologies: ["Git", "GitHub Actions", "Code Review"],
        },
        {
          id: "flext-devops",
          category: "DevOps",
          title: "CI/CD Pipeline",
          summary: "Implemented CI/CD pipelines reducing deployment time by 60% with automated testing.",
          impact: "60% faster deployments",
          technologies: ["Docker", "GitHub Actions", "AWS", "Terraform"],
        },
      ],
    },
    {
      id: "techcorp",
      company: "TechCorp Inc",
      role: "Full Stack Developer",
      period: "Mar 2021 — Dec 2022",
      kind: "employment",
      accentKey: "secondary",
      achievements: [
        {
          id: "tc-enterprise",
          category: "Development",
          title: "Enterprise Web Apps",
          summary: "Built responsive web applications used by 50+ enterprise clients with complex data requirements.",
          impact: "50+ enterprise clients served",
          technologies: ["React", "Vue.js", "TypeScript"],
        },
        {
          id: "tc-payments",
          category: "Integration",
          title: "Payment Systems",
          summary: "Integrated payment systems processing $1M+ monthly transactions with PCI compliance.",
          impact: "$1M+ monthly transactions",
          technologies: ["Stripe", "Node.js", "PostgreSQL"],
        },
        {
          id: "tc-db",
          category: "Performance",
          title: "Database Optimization",
          summary: "Optimized database queries improving response times by 35% across critical endpoints.",
          impact: "35% faster response times",
          technologies: ["MySQL", "Redis", "Elasticsearch"],
        },
        {
          id: "tc-migration",
          category: "Architecture",
          title: "Stack Migration",
          summary: "Led migration from legacy PHP to modern React stack, improving developer productivity.",
          impact: "Full stack modernization",
          technologies: ["React", "PHP", "Docker", "GCP"],
        },
      ],
    },
    {
      id: "freelance",
      company: "Freelance",
      role: "Full Stack Developer",
      period: "Jan 2020 — Feb 2021",
      kind: "freelance",
      accentKey: "tertiary",
      achievements: [
        {
          id: "fl-projects",
          category: "Delivery",
          title: "Client Projects",
          summary: "Completed 15+ projects with 100% client satisfaction rate across diverse industries.",
          impact: "15+ projects, 100% satisfaction",
          technologies: ["JavaScript", "Python", "WordPress"],
        },
        {
          id: "fl-ecommerce",
          category: "E-commerce",
          title: "Online Stores",
          summary: "Developed e-commerce solutions generating $500k+ in collective sales for clients.",
          impact: "$500k+ in sales generated",
          technologies: ["Shopify", "Stripe", "React"],
        },
        {
          id: "fl-cms",
          category: "Development",
          title: "Custom CMS Systems",
          summary: "Created custom CMS systems for content management tailored to client needs.",
          impact: "5 recurring client partnerships",
          technologies: ["WordPress", "PHP", "MySQL"],
        },
      ],
    },
    {
      id: "bootcamp",
      company: "Code Academy",
      role: "Full Stack Web Development",
      period: "Jun 2019 — Dec 2019",
      kind: "education",
      accentKey: "primary",
      achievements: [
        {
          id: "bc-grad",
          category: "Achievement",
          title: "Top Graduate",
          summary: "Graduated top 10% of cohort with distinction after intensive 6-month program.",
          impact: "Top 10% of cohort",
          technologies: ["HTML", "CSS", "JavaScript"],
        },
        {
          id: "bc-projects",
          category: "Development",
          title: "Capstone Projects",
          summary: "Built 8 full-stack projects including final capstone presented to industry professionals.",
          impact: "8 full-stack projects built",
          technologies: ["React", "Node.js", "MongoDB"],
        },
      ],
    },
    {
      id: "opensource",
      company: "Open Source",
      role: "Contributor & Maintainer",
      period: "Jan 2020 — Present",
      kind: "project",
      accentKey: "secondary",
      achievements: [
        {
          id: "oss-contrib",
          category: "Community",
          title: "Repository Contributions",
          summary: "Contributed to 20+ open source repositories across various ecosystems.",
          impact: "20+ repos contributed to",
          technologies: ["TypeScript", "Rust", "Go"],
        },
        {
          id: "oss-tools",
          category: "Development",
          title: "Developer Tools",
          summary: "Maintained CLI tools with 1k+ weekly downloads and VS Code extensions.",
          impact: "1k+ weekly downloads",
          technologies: ["TypeScript", "WebAssembly", "GitHub Actions"],
        },
        {
          id: "oss-speaking",
          category: "Speaking",
          title: "Tech Meetups",
          summary: "Spoke at 3 local tech meetups about web performance and developer tooling.",
          impact: "3 tech talks delivered",
          technologies: ["Web Performance", "DevTools"],
        },
      ],
    },
  ],
};
