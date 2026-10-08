module.exports = {
  // Keep in sync with domainName in config.ts
  siteUrl: process.env.SITE_URL || "https://memory-game-sepia-chi.vercel.app",
  generateRobotsTxt: true,
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: ["/twitter-image.*", "/opengraph-image.*", "/icon.*", "/apple-icon.*", "/dashboard"],
};
