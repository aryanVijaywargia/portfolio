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
    title: "Senior Full Stack Developer",
    organization: "Flext Solutions",
    period: "2023 — Present",
    type: "employment",
    description: "Leading development of scalable web applications using modern technologies",
    details: [
      "Architected and built 5+ production applications serving 10k+ users",
      "Reduced application load times by 40% through optimization",
      "Mentored 3 junior developers and established code review processes",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "cf-002",
    title: "Full Stack Developer",
    organization: "TechCorp Inc",
    period: "2021 — 2022",
    type: "employment",
    description: "Developed and maintained web applications for enterprise clients",
    details: [
      "Built responsive web applications used by 50+ enterprise clients",
      "Integrated payment systems processing $1M+ monthly transactions",
      "Optimized database queries improving response times by 35%",
    ],
    technologies: ["React", "Vue.js", "PHP", "MySQL", "Docker", "GCP"],
  },
  {
    id: "cf-003",
    title: "GDSC Lead",
    organization: "NIT Agartala",
    period: "2020 — 2022",
    type: "education",
    description: "Google Developer Student Clubs Lead at NIT Agartala",
    details: [
      "Led a community of 200+ student developers",
      "Organized 10+ technical workshops and hackathons",
      "Mentored students on open-source contributions",
    ],
    technologies: ["Python", "TensorFlow", "Flutter", "Firebase"],
  },
  {
    id: "cf-004",
    title: "Freelance Developer",
    organization: "Independent",
    period: "2020 — 2021",
    type: "freelance",
    description: "Delivered custom web solutions for small to medium businesses",
    details: [
      "Completed 15+ projects with 100% client satisfaction",
      "Developed e-commerce solutions generating $500k+ in sales",
      "Established long-term partnerships with 5 recurring clients",
    ],
    technologies: ["JavaScript", "Python", "WordPress", "Shopify", "Stripe"],
  },
  {
    id: "cf-005",
    title: "B.Tech Computer Science",
    organization: "NIT Agartala",
    period: "2019 — 2023",
    type: "education",
    description: "Specialized in Software Engineering and Data Structures",
    details: [
      "Specialized in Machine Learning and Software Engineering",
      "Published research on earthquake prediction using deep learning",
      "Won multiple hackathons and coding competitions",
    ],
    technologies: ["C++", "Python", "Java", "Data Structures", "Algorithms"],
  },
  {
    id: "cf-006",
    title: "Open Source Contributor",
    organization: "Various Projects",
    period: "2020 — Present",
    type: "project",
    description: "Contributing to open source projects and maintaining personal tools",
    details: [
      "Contributed to 20+ open source repositories",
      "Maintained CLI tools with 1k+ weekly downloads",
      "Spoke at 3 local tech meetups about web performance",
    ],
    technologies: ["TypeScript", "Rust", "Go", "GitHub Actions"],
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
