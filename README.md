# Staatslogica

A Next.js website for displaying critical analyses and philosophical perspectives on current events, inspired by great thinkers throughout history.

## Overview

Staatslogica is a modern Next.js website that presents articles analyzing current events from various philosophical perspectives. The site features:

- **Article Display**: Browse articles with rich metadata, images, and categorization
- **Thinker Profiles**: Learn about influential philosophers and thinkers
- **Tag-based Navigation**: Explore content by topics and themes
- **Archive**: Browse historical content chronologically
- **SEO Optimization**: Dynamic sitemap generation and comprehensive metadata

## Current Features

### Content Management
- **Static MDX Articles**: Articles stored as MDX files in `content/articles/`
- **Thinker Profiles**: Detailed profiles in `content/thinkers/` with biographical information
- **Rich Metadata**: Articles include dates, tags, thinker associations, and featured images
- **Image Integration**: Support for article images via Unsplash and local assets
- **Decap CMS Integration**: Content management system for easy article creation and editing

### User Experience
- **Featured Article**: Homepage highlights the latest article with full-width display
- **Article Grid**: Clean grid layout for browsing recent articles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Interactive Navigation**: Smooth transitions and hover effects
- **Social Sharing**: Built-in sharing buttons for Twitter and WhatsApp

### SEO & Technical Features
- **Dynamic Sitemap**: Automatically generated sitemap at `/sitemap.xml` with all pages
- **Structured Data**: JSON-LD markup for articles and organization information
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Robots.txt**: Proper search engine crawling directives
- **Performance**: Optimized images and static generation for fast loading

### Navigation & Discovery
- **Tag Pages**: Browse articles by specific topics (`/tags/[tag]`)
- **Thinker Pages**: Dedicated pages for each philosopher (`/denkers/[slug]`)
- **Archive Page**: Chronological listing of all articles (`/archive`)
- **About Page**: Information about the site and its mission
- **Search Engine Friendly**: All pages indexed with proper metadata

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Content**: MDX files with gray-matter for frontmatter parsing
- **Styling**: Tailwind CSS with typography plugin
- **Images**: Next.js Image optimization with Unsplash integration
- **CMS**: Decap CMS (formerly Netlify CMS) for content management
- **Deployment**: Netlify with server-side rendering support
- **SEO**: Dynamic sitemap generation and structured data

## Project Structure

```
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Homepage with featured article and grid
│   ├── articles/[slug]/    # Individual article pages
│   ├── denkers/[slug]/     # Thinker profile pages
│   ├── tags/[tag]/         # Tag-based article listings
│   ├── archive/            # Archive page
│   ├── about/              # About page
│   └── sitemap.ts          # Dynamic sitemap generation
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
├── public/                # Static assets
│   ├── robots.txt         # Search engine directives
│   └── cms/               # Decap CMS configuration
└── netlify.toml           # Netlify deployment configuration
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
sourceUrl: "https://example.com/original-article"
sourceTitle: "Original Source Title"
---

Article content in MDX format...
```

### Thinkers
Thinker profiles include biographical information, key ideas, and associated quotes, stored as Markdown files with frontmatter.

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

The site is configured for Next.js deployment with server-side features:

```bash
npm run build
npm start
```

### Netlify Deployment
The site is deployed on Netlify with the following configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Framework**: Next.js with @netlify/plugin-nextjs
- **Features**: Server-side rendering, dynamic sitemap, and API routes

## SEO Features

### Dynamic Sitemap
- **Automatic Generation**: Sitemap updates automatically when content changes
- **Comprehensive Coverage**: Includes all articles, thinker pages, tag pages, and static pages
- **Google Search Console**: Successfully indexed with 63+ pages discovered
- **SEO Best Practices**: Proper priorities, change frequencies, and last modified dates

### Structured Data
- **Article Schema**: Rich snippets for articles with author, date, and organization info
- **Organization Schema**: Proper site identification for search engines
- **Open Graph**: Complete social media sharing optimization

## Content Management

### Adding Articles via Decap CMS
1. Visit `/admin` on the live site
2. Authenticate with your Git provider
3. Create new articles with the visual editor
4. Articles are automatically committed to the repository

### Adding Articles Manually
1. Create a new MDX file in `content/articles/`
2. Include proper frontmatter with required fields
3. Write content using MDX syntax
4. The article will automatically appear on the site and in the sitemap

### Adding Thinkers
1. Create a new Markdown file in `content/thinkers/`
2. Include biographical information and metadata
3. Reference the thinker slug in article frontmatter
4. The thinker page will be automatically generated and included in the sitemap

### Image Management
- Use tested Unsplash URLs for article images
- Store local images in `public/images/uploads/`
- Images are automatically optimized by Next.js
- Thinker portraits should be placed in `public/uploads/[slug].png`

## Development Guidelines

- Use TypeScript for type safety
- Follow the existing code patterns and structure
- Test image URLs before adding them to articles
- Maintain consistent metadata across articles
- Use semantic HTML and proper accessibility attributes
- Ensure all new pages are included in sitemap generation

## Recent Updates

### Technical Improvements (June 2025)
- ✅ **Fixed sitemap generation** - Dynamic sitemap now works correctly in production
- ✅ **Resolved build issues** - TypeScript compilation errors fixed
- ✅ **Google Search Console integration** - 63 pages successfully indexed
- ✅ **Enhanced SEO** - Improved robots.txt and structured data
- ✅ **Netlify optimization** - Proper Next.js plugin configuration

### Performance & SEO
- **Fast loading times** with Next.js optimization
- **Complete search engine coverage** via dynamic sitemap
- **Social media ready** with Open Graph and Twitter Cards
- **Mobile optimized** responsive design

## Deployment Status

- **✅ Production**: Deployed on Netlify with full Next.js support
- **✅ Sitemap**: Working at https://staatslogica.nl/sitemap.xml
- **✅ Google Search Console**: Successfully indexed
- **✅ CMS**: Decap CMS available at /admin
- **✅ Performance**: Optimized for speed and SEO
