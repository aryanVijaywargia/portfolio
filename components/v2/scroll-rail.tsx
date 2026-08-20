import clsx from "clsx";
import { FC, ForwardedRef, forwardRef, PropsWithChildren } from "react";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";

/**
 * Bare text and an arrow, the way the v1 gallery draws them — the boxed
 * version read as two more chips competing with the filters right above it.
 * Colours come from the theme tokens rather than v1's fixed grays.
 */
const CONTROL_CLASS =
  "absolute bottom-0 hidden items-center gap-2 bg-transparent px-4 py-2 text-sm " +
  "text-[rgb(var(--v2-fg-4))] transition-colors duration-75 " +
  "hover:text-[rgb(var(--v2-fg))] " +
  "disabled:text-[rgb(var(--v2-fg-4)/0.4)] disabled:hover:text-[rgb(var(--v2-fg-4)/0.4)] " +
  "v2md:flex";

/**
 * The step controls, sitting at either end below the rail. Absolute, so they
 * need a positioned ancestor — see the wrapper the rail is rendered in.
 *
 * Pointer-only: below v2md the rail is swiped, and the buttons would take
 * space from the cards to do a job the thumb already does.
 */
export const V2ScrollRailControls: FC<{
  canStepBack: boolean;
  canStepForward: boolean;
  onStep: (direction: -1 | 1) => void;
  label: string;
}> = ({ canStepBack, canStepForward, onStep, label }) => (
  <>
    <button
      type="button"
      className={clsx(CONTROL_CLASS, "left-0")}
      onClick={() => onStep(-1)}
      disabled={!canStepBack}
      aria-label={`Previous ${label.toLowerCase()}`}
    >
      <ArrowLongLeftIcon className="mt-0.5 h-5 w-5" aria-hidden="true" />
      prev
    </button>

    <button
      type="button"
      className={clsx(CONTROL_CLASS, "right-0")}
      onClick={() => onStep(1)}
      disabled={!canStepForward}
      aria-label={`Next ${label.toLowerCase()}`}
    >
      next
      <ArrowLongRightIcon className="mt-0.5 h-5 w-5" aria-hidden="true" />
    </button>
  </>
);

/**
 * The scrolling track itself. Snap points, and gutters broken so the rail runs
 * to the edge of the screen while the first card stays aligned with the
 * heading above it.
 *
 * The bottom padding is the controls' room: they are absolutely placed over
 * it, so it has to clear their height even where they are not drawn.
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
          "-mx-[var(--v2-gutter)] gap-5 px-[var(--v2-gutter)] pb-6 pt-2 v2md:pb-14",
          "scroll-pl-[var(--v2-gutter)]",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
