import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the expected structure of the article frontmatter
// Adjust this interface based on the actual fields in your MDX files
export interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  thinker?: string;
  quote?: string;
  spin?: string;
  imageUrl?: string;
  sourceUrl?: string;
  // Add any other fields you expect in the frontmatter
}

// Define the structure of the returned article object
export interface Article extends ArticleFrontmatter {
  slug: string;
}

// --- Thinker Data Interface (keeps articleCount for calculation result) ---
export interface ThinkerData {
  slug: string;
  name: string;
  bio?: string;
  works: string[];
  quote?: string;
  articleCount: number;
  bioContent?: string;
}

// --- Load Thinker Data from JSON (contains base info) ---
interface ThinkerJsonData {
    slug: string;
    name: string;
    bio?: string;
    works: string[];
    quote?: string;
}
let thinkersJsonData: Record<string, ThinkerJsonData> = {};
const thinkersFilePath = path.join(process.cwd(), 'content', 'thinkers.json');

try {
  if (fs.existsSync(thinkersFilePath)) {
    const fileContents = fs.readFileSync(thinkersFilePath, 'utf8');
    thinkersJsonData = JSON.parse(fileContents);
  } else {
    console.warn(`Thinker data file not found: ${thinkersFilePath}. No predefined thinkers will be loaded.`);
  }
} catch (error) {
  console.error(`Error reading or parsing thinker data file: ${thinkersFilePath}`, error);
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');
const thinkersContentDirectory = path.join(process.cwd(), 'content', 'thinkers');

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

/**
 * Generates a slug from a thinker's name (e.g., "Ayn Rand" -> "ayn-rand")
 */
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// --- Function to read Markdown bio content ---
function getThinkerBioContent(slug: string): string | null {
  const filePath = path.join(thinkersContentDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(filePath)) {
      return null; // Bio file doesn't exist
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents); // Extract content
    return content;
  } catch (error) {
    console.error(`Error reading thinker bio file: ${filePath}`, error);
    return null;
  }
}

/**
 * Retrieves all unique thinkers mentioned in articles.
 * Merges with base data loaded from thinkers.json.
 * Includes article counts.
 * NOTE: This function does NOT load the markdown bio content for performance.
 */
export function getAllThinkers(): ThinkerData[] {
  const articles = getAllArticles();
  const thinkersFromArticles = new Map<string, ThinkerData>();
  const articleCounts = new Map<string, number>();

  // Count articles per thinker slug
  articles.forEach(article => {
    if (article.thinker) {
      const slug = generateSlug(article.thinker);
      articleCounts.set(slug, (articleCounts.get(slug) || 0) + 1);
    }
  });

  // Use the loaded thinkersJsonData for merging
  const predefinedThinkersByName = new Map<string, ThinkerJsonData>(
    Object.values(thinkersJsonData).map(t => [t.name.toLowerCase(), t])
  );

  // Consolidate thinker data and add counts
  articles.forEach(article => {
    if (article.thinker) {
      const articleThinkerNameLower = article.thinker.toLowerCase();
      const generatedSlug = generateSlug(article.thinker);

      const predefinedDataByName = predefinedThinkersByName.get(articleThinkerNameLower);
      const predefinedDataBySlug = thinkersJsonData[generatedSlug]; // Use JSON data

      const finalDataTemplate = predefinedDataByName || predefinedDataBySlug;
      let thinkerSlugToUse: string;
      let thinkerBaseData: ThinkerJsonData; // Base data from JSON or minimal

      if (finalDataTemplate) {
        thinkerSlugToUse = finalDataTemplate.slug;
        thinkerBaseData = { ...finalDataTemplate }; 
      } else {
        thinkerSlugToUse = generatedSlug;
        thinkerBaseData = {
          slug: thinkerSlugToUse,
          name: article.thinker,
          // No bio, works, quote for purely article-derived thinkers here
          works: [], 
        };
      }
      
      if (!thinkersFromArticles.has(thinkerSlugToUse)) {
          const count = articleCounts.get(generatedSlug) || 0; 
          thinkersFromArticles.set(thinkerSlugToUse, {
              ...thinkerBaseData,
              articleCount: count 
              // bioContent is NOT loaded here
          });
      } else {
           const existingThinker = thinkersFromArticles.get(thinkerSlugToUse);
           if (existingThinker && generatedSlug !== thinkerSlugToUse) {
               const countFromThisVariation = articleCounts.get(generatedSlug) || 0;
               existingThinker.articleCount += countFromThisVariation;
           }
      }
    }
  });

  // Add predefined thinkers from loaded JSON data who might not have articles yet
  Object.values(thinkersJsonData).forEach(thinker => {
    if (!thinkersFromArticles.has(thinker.slug)) {
        thinkersFromArticles.set(thinker.slug, { ...thinker, articleCount: 0 });
    }
  });

  // Filter out 'Unknown Thinker' and return
  const finalThinkers = Array.from(thinkersFromArticles.values())
                         .filter(thinker => thinker.slug !== 'unknown');

  return finalThinkers;
}

/**
 * Retrieves thinker details by slug, using loaded JSON data and reading bio markdown.
 */
export function getThinkerBySlug(slug: string): ThinkerData | null {
  // Try loaded predefined JSON data first
  const baseData = thinkersJsonData[slug];
  
  if (baseData) {
    // Found base data, now try to get bio content and article count
    const bioContent = getThinkerBioContent(slug);
    const articles = getArticlesByThinker(slug);
    return {
       ...baseData, 
       articleCount: articles.length, 
       bioContent: bioContent || undefined // Assign content or undefined
    };
  }

  // Fallback: Try finding via articles (less ideal, may lack full JSON data)
  // This part might become less relevant if thinkers.json is comprehensive
  const articles = getAllArticles();
  const foundArticle = articles.find(article => article.thinker && generateSlug(article.thinker) === slug);

  if (foundArticle && foundArticle.thinker) {
    const articlesForThisThinker = getArticlesByThinker(slug);
    const bioContent = getThinkerBioContent(slug); // Also attempt to get bio here
    return {
        slug: slug,
        name: foundArticle.thinker,
        works: [], // No works info from articles
        bio: undefined, // No short bio from articles
        quote: undefined, // No quote info from articles
        articleCount: articlesForThisThinker.length,
        bioContent: bioContent || undefined
    };
  }

  return null; // Not found
}

/**
 * Filters articles by thinker slug.
 */
export function getArticlesByThinker(thinkerSlug: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article =>
    article.thinker && generateSlug(article.thinker) === thinkerSlug
  );
}

/**
 * Retrieves all unique tags from articles.
 */
export interface TagData {
  name: string;
  slug: string;
}

export function getAllTags(): TagData[] {
  const articles = getAllArticles();
  const allTags = new Map<string, TagData>();

  articles.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tagName => {
        const slug = generateSlug(tagName); // Reuse the existing slug function
        if (!allTags.has(slug)) {
          allTags.set(slug, { name: tagName, slug: slug });
        }
      });
    }
  });

  return Array.from(allTags.values()).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
}

// Optional: Add a function to get articles by tag slug if needed elsewhere
/**
 * Filters articles by tag slug.
 */
export function getArticlesByTag(tagSlug: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => 
    Array.isArray(article.tags) && 
    article.tags.some(tagName => generateSlug(tagName) === tagSlug)
  );
} 