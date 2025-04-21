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

// --- Thinker Data (Placeholder) ---
// Ideally, this data would come from a separate source (CMS, JSON files, etc.)
// For now, we define it here. The key is the 'slug'.
export interface ThinkerData {
  slug: string;
  name: string;
  bio: string;
  works: string[];
  quote?: string;
}

const thinkersData: Record<string, ThinkerData> = {
  'ayn-rand': {
    slug: 'ayn-rand',
    name: 'Ayn Rand',
    bio: 'Ayn Rand was a Russian-American writer and philosopher known for her philosophy of Objectivism. She advocated reason as the only means of acquiring knowledge and rejected faith and religion. Her political philosophy emphasized laissez-faire capitalism based on individual rights.',
    works: ['Atlas Shrugged', 'The Fountainhead'],
    quote: "The question isn't who is going to let me; it's who is going to stop me."
  },
  'murray-rothbard': {
    slug: 'murray-rothbard',
    name: 'Murray Rothbard',
    bio: 'Murray Rothbard was an American economist of the Austrian School, a historian, and a political theorist. A central figure in the 20th-century American libertarian movement, he synthesized Austrian economics with classical liberalism and anarcho-capitalism.',
    works: ['Man, Economy, and State', 'For a New Liberty'],
    quote: "It is easy to be conspicuously 'compassionate' if others are being forced to pay the cost."
  },
  'ludwig-von-mises': {
    slug: 'ludwig-von-mises',
    name: 'Ludwig von Mises',
    bio: 'Ludwig von Mises was een leidende figuur in de Oostenrijkse School van economie en een fervent voorstander van economisch liberalisme. Hij betoogde dat economische calculatie onmogelijk is onder socialisme en verdedigde het belang van vrije marktprijzen. Zijn werk legde de basis voor de moderne libertarische economische theorie.',
    works: ['Human Action', 'Socialism: An Economic and Sociological Analysis'],
    quote: 'De overheid is de enige instelling die een nuttig product zoals papier kan nemen, er wat inkt op kan slaan en het volledig waardeloos kan maken.'
  },
  'hayek': {
    slug: 'hayek',
    name: 'Friedrich Hayek',
    bio: 'Friedrich Hayek was een Oostenrijks-Britse econoom en filosoof bekend om zijn verdediging van het klassiek liberalisme. Hij benadrukte de rol van spontane orde in markten en waarschuwde voor de gevaren van centrale planning. Zijn ideeën hebben het moderne libertarische en conservatieve denken diepgaand beïnvloed.',
    works: ['The Road to Serfdom', 'The Constitution of Liberty'],
    quote: 'Hoe meer de staat "plant", hoe moeilijker planning wordt voor het individu.'
  },
  'bastiat': {
    slug: 'bastiat',
    name: 'Frédéric Bastiat',
    bio: 'Frédéric Bastiat was een 19e-eeuwse Franse econoom en schrijver, vooral bekend om zijn heldere en geestige kritieken op overheidsingrijpen. Hij pionierde het concept van alternatieve kosten en populariseerde de drogreden van het gebroken raam. Zijn geschriften zijn fundamenteel in het klassiek liberale economische denken.',
    works: ['The Law', 'That Which is Seen, and That Which is Not Seen'],
    quote: 'De staat is de grote fictie waardoor iedereen probeert te leven ten koste van iedereen.'
  },
  'larken-rose': {
    slug: 'larken-rose',
    name: 'Larken Rose',
    bio: 'Larken Rose is een Amerikaanse auteur en spreker bekend om zijn onverbloemde kritiek op overheidsgezag. Hij pleit voor voluntarisme en vreedzame anarchie, met het argument dat het geloof in "autoriteit" de wortel is van het meeste maatschappelijke geweld. Zijn toon is vaak provocerend en radicaal individualistisch.',
    works: ['The Most Dangerous Superstition', 'How to Be a Successful Tyrant'],
    quote: 'Het geloof in autoriteit is het gevaarlijkste bijgeloof in de geschiedenis van de wereld.'
  },
  'ron-paul': {
    slug: 'ron-paul',
    name: 'Ron Paul',
    bio: 'Ron Paul is een Amerikaanse arts, auteur en voormalig congreslid die een prominente stem werd voor vrijheid, gezond geld en non-interventionisme. Bekend om zijn consistentie en principiële standpunten, ontketende hij een wereldwijde libertarische jeugdbeweging via zijn presidentiële campagnes.',
    works: ['The Revolution: A Manifesto', 'End the Fed'],
    quote: 'Waarheid is verraad in het rijk der leugens.'
  },
  'lysander-spooner': {
    slug: 'lysander-spooner',
    name: 'Lysander Spooner',
    bio: 'Lysander Spooner was een 19e-eeuwse Amerikaanse individualistische anarchist, advocaat en abolitionist, bekend om zijn argumenten tegen de legitimiteit van de Amerikaanse grondwet en zijn verdediging van natuurrecht en vrije markten.',
    works: ['No Treason: The Constitution of No Authority', 'Vices Are Not Crimes'],
    quote: 'Maar of de Grondwet nu wel of niet door "het Volk" is ingesteld, doet er weinig toe. Zij bestaat al die tijd, en ze is goed of slecht om wat ze op zichzelf is; niet omdat zoveel mensen het wel of niet leuk vonden.'
  },
  'henry-hazlitt': {
    slug: 'henry-hazlitt',
    name: 'Henry Hazlitt',
    bio: 'Henry Hazlitt was een Amerikaanse journalist en econoom van de Oostenrijkse School, bekend om het populariseren van economische principes door werken als "Economie in één les", waarbij hij de onzichtbare gevolgen van economisch beleid benadrukte.',
    works: ['Economics in One Lesson', 'The Failure of the \'New Economics\''],
    quote: 'De kunst van de economie bestaat erin niet alleen naar de onmiddellijke, maar ook naar de langetermijneffecten van een handeling of beleid te kijken; het bestaat erin de gevolgen van dat beleid niet alleen voor één groep, maar voor alle groepen te traceren.'
  },
  'unknown': {
    slug: 'unknown',
    name: 'Unknown Thinker',
    bio: 'Information about this thinker is not yet available.',
    works: [],
  }
};

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

/**
 * Generates a slug from a thinker's name (e.g., "Ayn Rand" -> "ayn-rand")
 */
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Retrieves all unique thinkers mentioned in articles.
 * This version derives thinkers from article frontmatter and merges with predefined data.
 */
export function getAllThinkers(): ThinkerData[] {
  const articles = getAllArticles();
  const thinkersFromArticles = new Map<string, ThinkerData>();
  const predefinedThinkersByName = new Map<string, ThinkerData>(
    Object.values(thinkersData).map(t => [t.name.toLowerCase(), t])
  );

  articles.forEach(article => {
    if (article.thinker) {
      const articleThinkerNameLower = article.thinker.toLowerCase();
      const slug = generateSlug(article.thinker);
      
      // Check if we already have this thinker by slug OR if a predefined thinker exists with the same name
      if (!thinkersFromArticles.has(slug)) {
          const predefinedDataByName = predefinedThinkersByName.get(articleThinkerNameLower);
          const predefinedDataBySlug = thinkersData[slug];

          // Prioritize predefined data if found either by matching name or slug
          const finalData = predefinedDataByName || predefinedDataBySlug;

          if (finalData) {
            // If using predefined data found by name, ensure we use ITS slug, not the potentially different one from the article
            if (!thinkersFromArticles.has(finalData.slug)) { 
                thinkersFromArticles.set(finalData.slug, finalData);
            }
          } else {
             // Only create a basic entry if NO predefined match is found by slug or name
             thinkersFromArticles.set(slug, {
                slug: slug,
                name: article.thinker, // Use the name from frontmatter
                bio: `Articles related to ${article.thinker}. More info coming soon.`, // Default bio
                works: [],
             });
          }
      }
    }
  });

  // Also add any predefined thinkers that might not have articles yet (and aren't already added)
  Object.values(thinkersData).forEach(thinker => {
    if (!thinkersFromArticles.has(thinker.slug)) {
        thinkersFromArticles.set(thinker.slug, thinker);
    }
  });

  // Filter out the 'Unknown Thinker' before returning
  const finalThinkers = Array.from(thinkersFromArticles.values())
                         .filter(thinker => thinker.slug !== 'unknown');

  return finalThinkers;
}

/**
 * Retrieves thinker details by slug.
 */
export function getThinkerBySlug(slug: string): ThinkerData | null {
  // First, try the predefined data
  if (thinkersData[slug]) {
    return thinkersData[slug];
  }

  // As a fallback, try to find a match based on article frontmatter
  // (This is less reliable as formatting might differ)
  const articles = getAllArticles();
  const foundArticle = articles.find(article => article.thinker && generateSlug(article.thinker) === slug);

  if (foundArticle && foundArticle.thinker) {
    // Return a basic structure if found via articles but not predefined
    return {
        slug: slug,
        name: foundArticle.thinker,
        bio: `Articles related to ${foundArticle.thinker}. More info coming soon.`, // Default bio
        works: [],
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