# Portfolio analytics

Vercel Web Analytics and free Speed Insights run through
`components/_app/site-analytics.tsx`, mounted in `pages/_app.tsx`.

## Setup

1. Open the [portfolio project](https://vercel.com/aryanvijaywargias-projects/portfolio).
2. Open **Analytics** and click **Enable**.
3. Open **Speed Insights** and enable the free tier. Keep Speed Insights Plus off.
4. In **Environment Variables**, enable access to System Environment Variables,
   previously called **Automatically expose System Environment Variables**. Vercel
   supplies `NEXT_PUBLIC_VERCEL_ENV`; no analytics key or manual variable is needed.
5. Deploy to production (merge to main). If you enabled the services after deployment,
   redeploy once.
6. Visit the site and resume page, then view visitors/pages in **Analytics** and
   performance scores in **Speed Insights**. Data needs real visits and processing
   time; content blockers can prevent collection.

## Free limits

Checked 2026-10-16:

- [Hobby Web Analytics](https://vercel.com/docs/analytics/limits-and-pricing):
  50,000 events/month across the team, unlimited projects, one-month reporting.
  Collection pauses at the limit without overage charges. Custom events require
  Pro, so downloads, contact submissions and outbound clicks are not tracked.
- [Free Speed Insights](https://vercel.com/docs/speed-insights/limits-and-pricing):
  10,000 events/rolling 30 days across the team, Real Experience Score, 24-hour and
  7-day views. Individual Core Web Vitals require Plus. At the limit, collection
  pauses for at least 14 days and until rolling usage falls to half the allowance
  or less.

## Next.js 12

Use the SDKs' `/react` imports. Their `/next` imports need `next/navigation`, absent
in Next 12. pnpm warns about the optional Next 13+ peer; the React entry points work
with this site's React 18. The Pages Router supplies route/path values explicitly;
page-view paths omit query strings and hashes.

## Local checks

Collection requires both `NODE_ENV` and `NEXT_PUBLIC_VERCEL_ENV` to be `production`.
Local development, ordinary local builds and Vercel previews load neither tracker.
To exercise collection locally, run `NEXT_PUBLIC_VERCEL_ENV=production pnpm build`,
then `pnpm start`. Mock `/_vercel/insights/script.js` and
`/_vercel/speed-insights/script.js` in browser checks; local Next.js does not serve
Vercel's collection endpoints. Verify real ingestion on the deployed site.
