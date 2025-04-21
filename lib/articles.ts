import fs from 'fs';
import path from 'path';

// Define the structure of an article based on the JSON
// This should match the structure in your JSON files
export interface Article {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thinker: string;
  image?: { // Make image optional
    url: string;
    alt: string;
  };
  spin: string;
  libertarianAnalysis: string;
  anarchistAnalysis: string;
  quote: string;
}

const articlesPath = path.join(process.cwd(), 'content/articles');

export function getAllArticleSlugs(): string[] {
  try {
    const filenames = fs.readdirSync(articlesPath);
    return filenames
      .filter(filename => filename.endsWith('.json'))
      .map((filename) => filename.replace('.json', ''));
  } catch (error) {
    console.error("Error reading article slugs:", error);
    return []; // Return empty array on error
  }
}

export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(articlesPath, `${slug}.json`);
  try {
    if (!fs.existsSync(fullPath)) {
        console.warn(`Article file not found: ${fullPath}`);
        return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const article: Article = JSON.parse(fileContents);

    // Basic validation (optional but recommended)
    if (!article.slug || !article.title || !article.date) {
        console.warn(`Incomplete data in article file: ${fullPath}`);
        // Decide how to handle incomplete data - return null or partial data?
        return null;
    }

    // Ensure the slug in the file matches the requested slug
    if (article.slug !== slug) {
        console.warn(`Slug mismatch in file ${fullPath}: expected ${slug}, got ${article.slug}`);
        // You might want to return null here or proceed cautiously
    }

    return article;
  } catch (error) {
    console.error(`Error reading or parsing article file ${fullPath}:`, error);
    return null; // Return null on error
  }
}

export function getAllArticles(): Article[] {
    const slugs = getAllArticleSlugs();
    const articles = slugs
        .map(slug => getArticleBySlug(slug))
        .filter((article): article is Article => article !== null) // Filter out nulls and type guard
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
    return articles;
} 