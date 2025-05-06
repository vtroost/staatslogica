// Remove type import - not needed in .mjs
// import type { NextConfig } from "next";

import nextMDX from '@next/mdx';

// Configure MDX support
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // Optionally add remark/rehype plugins here if needed later
    // remarkPlugins: [],
    // rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Uncomment for static export build
  reactStrictMode: false, // Disable Strict Mode for testing CMS compatibility
  images: {
    unoptimized: true,
  },
  // Explicitly tell Next.js to transpile these packages
  transpilePackages: [
    'decap-cms-lib-util',
    'decap-cms-core'
    // Add other decap-cms packages here if similar errors occur
  ],
  // Remove any API routes or dynamic features
  experimental: {
    // Disable any experimental features
  }
};

// Combine the MDX config with your existing Next.js config
// Temporarily export the config directly without withMDX
// export default withMDX(nextConfig);
// Re-enable withMDX
export default withMDX(nextConfig);
