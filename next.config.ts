import type { NextConfig } from "next";

// Ensure Turbopack uses this folder as the root to avoid lockfile mis-detection
// and internal module resolution errors.
// See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
