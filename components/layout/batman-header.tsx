import { FC, useEffect, useState } from "react";
import { Link } from "components/link";
import { usePortfolioMode } from "components/_stores/portfolio-mode-context";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";

export const BatmanHeader: FC = () => {
  const { deactivateBatman } = usePortfolioMode();
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 print:hidden"
      style={{
        background: scrolled ? "rgba(4, 23, 22, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--bat-border)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Left: Location + Time */}
        <div className="flex items-center gap-2">
          <span
            className="text-sm tracking-wide"
            style={{
              color: "var(--bat-fg-muted)",
              fontFamily: "var(--bat-sans)",
            }}
          >
            India &middot; {time}
          </span>
        </div>

        {/* Center: Bat Logo / Exit */}
        <button
          onClick={deactivateBatman}
          className="group flex items-center gap-2 transition-all"
          title="Exit Batman Mode"
          aria-label="Exit Batman Mode"
        >
          <svg
            width="28"
            height="14"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,166,146,0.6)]"
          >
            <path
              d="M60 5 C60 5, 45 0, 30 15 C20 25, 5 20, 0 30 C5 28, 15 30, 20 35 C25 40, 30 50, 40 55 C45 55, 50 45, 55 40 C57 37, 58 35, 60 33 C62 35, 63 37, 65 40 C70 45, 75 55, 80 55 C90 50, 95 40, 100 35 C105 30, 115 28, 120 30 C115 20, 100 25, 90 15 C75 0, 60 5, 60 5Z"
              fill="#00a692"
            />
          </svg>
        </button>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="mailto:aryanvijaywargia@gmail.com"
            className="transition-all hover:drop-shadow-[0_0_8px_rgba(0,166,146,0.5)]"
            style={{ color: "var(--bat-fg-muted)" }}
            aria-label="Email"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </Link>
          <Link
            href="https://www.linkedin.com/in/aryan-vijaywargia/"
            target="_blank"
            className="transition-all hover:drop-shadow-[0_0_8px_rgba(0,166,146,0.5)]"
            style={{ color: "var(--bat-fg-muted)" }}
            aria-label="LinkedIn"
          >
            <SiLinkedin className="h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/AryanVijaywargia"
            target="_blank"
            className="transition-all hover:drop-shadow-[0_0_8px_rgba(0,166,146,0.5)]"
            style={{ color: "var(--bat-fg-muted)" }}
            aria-label="GitHub"
          >
            <SiGithub className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
