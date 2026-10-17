import { NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { ErrorPageLayout } from "components/v2/not-found-v2";

type ErrorProps = { statusCode?: number };

export const Error: NextPage<ErrorProps> & { hasOwnChrome?: boolean } = ({ statusCode = 500 }) => (
  <>
    <NextSeo title={`${statusCode} | Something went wrong`} noindex nofollow />
    <ErrorPageLayout>
      <section className="mx-auto w-full max-w-[var(--v2-max-w)] flex-1 px-[var(--v2-gutter)] py-16">
        <p className="mb-4 font-[family-name:var(--v2-font-mono)] text-sm text-[rgb(var(--v2-accent))]">
          Status {statusCode}
        </p>
        <h1 className="mb-3 font-[family-name:var(--v2-font-display)] text-3xl font-bold tracking-tight text-[rgb(var(--v2-fg))]">
          Something went wrong.
        </h1>
        <p className="mb-6 text-[15px] leading-relaxed text-[rgb(var(--v2-fg-3))]">
          Sorry, this page hit a snag. Try again, or head back home.
        </p>
        <Link href="/">
          <a className="inline-flex min-h-[46px] items-center rounded-[var(--v2-radius-sm)] bg-[rgb(var(--v2-btn-bg))] px-5 text-sm font-medium text-[rgb(var(--v2-btn-fg))] [background-image:var(--v2-btn-image)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--v2-accent))]">
            Back to home
          </a>
        </Link>
      </section>
    </ErrorPageLayout>
  </>
);

Error.hasOwnChrome = true;

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
