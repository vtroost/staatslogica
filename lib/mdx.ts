import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the expected structure of the article frontmatter
// Adjust this interface based on the actual fields in your MDX files
interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  thinker?: string;
  quote?: string;
  spin?: string;
  // Add any other fields you expect in the frontmatter
}

// Define the structure of the returned article object
interface Article extends ArticleFrontmatter {
  slug: string;
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

/**
 * Reads all .mdx files from the articles directory, parses their frontmatter,
 * and returns an array of article objects.
 */
export function getAllArticles(): Article[] {
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

  return files.map(filename => {
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
  }).filter(article => article.title !== 'Error Loading Article' && article.title !== 'Untitled'); // Filter out articles with errors/missing data
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