import { Link } from "components/link";
import clsx from "clsx";
import { HoverEffect } from "components/layout/header.desktop-nav.hover-effect";

import { HEADER } from "content/layout";
import { useRouter } from "next/router";
import { FC, useState, useEffect } from "react";

export const DesktopNav: FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle hash links with smooth scroll
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL without reload
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <>
      <nav className="sm:scrollbar-none header-nav group relative isolate mt-auto hidden h-full items-center justify-center gap-2 overflow-visible px-2 md:flex">
        <HoverEffect />
        {HEADER.nav
          .filter(({ desktop }) => desktop)
          .map((link, i) => {
            // Only use scroll-based detection for hash links, use router for regular pages
            const isHashLink = link.href.startsWith("/#");
            const isActive = isHashLink
              ? activeSection === link.href
              : activeSection === link.href || router.asPath.split(/[#?]/)[0] === link.href;
            const Icon = link.Icon;
            return (
              <div className="my-auto flex items-center" key={link.href + link.title + i}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={clsx(
                    "group/nav relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full outline-none transition-all duration-300 ease-out",
                    isActive
                      ? "w-auto bg-sky-500 px-1 shadow-lg shadow-sky-500/30"
                      : "bg-gray-200/80 hover:w-auto hover:bg-sky-500 hover:px-1 hover:shadow-lg hover:shadow-sky-500/30 d:bg-gray-700"
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover/nav:text-white d:text-gray-300"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </span>
                  <span
                    className={clsx(
                      "whitespace-nowrap text-sm font-medium transition-all duration-300",
                      isActive
                        ? "ml-0.5 w-auto pr-2 text-white opacity-100"
                        : "ml-0 w-0 pr-0 opacity-0 group-hover/nav:ml-0.5 group-hover/nav:w-auto group-hover/nav:pr-2 group-hover/nav:text-white group-hover/nav:opacity-100"
                    )}
                  >
                    {link.title}
                  </span>
                </Link>
              </div>
            );
          })}
      </nav>
    </>
  );
};
