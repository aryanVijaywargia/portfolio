import { FC } from "react";

export const BatmanFooter: FC = () => {
  return (
    <footer className="print:hidden" style={{ borderTop: "1px solid var(--bat-border)" }}>
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-sm"
            style={{ color: "var(--bat-fg-muted)", fontFamily: "var(--bat-sans)" }}
          >
            aryanvijaywargia@gmail.com
          </p>
          <p className="text-sm" style={{ color: "var(--bat-fg-dim)" }}>
            &copy; {new Date().getFullYear()} Aryan Vijaywargia. All rights reserved.
          </p>
        </div>

        <div
          className="mt-8 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--bat-primary), var(--bat-border), transparent)",
          }}
        />
      </div>
    </footer>
  );
};
