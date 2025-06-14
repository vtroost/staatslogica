import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleFrontmatter } from './types'; // Import types

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

// Cache for articles to avoid re-reading files
let articlesCache: Article[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute in production, shorter for development

// Function to clear cache (useful for development)
export function clearArticlesCache() {
  articlesCache = null;
  cacheTimestamp = 0;
}

/**
 * Reads all .mdx files from the articles directory, parses their frontmatter,
 * and returns an array of article objects with caching for performance.
 */
export function getAllArticles(): Article[] {
  const now = Date.now();
  
  // Return cached articles if cache is still valid
  if (articlesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return articlesCache;
  }

  let files: string[] = [];
  try {
    // Check if the directory exists before reading
    if (fs.existsSync(articlesDirectory)) {
        files = fs.readdirSync(articlesDirectory).filter(file => file.endsWith('.mdx'));
    } else {
        console.warn(`Articles directory not found: ${articlesDirectory}`);
        return []; // Return empty array if directory doesn't exist
    }
  } catch (error) {
      console.error(`Error reading articles directory: ${articlesDirectory}`, error);
      return []; // Return empty array on error
  }

  const articles = files.map(filename => {
    const filePath = path.join(articlesDirectory, filename);
    const slug = filename.replace(/\.mdx$/, '');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        // Use gray-matter to parse the post metadata section
        const { data } = matter(fileContents);

        // Type assertion for safety, assuming data conforms to ArticleFrontmatter
        const frontmatter = data as ArticleFrontmatter;

        // Validate required fields (optional but recommended)
        if (!frontmatter.title || !frontmatter.date) {
            console.warn(`Article ${filename} is missing required frontmatter (title or date). Skipping.`);
            // Return a minimal object or filter it out later
            return { slug, title: 'Untitled', date: 'Unknown Date' } as Article; 
        }

        return {
          slug,
          ...frontmatter, // Spread the parsed frontmatter data
        };
    } catch (error) {
        console.error(`Error reading or parsing article file: ${filePath}`, error);
        // Return a placeholder or skip this file
        return { slug, title: 'Error Loading Article', date: 'Unknown Date' } as Article;
    }
  }).filter(article => {
    // Filter out articles with errors/missing data
    if (article.title === 'Error Loading Article' || article.title === 'Untitled') {
      return false;
    }
    // Filter out unpublished articles (published: false)
    // Articles without published field or with published: true are included
    return article.published !== false;
  });

  // Update cache
  articlesCache = articles;
  cacheTimestamp = now;

  return articles;
}

/**
 * Reads a single MDX article file by slug, parses its frontmatter and content.
 * 
 * @param slug The slug of the article (filename without .mdx)
 * @returns An object containing the parsed frontmatter (data) and content, or null if not found/error.
 */
export function getArticleBySlug(slug: string): { data: ArticleFrontmatter, content: string } | null {
    const filePath = path.join(articlesDirectory, `${slug}.mdx`);
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Article file not found: ${filePath}`);
            return null;
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Type assertion
        let frontmatter = data as Partial<ArticleFrontmatter>; // Use Partial initially

        // Basic validation and setting defaults
        if (!frontmatter.title || !frontmatter.date) {
             console.warn(`Article ${slug}.mdx is missing required frontmatter (title or date). Setting defaults.`);
             // Spread first, then set defaults if needed
             frontmatter = {
                ...frontmatter,
                title: frontmatter.title || 'Untitled', 
                date: frontmatter.date || 'Unknown Date'
             };
        }

        // Now we can assert the full type as defaults are set
        return { data: frontmatter as ArticleFrontmatter, content };

    } catch (error) {
        console.error(`Error reading or parsing article file: ${filePath}`, error);
        return null;
    }
} 