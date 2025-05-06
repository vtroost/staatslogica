import type { TagData } from './types'; // Import types
import { generateSlug } from './utils'; // Import utility
import { getAllArticles } from './articles'; // Import article function

/**
 * Retrieves all unique tags from articles.
 */
export function getAllTags(): TagData[] {
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

  return Array.from(allTags.values()).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
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