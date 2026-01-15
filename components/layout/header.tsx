import { Link } from "components/link";
import { DesktopNav } from "components/layout/header.desktop-nav";
import { MobileNav } from "components/layout/header.mobile-nav";
import { ProfileNav } from "components/layout/header.settings";
import { HEADER } from "content/layout";
import { FC, useState, useEffect } from "react";

export const Header: FC = ({}) => {
  const [showNav, setShowNav] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [navTop, setNavTop] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero');
      const heroHeight = heroSection?.clientHeight || window.innerHeight;
      // Get navbar height from rem (h-20 = 5rem) - converts to pixels based on root font size
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const navbarHeight = 5 * rootFontSize; // 5rem
      const scrollY = window.scrollY;

      // Navbar starts at bottom of hero section (its top edge at heroHeight - navbarHeight)
      // As user scrolls, navbar "rises up" - top value decreases
      // Once top reaches 0, navbar is fixed at the top
      const initialTop = heroHeight - navbarHeight;
      const calculatedTop = Math.max(0, initialTop - scrollY);
      setNavTop(calculatedTop);

      // Opacity: fade in during the last 30% of hero height before navbar reaches top
      // This creates the "becoming visible" effect as user scrolls
      const fadeDistance = heroHeight * 0.3;
      if (calculatedTop >= fadeDistance) {
        setScrollOpacity(0);
      } else {
        setScrollOpacity(1 - (calculatedTop / fadeDistance));
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 h-20 w-full border-b border-gray-800/10 bg-white/50 backdrop-blur d:border-gray-100/10 d:bg-gray-900/40 print:hidden ${
          scrollOpacity > 0 ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          top: navTop !== null ? `${navTop}px` : undefined,
          opacity: scrollOpacity,
          visibility: scrollOpacity === 0 ? 'hidden' : 'visible'
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl grid-cols-[210px_1fr_210px] items-center gap-1 px-4 md:grid md:gap-4 md:px-8">
          <Link
            href="/"
            className="z-10 w-min"
            data-tip={"Hi, I'm Aryan. Welcome to my site."}
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
