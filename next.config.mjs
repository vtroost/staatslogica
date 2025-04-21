// Remove type import - not needed in .mjs
// import type { NextConfig } from "next";

// Remove type annotation
const nextConfig = {
  // Remove static export configuration to enable API routes
  // output: 'export',
  // trailingSlash: true, // Likely not needed without static export

  // Keep images config if still using next/image, otherwise remove
  // images: {
  //   unoptimized: true,
  // }

  /* other config options can go here */
};

// Keep standard ES Module export
export default nextConfig;
