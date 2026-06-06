const withSerwist = require("@serwist/next").default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/habits", destination: "/app/habits", permanent: true },
      { source: "/timer", destination: "/app/timer", permanent: true },
      { source: "/journal", destination: "/app/journal", permanent: true },
      { source: "/stats", destination: "/app/stats", permanent: true },
      { source: "/settings", destination: "/app/settings", permanent: true },
    ];
  },
};

module.exports = withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  scope: "/",
})(nextConfig);
