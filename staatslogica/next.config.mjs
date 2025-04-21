// Remove type import - not needed in .mjs
// import type { NextConfig } from "next";

// Remove type annotation
const nextConfig = {
  // Configure static export for Netlify compatibility
  output: 'export',
  // Optional: Ensure trailing slashes for static paths (often helpful)
  trailingSlash: true,

  // Ensure images configured for static export if using next/image
  images: {
    unoptimized: true, // Required for static export with next/image
  }

  /* other config options can go here */
};

// Keep standard ES Module export
export default nextConfig;
