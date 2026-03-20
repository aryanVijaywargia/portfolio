import { CONTACT } from "content/contact";
import { motion } from "framer-motion";
import { FC, FormEvent, ReactNode, useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type FormStatus = "idle" | "sending" | "success" | "error";

/* ─── Shared sub-components ─── */

const WindowDots: FC = () => (
  <div className="flex gap-1.5">
    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
  </div>
);

const JsonLine: FC<{ num: number; children: ReactNode }> = ({ num, children }) => (
  <div className="flex min-h-[1.5rem] items-start leading-[1.5rem]">
    <span className="mr-4 inline-block w-6 select-none border-r border-gray-200/50 pr-3 text-right text-[0.9rem] text-gray-400/90 d:border-slate-700/50 d:text-slate-500/90">
      {num}
    </span>
    <span>{children}</span>
  </div>
);

const JsonKey: FC<{ children: string }> = ({ children }) => (
  <span className="text-primary-400">&quot;{children}&quot;</span>
);

const JsonString: FC<{ children: string; href?: string }> = ({ children, href }) => {
  const content = <span className="text-emerald-400">&quot;{children}&quot;</span>;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hfa:opacity-80"
      >
        {content}
      </a>
    );
  }
  return content;
};

const CodeKeyword: FC<{ children: string }> = ({ children }) => (
  <span className="text-purple-400">{children}</span>
);

const CodeComment: FC<{ children: string }> = ({ children }) => (
  <span className="italic text-gray-400/90 d:text-slate-500/90">{children}</span>
);

/* ─── Animation variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ─── Left Panel ─── */

const ContactInfoPanel: FC = () => {
  const { contactInfo, socialLinks } = CONTACT;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-gray-200/80 bg-gray-50/95 shadow-[0_18px_52px_-34px_rgba(15,23,42,0.42)] d:border-[#243146] d:bg-[#101824] d:shadow-[0_18px_52px_-34px_rgba(2,8,23,0.84)]">
      <div className="flex h-[3rem] items-center justify-between border-b border-gray-200/80 bg-gray-100/90 px-4 d:border-[#243146] d:bg-[#171f2b]">
        <WindowDots />
        <div className="flex items-center gap-2 font-mono text-[0.82rem] text-gray-500 d:text-slate-400">
          <span className="text-yellow-500 d:text-yellow-400">{`</>`}</span>
          <span>contact_info.json</span>
        </div>
      </div>

      <div className="flex-1 px-4 pb-3 pt-4 font-mono text-[0.84rem] md:px-5 lg:px-5">
        <JsonLine num={1}>
          <span className="text-gray-700 d:text-slate-300">{"{"}</span>
        </JsonLine>

        <JsonLine num={2}>
          <span className="ml-4">
            <JsonKey>status</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString>open_to_work</JsonString>
            <span className="text-gray-700 d:text-slate-300">,</span>
          </span>
        </JsonLine>

        <JsonLine num={3}>
          <span className="ml-4">
            <JsonKey>email</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString href={`mailto:${contactInfo.email}`}>{contactInfo.email}</JsonString>
            <span className="text-gray-700 d:text-slate-300">,</span>
          </span>
        </JsonLine>

        <JsonLine num={4}>
          <span className="ml-4">
            <JsonKey>socials</JsonKey>
            <span className="text-gray-700 d:text-slate-300">{": {"}</span>
          </span>
        </JsonLine>

        <JsonLine num={5}>
          <span className="ml-8">
            <JsonKey>github</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString href={socialLinks.github}>{contactInfo.socials.github}</JsonString>
            <span className="text-gray-700 d:text-slate-300">,</span>
          </span>
        </JsonLine>

        <JsonLine num={6}>
          <span className="ml-8">
            <JsonKey>linkedin</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString href={socialLinks.linkedin}>{contactInfo.socials.linkedin}</JsonString>
            <span className="text-gray-700 d:text-slate-300">,</span>
          </span>
        </JsonLine>

        <JsonLine num={7}>
          <span className="ml-8">
            <JsonKey>twitter</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString href={socialLinks.twitter}>{contactInfo.socials.twitter}</JsonString>
          </span>
        </JsonLine>

        <JsonLine num={8}>
          <span className="ml-4">
            <span className="text-gray-700 d:text-slate-300">{"},"}</span>
          </span>
        </JsonLine>

        <JsonLine num={9}>
          <span className="ml-4">
            <JsonKey>location</JsonKey>
            <span className="text-gray-700 d:text-slate-300">: </span>
            <JsonString>{contactInfo.location}</JsonString>
          </span>
        </JsonLine>

        <JsonLine num={10}>
          <span className="text-gray-700 d:text-slate-300">{"}"}</span>
        </JsonLine>

        <JsonLine num={11}>
          <span>&nbsp;</span>
        </JsonLine>

        <JsonLine num={12}>
          <CodeComment>{"// " + "Waiting for connection..."}</CodeComment>
        </JsonLine>

        <div className="ml-[2.45rem] mt-1.5">
          <span className="inline-block h-[2px] w-2.5 animate-blink bg-gray-800 d:bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

/* ─── Right Panel ─── */

const SendMessagePanel: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("idle");
    setStatusMessage("");

    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send email");
      }

      setStatus("success");
      setStatusMessage("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to send message.");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-gray-200/80 bg-gray-50/95 shadow-[0_18px_52px_-34px_rgba(15,23,42,0.42)] d:border-[#243146] d:bg-[#101824] d:shadow-[0_18px_52px_-34px_rgba(2,8,23,0.84)]">
      <div className="relative flex h-[3rem] items-center border-b border-gray-200/80 bg-gray-100/90 px-4 d:border-[#243146] d:bg-[#171f2b]">
        <WindowDots />
        <div className="absolute bottom-[-1px] left-[4.5rem] flex h-[3rem] items-center gap-2.5 border-x border-t border-gray-200/80 bg-white/80 px-3.5 font-mono text-[0.82rem] text-gray-500 d:border-[#243146] d:bg-[#101824] d:text-slate-400">
          <span className="absolute inset-x-0 top-0 h-[2px] bg-primary-400" />
          <span className="text-[0.82rem] font-bold text-blue-500 d:text-blue-400">TS</span>
          <span>sendMessage.ts</span>
          <span className="ml-1 text-gray-400 d:text-slate-600">&times;</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3 pt-3 font-mono text-[0.84rem] leading-[1.5rem] md:px-5 lg:px-5">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex-1">
            <div className="mb-2 text-[0.9rem]">
              <CodeComment>{"// " + "Run this script to send a message"}</CodeComment>
            </div>

            <div className="mb-3 text-[0.9rem]">
              <CodeKeyword>const</CodeKeyword>
              <span className="text-primary-300"> send</span>
              <span className="text-gray-700 d:text-slate-300"> = </span>
              <CodeKeyword>async</CodeKeyword>
              <span className="text-gray-700 d:text-slate-300"> () </span>
              <span className="text-primary-400">{"\u21D2"}</span>
              <span className="text-gray-700 d:text-slate-300"> {"{"}</span>
            </div>

            <div className="mb-2.5 ml-4">
              <div className="flex items-end">
                <span className="shrink-0 whitespace-nowrap">
                  <CodeKeyword>const</CodeKeyword>
                  <span className="text-primary-300"> name</span>
                  <span className="text-gray-700 d:text-slate-300"> = </span>
                  <span className="text-emerald-400">&quot;</span>
                </span>
                <input
                  type="text"
                  aria-label="Your name"
                  spellCheck={false}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Your Name"
                  className={`placeholder-gray-400/45 min-w-0 flex-1 border-0 border-b bg-transparent px-0 pb-0.5 pt-0 font-mono text-[0.9rem] text-emerald-400 caret-emerald-400 outline-none focus:ring-0 d:placeholder-slate-600/70 ${
                    errors.name
                      ? "border-red-400"
                      : "border-gray-300/70 focus:border-primary-400 d:border-[#31425c]"
                  }`}
                />
                <span className="shrink-0 whitespace-nowrap">
                  <span className="text-emerald-400">&quot;</span>
                  <span className="text-gray-700 d:text-slate-300">;</span>
                </span>
              </div>
              {errors.name && (
                <div className="mt-0.5 text-xs text-red-400">
                  <CodeComment>{`// Error: ${errors.name}`}</CodeComment>
                </div>
              )}
            </div>

            <div className="mb-3 ml-4">
              <div className="flex items-end">
                <span className="shrink-0 whitespace-nowrap">
                  <CodeKeyword>const</CodeKeyword>
                  <span className="text-primary-300"> email</span>
                  <span className="text-gray-700 d:text-slate-300"> = </span>
                  <span className="text-emerald-400">&quot;</span>
                </span>
                <input
                  type="email"
                  aria-label="Your email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="your@email.com"
                  className={`placeholder-gray-400/45 min-w-0 flex-1 border-0 border-b bg-transparent px-0 pb-0.5 pt-0 font-mono text-[0.9rem] text-emerald-400 caret-emerald-400 outline-none focus:ring-0 d:placeholder-slate-600/70 ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-300/70 focus:border-primary-400 d:border-[#31425c]"
                  }`}
                />
                <span className="shrink-0 whitespace-nowrap">
                  <span className="text-emerald-400">&quot;</span>
                  <span className="text-gray-700 d:text-slate-300">;</span>
                </span>
              </div>
              {errors.email && (
                <div className="mt-0.5 text-xs text-red-400">
                  <CodeComment>{`// Error: ${errors.email}`}</CodeComment>
                </div>
              )}
            </div>

            <div className="mb-0.5 ml-4 text-[0.9rem]">
              <CodeKeyword>await</CodeKeyword>
              <span className="text-primary-300"> api</span>
              <span className="text-gray-700 d:text-slate-300">.</span>
              <span className="text-yellow-300">submit</span>
              <span className="text-gray-700 d:text-slate-300">({"{"}</span>
            </div>

            <div className="mb-0.5 ml-8 text-[0.9rem]">
              <span className="text-primary-300">name</span>
              <span className="text-gray-700 d:text-slate-300">, </span>
              <span className="text-primary-300">email</span>
              <span className="text-gray-700 d:text-slate-300">,</span>
            </div>

            <div className="mb-0.5 ml-8 text-[0.9rem]">
              <span className="text-primary-300">message</span>
              <span className="text-gray-700 d:text-slate-300"> : </span>
              <span className="text-emerald-400">`</span>
            </div>

            <div className="border-primary-400/35 mb-1.5 ml-[3.1rem] mr-1 border-l pl-2.5 d:border-primary-400/25">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                }}
                placeholder="Type your message here..."
                rows={3}
                aria-label="Your message"
                className="placeholder-gray-400/45 h-16 w-full resize-none border-0 bg-transparent p-0 font-mono text-[0.9rem] leading-[1.72rem] text-emerald-400 caret-emerald-400 outline-none focus:ring-0 d:placeholder-slate-600/70"
              />
              {errors.message && (
                <div className="mt-0.5 text-xs text-red-400">
                  <CodeComment>{`// Error: ${errors.message}`}</CodeComment>
                </div>
              )}
            </div>

            <div className="mb-0.5 ml-4 text-[0.9rem]">
              <span className="text-emerald-400">`</span>
              <span className="text-gray-700 d:text-slate-300">{"})"}</span>
              <span className="text-gray-700 d:text-slate-300">;</span>
            </div>

            <div className="text-[0.9rem]">
              <span className="text-gray-700 d:text-slate-300">{"}"}</span>
            </div>

            {/* Status messages */}
            {status === "success" && (
              <div className="mt-2 text-emerald-400">
                {">"} {statusMessage}
              </div>
            )}
            {status === "error" && (
              <div className="mt-2 text-red-400">
                {">"} Error: {statusMessage}
              </div>
            )}
          </div>

          <div className="mt-2">
            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-md bg-emerald-500 px-6 py-2.5 font-mono text-[0.84rem] font-bold uppercase tracking-[0.12em] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hfa:bg-emerald-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {status === "sending" ? "SENDING..." : "RUN SCRIPT"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Right-side vertical accent line with dots + mail icon ─── */

const RightSideAccent: FC = () => (
  <div className="pointer-events-none absolute right-4 top-[50%] hidden -translate-y-1/2 flex-col items-center gap-2.5 lg:flex xl:right-8">
    <div className="h-14 w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-gray-300 d:via-gray-700 d:to-gray-700" />
    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 d:bg-gray-600" />
    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 d:bg-gray-600" />
    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 d:bg-gray-600" />
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 d:border-gray-700 d:bg-[#111a27]">
      <svg
        className="h-3.5 w-3.5 text-primary-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    </div>
    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 d:bg-gray-600" />
    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 d:bg-gray-600" />
    <div className="h-14 w-[1px] bg-gradient-to-b from-gray-300 via-gray-300 to-transparent d:from-gray-700 d:via-gray-700" />
  </div>
);

/* ─── Bottom-right avatar with online indicator ─── */

const AvatarOnline: FC = () => (
  <div className="pointer-events-none absolute bottom-6 right-6 hidden lg:block xl:right-10">
    <div className="relative">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300/50 bg-gray-100 d:border-gray-600/50 d:bg-[#19222e]">
        {/* Initials as avatar placeholder */}
        <span className="font-mono text-xs font-bold text-primary-400">
          {CONTACT.footer.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>
      {/* Green online indicator */}
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 d:border-dark-bg" />
    </div>
  </div>
);

/* ─── Main Contact Section ─── */

export const Contact: FC = () => {
  return (
    <section id="contact" className="relative overflow-hidden py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-[74rem] px-4 md:px-8">
        {/* Section header */}
        <header className="mb-8">
          <div className="heading-pre">{CONTACT.pre}</div>
          <h1 className="heading-2xl -ml-1">{CONTACT.heading}</h1>
        </header>

        {/* Two-panel layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:gap-8"
        >
          <motion.div variants={leftPanelVariants} className="flex">
            <ContactInfoPanel />
          </motion.div>
          <motion.div variants={rightPanelVariants} className="flex">
            <SendMessagePanel />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
