import { FC } from "react";
import { Link } from "components/link";

const socialLinks = [
  { name: "Github", href: "https://github.com/AryanVijaywargia" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/aryan-vijaywargia/" },
  { name: "DagsHub", href: "https://dagshub.com/aryanVijaywargia" },
];

export const BatmanFooter: FC = () => {
  return (
    <footer className="print:hidden" style={{ borderTop: "1px solid var(--bat-border)" }}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          {/* Left: Info */}
          <div className="space-y-3">
            <p style={{ color: "var(--bat-fg-muted)", fontFamily: "var(--bat-sans)" }}>
              aryanvijaywargia@gmail.com
            </p>
            <p className="text-sm" style={{ color: "var(--bat-fg-dim)" }}>
              &copy; {new Date().getFullYear()} Aryan Vijaywargia
            </p>
            <p className="text-sm" style={{ color: "var(--bat-fg-dim)" }}>
              All rights reserved.
            </p>
          </div>

          {/* Right: Large Social Links */}
          <nav className="space-y-4">
            {socialLinks.map(({ name, href }) => (
              <div key={name}>
                <Link
                  href={href}
                  target="_blank"
                  className="group inline-flex items-center gap-3 transition-all"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 600,
                    color: "var(--bat-fg)",
                    textDecoration: "none",
                  }}
                >
                  {name}
                  <span
                    className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: "var(--bat-primary)" }}
                  >
                    &#8599;
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom rule */}
        <div
          className="mt-16 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--bat-primary), var(--bat-border), transparent)",
          }}
        />
      </div>
    </footer>
  );
};
