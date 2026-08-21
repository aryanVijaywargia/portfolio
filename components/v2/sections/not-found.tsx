import Link from "next/link";
import { FC } from "react";
import { SOCIAL_ACCOUNTS } from "content/social-accounts";
import { V2_NOT_FOUND } from "content/v2";
import { V2NotFoundWire } from "components/v2/sections/not-found.wire";

/* The headline is three stacked copies of "404": one legible glyph and two
   coloured ghosts that jump for a frame or two. They share a class so the
   sizing stays in one place — mismatched tracking is instantly visible.

   The ghosts carry `opacity-0` as their resting state, not just as a keyframe:
   prefers-reduced-motion cuts the animation to one 0.01ms pass, after which an
   element falls back to its un-animated style. Without it, both ghosts would
   settle fully opaque behind the headline. */
const GLYPH_CLASS =
  "font-[family-name:var(--v2-font-display)] text-[clamp(96px,20vw,188px)] " +
  "font-bold leading-[0.82] tracking-[-0.06em]";

const BUTTON_BASE =
  "inline-flex min-h-[46px] items-center gap-2.5 rounded-[var(--v2-radius-sm)] " +
  "px-5 text-[13.5px] transition-colors focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-[rgb(var(--v2-accent))]";

/* The flat accent fill is what signal and graphite want; `base` paints its
   gradient over the top through --v2-btn-image, which is `none` elsewhere. */
const BUTTON_PRIMARY =
  `${BUTTON_BASE} border border-[rgb(var(--v2-btn-bg))] bg-[rgb(var(--v2-btn-bg))] ` +
  "[background-image:var(--v2-btn-image)] font-[number:var(--v2-btn-weight,700)] " +
  "text-[rgb(var(--v2-btn-fg))]";

const BUTTON_SECONDARY =
  `${BUTTON_BASE} border border-[rgb(var(--v2-line-2))] font-semibold ` +
  "text-[rgb(var(--v2-fg))] hover:border-[rgb(var(--v2-accent))] " +
  "hover:text-[rgb(var(--v2-accent))]";

export const V2NotFound: FC = () => (
  <main className="mx-auto grid w-full max-w-[var(--v2-max-w)] flex-1 grid-cols-1 items-start gap-[30px] px-[var(--v2-gutter)] pb-12 pt-[30px] v2sm:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] v2sm:gap-11 v2sm:pb-16 v2sm:pt-11">
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="font-[family-name:var(--v2-font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[rgb(var(--v2-accent))]">
          {V2_NOT_FOUND.eyebrow}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[rgb(var(--v2-line))]" />
      </div>

      <div className="relative mb-1.5">
        <h1 className={`relative z-[2] ${GLYPH_CLASS} text-[rgb(var(--v2-fg))]`}>404</h1>
        <span
          aria-hidden="true"
          className={`v2-animate-glitch-a absolute inset-0 z-[1] opacity-0 ${GLYPH_CLASS} text-[rgb(var(--v2-accent))]`}
        >
          404
        </span>
        <span
          aria-hidden="true"
          className={`v2-animate-glitch-b absolute inset-0 z-[1] opacity-0 ${GLYPH_CLASS} text-[rgb(var(--v2-glitch-2))]`}
        >
          404
        </span>
      </div>

      <h2 className="mb-3 font-[family-name:var(--v2-font-display)] text-[28px] font-bold tracking-[-0.03em] text-[rgb(var(--v2-fg))]">
        {V2_NOT_FOUND.heading}
      </h2>
      <p className="mb-6 max-w-[46ch] text-[15px] leading-[1.65] text-[rgb(var(--v2-fg-3))] [text-wrap:pretty]">
        {V2_NOT_FOUND.body}
      </p>

      <div className="mb-8 flex flex-wrap gap-2.5">
        <Link href="/">
          <a className={BUTTON_PRIMARY}>
            {V2_NOT_FOUND.actions.home} <span aria-hidden="true">→</span>
          </a>
        </Link>
        <a href={SOCIAL_ACCOUNTS.email.href} className={BUTTON_SECONDARY}>
          {V2_NOT_FOUND.actions.report}
        </a>
      </div>

      <div>
        <span className="mb-3 block font-[family-name:var(--v2-font-mono)] text-[10px] uppercase tracking-[0.18em] text-[rgb(var(--v2-fg-4))]">
          {V2_NOT_FOUND.suggestionsLabel}
        </span>
        <div className="flex flex-col border-t border-[rgb(var(--v2-line))]">
          {V2_NOT_FOUND.suggestions.map(({ path, label, note, external }) => {
            const body = (
              <>
                <span className="w-[104px] shrink-0 font-[family-name:var(--v2-font-mono)] text-xs text-[rgb(var(--v2-accent))]">
                  {label}
                </span>
                <span className="flex-1 text-[13.5px] text-[rgb(var(--v2-fg-3))]">{note}</span>
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--v2-font-mono)] text-[rgb(var(--v2-fg-4))]"
                >
                  ↗
                </span>
              </>
            );
            const rowClass =
              "group flex min-h-[52px] items-center gap-3 border-b border-[rgb(var(--v2-line))] px-0.5";

            return external
              ? <a key={label} href={path} className={rowClass}>
                  {body}
                </a>
              : <Link key={label} href={path}>
                  <a className={rowClass}>{body}</a>
                </Link>;
          })}
        </div>
      </div>
    </section>

    <V2NotFoundWire />
  </main>
);
