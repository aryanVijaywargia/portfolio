import { BriefcaseIcon, CodeBracketIcon, DocumentTextIcon, EnvelopeIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { HERO } from "content/hero";
import type { V2Variant } from "components/v2/variant";

/**
 * Content that belongs to the v2 design specifically.
 *
 * Structured data — projects, timeline events, experience, about stats and
 * descriptions, social accounts — is NOT duplicated here. Those come from the
 * existing content/* modules so both designs stay in sync from one source.
 *
 * What lives here is copy the v2 design words differently, plus the section
 * eyebrows, which differ per variant.
 */

export type V2SectionId = "hero" | "about" | "experience" | "portfolio" | "contact" | "quiz";

type V2Eyebrow = {
  /** Running order, rendered by variants that number their eyebrows. */
  num: string;
  label: Record<V2Variant, string>;
};

/**
 * Note: "03" is intentionally absent. The design nests the timeline inside the
 * About section and gives it a rule instead of an eyebrow, so it consumes the
 * slot without rendering a label.
 */
export const V2_EYEBROWS: Record<V2SectionId, V2Eyebrow> = {
  hero: { num: "01", label: { signal: "intro", graphite: "welcome to my site" } },
  about: { num: "02", label: { signal: "about", graphite: "about" } },
  experience: { num: "04", label: { signal: "experience", graphite: "experience" } },
  portfolio: { num: "05", label: { signal: "work", graphite: "projects" } },
  contact: { num: "06", label: { signal: "contact", graphite: "contact" } },
  quiz: { num: "07", label: { signal: "bonus", graphite: "bonus" } },
};

/**
 * Fixed-header navigation. `id` doubles as the scroll-spy target.
 *
 * Each pill shows only its icon until it is active or hovered, matching the
 * behaviour of the v1 header. `alt` is the aside the small-screen sheet prints
 * opposite each row; the desktop pills ignore it.
 */
export const V2_NAV = [
  { id: "about", label: "about", alt: "More about me.", Icon: UserIcon },
  {
    id: "experience",
    label: "experience",
    alt: "My work experience.",
    Icon: BriefcaseIcon,
  },
  { id: "portfolio", label: "projects", alt: "Work I've done.", Icon: CodeBracketIcon },
  { id: "contact", label: "contact", alt: "Get in touch.", Icon: EnvelopeIcon },
] as const;

/** The row the small-screen sheet prints above the section links. */
export const V2_NAV_HOME = {
  id: "top",
  label: "home",
  alt: "Country roads..",
  Icon: HomeIcon,
} as const;

/** ...and the one it prints below them, which leaves the page. */
export const V2_NAV_RESUME = {
  label: "resume",
  alt: "Experience, in detail.",
  Icon: DocumentTextIcon,
} as const;

export const V2_HERO = {
  greeting: "I'm Aryan Vijaywargia,",
  /* The heading is locked to three lines, so the name's break is authored here
     rather than left to whatever the column width happens to produce — a longer
     role would otherwise push it to four. Joined for the accessible label. */
  greetingLines: ["I'm Aryan", "Vijaywargia,"] as const,
  /** Cycled by the role animation; the trailing "" produces a delete-to-empty beat. */
  roles: ["Backend", "Fullstack", "AI", ""] as const,
  roleSuffix: "Engineer",
  strapline: "Senior SWE · GEP Worldwide · India",
  /* The same four the v1 hero shows, with their marks — one list, one order,
     so the two designs cannot drift apart. */
  stack: HERO.tech,
  terminal: {
    path: "~/aryan",
    title: "aryan@macbook — zsh",
    status: "main   node 20.11",
    hint: "↵ try `help`",
  },
  cta: {
    primary: { label: "Resume", href: "/resume" },
    secondary: { label: "Contact me", href: "mailto:aryanvijaywargia@gmail.com" },
  },
};

/**
 * The phone contact composer.
 *
 * Two lists the reader taps through to build one sentence; the sentence
 * becomes the subject and body of a mail. `subject` rides on the intent
 * because that is the half that says what the mail is about, and `line` on the
 * action because that is the half that says what should happen next.
 */
export const V2_CONTACT_COMPOSER = {
  lead: "Aryan, I want to",
  joiner: "\u2014 so",
  hint: "tap the words to change them",
  sendEyebrow: "send as mail",
  sendLabel: "Open my mail app",
  socialsLabel: "or find me at",
  intents: [
    { label: "hire you", subject: "Hiring you \u2014 let's talk" },
    { label: "build something with you", subject: "Building something together" },
    { label: "pick your brain", subject: "One question for you" },
    { label: "waste your time politely", subject: "No agenda, just hi" },
  ],
  actions: [
    {
      label: "send me a calendar link",
      line: "Send me a calendar link and I'll take the worst slot on it.",
    },
    {
      label: "just reply to this",
      line: "A reply right here is plenty \u2014 no meeting required.",
    },
    {
      label: "point me at your r\u00e9sum\u00e9",
      line: "Point me at your r\u00e9sum\u00e9 and I'll do the reading.",
    },
    {
      label: "say hi back and we'll wing it",
      line: "Say hi back and we'll figure out the rest live.",
    },
  ],
} as const;

/** Identity chips on the "also:" rail beneath the terminal. */
export const V2_IDENTITY_CHIPS = [
  { label: "Traveler", hue: "brass" },
  { label: "Reader", hue: "sage" },
  { label: "Lifter", hue: "clay" },
  { label: "Swimmer", hue: "teal" },
  { label: "Coffee Snob", hue: "umber" },
] as const;

export type V2Hue = typeof V2_IDENTITY_CHIPS[number]["hue"];

export const V2_SECTION_HEADINGS = {
  about: "About Me",
  experience: "Where have I been all your life?",
  portfolio: "Things I've built",
  contact: "Contact me",
};

export const V2_ABOUT = {
  /**
   * Description length control. `short` is the small-screen form: the v1 site
   * collapses the three words to single letters there rather than spending a
   * full row on them.
   */
  sizes: [
    { key: "brief", label: "brief", short: "S" },
    { key: "standard", label: "standard", short: "M" },
    { key: "detailed", label: "detailed", short: "L" },
  ] as const,
};

export const V2_FOOTER = {
  note: "Human? Machine? Curious either way.",
  llmsHref: "/llms.txt",
};

/** Hue assigned to each project card, keyed by the project name in content/projects. */
export const V2_PROJECT_HUES: Record<string, V2Hue> = {
  Continua: "brass",
  "Earthquake Precursor Detection - ISRO-NESAC": "clay",
  "Forex Trading Recommendation System": "sage",
};

export const V2_PROJECT_FALLBACK_HUE: V2Hue = "teal";

/* -------------------------------------------------------------------------
   404
   ------------------------------------------------------------------------- */

/**
 * Copy for the not-found page.
 *
 * The terminal's command table lives with the component that runs it, since
 * each entry is behaviour as much as text. What sits here is the prose and the
 * route list, which are the parts worth editing without reading the logic.
 */
export const V2_NOT_FOUND = {
  eyebrow: "status 404",
  heading: "This route was never deployed.",
  body: "Either I moved it, you typed it, or a crawler invented it. Nothing here is on fire — the rest of the site is fine.",
  footerNote: "404 · nothing lost, nothing found",
  suggestionsLabel: "did you mean",
  suggestions: [
    { path: "/#portfolio", label: "/projects", note: "Continua, precursor detection, forex NLP" },
    { path: "/#experience", label: "/experience", note: "GEP, IHub-Data, Omdena, IMD" },
    { path: "/#contact", label: "/contact", note: "Mail, GitHub, LinkedIn" },
    {
      path: "/llms.txt",
      label: "/llms.txt",
      note: "For the machines reading this",
      external: true,
    },
  ],
  actions: {
    home: "Back to home",
    report: "Report a broken link",
  },
};
