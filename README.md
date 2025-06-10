# Staatslogica

A Next.js website for displaying critical analyses and philosophical perspectives on current events, inspired by great thinkers throughout history.

## Overview

Staatslogica is a static content website that presents articles analyzing current events from various philosophical perspectives. The site features:

- **Article Display**: Browse articles with rich metadata, images, and categorization
- **Thinker Profiles**: Learn about influential philosophers and thinkers
- **Tag-based Navigation**: Explore content by topics and themes
- **Archive**: Browse historical content chronologically

## Current Features

### Content Management
- **Static MDX Articles**: Articles stored as MDX files in `content/articles/`
- **Thinker Profiles**: Detailed profiles in `content/thinkers/` with biographical information
- **Rich Metadata**: Articles include dates, tags, thinker associations, and featured images
- **Image Integration**: Support for article images via Unsplash and local assets

### User Experience
- **Featured Article**: Homepage highlights the latest article with full-width display
- **Article Grid**: Clean grid layout for browsing recent articles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **SEO Optimized**: Proper metadata and static generation for search engines

### Navigation & Discovery
- **Tag Pages**: Browse articles by specific topics (`/tags/[tag]`)
- **Thinker Pages**: Dedicated pages for each philosopher (`/denkers/[slug]`)
- **Archive Page**: Chronological listing of all articles (`/archive`)
- **About Page**: Information about the site and its mission

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Content**: MDX files with gray-matter for frontmatter parsing
- **Styling**: Tailwind CSS with typography plugin
- **Images**: Next.js Image optimization with Unsplash integration
- **Deployment**: Netlify with static site generation

## Project Structure

```
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Homepage with featured article and grid
│   ├── articles/[slug]/    # Individual article pages
│   ├── denkers/[slug]/     # Thinker profile pages
│   ├── tags/[tag]/         # Tag-based article listings
│   ├── archive/            # Archive page
│   └── about/              # About page
├── components/             # Reusable React components
├── content/               # Static content files
│   ├── articles/          # MDX article files
│   ├── thinkers/          # Thinker profile data
│   └── pages/             # Static page content
├── lib/                   # Utility functions and data fetching
│   ├── articles.ts        # Article parsing and retrieval
│   ├── thinkers.ts        # Thinker data management
│   ├── tags.ts            # Tag extraction and organization
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Content Structure

### Articles
Articles are stored as MDX files with YAML frontmatter:

```yaml
---
title: "Article Title"
date: "2025-01-15"
slug: "article-slug"
tags: ["politics", "economics"]
thinkers: ["ayn-rand", "ludwig-von-mises"]
spin: "Brief description of the article's perspective"
imageUrl: "https://images.unsplash.com/photo-id"
---

Article content in MDX format...
```

### Thinkers
Thinker profiles include biographical information, key ideas, and associated quotes.

## Setup and Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd staatslogica
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Building and Deployment

The site is configured for static export and deployment on Netlify:

```bash
npm run build
```

This generates a static site in the `out` directory, which is automatically deployed via Netlify's Git integration.

## Content Management

### Adding Articles
1. Create a new MDX file in `content/articles/`
2. Include proper frontmatter with required fields
3. Write content using MDX syntax
4. The article will automatically appear on the site

### Adding Thinkers
1. Add thinker data to the appropriate data structure in `lib/thinkers.ts`
2. Include biographical information, key ideas, and quotes
3. Ensure the slug matches references in article frontmatter

### Image Management
- Use tested Unsplash URLs for article images
- Store local images in `public/images/`
- Follow the image guidelines in `.cursorrules.md` for best practices

## Development Guidelines

- Use TypeScript for type safety
- Follow the existing code patterns and structure
- Test image URLs before adding them to articles
- Maintain consistent metadata across articles
- Use semantic HTML and proper accessibility attributes

## Deployment

The site is deployed on Netlify with the following configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Framework**: Next.js with static export

Static generation ensures fast loading times and excellent SEO performance.
