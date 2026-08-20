import clsx from "clsx";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ABOUT } from "content/about";
import { V2_ABOUT, V2_SECTION_HEADINGS } from "content/v2";
import { Image } from "components/image";
import { useAchievementActions } from "components/achievements";
import { useTooltipStore } from "components/_stores/tooltip-store";
import { useLiveStatValues } from "lib/use-github-stats";
import { V2Container, V2Heading, V2SectionHeader } from "components/v2/primitives";
import { V2Timeline } from "components/v2/sections/timeline";

type DescriptionSize = typeof V2_ABOUT.sizes[number]["key"];

const VISITED_KEY = "about:images-visited";

/* The stack takes ~350ms to fly back to the first photo when the cycle wraps;
   a plain step only needs a frame or two. The tooltip is re-shown after the
   move has settled so it never points at a photo that is still travelling. */
const WRAP_MS = 350;
const STEP_MS = 50;
const REHOVER_ATTEMPTS_MS = [50, 260];

/** Fans the stack out: alternating lean, growing with depth. */
const rotationFor = (index: number) => (index % 4) * (index % 2 === 0 ? 0.5 : -1.2) * 3;

const shuffle = <T,>(items: readonly T[]): T[] => {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const V2About: FC = () => {
  const { trackAchievementEvent } = useAchievementActions();
  const [images, setImages] = useState(ABOUT.images);
  const [focusIndex, setFocusIndex] = useState(0);
  const [size, setSize] = useState<DescriptionSize>("standard");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [, setTooltip] = useTooltipStore();
  const liveStats = useLiveStatValues();

  // Returning visitors get a reshuffled stack so the section is not identical
  // on every visit.
  useEffect(() => {
    try {
      if (localStorage.getItem(VISITED_KEY)) {
        setImages(shuffle(ABOUT.images));
      } else {
        localStorage.setItem(VISITED_KEY, "1");
      }
    } catch {
      // Private browsing can throw on localStorage; the unshuffled order is fine.
    }
  }, []);

  /**
   * react-tooltip reads `data-tip` once, when the hover that opened it fired,
   * and caches the result. Pointing the attribute at the next photo therefore
   * leaves the previous caption on screen until the pointer leaves and returns.
   * Unmounting the tooltip, then re-firing the hover once the new photo has
   * settled, is what actually swaps the caption under a stationary cursor.
   */
  const refreshTooltip = useCallback((delayMs: number) => {
    window.setTimeout(
      () => {
        setTooltip(true);
        // Must be `mouseenter`, and it must bubble: that is the event
        // react-tooltip binds to. A `mouseover` — what the v1 site dispatches —
        // is ignored, so the caption silently keeps the previous photo's text.
        //
        // Sent twice: the remounted tooltip occasionally is not listening yet
        // on the first frame, and a re-assert is far cheaper than a delay long
        // enough to be safe in every case. Re-entering an already-open tooltip
        // is a no-op, so the second send costs nothing when the first landed.
        REHOVER_ATTEMPTS_MS.forEach((wait) =>
          window.setTimeout(
            () => buttonRef.current?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true })),
            wait
          )
        );
      },
      delayMs
    );
  }, [setTooltip]);

  const handleAdvance = useCallback(() => {
    // Close the open tooltip properly before tearing it down. ReactTooltip is
    // mounted with delayHide=500, so an advance made while it is showing leaves
    // a pending hide that would land on the freshly re-shown caption.
    buttonRef.current?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    setTooltip(false);

    if (focusIndex >= images.length - 1) {
      trackAchievementEvent({ type: "about:cycle-complete" });
      // One step past the end sends the whole stack off, then it snaps back.
      setFocusIndex(focusIndex + 1);
      window.setTimeout(() => setFocusIndex(0), WRAP_MS);
      refreshTooltip(WRAP_MS);
      return;
    }

    setFocusIndex(focusIndex + 1);
    refreshTooltip(STEP_MS);
  }, [focusIndex, images.length, refreshTooltip, setTooltip, trackAchievementEvent]);

  return (
    <section
      id="about"
      data-screen-label="About"
      data-v2-defer=""
      className="scroll-mt-20 overflow-hidden pb-[var(--v2-section-gap)] pt-[var(--v2-section-pt)]"
    >
      <V2Container>
        <V2SectionHeader section="about" />
        <V2Heading className="mb-8">{V2_SECTION_HEADINGS.about}</V2Heading>

        <div className="grid grid-cols-1 items-start gap-12 v2md:grid-cols-[minmax(0,480px)_minmax(0,1fr)] v2md:gap-14">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleAdvance}
            data-tip={images[focusIndex]?.tooltip ?? images[focusIndex]?.alt}
            className="relative mb-8 aspect-3/2 w-full max-w-[520px] cursor-pointer border-0 bg-transparent p-0"
          >
            <span className="sr-only">Cycle through images</span>
            {images.map(({ src, alt }, index) => (
              <Image
                key={alt}
                src={src}
                alt={alt}
                width={2000}
                height={1500}
                maxWidth={520}
                sizes="(min-width: 1000px) 480px, 100vw"
                preload={index === 0}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className={clsx(
                  "absolute left-0 top-0 h-full w-full rounded-[var(--v2-radius-md)] object-cover",
                  // The mount, and the shadow it casts on the print below it:
                  // without both, the photos underneath read as slivers of
                  // grey rather than as a stack. Same treatment as v1.
                  "border-2 border-[rgb(var(--v2-photo-frame))]",
                  "shadow-[0_10px_15px_-3px_rgb(0_0_0/0.18),0_4px_6px_-4px_rgb(0_0_0/0.16)]",
                  "transition-all duration-300"
                )}
                style={{
                  transform:
                    focusIndex > index
                      ? `translate(-700px, -${(index % 4) * 60 + 25}px) rotate(${rotationFor(
                          index
                        )}deg)`
                      : `rotate(${rotationFor(index)}deg)`,
                  filter: focusIndex === index ? undefined : "grayscale(1)",
                  opacity: focusIndex > index ? 0 : 1,
                  // Positive and descending: the deck fans out with the
                  // focused photo on top. Negative values would paint the rest
                  // behind the page background and only one photo would show.
                  zIndex: images.length - index,
                }}
              />
            ))}

            {/* The bottom of the deck: a blank mount leaning the other way, so
                the stack has an edge to sit on even when a photo above it is
                nearly square to the frame. z-0 rather than negative — the
                images stack above it, and a negative index would put it behind
                the section's own background. */}
            <span
              aria-hidden="true"
              style={{ zIndex: 0 }}
              className="absolute inset-0 -rotate-6 rounded-[var(--v2-radius-md)] bg-[rgb(var(--v2-photo-frame))]"
            />
          </button>

          <div className="flex flex-col gap-7">
            {/* Centred in the 2×2 phone layout and left-aligned once the four
                sit in a row, matching the v1 site. */}
            <div className="grid grid-cols-2 justify-items-center gap-6 border-b border-[rgb(var(--v2-line))] pb-6 text-center v2sm:grid-cols-4 v2sm:justify-items-start v2sm:text-left">
              {ABOUT.stats.map(({ statistic, caption, tooltip }, index) => (
                <figure
                  key={caption}
                  data-tip={liveStats[caption]?.tooltip ?? tooltip}
                  className="m-0 min-w-0 cursor-help select-none"
                >
                  <span
                    className={clsx(
                      "block font-[family-name:var(--v2-font-display)] text-[40px] font-bold leading-none tracking-[-0.045em]",
                      index === ABOUT.stats.length - 1
                        ? "text-[rgb(var(--v2-accent))]"
                        : "text-[rgb(var(--v2-fg))]"
                    )}
                  >
                    {liveStats[caption]?.statistic ?? statistic}
                  </span>
                  <figcaption className="mt-2 font-[family-name:var(--v2-font-mono)] text-[10px] uppercase tracking-[0.14em] text-[rgb(var(--v2-fg-4))]">
                    {caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Small screens get the v1 site's compact S / M / L row above the
                text; from v2sm the control becomes the dashed column beside it,
                spread against the paragraph the way v1 draws it. */}
            <div className="flex select-none items-center justify-center gap-5 v2sm:hidden">
              {V2_ABOUT.sizes.map(({ key, short }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSize(key)}
                  aria-pressed={size === key}
                  aria-label={key}
                  className={clsx(
                    "border-0 bg-transparent p-0 font-[family-name:var(--v2-font-mono)] text-base font-semibold tracking-[0.2em] transition-colors duration-300",
                    size === key ? "text-[rgb(var(--v2-accent))]" : "text-[rgb(var(--v2-fg-4))]"
                  )}
                >
                  {short}
                </button>
              ))}
            </div>

            <div className="flex items-start">
              <div className="v2-prose max-w-[36rem] flex-1 text-[15.5px] leading-[1.625] tracking-[-0.003em] text-[rgb(var(--v2-fg-3))] v2sm:text-base">
                {ABOUT.descriptions[size]}
              </div>

              <div
                className="ml-auto hidden shrink-0 select-none flex-col justify-between pl-8 v2sm:flex"
                style={{ minHeight: 120 }}
              >
                {V2_ABOUT.sizes.map(({ key, label }) => {
                  const isActive = size === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSize(key)}
                      aria-pressed={isActive}
                      className={clsx(
                        "group flex items-center gap-2 border-0 bg-transparent p-0 py-1 text-left transition-colors duration-300",
                        isActive
                          ? "text-[rgb(var(--v2-accent))]"
                          : "text-[rgb(var(--v2-fg-4))] hover:text-[rgb(var(--v2-fg-3))]"
                      )}
                    >
                      <span
                        className={clsx(
                          "block h-[1.5px] bg-current transition-all duration-300",
                          isActive ? "w-5" : "w-3 group-hover:w-4"
                        )}
                      />
                      <span className="font-[family-name:var(--v2-font-mono)] text-[10px] font-semibold uppercase tracking-[0.2em]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <V2Timeline />
      </V2Container>
    </section>
  );
};
