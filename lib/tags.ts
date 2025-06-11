import type { TagData } from './types'; // Import types
import { generateSlug } from './utils'; // Import utility
import { getAllArticles } from './articles'; // Import article function
import type { Article } from './types';

// Cache for tags to avoid recalculation
let tagsCache: { name: string; slug: string; count: number }[] | null = null;
let tagsCacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute cache duration

/**
 * Retrieves all unique tags from articles.
 */
export function getAllTags(): TagData[] {
  const now = Date.now();
  
  // Return cached tags if cache is still valid
  if (tagsCache && (now - tagsCacheTimestamp) < CACHE_DURATION) {
    return tagsCache;
  }

  const articles = getAllArticles();
  const allTags = new Map<string, TagData>();

  articles.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tagName => {
        const slug = generateSlug(tagName); // Reuse the existing slug function
        if (slug && !allTags.has(slug)) { // Ensure slug is generated and not empty
          allTags.set(slug, { name: tagName, slug: slug });
        }
      });
    }
  });

  // Convert to array and sort alphabetically
  const tags = Array.from(allTags.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Update cache
  tagsCache = tags;
  tagsCacheTimestamp = now;

  return tags;
}

/**
 * Filters articles by tag slug.
 */
export function getArticlesByTag(tagSlug: string): ReturnType<typeof getAllArticles> {
  const allArticles = getAllArticles();
  return allArticles.filter(article => 
    Array.isArray(article.tags) && 
    article.tags.some(tagName => generateSlug(tagName) === tagSlug)
  );
} 