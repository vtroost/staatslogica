import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ThinkerData, Article } from './types'; // Import types
import { generateSlug } from './utils'; // Import utility
import { getAllArticles } from './articles'; // Import article functions

const thinkersContentDirectory = path.join(process.cwd(), 'content', 'thinkers');

// Interface matching the FRONTMATTER of thinker MD files now
interface ThinkerFrontmatter {
  slug?: string; // Can be derived from filename if not present
  name: string;
  title?: string; // e.g., Ludwig von Mises (1881–1973)
  works?: string[];
  quote?: string;
}

/**
 * Reads a single thinker's MD file and returns its parsed frontmatter and content.
 */
function readThinkerFile(filePath: string): { frontmatter: ThinkerFrontmatter, content: string, slug: string } | null {
  try {
    const filename = path.basename(filePath);
    const slug = filename.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as ThinkerFrontmatter;

    // Basic validation
    if (!frontmatter.name) {
      console.warn(`Thinker file ${filename} is missing required frontmatter field: name. Skipping.`);
      return null;
    }
    
    // Use slug from frontmatter if present, otherwise from filename
    const finalSlug = frontmatter.slug || slug;

    return { frontmatter: { ...frontmatter, slug: finalSlug }, content, slug: finalSlug };

  } catch (error) {
    console.error(`Error reading or parsing thinker file: ${filePath}`, error);
    return null;
  }
}

/**
 * Reads all thinker MD files from the content/thinkers directory.
 */
function getAllThinkerFileData(): ({ frontmatter: ThinkerFrontmatter, content: string, slug: string })[] {
  let files: string[] = [];
  try {
    if (fs.existsSync(thinkersContentDirectory)) {
      files = fs.readdirSync(thinkersContentDirectory).filter(file => file.endsWith('.md'));
    } else {
      console.warn(`Thinkers content directory not found: ${thinkersContentDirectory}`);
      return [];
    }
  } catch (error) {
    console.error(`Error reading thinkers directory: ${thinkersContentDirectory}`, error);
    return [];
  }

  return files.map(filename => readThinkerFile(path.join(thinkersContentDirectory, filename)))
              .filter((data): data is { frontmatter: ThinkerFrontmatter; content: string; slug: string } => data !== null);
}

/**
 * Retrieves all unique thinkers based on MD files and calculates article counts.
 */
export function getAllThinkers(): ThinkerData[] {
  const allThinkerFiles = getAllThinkerFileData();
  const articles = getAllArticles(); 
  const articleCounts = new Map<string, number>();

  articles.forEach(article => {
    // Now consistently use article.thinkers, which should be an array of slugs
    if (article.thinkers && article.thinkers.length > 0) {
      article.thinkers.forEach(slug => {
        if (slug) { // Ensure slug is not empty or undefined
          articleCounts.set(slug, (articleCounts.get(slug) || 0) + 1);
        }
      });
    }
  });

  const thinkers = allThinkerFiles.map(fileData => {
    const slug = fileData.slug;
    const count = articleCounts.get(slug) || 0;
    return {
      slug: slug,
      name: fileData.frontmatter.name,
      title: fileData.frontmatter.title, // Directly from frontmatter
      works: fileData.frontmatter.works || [], // Directly from frontmatter
      quote: fileData.frontmatter.quote, // Directly from frontmatter
      articleCount: count,
      // bioContent is not included in this summary function for performance
    } as ThinkerData; // Asserting type, excluding bioContent
  });
  
  // Filter out any potential 'unknown' slug from files if it exists
  return thinkers.filter(thinker => thinker.slug !== 'unknown');
}

/**
 * Retrieves thinker details by slug, including bio content.
 */
export function getThinkerBySlug(slug: string): ThinkerData | null {
  const filePath = path.join(thinkersContentDirectory, `${slug}.md`);
  const fileData = readThinkerFile(filePath);

  if (!fileData) {
    return null; // Thinker MD file not found or failed to parse
  }

  const articles = getArticlesByThinker(slug);
  const articleCount = articles.length;

  return {
    slug: fileData.slug,
    name: fileData.frontmatter.name,
    title: fileData.frontmatter.title,
    works: fileData.frontmatter.works || [],
    quote: fileData.frontmatter.quote,
    articleCount: articleCount,
    bioContent: fileData.content, // Include the bio content here
  };
}

/**
 * Filters articles by thinker slug.
 */
export function getArticlesByThinker(thinkerSlugToFilter: string): Article[] {
  const allArticles = getAllArticles(); 
  return allArticles.filter(article => {
    // Now consistently use article.thinkers
    return article.thinkers ? article.thinkers.includes(thinkerSlugToFilter) : false;
  });
} 