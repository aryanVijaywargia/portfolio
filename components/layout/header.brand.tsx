import { FC } from "react";

export const HeaderBrand: FC = () => {
  return (
    <span className="group/brand inline-flex h-11 w-11 items-center justify-center text-slate-800 d:text-slate-100">
      <svg
        aria-hidden="true"
        viewBox="0 0 44 44"
        className="h-10 w-10 overflow-visible transition-transform duration-300 group-hover/brand:-translate-y-0.5"
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
        {/* The crossbar colour comes from a variable so a themed page can repoint
          it; the fallback is the v1 cyan, so the home route is unchanged. */}
        <path
          d="M15.1 25.7h13.8"
          stroke="var(--brand-accent, rgb(6 182 212))"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
