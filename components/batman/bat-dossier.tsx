import { FC } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "171", label: "CDC Pipelines" },
  { value: "2.8×", label: "MCP Speedup" },
  { value: "7+", label: "Years Coding" },
];

const specialties = [
  "Go",
  "C#",
  ".NET",
  "TypeScript",
  "Python",
  "C/C++",
  "SQL",
  "Angular",
  "React",
  "TensorFlow",
  "PyTorch",
  "PostgreSQL",
  "Elasticsearch",
  "Kafka",
  "Docker",
  "Kubernetes",
];

export const BatDossier: FC = () => {
  return (
    <section id="bat-dossier" className="bat-section">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Section Label */}
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--bat-primary)", fontFamily: "var(--bat-sans)" }}
          >
            Identity Dossier
          </motion.p>

          {/* Heading */}
          <motion.h2 variants={fadeIn} transition={{ duration: 0.6 }} className="bat-heading mb-12">
            About Me
          </motion.h2>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Left: Bio */}
            <motion.div variants={fadeIn} transition={{ duration: 0.6 }} className="space-y-6">
              {/* Quote callout */}
              <blockquote
                className="border-l-2 pl-6 text-lg italic"
                style={{
                  borderColor: "var(--bat-primary)",
                  color: "var(--bat-fg)",
                  fontFamily: "var(--bat-serif)",
                }}
              >
                &ldquo;I build the infrastructure other people&apos;s agents and applications
                run on.&rdquo;
              </blockquote>

              <p className="bat-subtext">
                I&apos;m Aryan Vijaywargia — a Senior Software Engineer at GEP Worldwide, working on
                the Leo Agentic Runtime and the Leo search platform. My focus is backend
                infrastructure — durable execution, streaming protocols, search, and CDC.
              </p>

              <p className="bat-subtext">
                On the side I&apos;m building <strong>Continua</strong>, a Go/Postgres durable
                execution engine purpose-built for AI agents — event-sourced replay, lease-based
                crash recovery, and a React time-travel trace debugger over event-sourced history.
              </p>

              <p className="bat-subtext">
                Before GEP I studied Computer Science &amp; Engineering at NIT Agartala (CGPA 8.59)
                and interned at IHub-Data IIIT Hyderabad, ISRO-NESAC, IMD, and Omdena × EnergyHub —
                research roles spanning earthquake-precursor detection, hailstorm forecasting, and
                EV-charging optimization. Former GDSC Lead at NIT Agartala.
              </p>

              {/* Stats Row */}
              <div className="flex gap-8 pt-4">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: "var(--bat-primary)", fontFamily: "var(--bat-serif)" }}
                    >
                      {value}
                    </p>
                    <p
                      className="mt-1 text-xs uppercase tracking-widest"
                      style={{ color: "var(--bat-fg-dim)" }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Skills Tags */}
            <motion.div variants={fadeIn} transition={{ duration: 0.6, delay: 0.2 }}>
              <p
                className="mb-6 text-sm uppercase tracking-[0.3em]"
                style={{ color: "var(--bat-primary)", fontFamily: "var(--bat-sans)" }}
              >
                Specialties
              </p>
              <div className="flex flex-wrap gap-3">
                {specialties.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="inline-block rounded-sm px-4 py-2 text-sm font-medium transition-all hover:shadow-[0_0_15px_var(--bat-primary-glow)]"
                    style={{
                      background: "var(--bat-bg-card)",
                      border: "1px solid var(--bat-border)",
                      color: "var(--bat-fg-muted)",
                      fontFamily: "var(--bat-sans)",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              {/* Divider */}
              <div className="bat-rule my-8" />

              {/* Quick profile info */}
              <div className="space-y-3">
                {[
                  ["Location", "India"],
                  ["Education", "NIT Agartala — B.Tech CSE, CGPA 8.59"],
                  ["Focus", "Durable execution · agentic runtimes · search"],
                  ["Status", "Building Continua"],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-4">
                    <span
                      className="w-24 text-xs uppercase tracking-widest"
                      style={{ color: "var(--bat-fg-dim)" }}
                    >
                      {key}
                    </span>
                    <span className="text-sm" style={{ color: "var(--bat-fg-muted)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
