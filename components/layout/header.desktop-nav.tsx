import clsx from "clsx";

import { HEADER } from "content/layout";
import { useRouter } from "next/router";
import { FC, useState, useEffect, useRef, useCallback } from "react";

export const DesktopNav: FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");
  const scrollingRef = useRef(false);

  useEffect(() => {
    const sectionIds = ["about", "experience", "portfolio", "contact"];
    const currentPath = router.asPath.split(/[#?]/)[0];

    if (currentPath !== "/") {
      setActiveSection(currentPath);
      return;
    }

    let lastSection = "";
    let frameId: number | null = null;

    const computeActive = () => {
      frameId = null;
      if (scrollingRef.current) return;

      if (window.scrollY < 100) {
        if (lastSection !== "") {
          lastSection = "";
          setActiveSection("");
        }
        return;
      }

      const anchor = window.innerHeight * 0.3;
      let bestId = "";
      let bestDist = Infinity;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top > anchor) continue;
        if (rect.bottom < 0) continue;
        const dist = anchor - rect.top;
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      }

      const next = bestId ? `/#${bestId}` : "";
      if (next !== lastSection) {
        lastSection = next;
        setActiveSection(next);
        // Keep the URL in sync with what's actually in view, without polluting history.
        const targetUrl = next || "/";
        if (window.location.pathname + window.location.hash !== targetUrl) {
          window.history.replaceState(null, "", targetUrl);
        }
      }
    };

    const schedule = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(computeActive);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    computeActive();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [router.asPath]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      e.stopPropagation();
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        // Set active immediately for instant visual feedback
        setActiveSection(href);
        scrollingRef.current = true;

        const targetY = element.getBoundingClientRect().top + window.scrollY;
        const startY = window.scrollY;
        const diff = targetY - startY;
        const duration = Math.min(800, Math.max(400, Math.abs(diff) * 0.3));
        let start: number | null = null;

        const easeInOutCubic = (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutCubic(progress);

          window.scrollTo(0, startY + diff * eased);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            scrollingRef.current = false;
            window.history.pushState(null, "", href);
          }
        };

        requestAnimationFrame(step);
      }
    }
  }, []);

  return (
    <nav className="sm:scrollbar-none header-nav group relative isolate mt-auto hidden h-full items-center justify-center gap-3 overflow-visible px-2 md:flex">
      {HEADER.nav
        .filter(({ desktop }) => desktop)
        .map((link, i) => {
          const isHashLink = link.href.startsWith("/#");
          const isActive = isHashLink
            ? activeSection === link.href
            : activeSection === link.href || router.asPath.split(/[#?]/)[0] === link.href;
          const Icon = link.Icon;
          return (
            <a
              key={link.href + link.title + i}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={clsx(
                "group/nav relative flex h-10 min-w-[2.5rem] items-center justify-center rounded-full outline-none",
                "transition-[background-color,box-shadow,padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isActive
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 pl-3 pr-1 shadow-[0_8px_24px_-8px_rgba(6,182,212,0.5),0_0_40px_-8px_rgba(59,130,246,0.3)] d:shadow-[0_8px_24px_-8px_rgba(6,182,212,0.6),0_0_40px_-8px_rgba(59,130,246,0.4)]"
                  : "bg-white/70 px-0 ring-1 ring-inset ring-slate-300/60 backdrop-blur hover:pl-3 hover:pr-1 hfa:bg-white/90 hfa:ring-slate-400/50 d:bg-slate-900/60 d:ring-slate-400/15 d:hfa:bg-slate-800/80 d:hfa:ring-slate-300/30"
              )}
            >
              <span
                className={clsx(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center transition-colors duration-200",
                  isActive ? "text-white" : "text-gray-600 d:text-gray-300"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </span>
              <div
                className={clsx(
                  "overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive
                    ? "max-w-[6rem] opacity-100"
                    : "max-w-0 opacity-0 group-hover/nav:max-w-[6rem] group-hover/nav:opacity-100"
                )}
              >
                <span
                  className={clsx(
                    "whitespace-nowrap pl-2 pr-2 text-sm font-medium",
                    isActive ? "text-white" : "text-gray-600 d:text-gray-300"
                  )}
                >
                  {link.title}
                </span>
              </div>
            </a>
          );
        })}
    </nav>
  );
};
