import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Minimum time (in seconds) Next.js caches an optimized image before re-validating.
    // 60 * 60 * 24 * 30 = 30 days — good for static assets that rarely change.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/drqqqhudz/**',
      },
    ],
  },

  async headers() {
    return [
      // Static assets (images, fonts, icons, manifests, etc.)
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            // cache for 1 year, stale-while-revalidate for 1 day
            value: "public, max-age=31536000, stale-while-revalidate=86400, immutable",
          },
        ],
      },
      {
        source: "/:file(.*\\.(?:ico|png|webp|svg|jpg|jpeg|woff2?|ttf|otf))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400, immutable",
          },
        ],
      },
      // Next.js optimised image endpoint
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400, immutable",
          },
        ],
      },
      // Static JS/CSS chunks — content-hashed so safe to cache forever
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // HTML pages — short cache, always revalidate in background
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
