const { siteUrl } = require("./site.config");

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
};

module.exports = config;
