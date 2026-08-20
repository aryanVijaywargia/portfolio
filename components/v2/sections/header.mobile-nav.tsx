import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";
import { V2_HERO, V2_NAV, V2_NAV_HOME, V2_NAV_RESUME } from "content/v2";

type V2MobileNavPanelProps = {
  open: boolean;
  setOpen: (value: boolean | ((current: boolean) => boolean)) => void;
  activeId: string;
  resumeHref: string;
  scrollToSection: (id: string) => void;
};

/**
 * The blinds behind the sheet: 18 columns that drop in one after another, so
 * the background arrives as a wipe rather than a fade. The two edge columns
 * are 1rem wide and carry the dashed rules; the 16 between them share what is
 * left. Copied from the v1 header so both designs open the same way.
 */
const BLIND_COUNT = 18;
const EDGE_RULE =
  "before:absolute b:top-0 b:h-full b:w-px b:opacity-70 d:b:opacity-30 " +
  "b:bg-[linear-gradient(180deg,var(--v2-nav-line),var(--v2-nav-line)_50%,transparent_0,transparent)] " +
  "b:bg-[length:1px_8px]";

/** Section rows, plus home above them. Resume is drawn separately: it leaves the page. */
const SECTION_ROWS = [V2_NAV_HOME, ...V2_NAV];

/**
 * Row labels are set in the page's own display face, sentence case, the way
 * the v1 sheet sets them — not the mono caps the rest of the v2 chrome uses.
 * Each row reads as a destination rather than a control label, and the wide
 * tracking of the mono form made the column hard to scan.
 */
const ROW_LABEL_CLASS =
  "flex -translate-x-[200%] items-center gap-3 [.v2-nav-active_&]:translate-x-0 " +
  "font-[family-name:var(--v2-font-display)] text-[17px] font-medium capitalize tracking-[-0.01em]";

const ROW_CLASS =
  "group flex items-baseline justify-between py-2 opacity-0 transition-opacity delay-200 " +
  "[.v2-nav-active_&]:opacity-100";

const ROW_RULE_CLASS =
  "mx-3 h-px flex-1 bg-[length:8px_1px] opacity-0 transition-opacity " +
  "bg-[linear-gradient(90deg,var(--v2-nav-line),var(--v2-nav-line)_50%,transparent_0,transparent)] " +
  "[.v2-nav-active_&]:opacity-70 [.v2-nav-active_&]:delay-500";

const ROW_ALT_CLASS =
  "translate-x-[200%] text-[rgb(var(--v2-fg-4))] [.v2-nav-active_&]:translate-x-0";

/**
 * The trigger, which stays in the header bar while the panel is open — the bar
 * keeps its brand and its icon row visible over the sheet, the way v1 does.
 */
export const V2MobileNavButton: FC<{
  open: boolean;
  setOpen: (value: boolean | ((current: boolean) => boolean)) => void;
}> = ({ open, setOpen }) => (
  <button
    type="button"
    onClick={() => setOpen((current) => !current)}
    aria-expanded={open}
    aria-label={open ? "Close menu" : "Open menu"}
    className="relative p-1 text-[rgb(var(--v2-fg-2))] v2md:hidden"
    style={{ "--nav-icon-size": "24px", "--nav-icon-border": "2px" } as never}
  >
    <span className="sr-only">Mobile Navigation</span>
    <i className={clsx("burger-menu", open && "active")}>
      <div />
    </i>
  </button>
);

export const V2MobileNavPanel: FC<V2MobileNavPanelProps> = ({
  open,
  setOpen,
  activeId,
  resumeHref,
  scrollToSection,
}) => {
  const rowCount = SECTION_ROWS.length + 1;

  /**
   * Rows fly in from both edges once the blinds have landed, and leave without
   * that wait. One delay ramp drives every row so the stagger reads as a
   * single gesture.
   */
  const rowTransition = (index: number) =>
    open ? `transform 0.15s ${0.4 + 0.05 * index}s` : `transform 0.15s ${0.05 * index}s`;

  return (
    <div
      className={clsx(
        "fixed inset-x-0 top-0 z-40 h-screen w-full v2md:hidden",
        open
          ? "v2-nav-active opacity-100"
          : "pointer-events-none select-none opacity-0 delay-[900ms]"
      )}
    >
      <div className="absolute inset-0 -z-50 grid grid-cols-[1rem_repeat(16,minmax(0,1fr))_1rem]">
        {[...new Array(BLIND_COUNT)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              "pointer-events-none relative h-full -translate-y-full select-none",
              "bg-[rgb(var(--v2-bg))] transition-all duration-300 ease-linear",
              (index === 0 || index === BLIND_COUNT - 1) && EDGE_RULE,
              index === 0 && "b:right-0",
              index === BLIND_COUNT - 1 && "b:left-0"
            )}
            style={
              {
                // Opening is a fast cascade; closing is slower, so the wipe
                // reads in both directions.
                transitionDelay: open ? `${index * 0.01}s` : `${index * 0.025}s`,
                "--tw-translate-y": open ? "0%" : "-100%",
              } as never
            }
          />
        ))}
      </div>

      <section className="v2-scrollbar-none mt-28 max-h-[calc(100vh-7rem)] overflow-y-auto px-[var(--v2-gutter)] py-8">
        <nav className="relative flex flex-col gap-6">
          {SECTION_ROWS.map(({ id, label, alt, Icon }, index) => (
            <Link key={id} href={`#${id}`}>
              <a
                aria-current={activeId === id ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setOpen(false);
                  scrollToSection(id);
                }}
                className={clsx(
                  ROW_CLASS,
                  activeId === id
                    ? "text-[rgb(var(--v2-accent))]"
                    : "text-[rgb(var(--v2-fg-2))] hover:text-[rgb(var(--v2-accent))]"
                )}
              >
                <span className={ROW_LABEL_CLASS} style={{ transition: rowTransition(index) }}>
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </span>
                <div className={ROW_RULE_CLASS} />
                <small className={ROW_ALT_CLASS} style={{ transition: rowTransition(index) }}>
                  {alt}
                </small>
              </a>
            </Link>
          ))}

          <Link href={resumeHref}>
            <a
              onClick={() => setOpen(false)}
              className={clsx(
                ROW_CLASS,
                "text-[rgb(var(--v2-fg-2))] hover:text-[rgb(var(--v2-accent))]"
              )}
            >
              <span
                className={ROW_LABEL_CLASS}
                style={{ transition: rowTransition(SECTION_ROWS.length) }}
              >
                <V2_NAV_RESUME.Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {V2_NAV_RESUME.label}
              </span>
              <div className="mx-3 h-px flex-1 bg-[linear-gradient(90deg,var(--v2-nav-line),var(--v2-nav-line)_50%,transparent_0,transparent)] bg-[length:8px_1px] opacity-0 transition-opacity [.v2-nav-active_&]:opacity-70 [.v2-nav-active_&]:delay-500" />
              <small
                className="translate-x-[200%] text-[rgb(var(--v2-fg-4))] [.v2-nav-active_&]:translate-x-0"
                style={{ transition: rowTransition(SECTION_ROWS.length) }}
              >
                {V2_NAV_RESUME.alt}
              </small>
            </a>
          </Link>
        </nav>

        <div
          className="mt-12 flex translate-y-8 items-center justify-center opacity-0 [.v2-nav-active_&]:translate-y-0 [.v2-nav-active_&]:opacity-100 [.v2-nav-active_&]:delay-500"
          style={{
            transition: open
              ? `transform 0.15s ${0.35 + 0.05 * rowCount}s, opacity 0.2s ${
                  0.35 + 0.05 * rowCount
                }s`
              : "transform 0.15s 0.05s, opacity 0.2s 0.05s",
          }}
        >
          <a
            href={V2_HERO.cta.secondary.href}
            className="whitespace-nowrap rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-accent))] px-10 py-3 font-[family-name:var(--v2-font-display)] text-base font-medium tracking-tight text-[rgb(var(--v2-btn-fg))]"
          >
            Email Me
          </a>
        </div>
      </section>
    </div>
  );
};
