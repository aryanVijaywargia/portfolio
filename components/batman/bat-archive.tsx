import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "components/link";
import { PROJECTS } from "content/projects";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const BatArchive: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECTS[activeIndex];

  const goNext = () => setActiveIndex((i) => (i + 1) % PROJECTS.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + PROJECTS.length) % PROJECTS.length);

  return (
    <section id="bat-archive" className="bat-section">
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
            Case Archive
          </motion.p>

          <motion.h2 variants={fadeIn} transition={{ duration: 0.6 }} className="bat-heading mb-16">
            Projects
          </motion.h2>

          {/* Featured Project */}
          <motion.div variants={fadeIn} transition={{ duration: 0.6 }}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main featured card */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bat-card p-8 md:p-10"
                  >
                    {/* Type badges */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {activeProject.type.map((t) => (
                        <span
                          key={t}
                          className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-widest"
                          style={{
                            background: "var(--bat-accent)",
                            color: "var(--bat-fg-muted)",
                            border: "1px solid var(--bat-border)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3
                      className="text-2xl font-bold md:text-3xl"
                      style={{
                        fontFamily: "var(--bat-serif)",
                        color: "var(--bat-fg)",
                      }}
                    >
                      {activeProject.name}
                    </h3>

                    <p
                      className="mt-4 text-base leading-relaxed"
                      style={{ color: "var(--bat-fg-muted)" }}
                    >
                      {activeProject.description}
                    </p>

                    {/* Year */}
                    <p
                      className="mt-4 text-sm"
                      style={{ color: "var(--bat-fg-dim)", fontFamily: "var(--bat-mono)" }}
                    >
                      {activeProject.year}
                    </p>

                    {/* Tech */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeProject.tech.map(({ name }) => (
                        <span
                          key={name}
                          className="rounded-sm px-3 py-1 text-xs"
                          style={{
                            background: "var(--bat-muted)",
                            color: "var(--bat-primary)",
                            border: "1px solid var(--bat-border)",
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-8 flex gap-4">
                      {activeProject.repository && (
                        <Link
                          href={activeProject.repository}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-sm transition-all"
                          style={{
                            color: "var(--bat-primary)",
                            fontFamily: "var(--bat-sans)",
                          }}
                        >
                          View Source &#8599;
                        </Link>
                      )}
                      {activeProject.url && (
                        <Link
                          href={activeProject.url}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-sm transition-all"
                          style={{
                            color: "var(--bat-primary)",
                            fontFamily: "var(--bat-sans)",
                          }}
                        >
                          Live Demo &#8599;
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation controls */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={goPrev}
                    className="text-sm uppercase tracking-widest transition-all hover:tracking-[0.35em]"
                    style={{
                      color: "var(--bat-fg-muted)",
                      fontFamily: "var(--bat-serif)",
                      background: "none",
                      border: "none",
                    }}
                  >
                    [ PREV ]
                  </button>
                  <span
                    className="text-xs"
                    style={{ color: "var(--bat-fg-dim)", fontFamily: "var(--bat-mono)" }}
                  >
                    {activeIndex + 1} / {PROJECTS.length}
                  </span>
                  <button
                    onClick={goNext}
                    className="text-sm uppercase tracking-widest transition-all hover:tracking-[0.35em]"
                    style={{
                      color: "var(--bat-fg-muted)",
                      fontFamily: "var(--bat-serif)",
                      background: "none",
                      border: "none",
                    }}
                  >
                    [ NEXT ]
                  </button>
                </div>
              </div>

              {/* Thumbnail rail */}
              <div className="space-y-3">
                {PROJECTS.map((project, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="w-full text-left transition-all"
                    style={{
                      padding: "0.75rem 1rem",
                      background: i === activeIndex ? "var(--bat-bg-card-hover)" : "transparent",
                      border: `1px solid ${
                        i === activeIndex ? "var(--bat-primary)" : "var(--bat-border)"
                      }`,
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: i === activeIndex ? "var(--bat-fg)" : "var(--bat-fg-dim)",
                        fontFamily: "var(--bat-sans)",
                      }}
                    >
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--bat-fg-dim)" }}>
                      {project.year} &middot; {project.type[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
