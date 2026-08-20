import clsx from "clsx";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { DogIcon } from "components/icons/dog-icon";
import { useOpenChatbot } from "components/v2/use-open-chatbot";
import { V2_NAV } from "content/v2";
import { useV2Variant } from "components/v2/variant";
import { V2_CONTROL_CLASS } from "components/v2/primitives";
import { V2Brand } from "components/v2/brand";
import { V2ThemeToggle } from "components/v2/theme-toggle";
import { useHeaderReveal } from "components/v2/use-header-reveal";
import { V2MobileNavButton, V2MobileNavPanel } from "components/v2/sections/header.mobile-nav";

const NAV_IDS = V2_NAV.map((item) => item.id);

/**
 * Fixed header that starts parked at the foot of the hero and rises into a
 * pinned bar as the hero scrolls away.
 *
 * Nav pills follow the v1 pattern: icon only at rest, expanding to reveal the
 * label when active or hovered. The label is animated on grid-template-columns
 * so the pill grows smoothly without needing a measured width.
 */
export const V2Header: FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openChatbot = useOpenChatbot();
  // Carries the skin across to pages that are shared with "/".
  const resumeHref = `/resume?theme=${useV2Variant()}`;
  const { isVisible, activeId, scrollToSection } = useHeaderReveal({
    headerRef,
    heroSelector: "#top",
    sectionIds: NAV_IDS,
  });

  return (
    <header
      ref={headerRef}
      data-v2-header=""
      className={clsx(
        "fixed inset-x-0 top-0 z-50 w-full",
        "border-b border-[rgb(var(--v2-line))] bg-[rgb(var(--v2-bg-blur))] backdrop-blur-lg",
        "transition-opacity duration-200 ease-linear",
        isVisible ? "pointer-events-auto" : "pointer-events-none invisible"
      )}
      style={{
        opacity: "var(--v2-header-opacity, 0)",
        transform: "translate3d(0, var(--v2-header-y, 0px), 0)",
        willChange: "transform, opacity",
      }}
    >
      <div className="relative z-50 mx-auto flex h-[var(--v2-header-h)] max-w-[var(--v2-max-w)] items-center gap-3 px-[var(--v2-gutter)] v2md:gap-4">
        <Link href="#top">
          <a
            className="group/brand z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center text-[rgb(var(--v2-fg))]"
            aria-label="Back to top"
          >
            <V2Brand />
          </a>
        </Link>

        <nav className="hidden h-full min-w-0 flex-1 items-center justify-center gap-3 v2md:flex">
          {V2_NAV.map(({ id, label, Icon }) => {
            const isActive = activeId === id;
            const isExpanded = isActive || hoveredId === id;
            return (
              <Link key={id} href={`#${id}`}>
                <a
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(id);
                  }}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId((current) => (current === id ? null : current))}
                  onFocus={() => setHoveredId(id)}
                  onBlur={() => setHoveredId((current) => (current === id ? null : current))}
                  className={clsx(
                    "group/nav relative flex h-10 min-w-[2.5rem] shrink-0 items-center justify-center rounded-full outline-none",
                    "font-[family-name:var(--v2-font-mono)] text-[11px] uppercase tracking-[0.1em]",
                    "transition-[background-color,color,box-shadow,padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isActive
                      ? "bg-[rgb(var(--v2-accent))] pl-3 pr-1 text-[rgb(var(--v2-btn-fg))] shadow-[inset_0_0_0_1px_rgb(var(--v2-accent))]"
                      : "bg-[rgb(var(--v2-surface))] px-0 text-[rgb(var(--v2-fg-2))] shadow-[inset_0_0_0_1px_rgb(var(--v2-line-2))] hover:pl-3 hover:pr-1"
                  )}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {/* Collapsed to zero width at rest; the label stays in the
                      accessibility tree either way. */}
                  <span
                    className={clsx(
                      "overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isExpanded ? "max-w-[7rem] opacity-100" : "max-w-0 opacity-0"
                    )}
                  >
                    <span className="whitespace-nowrap px-2">{label}</span>
                  </span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="z-10 ml-auto flex shrink-0 items-center gap-1 pl-2">
          <button
            type="button"
            onClick={openChatbot}
            aria-label="Chat with Byte"
            className={V2_CONTROL_CLASS}
          >
            <span className="sr-only">Chat with Byte</span>
            <DogIcon className="h-5 w-5 text-[rgb(var(--v2-accent))]" />
          </button>

          <V2ThemeToggle />

          <a
            href="https://github.com/AryanVijaywargia"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className={V2_CONTROL_CLASS}
          >
            <span className="sr-only">GitHub</span>
            <SiGithub className="h-5 w-5" />
          </a>

          {/* Resume is the one call to action here, so it keeps a button
              silhouette rather than sitting in the icon row. */}
          <Link href={resumeHref}>
            <a className="ml-3 hidden whitespace-nowrap rounded-[var(--v2-radius-sm)] border border-[rgb(var(--v2-line-2))] bg-[rgb(var(--v2-surface))] px-4 py-1.5 text-sm font-medium tracking-tight text-[rgb(var(--v2-fg-2))] transition-colors hover:border-[rgb(var(--v2-accent))] hover:text-[rgb(var(--v2-accent))] v2sm:block">
              Resume
            </a>
          </Link>

          <V2MobileNavButton open={menuOpen} setOpen={setMenuOpen} />
        </div>
      </div>

      <V2MobileNavPanel
        open={menuOpen}
        setOpen={setMenuOpen}
        activeId={activeId}
        resumeHref={resumeHref}
        scrollToSection={scrollToSection}
      />
    </header>
  );
};
