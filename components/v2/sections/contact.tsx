import clsx from "clsx";
import { FC, FormEvent, ReactNode, useState } from "react";
import { SOCIAL_ACCOUNTS } from "content/social-accounts";
import { V2_SECTION_HEADINGS } from "content/v2";
import { contactSchema, ContactStatus } from "lib/contact-schema";
import { V2Heading, V2Section, V2SectionHeader } from "components/v2/primitives";
import { V2ContactComposer } from "components/v2/sections/contact.composer";

/** Editor-chrome text. Looks like a source comment; it is copy. */
const IDLE_COMMENT = "// Waiting for connection...";
const FORM_COMMENT = "// Run this script to send a message";

/* ---------- shared window chrome ---------- */

const TrafficLights: FC = () => (
  <span className="flex gap-1.5">
    <span className="h-[9px] w-[9px] rounded-full bg-[rgb(var(--v2-fg-4))] opacity-60" />
    <span className="h-[9px] w-[9px] rounded-full bg-[rgb(var(--v2-fg-4))] opacity-60" />
    <span className="h-[9px] w-[9px] rounded-full bg-[rgb(var(--v2-accent))]" />
  </span>
);

const CodeWindow: FC<{ children: ReactNode; chrome: ReactNode }> = ({ children, chrome }) => (
  <div className="flex flex-col overflow-hidden rounded-[var(--v2-radius-md)] border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface))]">
    <div className="flex h-11 items-center gap-5 border-b border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-surface-2))] px-3.5">
      {chrome}
    </div>
    <div className="flex flex-1 flex-col p-4 font-[family-name:var(--v2-font-mono)] text-[12.5px]">
      {children}
    </div>
  </div>
);

/* ---------- contact_info.json ---------- */

const Line: FC<{ n: number; indent?: number; children?: ReactNode }> = ({
  n,
  indent = 0,
  children,
}) => (
  <div className="flex min-h-[1.5rem] items-start leading-6">
    <span className="mr-4 inline-block w-[22px] select-none border-r border-[rgb(var(--v2-line))] pr-2.5 text-right text-xs text-[rgb(var(--v2-fg-4))]">
      {n}
    </span>
    <span style={{ marginLeft: indent }}>{children}</span>
  </div>
);

const Key: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="text-[rgb(var(--v2-accent))]">&quot;{children}&quot;</span>
);
const Punct: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="text-[rgb(var(--v2-fg-3))]">{children}</span>
);
const Value: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="text-[rgb(var(--v2-fg))]">&quot;{children}&quot;</span>
);
const ValueLink: FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-[rgb(var(--v2-fg))] underline underline-offset-[3px]"
  >
    &quot;{children}&quot;
  </a>
);

const ContactInfo: FC = () => (
  <CodeWindow
    chrome={
      <>
        <TrafficLights />
        <span className="ml-auto font-[family-name:var(--v2-font-mono)] text-[11px] font-semibold tracking-[0.06em] text-[rgb(var(--v2-fg-3))]">
          contact_info.json
        </span>
      </>
    }
  >
    <Line n={1}>
      <Punct>{"{"}</Punct>
    </Line>
    <Line n={2} indent={14}>
      <Key>status</Key>
      <Punct>: </Punct>
      <Value>open_to_work</Value>
      <Punct>,</Punct>
    </Line>
    <Line n={3} indent={14}>
      <Key>email</Key>
      <Punct>: </Punct>
      <ValueLink href={SOCIAL_ACCOUNTS.email.href}>aryanvijaywargia@gmail.com</ValueLink>
      <Punct>,</Punct>
    </Line>
    <Line n={4} indent={14}>
      <Key>socials</Key>
      <Punct>: {"{"}</Punct>
    </Line>
    <Line n={5} indent={28}>
      <Key>github</Key>
      <Punct>: </Punct>
      <ValueLink href={SOCIAL_ACCOUNTS.github.href}>@aryanVijaywargia</ValueLink>
      <Punct>,</Punct>
    </Line>
    <Line n={6} indent={28}>
      <Key>linkedin</Key>
      <Punct>: </Punct>
      <ValueLink href={SOCIAL_ACCOUNTS.linkedin.href}>@aryan-vijaywargia</ValueLink>
    </Line>
    <Line n={7} indent={14}>
      <Punct>{"},"}</Punct>
    </Line>
    <Line n={8} indent={14}>
      <Key>location</Key>
      <Punct>: </Punct>
      <Value>India</Value>
    </Line>
    <Line n={9}>
      <Punct>{"}"}</Punct>
    </Line>
    <Line n={10}>&nbsp;</Line>
    <Line n={11}>
      <span className="italic text-[rgb(var(--v2-fg-4))]">{IDLE_COMMENT}</span>
    </Line>
    <div className="ml-[2.4rem] mt-1.5">
      <span className="v2-animate-blink inline-block h-0.5 w-2.5 bg-[rgb(var(--v2-fg-2))]" />
    </div>
  </CodeWindow>
);

/* ---------- sendMessage.ts ---------- */

const CODE_INPUT_CLASS =
  "min-w-0 flex-1 border-0 border-b border-[rgb(var(--v2-line-2))] bg-transparent px-0 pb-0.5 font-[family-name:var(--v2-font-mono)] text-[12.5px] text-[rgb(var(--v2-fg))] outline-none focus:border-[rgb(var(--v2-accent))]";

const ContactForm: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setStatusMessage("");

    const parsed = contactSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      setStatus("error");
      setStatusMessage(parsed.error.issues[0]?.message ?? "Check the fields above");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Failed to send message");
      }

      setStatus("success");
      setStatusMessage("Message sent — I'll get back to you.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <CodeWindow
      chrome={
        <>
          <TrafficLights />
          <span className="inline-flex items-center gap-2 border-t-2 border-[rgb(var(--v2-accent))] bg-[rgb(var(--v2-surface))] px-3.5 py-3 font-[family-name:var(--v2-font-mono)] text-[11px] font-semibold text-[rgb(var(--v2-fg-3))]">
            sendMessage.ts<span className="text-[rgb(var(--v2-fg-4))]">×</span>
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col leading-[1.6]">
        <div className="flex-1">
          <div className="mb-2 italic text-[rgb(var(--v2-fg-4))]">{FORM_COMMENT}</div>
          <div className="mb-3">
            <span className="text-[rgb(var(--v2-accent))]">const</span>
            <span className="text-[rgb(var(--v2-fg))]"> send</span>
            <Punct> = </Punct>
            <span className="text-[rgb(var(--v2-accent))]">async</span>
            <Punct> () ⇒ {"{"}</Punct>
          </div>

          <div className="mb-2.5 ml-3.5 flex items-end gap-0.5">
            <span className="shrink-0 whitespace-nowrap">
              <span className="text-[rgb(var(--v2-accent))]">const</span>
              <span className="text-[rgb(var(--v2-fg))]"> name</span>
              <Punct> = &quot;</Punct>
            </span>
            <input
              type="text"
              aria-label="Your name"
              spellCheck={false}
              placeholder="Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={CODE_INPUT_CLASS}
            />
            <Punct>&quot;;</Punct>
          </div>

          <div className="mb-3 ml-3.5 flex items-end gap-0.5">
            <span className="shrink-0 whitespace-nowrap">
              <span className="text-[rgb(var(--v2-accent))]">const</span>
              <span className="text-[rgb(var(--v2-fg))]"> email</span>
              <Punct> = &quot;</Punct>
            </span>
            <input
              type="email"
              aria-label="Your email"
              spellCheck={false}
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={CODE_INPUT_CLASS}
            />
            <Punct>&quot;;</Punct>
          </div>

          <div className="ml-3.5">
            <span className="text-[rgb(var(--v2-accent))]">await</span>
            <span className="text-[rgb(var(--v2-fg))]"> api</span>
            <Punct>.</Punct>
            <span className="text-[rgb(var(--v2-fg-2))]">submit</span>
            <Punct>({"{"}</Punct>
          </div>
          <div className="ml-7">
            <span className="text-[rgb(var(--v2-fg))]">name</span>
            <Punct>, </Punct>
            <span className="text-[rgb(var(--v2-fg))]">email</span>
            <Punct>,</Punct>
          </div>
          <div className="ml-7">
            <span className="text-[rgb(var(--v2-fg))]">message</span>
            <Punct> : `</Punct>
          </div>
          <div className="my-1 ml-12 mr-1 border-l border-[rgb(var(--v2-line-2))] pl-2.5">
            <textarea
              rows={3}
              aria-label="Your message"
              placeholder="Type your message here..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="h-[62px] w-full resize-none border-0 bg-transparent p-0 font-[family-name:var(--v2-font-mono)] text-[12.5px] leading-[1.6] text-[rgb(var(--v2-fg))] outline-none"
            />
          </div>
          <div className="ml-3.5">
            <Punct>`{"});"}</Punct>
          </div>
          <div>
            <Punct>{"}"}</Punct>
          </div>

          {status === "success" || status === "error"
            ? <div
                role="status"
                className={clsx(
                  "mt-2.5 font-[family-name:var(--v2-font-mono)] text-xs",
                  status === "error" ? "text-[#e0685f]" : "text-[rgb(var(--v2-accent))]"
                )}
              >
                {">"} {statusMessage}
              </div>
            : null}
        </div>

        <div className="mt-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-accent))] bg-[rgb(var(--v2-accent))] px-6 py-[11px] font-[family-name:var(--v2-font-mono)] text-[11.5px] font-bold uppercase tracking-[0.12em] text-[rgb(var(--v2-btn-fg))] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            {status === "sending" ? "sending..." : "run script"}
          </button>
        </div>
      </form>
    </CodeWindow>
  );
};

export const V2Contact: FC = () => (
  <V2Section id="contact" label="Contact">
    <V2SectionHeader section="contact" />
    <V2Heading className="mb-7">{V2_SECTION_HEADINGS.contact}</V2Heading>

    {/* Below v2sm the two windows stack into a tall column of nested chrome
        — title bars, line numbers and a form, all inside boxes, at 375px wide.
        The phone gets the composer instead; the windows return with the room
        to hold them. */}
    <V2ContactComposer className="v2sm:hidden" />

    <div className="hidden grid-cols-1 items-stretch gap-6 v2sm:grid v2md:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)]">
      <ContactInfo />
      <ContactForm />
    </div>
  </V2Section>
);
