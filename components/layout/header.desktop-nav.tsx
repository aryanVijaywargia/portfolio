import clsx from "clsx";

import { HEADER } from "content/layout";
import { useRouter } from "next/router";
import { FC, useState, useEffect, useRef, useCallback } from "react";

export const DesktopNav: FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");
  const scrollingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollingRef.current) return;

      const sections = ["about", "experience", "portfolio", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check if we're at the top (home)
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      // Check current route for non-hash pages
      const currentPath = router.asPath.split(/[#?]/)[0];
      if (currentPath !== "/") {
        setActiveSection(currentPath);
        return;
      }

      // Find the closest section to current scroll position
      let closestSection = "";
      let closestDistance = Infinity;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height / 2;

          // If we're inside the section, use it
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            closestSection = `/#${sectionId}`;
            break;
          }

          // Otherwise find the closest section
          const distance = Math.min(
            Math.abs(scrollPosition - elementTop),
            Math.abs(scrollPosition - elementCenter)
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = `/#${sectionId}`;
          }
        }
      }

      setActiveSection(closestSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                  ? "bg-sky-500 pl-3 pr-1 shadow-lg shadow-sky-500/30"
                  : "bg-gray-200/80 px-0 hover:pl-3 hover:pr-1 d:bg-gray-700"
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
