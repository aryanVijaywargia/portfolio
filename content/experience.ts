import { 
  BriefcaseIcon, 
  CodeBracketIcon, 
  CommandLineIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export interface ExperienceItem {
  id: string;
  hash: string;
  company: string;
  position: string;
  type: 'employment' | 'freelance' | 'project' | 'education';
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  projects: string[];
  Icon: any;
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "current-role",
    hash: "a7f3b2c",
    company: "Flext Solutions",
    position: "Senior Full Stack Developer",
    type: "employment",
    startDate: "2023-01-15",
    endDate: null,
    location: "Remote",
    description: "Leading development of scalable web applications using modern technologies",
    achievements: [
      "Architected and built 5+ production applications serving 10k+ users",
      "Reduced application load times by 40% through optimization",
      "Mentored 3 junior developers and established code review processes",
      "Implemented CI/CD pipelines reducing deployment time by 60%"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    projects: ["E-commerce Platform", "Dashboard Analytics", "API Gateway"],
    Icon: StarIcon
  },
  {
    id: "previous-role",
    hash: "d4e9a1b",
    company: "TechCorp Inc",
    position: "Full Stack Developer",
    type: "employment",
    startDate: "2021-03-01",
    endDate: "2022-12-31",
    location: "Cape Town, SA",
    description: "Developed and maintained web applications for enterprise clients",
    achievements: [
      "Built responsive web applications used by 50+ enterprise clients",
      "Integrated payment systems processing $1M+ monthly transactions",
      "Optimized database queries improving response times by 35%",
      "Led migration from legacy PHP to modern React stack"
    ],
    technologies: ["React", "Vue.js", "PHP", "MySQL", "Docker", "GCP"],
    projects: ["Client Portal", "Payment Gateway", "Admin Dashboard"],
    Icon: BriefcaseIcon
  },
  {
    id: "freelance-work",
    hash: "f2c8d5e",
    company: "Freelance Projects",
    position: "Full Stack Developer",
    type: "freelance",
    startDate: "2020-01-01",
    endDate: "2021-02-28",
    location: "Remote",
    description: "Delivered custom web solutions for small to medium businesses",
    achievements: [
      "Completed 15+ projects with 100% client satisfaction rate",
      "Developed e-commerce solutions generating $500k+ in sales",
      "Created custom CMS systems for content management",
      "Established long-term partnerships with 5 recurring clients"
    ],
    technologies: ["JavaScript", "Python", "WordPress", "Shopify", "Stripe"],
    projects: ["Restaurant Websites", "E-commerce Stores", "Booking Systems"],
    Icon: UserGroupIcon
  },
  {
    id: "bootcamp",
    hash: "b8a3f7d",
    company: "Code Academy Bootcamp",
    position: "Full Stack Web Development",
    type: "education",
    startDate: "2019-06-01",
    endDate: "2019-12-15",
    location: "Cape Town, SA",
    description: "Intensive 6-month program covering modern web development",
    achievements: [
      "Graduated top 10% of cohort with distinction",
      "Built 8 full-stack projects including final capstone",
      "Collaborated in agile teams on real-world scenarios",
      "Presented final project to industry professionals"
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    projects: ["Social Media App", "Task Manager", "Weather Dashboard"],
    Icon: AcademicCapIcon
  },
  {
    id: "side-projects",
    hash: "c9b2e4a",
    company: "Open Source Contributions",
    position: "Contributor & Maintainer",
    type: "project",
    startDate: "2020-01-01",
    endDate: null,
    location: "Remote",
    description: "Contributing to open source projects and maintaining personal tools",
    achievements: [
      "Contributed to 20+ open source repositories",
      "Maintained CLI tools with 1k+ weekly downloads",
      "Spoke at 3 local tech meetups about web performance",
      "Built developer tools used by 500+ developers"
    ],
    technologies: ["TypeScript", "Rust", "Go", "WebAssembly", "GitHub Actions"],
    projects: ["CLI Tools", "VS Code Extensions", "Performance Libraries"],
    Icon: HeartIcon
  }
];

export const EXPERIENCE_STATS = {
  totalCommits: EXPERIENCE_DATA.length,
  yearsExperience: Math.floor((new Date().getTime() - new Date('2019-06-01').getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
  technologies: [...new Set(EXPERIENCE_DATA.flatMap(exp => exp.technologies))].length,
  projects: EXPERIENCE_DATA.reduce((acc, exp) => acc + exp.projects.length, 0)
};

export const EXPERIENCE_BRANCHES = [
  { name: "main", description: "Primary career path", count: EXPERIENCE_DATA.filter(e => e.type === 'employment').length },
  { name: "freelance", description: "Independent projects", count: EXPERIENCE_DATA.filter(e => e.type === 'freelance').length },
  { name: "education", description: "Learning & growth", count: EXPERIENCE_DATA.filter(e => e.type === 'education').length },
  { name: "open-source", description: "Community contributions", count: EXPERIENCE_DATA.filter(e => e.type === 'project').length }
];

export const EXPERIENCE_CONTRIBUTORS = [
  "Flext Solutions Team",
  "TechCorp Development Team", 
  "Bootcamp Cohort 2019",
  "Open Source Community",
  "Freelance Client Network"
];