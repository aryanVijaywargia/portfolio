import { Link } from "components/link";
import { DesktopNav } from "components/layout/header.desktop-nav";
import { MobileNav } from "components/layout/header.mobile-nav";
import { ProfileNav } from "components/layout/header.settings";
import { HEADER } from "content/layout";
import { FC, useState, useEffect, useRef } from "react";

export const Header: FC = ({}) => {
  const [showNav, setShowNav] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const metricsRef = useRef({ heroHeight: 0, navbarHeight: 80 });
  const lastVisibleRef = useRef(false);

  useEffect(() => {
    const measure = () => {
      const heroSection = document.querySelector(".hero");
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      metricsRef.current = {
        heroHeight: heroSection?.clientHeight || window.innerHeight,
        navbarHeight: 5 * rootFontSize,
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

      header.style.setProperty("--header-top", `${calculatedTop}px`);
      header.style.setProperty("--header-opacity", `${nextOpacity}`);

      const nextVisible = nextOpacity > 0;
      if (nextVisible !== lastVisibleRef.current) {
        lastVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateHeader);
    };

    const handleResize = () => {
      measure();
      scheduleUpdate();
    };

    measure();
    updateHeader();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 z-50 h-20 w-full border-b border-gray-800/10 bg-white/50 backdrop-blur d:border-gray-100/10 d:bg-gray-900/40 print:hidden ${
          isVisible ? "pointer-events-auto" : "pointer-events-none invisible"
        }`}
        style={{
          top: "var(--header-top, 0px)",
          opacity: "var(--header-opacity, 0)",
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl grid-cols-[210px_1fr_210px] items-center gap-1 px-4 md:grid md:gap-4 md:px-8">
          <Link
            href="/"
            className="z-10 w-min"
            data-tip="Hi, I'm Aryan. Welcome to my site."
            data-delay-show={2000}
          >
            <span className="sr-only">Aryan's Logo</span>
            {HEADER.logo.title}
          </Link>
          <DesktopNav />
          <ProfileNav showNav={showNav} />
          <MobileNav showNav={showNav} setShowNav={setShowNav} />
        </div>
      </header>
    </>
  );
};
