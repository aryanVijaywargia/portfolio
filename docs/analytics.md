# Portfolio analytics

The site uses Vercel Web Analytics for page views and visitors, and Vercel Speed
Insights for real visitor performance scores. Both mount once in `pages/_app.tsx`.
The old inline Umami tracker has been removed from `pages/_document.tsx`.

## Enable collection

1. Open the [portfolio project](https://vercel.com/aryanvijaywargias-projects/portfolio).
2. Open **Analytics**, then click **Enable**.
3. Open **Speed Insights**, then enable the free tier. Keep Speed Insights Plus off.
4. In the project's **Environment Variables** settings, enable access to System
   Environment Variables. Older dashboards call this **Automatically expose
   System Environment Variables**. Vercel supplies `NEXT_PUBLIC_VERCEL_ENV` for
   Next.js builds; do not set it manually in local or preview environments.
5. Have the coordinator merge the PR after review and a passing Vercel check.
   If the dashboard features were enabled after that deployment, redeploy once.
6. Visit the production site, then follow its resume link. Browser developer tools
   should show successful requests to Vercel's analytics and performance endpoints.
   Content blockers can prevent collection.
7. View visitors, pages and referrers in **Analytics**, and performance scores in
   **Speed Insights**. Performance data needs real visits and may take time to appear.

No analytics API key or manually configured environment variable is needed.
Dashboard enablement and real ingestion have to be checked in the owner's account.
See the [Web Analytics setup](https://vercel.com/docs/analytics/quickstart),
[Speed Insights setup](https://vercel.com/docs/speed-insights/quickstart), and
[framework environment variables](https://vercel.com/docs/environment-variables/framework-environment-variables).

## Free limits

Checked on 2026-10-16. Hobby Web Analytics includes 50,000 events per month across
the team, unlimited projects, and a one-month reporting window. Collection pauses
at the allowance rather than charging overages. Custom events require Pro, so this
integration does not track contact submissions, downloads, or outbound clicks.
Resume page visits appear in ordinary page views. See
[Web Analytics pricing](https://vercel.com/docs/analytics/limits-and-pricing).

Free Speed Insights includes 10,000 events across the team in a rolling 30-day
window. It shows Real Experience Score with 24-hour and 7-day views. Individual
Core Web Vitals and detailed breakdowns require Plus. At the free limit, collection
pauses for at least 14 days and until rolling usage falls sufficiently; the site
continues to run. See
[Speed Insights pricing](https://vercel.com/docs/speed-insights/limits-and-pricing).

## Next.js 12 and local development

Use the SDKs' `/react` imports. Their `/next` imports depend on `next/navigation`,
which Next.js 12 does not provide. The packages declare an optional Next.js 13+
peer and pnpm warns about it; the React entry points only import React and work
with this site's React 18. No framework upgrade is needed for this integration.

The Pages Router supplies `route` and `path` explicitly. The SDK queues one page
view on the initial page and on client navigation, with automatic tracking disabled
to avoid duplicates. Hashes and query strings are excluded from the supplied path.
Speed Insights receives the current route, and both SDKs receive Vercel's optional
build configuration for its collection endpoints.

Collection mounts only when `NODE_ENV` and `NEXT_PUBLIC_VERCEL_ENV` are both
`production`, after the router is ready. Local development, ordinary local builds,
and Vercel previews load neither tracking script. To exercise the enabled branch
locally, build with `NEXT_PUBLIC_VERCEL_ENV=production pnpm build` and run
`pnpm start`. Mock `/_vercel/insights/script.js` and
`/_vercel/speed-insights/script.js` in browser tests because local Next.js does not
serve Vercel's ingestion routes.

Vercel collects anonymous aggregate data without analytics cookies. This change
adds no consent banner or user identifiers, and never sends form contents or chat
messages as custom events. See [analytics privacy](https://vercel.com/docs/analytics/privacy-policy)
and [performance privacy](https://vercel.com/docs/speed-insights/privacy-policy).
