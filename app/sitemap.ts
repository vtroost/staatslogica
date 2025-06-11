import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllThinkers } from '@/lib/thinkers'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://staatslogica.nl'
  
  try {
    // Get all articles
    const articles = getAllArticles()
    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Get all thinkers
    const thinkers = getAllThinkers()
    const thinkerEntries: MetadataRoute.Sitemap = thinkers.map((thinker) => ({
      url: `${baseUrl}/denkers/${thinker.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }))

    // Get all unique tags
    const allTags = new Set<string>()
    articles.forEach((article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => allTags.add(tag))
      }
    })
    
    const tagEntries: MetadataRoute.Sitemap = Array.from(allTags).map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categorieen`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/onderwerpen`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/denkers`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/disclaimer`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]

    return [...staticPages, ...articleEntries, ...thinkerEntries, ...tagEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least the static pages if dynamic content fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/denkers`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/disclaimer`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]
  }
} 