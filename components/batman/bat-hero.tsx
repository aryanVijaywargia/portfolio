import { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "components/link";
import { Image } from "components/image";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const navLinks = [
  { label: "About Me", href: "#bat-dossier" },
  { label: "Projects", href: "#bat-archive" },
  { label: "Experience", href: "#bat-casefile" },
  { label: "Contact", href: "#bat-contact" },
];

export const BatHero: FC = () => {
  return (
    <section
      id="bat-hero"
      className="relative flex flex-col overflow-hidden"
      style={{ paddingTop: "6rem", paddingBottom: "4rem" }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto w-full max-w-7xl px-6 md:px-10"
      >
        {/* Top Row: Typography + Photo side by side */}
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
          {/* Left: Oversized Typography */}
          <motion.div variants={fadeIn} transition={{ duration: 0.7 }}>
            <motion.p
              variants={fadeIn}
              className="mb-6 text-sm uppercase tracking-[0.3em]"
              style={{ color: "var(--bat-fg-muted)", fontFamily: "var(--bat-sans)" }}
            >
              Aryan Vijaywargia
            </motion.p>

            <div>
              {["IMAGINE.", "BUILD.", "DEPLOY.", "WOW."].map((word, i) => (
                <motion.h1
                  key={word}
                  variants={fadeIn}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="bat-heading-huge"
                  style={{
                    opacity: i === 3 ? 0.35 : 1,
                    color: i === 3 ? "var(--bat-fg-dim)" : "var(--bat-fg)",
                  }}
                >
                  {word}
                </motion.h1>
              ))}
            </div>

            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 max-w-md text-lg leading-relaxed"
              style={{ color: "var(--bat-fg-muted)", fontFamily: "var(--bat-sans)" }}
            >
              Fullstack Engineer & ML enthusiast crafting intelligent systems that push boundaries.
            </motion.p>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <Link
                href="#bat-archive"
                className="bat-nav-link"
                style={{
                  color: "var(--bat-primary)",
                  fontSize: "1rem",
                  fontFamily: "var(--bat-sans)",
                  textDecoration: "none",
                }}
              >
                View My Work
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Framed Photo */}
          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div
              className="relative w-full max-w-md overflow-hidden"
              style={{
                border: "1px solid var(--bat-border)",
                background: "var(--bat-bg-card)",
              }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/about/aryan-profile.jpg"
                  alt="Aryan Vijaywargia"
                  width={1600}
                  height={1200}
                  className="bat-no-filter h-full w-full object-cover"
                  style={{
                    filter:
                      "saturate(0.2) sepia(0.15) hue-rotate(120deg) brightness(0.75) contrast(1.1)",
                  }}
                />
                {/* Overlay text */}
                <div
                  className="absolute bottom-6 right-6 text-right"
                  style={{ fontFamily: "var(--bat-sans)" }}
                >
                  {["Code.", "Build.", "Deploy."].map((text) => (
                    <p
                      key={text}
                      className="text-xs font-medium tracking-widest"
                      style={{ color: "var(--bat-fg)" }}
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <motion.div
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16"
          style={{ borderTop: "1px solid var(--bat-border)" }}
        >
          <nav className="flex flex-wrap gap-8 pt-8 md:gap-12">
            {navLinks.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                className="bat-nav-link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              >
                {label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      </motion.div>

      {/* Subtle floating particles (decorative) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 5}px`,
              height: `${4 + Math.random() * 5}px`,
              background: "var(--bat-primary)",
              opacity: 0.12 + Math.random() * 0.15,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.12, 0.25, 0.12],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};
