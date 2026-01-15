/**
 * @type {import('next').NextConfig}
 */

module.exports = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "assets.vercel.com",
      "avatars1.githubusercontent.com",
      "avatars.githubusercontent.com",
      "cdn.shopify.com",
      "burst.shopifycdn.com",
      "images.unsplash.com",
      "pbs.twimg.com",
      "images-na.ssl-images-amazon.com",
      "m.media-amazon.com",
      "via.placeholder.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        tls: false,
        net: false,
        http: false,
        https: false,
        cardinal: false,
      };
    }

    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test(".svg"));
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }
    config.module.rules.push({
      test: /\.svg$/,
      loader: require.resolve("@svgr/webpack"),
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: require("./package.json").version,
  },
};