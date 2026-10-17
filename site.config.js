// Shared by Next.js and next-sitemap. SITE_URL is the build-time public origin.
module.exports = {
  siteUrl: (process.env.SITE_URL || "https://aryanvijaywargia.com").replace(/\/+$/, ""),
};
