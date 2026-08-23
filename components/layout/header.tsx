import { Link } from "components/link";
import { DesktopNav } from "components/layout/header.desktop-nav";
import { HeaderBrand } from "components/layout/header.brand";
import { MobileNav } from "components/layout/header.mobile-nav";
import { ProfileNav } from "components/layout/header.settings";
import { HEADER } from "content/layout";
import { useRouter } from "next/router";
import { FC, useState, useEffect, useRef } from "react";

export const Header: FC = ({}) => {
  const router = useRouter();
  const isPortfolioHome = router.pathname === "/graphite";
  const isMinimal = !isPortfolioHome;
  const [showNav, setShowNav] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const metricsRef = useRef({ heroHeight: 0, navbarHeight: 80 });
  const lastVisibleRef = useRef(false);
  const lastStyleRef = useRef({ opacity: Number.NaN, translateY: Number.NaN });

  useEffect(() => {
    if (isMinimal) return;

    const measure = () => {
      const heroSection = document.querySelector(".hero");
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const headerHeight = headerRef.current?.offsetHeight || 5 * rootFontSize;
      metricsRef.current = {
        heroHeight: heroSection?.getBoundingClientRect().height || window.innerHeight,
        navbarHeight: headerHeight,
      };
    };

    const updateHeader = () => {
      frameRef.current = null;
      const header = headerRef.current;
      if (!header) return;
      const { heroHeight, navbarHeight } = metricsRef.current;
      const scrollY = window.scrollY;

      const initialTop = heroHeight - navbarHeight;
      const calculatedTop = Math.max(0, initialTop - scrollY);
      const fadeDistance = heroHeight * 0.3;
      const nextOpacity = calculatedTop >= fadeDistance ? 0 : 1 - calculatedTop / fadeDistance;

      if (calculatedTop !== lastStyleRef.current.translateY) {
        header.style.setProperty("--header-translate-y", `${calculatedTop}px`);
        lastStyleRef.current.translateY = calculatedTop;
      }
      if (nextOpacity !== lastStyleRef.current.opacity) {
        header.style.setProperty("--header-opacity", `${nextOpacity}`);
        lastStyleRef.current.opacity = nextOpacity;
      }

      const nextVisible = nextOpacity > 0;
      if (nextVisible !== lastVisibleRef.current) {
        lastVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;

      // Only skip work after the header has actually reached its pinned state.
      // A fast scroll or hash jump can cross the pin threshold while the last
      // rendered frame is still partially translated; skipping that frame
      // leaves the navbar floating over the section content on large screens.
      const { heroHeight, navbarHeight } = metricsRef.current;
      const isPinned = lastStyleRef.current.translateY === 0 && lastStyleRef.current.opacity === 1;
      if (isPinned && window.scrollY >= heroHeight - navbarHeight) return;

      frameRef.current = window.requestAnimationFrame(updateHeader);
    };

    const handleResize = () => {
      measure();
      scheduleUpdate();
    };

    measure();
    updateHeader();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;
    const heroSection = document.querySelector(".hero");
    if (heroSection) resizeObserver?.observe(heroSection);
    if (headerRef.current) resizeObserver?.observe(headerRef.current);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMinimal]);

  if (isMinimal) {
    const isResume = router.pathname === "/resume";

    return (
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl d:border-gray-700/60 d:bg-gray-900/80 print:hidden">
        <div className="mx-auto flex h-full max-w-6xl items-center px-4 md:px-8">
          <Link href="/" className="z-10 w-min" data-tip="Back to home" data-delay-show={500}>
            <span className="sr-only">Back to home</span>
            <HeaderBrand />
          </Link>
          <nav className="ml-auto flex items-center gap-5 text-sm font-medium text-gray-500 d:text-gray-400 sm:gap-7">
            <Link
              href="/resume"
              aria-current={isResume ? "page" : undefined}
              className={`relative inline-flex min-h-[44px] items-center py-2 transition-colors hfa:text-sky-600 d:hfa:text-sky-400 ${
                isResume
                  ? "text-gray-900 after:absolute a:inset-x-0 a:-bottom-0.5 a:h-px a:bg-sky-500 d:text-white"
                  : ""
              }`}
            >
              Resume
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`portfolio-header fixed inset-x-0 z-50 h-20 w-full border-b border-gray-800/10 bg-white/50 backdrop-blur d:border-gray-100/10 d:bg-gray-900/40 print:hidden ${
          isVisible ? "pointer-events-auto" : "pointer-events-none invisible"
        }`}
        style={{
          top: 0,
          opacity: "var(--header-opacity, 0)",
          transform: "translate3d(0, var(--header-translate-y, 0px), 0)",
          willChange: "transform, opacity",
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center gap-1 px-4 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 md:px-8 xl:grid-cols-[210px_1fr_210px]">
          <Link
            href="/graphite"
            className="z-10 w-min"
            data-tip="Hi, I'm Aryan. Welcome to my site."
            data-delay-show={2000}
          >
            <span className="sr-only">Aryan Vijaywargia — home</span>
            <HeaderBrand />
          </Link>
          <DesktopNav />
          <ProfileNav showNav={showNav} />
          <MobileNav showNav={showNav} setShowNav={setShowNav} />
        </div>
      </header>
    </>
  );
};
