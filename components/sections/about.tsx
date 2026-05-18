import { useAchievementActions } from "components/achievements";
import { useTooltipStore } from "components/_stores/tooltip-store";
import { Image } from "components/image";
import { ABOUT } from "content/about";
import clsx from "clsx";
import { FC, useCallback, useEffect, useRef, useState } from "react";

type DescriptionSize = "brief" | "standard" | "detailed";

type AboutProps = {};

const ABOUT_VISITED_KEY = "about:images-visited";

const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const About: FC<AboutProps> = (props) => {
  const imageRef = useRef<HTMLImageElement[]>([]);
  const [focusImageIndex, setFocusImageIndex] = useState(0);
  const [images, setImages] = useState(ABOUT.images);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const visited = localStorage.getItem(ABOUT_VISITED_KEY);
      if (visited) {
        setImages(shuffle(ABOUT.images));
      } else {
        localStorage.setItem(ABOUT_VISITED_KEY, "1");
      }
    } catch {
      // localStorage may be unavailable; fall back to sequence
    }
  }, []);
  const [tooltip, setTooltip] = useTooltipStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { trackAchievementEvent } = useAchievementActions();
  const [descriptionSize, setDescriptionSize] = useState<DescriptionSize>("standard");

  const handleImageClick = useCallback(() => {
    setTooltip(false);
    if (focusImageIndex === images.length - 1) {
      trackAchievementEvent({ type: "about:cycle-complete" });
      setFocusImageIndex((current) => current + 1);
      setTimeout(
        () => {
          setFocusImageIndex(0);
          setTooltip(true);
          const trigger = new Event("mouseover");
          setTimeout(
            () => {
              buttonRef.current?.dispatchEvent(trigger);
            },
            50
          );
        },
        350
      );
    }

    if (focusImageIndex < images.length - 1) {
      setFocusImageIndex((current) => current + 1);
      setTimeout(
        () => {
          setTooltip(true);
          const trigger = new Event("mouseover");
          setTimeout(
            () => {
              buttonRef.current?.dispatchEvent(trigger);
            },
            50
          );
        },
        50
      );
    }
  }, [focusImageIndex, images.length, setTooltip, trackAchievementEvent]);

  return (
    <section id="about" className="relative overflow-hidden pt-24 md:pt-28 lg:pt-36">
      {/* Section Header */}
      <header className="mx-auto mb-8 grid w-full max-w-6xl px-4 md:px-8">
        <div className="heading-pre">Get to Know Me</div>
        <h1 className="heading-2xl -ml-1">About Me</h1>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col justify-center gap-16 px-4 pb-16 md:px-8 lg:grid lg:grid-cols-[540px_auto] lg:pt-8">
        <button
          ref={buttonRef}
          className="group relative mx-auto mb-12 aspect-3/2 max-h-[405px] w-full max-w-[540px] flex-1 hfa:outline-none lg:mb-auto  lg:mr-0 lg:aspect-4/3"
          onClick={handleImageClick}
          type="button"
          data-event="mouseover"
          data-tip={images[focusImageIndex]?.tooltip ?? images[focusImageIndex]?.alt}
        >
          <span className="sr-only">Cycle through Images</span>
          {images.map(({ src, alt, objectPosition }, index) => {
            return (
              <Image
                maxWidth={540}
                src={src}
                alt={alt}
                key={alt}
                width={2000}
                height={1500}
                sizes="(min-width: 580px) 540px, 400px"
                preload={index === 0}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute left-0 top-0 rounded-xl border-2 border-gray-50/80 object-cover !opacity-0 shadow-lg shadow-gray-700/5 transition-all duration-300 group-focus-visible:border-sky-500 d:border-gray-600/80"
                data-about-image-index={index}
                onLoadingComplete={() =>
                  document
                    .querySelectorAll(`[data-about-image-index="${index}"]`)
                    .forEach((img) => img.classList.remove("!opacity-0"))
                }
                style={{
                  transform:
                    focusImageIndex > index
                      ? `translate(-700px, -${(index % 4) * 60 + 25}px) rotate(${
                          (index % 4) * (index % 2 === 0 ? 0.5 : -1.2) * 3
                        }deg)`
                      : `rotate(${(index % 4) * (index % 2 === 0 ? 0.5 : -1.2) * 3}deg)`,
                  zIndex: -index,
                  ...(focusImageIndex !== index ? { filter: "grayscale(80)" } : {}),
                  opacity: focusImageIndex > index ? "0" : "1",
                  objectPosition,
                }}
              />
            );
          })}
          <div className="relative -z-50 h-full w-full -rotate-6 rounded-xl bg-gray-200/80"></div>
        </button>
        <section className="spacing-8">
          <header className="grid max-w-xl grid-cols-2 gap-4 text-center sm:grid-cols-4 sm:text-left">
            {ABOUT.stats.map(({ statistic, caption, tooltip }, index) => {
              return (
                <figure
                  key={caption + index}
                  data-tip={tooltip}
                  className="cursor-help select-none spacing-1"
                >
                  <span
                    className={clsx(
                      "text-4xl font-extrabold tracking-tighter",
                      statistic === "∞"
                        ? "text-blue-500"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"
                    )}
                  >
                    {statistic}
                  </span>
                  <figcaption className="text-[15px] font-semibold tracking-tight text-gray-400 d:text-gray-300/80">
                    {caption}
                  </figcaption>
                </figure>
              );
            })}
          </header>
          {/* Mobile: S M L toggle */}
          <div className="flex select-none items-center justify-center gap-4 sm:hidden">
            {(
              [
                { key: "brief", label: "S" },
                { key: "standard", label: "M" },
                { key: "detailed", label: "L" },
              ] as const
            ).map(({ key, label }) => {
              const isActive = descriptionSize === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDescriptionSize(key)}
                  className={clsx(
                    "font-mono text-base font-semibold tracking-widest outline-none transition-all duration-300",
                    isActive ? "text-cyan-500" : "text-gray-500 d:text-gray-700"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {/* Description with right-side toggle */}
          <div className="flex items-start">
            <main className="tracking tight max-w-xl flex-1 leading-relaxed text-gray-500 d:text-gray-100/70 [&>p+p]:mt-4">
              {ABOUT.descriptions[descriptionSize]}
            </main>
            {/* Right toggle labels */}
            <div
              className="ml-auto hidden flex-shrink-0 select-none flex-col justify-between pl-8 sm:flex"
              style={{ minHeight: 120 }}
            >
              {(["brief", "standard", "detailed"] as const).map((size) => {
                const isActive = descriptionSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setDescriptionSize(size)}
                    className={clsx(
                      "group flex items-center gap-2 py-1 text-left outline-none transition-all duration-300",
                      isActive
                        ? "text-cyan-500"
                        : "text-gray-400/40 hover:text-gray-400 d:text-gray-700 d:hover:text-gray-500"
                    )}
                  >
                    <span
                      className={clsx(
                        "block h-[1.5px] rounded-full transition-all duration-300",
                        isActive
                          ? "w-5 bg-cyan-500"
                          : "w-3 bg-gray-300 group-hover:w-4 d:bg-gray-700"
                      )}
                    />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
                      {size}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
