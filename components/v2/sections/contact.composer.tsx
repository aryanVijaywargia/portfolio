import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { SOCIAL_ACCOUNTS } from "content/social-accounts";
import { V2_CONTACT_COMPOSER } from "content/v2";

/** The address behind the shared mail link, without its scheme. */
const EMAIL = SOCIAL_ACCOUNTS.email.href.replace(/^mailto:/, "");

/**
 * The socials the composer lists, in the design's order and wording — "x"
 * rather than "twitter". The hrefs stay in the shared account list.
 */
const SOCIALS = [
  { label: "github", href: SOCIAL_ACCOUNTS.github.href },
  { label: "linkedin", href: SOCIAL_ACCOUNTS.linkedin.href },
  { label: "x", href: SOCIAL_ACCOUNTS.twitter.href },
] as const;

const RULE_CLASS = "h-px flex-1 bg-[rgb(var(--v2-line))]";

const CAPTION_CLASS =
  "font-[family-name:var(--v2-font-mono)] text-[9.5px] uppercase tracking-[0.16em] text-[rgb(var(--v2-fg-4))]";

/**
 * A word in the sentence that cycles when tapped.
 *
 * `font-size: inherit` and `letter-spacing: inherit` rather than repeating the
 * sentence's type: the button sits mid-paragraph, and any drift shows up as a
 * word that sits off the line.
 */
const CYCLE_CLASS =
  "inline cursor-pointer border-0 border-b-2 border-dashed border-[rgb(var(--v2-line-2))] " +
  "bg-transparent p-0 text-left font-bold text-[rgb(var(--v2-accent))] " +
  "[font-size:inherit] [letter-spacing:inherit]";

const cycle = (length: number) => (current: number) => (current + 1) % length;

/**
 * The contact section as it reads on a phone.
 *
 * The desktop pair of code windows becomes a column of nested chrome at 375px
 * — line numbers, a title bar and a form inside a box inside a box — so the
 * small screen gets this instead: one sentence the reader assembles by tapping
 * two words, which is also the mail it sends.
 */
export const V2ContactComposer: FC<{ className?: string }> = ({ className }) => {
  const [intentIndex, setIntentIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);

  const { intents, actions } = V2_CONTACT_COMPOSER;
  const intent = intents[intentIndex];
  const action = actions[actionIndex];

  // The sentence is the mail: the intent names it, the action says what should
  // happen next, and both go over as written.
  const mailto = useMemo(() => {
    const body = `Hi Aryan,\n\nI want to ${intent.label}. ${action.line}\n\n`;
    const query = `subject=${encodeURIComponent(intent.subject)}&body=${encodeURIComponent(body)}`;
    return `mailto:${EMAIL}?${query}`;
  }, [action.line, intent.label, intent.subject]);

  return (
    <div className={clsx("flex flex-col", className)}>
      <p className="m-0 mb-[26px] text-[26px] font-medium leading-[1.45] tracking-[-0.025em] text-[rgb(var(--v2-fg-3))] [text-wrap:pretty]">
        {V2_CONTACT_COMPOSER.lead}{" "}
        <button
          type="button"
          onClick={() => setIntentIndex(cycle(intents.length))}
          aria-label={`Change what you want — currently "${intent.label}"`}
          className={CYCLE_CLASS}
        >
          {intent.label}
        </button>{" "}
        {V2_CONTACT_COMPOSER.joiner}{" "}
        <button
          type="button"
          onClick={() => setActionIndex(cycle(actions.length))}
          aria-label={`Change what happens next — currently "${action.label}"`}
          className={CYCLE_CLASS}
        >
          {action.label}
        </button>
        .
      </p>

      <div className="mb-3 flex items-center gap-[9px]">
        <span className={CAPTION_CLASS}>{V2_CONTACT_COMPOSER.hint}</span>
        <span aria-hidden="true" className={RULE_CLASS} />
      </div>

      <a
        href={mailto}
        className="mb-3 flex min-h-[60px] items-center justify-between gap-3 rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-accent))] px-[18px] text-[rgb(var(--v2-btn-fg))]"
      >
        <span className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--v2-font-mono)] text-[9.5px] uppercase tracking-[0.16em] opacity-70">
            {V2_CONTACT_COMPOSER.sendEyebrow}
          </span>
          <span className="text-[15px] font-bold tracking-[-0.015em]">
            {V2_CONTACT_COMPOSER.sendLabel}
          </span>
        </span>
        <span aria-hidden="true" className="font-[family-name:var(--v2-font-mono)] text-[17px]">
          →
        </span>
      </a>

      {/* What the mail app will be handed, so tapping the button is not a
          jump into the dark. */}
      <div className="mb-[26px] border-l-2 border-[rgb(var(--v2-line-2))] py-0.5 pl-3">
        <span className="block font-[family-name:var(--v2-font-mono)] text-[10.5px] leading-[1.65] text-[rgb(var(--v2-fg-4))]">
          subject: {intent.subject}
        </span>
        <span className="block font-[family-name:var(--v2-font-mono)] text-[10.5px] leading-[1.65] text-[rgb(var(--v2-fg-4))]">
          to: {EMAIL}
        </span>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className={CAPTION_CLASS}>{V2_CONTACT_COMPOSER.socialsLabel}</span>
        <span aria-hidden="true" className={RULE_CLASS} />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {SOCIALS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 font-[family-name:var(--v2-font-mono)] text-[12.5px] text-[rgb(var(--v2-fg-2))]"
          >
            {label}
            <span aria-hidden="true" className="text-[rgb(var(--v2-fg-4))]">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
