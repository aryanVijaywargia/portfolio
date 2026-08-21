import Link from "next/link";
import { FC, ReactNode } from "react";
import { SOCIAL_ACCOUNTS } from "content/social-accounts";
import { V2_FOOTER } from "content/v2";

/** `note` replaces the default byline; the 404 uses it to word its own. */
export const V2Footer: FC<{ note?: ReactNode }> = ({ note }) => (
  <footer className="border-t border-[rgb(var(--v2-line))]">
    <div className="mx-auto flex max-w-[var(--v2-max-w)] flex-col gap-4 px-[var(--v2-gutter)] py-7 font-[family-name:var(--v2-font-mono)] text-[10.5px] tracking-[0.08em] text-[rgb(var(--v2-fg-4))] v2sm:flex-row v2sm:items-center v2sm:justify-between">
      <span>
        {note ?? (
          <>
            {V2_FOOTER.note}{" "}
            <Link href={V2_FOOTER.llmsHref}>
              <a className="text-[rgb(var(--v2-fg-3))]">llms.txt</a>
            </Link>
          </>
        )}{" "}
        · © {new Date().getFullYear()} Aryan Vijaywargia
      </span>
      <span className="flex flex-wrap gap-x-[18px] gap-y-2">
        {Object.values(SOCIAL_ACCOUNTS).map(({ name, href }) => (
          <a key={name} href={href} target="_blank" rel="noreferrer">
            {name.toLowerCase()}
          </a>
        ))}
      </span>
    </div>
  </footer>
);
