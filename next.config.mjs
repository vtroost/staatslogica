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

// Remove type annotation
const nextConfig = {
  // Remove static export configuration to enable API routes
  // output: 'export',
  // trailingSlash: true, // Likely not needed without static export

  // Keep images config if still using next/image, otherwise remove
  // images: {
  //   unoptimized: true,
  // }

  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'], // Add md/mdx extensions

  /* other config options can go here */
};

// Combine the MDX config with your existing Next.js config
export default withMDX(nextConfig);
