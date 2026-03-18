import { FC, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "components/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const socialLinks = [
  { name: "Github", href: "https://github.com/AryanVijaywargia" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/aryan-vijaywargia/" },
  { name: "DagsHub", href: "https://dagshub.com/aryanVijaywargia" },
];

export const BatContact: FC = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
      }
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="bat-contact" className="bat-section">
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
            Begin Something
          </motion.p>

          <motion.h2 variants={fadeIn} transition={{ duration: 0.6 }} className="bat-heading mb-4">
            Say Hi!
          </motion.h2>

          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-16 max-w-lg text-lg"
            style={{
              color: "var(--bat-fg-muted)",
              fontFamily: "var(--bat-serif)",
              fontStyle: "italic",
            }}
          >
            Tell me about your idea &amp; let&apos;s build something extraordinary together.
          </motion.p>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Left: Contact Form */}
            <motion.div variants={fadeIn} transition={{ duration: 0.6 }}>
              {submitted
                ? <div className="bat-card p-10 text-center">
                    <p
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--bat-serif)", color: "var(--bat-primary)" }}
                    >
                      Message Received.
                    </p>
                    <p className="mt-3" style={{ color: "var(--bat-fg-muted)" }}>
                      I&apos;ll get back to you soon.
                    </p>
                  </div>
                : <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        className="mb-2 block text-xs uppercase tracking-widest"
                        style={{ color: "var(--bat-fg-dim)" }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                        className="w-full rounded-sm px-4 py-3 text-sm"
                        style={{
                          background: "var(--bat-surface)",
                          border: "1px solid var(--bat-border)",
                          color: "var(--bat-fg)",
                          fontFamily: "var(--bat-sans)",
                        }}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-xs uppercase tracking-widest"
                        style={{ color: "var(--bat-fg-dim)" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                        className="w-full rounded-sm px-4 py-3 text-sm"
                        style={{
                          background: "var(--bat-surface)",
                          border: "1px solid var(--bat-border)",
                          color: "var(--bat-fg)",
                          fontFamily: "var(--bat-sans)",
                        }}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        className="mb-2 block text-xs uppercase tracking-widest"
                        style={{ color: "var(--bat-fg-dim)" }}
                      >
                        Message
                      </label>
                      <textarea
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        rows={5}
                        className="w-full resize-none rounded-sm px-4 py-3 text-sm"
                        style={{
                          background: "var(--bat-surface)",
                          border: "1px solid var(--bat-border)",
                          color: "var(--bat-fg)",
                          fontFamily: "var(--bat-sans)",
                        }}
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-sm px-6 py-3 text-sm font-medium uppercase tracking-widest transition-all"
                      style={{
                        background: "var(--bat-accent)",
                        color: "var(--bat-fg)",
                        border: "1px solid var(--bat-border)",
                        fontFamily: "var(--bat-sans)",
                        cursor: isSubmitting ? "wait" : "pointer",
                      }}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>}
            </motion.div>

            {/* Right: Social Links */}
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-between"
            >
              <div>
                <p
                  className="mb-2 text-xs uppercase tracking-widest"
                  style={{ color: "var(--bat-fg-dim)" }}
                >
                  Email
                </p>
                <Link
                  href="mailto:aryanvijaywargia@gmail.com"
                  className="text-lg"
                  style={{
                    color: "var(--bat-fg-muted)",
                    fontFamily: "var(--bat-sans)",
                    textDecoration: "none",
                  }}
                >
                  aryanvijaywargia@gmail.com
                </Link>

                <div className="bat-rule my-8" />

                <p
                  className="mb-6 text-xs uppercase tracking-widest"
                  style={{ color: "var(--bat-fg-dim)" }}
                >
                  Connect
                </p>

                <div className="space-y-4">
                  {socialLinks.map(({ name, href }) => (
                    <div key={name}>
                      <Link
                        href={href}
                        target="_blank"
                        className="group inline-flex items-center gap-2 text-xl font-semibold transition-all"
                        style={{
                          fontFamily: "var(--bat-serif)",
                          color: "var(--bat-fg)",
                          textDecoration: "none",
                        }}
                      >
                        {name}
                        <span
                          className="inline-block text-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          style={{ color: "var(--bat-primary)" }}
                        >
                          &#8599;
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm" style={{ color: "var(--bat-fg-dim)" }}>
                  Currently based in <strong style={{ color: "var(--bat-fg-muted)" }}>India</strong>
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--bat-fg-dim)" }}>
                  Open to remote &amp; hybrid opportunities
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
