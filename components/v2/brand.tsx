import { FC } from "react";

/** The "A" monogram, drawn with the v2 accent on the crossbar. */
export const V2Brand: FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 44 44"
    className={`${className} overflow-visible transition-transform duration-300 group-hover/brand:-translate-y-0.5`}
    fill="none"
  >
    <path
      d="M6.5 34.5 20.4 8.8c.7-1.3 2.5-1.3 3.2 0l13.9 25.7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m12.2 18.6 8.2 15c.7 1.3 2.5 1.3 3.2 0l8.2-15"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.1 25.7h13.8"
      stroke="rgb(var(--v2-accent))"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);
