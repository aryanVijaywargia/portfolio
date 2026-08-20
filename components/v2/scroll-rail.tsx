import clsx from "clsx";
import { FC, ForwardedRef, forwardRef, PropsWithChildren } from "react";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";

const CONTROL_CLASS =
  "inline-flex h-9 items-center gap-2 border bg-transparent px-3 transition-colors " +
  "border-[rgb(var(--v2-line-2))] text-[rgb(var(--v2-fg-2))] rounded-[var(--v2-radius-sm)] " +
  "font-[family-name:var(--v2-font-mono)] text-[11px] uppercase tracking-[0.14em] " +
  "hover:border-[rgb(var(--v2-accent))] hover:text-[rgb(var(--v2-accent))] " +
  "disabled:border-[rgb(var(--v2-line))] disabled:text-[rgb(var(--v2-fg-4))] disabled:opacity-45 " +
  "disabled:hover:border-[rgb(var(--v2-line))] disabled:hover:text-[rgb(var(--v2-fg-4))]";

/**
 * The step controls, drawn beside the section heading rather than under the
 * rail — that is where the design puts them, and where they stay in view while
 * the reader is looking at the cards.
 */
export const V2ScrollRailControls: FC<{
  canStepBack: boolean;
  canStepForward: boolean;
  onStep: (direction: -1 | 1) => void;
  label: string;
}> = ({ canStepBack, canStepForward, onStep, label }) => (
  <div className="hidden shrink-0 items-center gap-2 v2md:flex">
    <button
      type="button"
      className={CONTROL_CLASS}
      onClick={() => onStep(-1)}
      disabled={!canStepBack}
      aria-label={`Previous ${label.toLowerCase()}`}
    >
      <ArrowLongLeftIcon className="h-4 w-4" aria-hidden="true" />
      prev
    </button>
    <button
      type="button"
      className={CONTROL_CLASS}
      onClick={() => onStep(1)}
      disabled={!canStepForward}
      aria-label={`Next ${label.toLowerCase()}`}
    >
      next
      <ArrowLongRightIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

/**
 * The scrolling track itself. Snap points, and gutters broken so the rail runs
 * to the edge of the screen while the first card stays aligned with the
 * heading above it.
 */
export const V2ScrollRail = forwardRef(
  (
    { label, className, children }: PropsWithChildren<{ label: string; className?: string }>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={clsx(
          "v2-scrollbar-none flex snap-x snap-mandatory items-stretch overflow-x-auto",
          "-mx-[var(--v2-gutter)] gap-5 px-[var(--v2-gutter)] pb-6 pt-2",
          "scroll-pl-[var(--v2-gutter)]",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
