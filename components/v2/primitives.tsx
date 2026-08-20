import clsx from "clsx";
import { FC, PropsWithChildren, ReactNode } from "react";
import { V2_EYEBROWS, V2SectionId, V2Hue } from "content/v2";
import { useV2Variant, useV2VariantTraits } from "components/v2/variant";

/* -------------------------------------------------------------------------
   Shared building blocks for the v2 sections.

   Colour, radius, type scale and eyebrow treatment all read from CSS custom
   properties, so these render identically for both variants and change
   appearance purely through the token layer.
   ------------------------------------------------------------------------- */

/** Horizontal frame every section shares: centred, max-width, gutter. */
/**
 * The header and hero share one row of controls — Byte, theme, GitHub. The v1
 * site draws these as bare icons rather than ringed buttons, which keeps them
 * quiet next to the section content.
 */
export const V2_CONTROL_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-[var(--v2-radius-sm)] p-2 " +
  "text-[rgb(var(--v2-fg-3))] transition-colors hover:text-[rgb(var(--v2-accent))] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--v2-accent))]";

export const V2Container: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <div className={clsx("mx-auto w-full max-w-[var(--v2-max-w)] px-[var(--v2-gutter)]", className)}>
    {children}
  </div>
);

/**
 * A top-level page section.
 *
 * `defer` opts the section into content-visibility on small screens, which is
 * what keeps long-page scrolling cheap on mobile.
 */
export const V2Section: FC<
  PropsWithChildren<{ id: string; label: string; className?: string; defer?: boolean }>
> = ({ id, label, className, defer = true, children }) => (
  <section
    id={id}
    data-screen-label={label}
    data-v2-defer={defer ? "" : undefined}
    className={clsx(
      // A section fills the viewport and centres its content, so scrolling
      // lands on one section at a time rather than showing two at once.
      // scroll-mt clears the 80px pinned header on anchor jumps.
      "flex min-h-[100svh] scroll-mt-20 flex-col justify-center",
      "pb-[var(--v2-section-gap)] pt-[var(--v2-section-pt)]",
      className
    )}
  >
    <V2Container>{children}</V2Container>
  </section>
);

/** The mono label that opens each section. Numbering is a variant trait. */
export const V2Eyebrow: FC<{ section: V2SectionId; className?: string }> = ({
  section,
  className,
}) => {
  const variant = useV2Variant();
  const { numberedEyebrows } = useV2VariantTraits();
  const eyebrow = V2_EYEBROWS[section];
  const label = eyebrow.label[variant];

  return (
    <span
      className={clsx(
        "font-[family-name:var(--v2-font-mono)] uppercase tracking-[0.2em]",
        "bg-[var(--v2-eyebrow-bg)] text-[color:var(--v2-eyebrow-fg)]",
        "p-[var(--v2-eyebrow-pad)] text-[length:var(--v2-eyebrow-size)]",
        "font-[number:var(--v2-eyebrow-weight)]",
        className
      )}
    >
      {numberedEyebrows ? `${eyebrow.num} / ${label}` : label}
    </span>
  );
};

/** Eyebrow plus the hairline rule that runs to the edge of the container. */
export const V2SectionHeader: FC<{ section: V2SectionId; children?: ReactNode }> = ({
  section,
  children,
}) => (
  <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 v2md:mb-[30px] v2md:flex-nowrap">
    <V2Eyebrow section={section} />
    <span className="h-px flex-1 bg-[rgb(var(--v2-line))]" />
    {/* Trailing controls drop to their own full-width row on narrow screens
        rather than competing with the eyebrow for space. */}
    {children ? <div className="w-full v2md:w-auto">{children}</div> : null}
  </div>
);

/** Display heading used by Experience, Projects and Contact. */
export const V2Heading: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <h2
    className={clsx(
      "text-[length:var(--v2-h2-size)] font-bold leading-[1.05]",
      "tracking-[var(--v2-h2-tracking)] text-[rgb(var(--v2-fg))]",
      className
    )}
  >
    {children}
  </h2>
);

/* ---------- hue system ---------- */

/**
 * Identity chips and project cards are tinted from a fixed palette shared by
 * both variants. Each hue resolves to an RGB triplet token plus a text colour
 * that is swapped for light mode in the token layer.
 */
export const hueVars = (hue: V2Hue) =>
  ({
    "--hue": `var(--v2-hue-${hue})`,
    "--hue-text": `var(--v2-hue-${hue}-text)`,
  } as React.CSSProperties);
