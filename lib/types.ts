// Define the expected structure of the article frontmatter
// Adjust this interface based on the actual fields in your MDX files
export interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  thinkerSlugs?: string[];
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
  bio?: string; // Short bio from JSON
  works: string[]; // From JSON
  quote?: string; // From JSON
  articleCount: number; // Calculated
  bioContent?: string; // Full bio content from MD file
  title?: string; // Title from MD file frontmatter
}

// --- Base Thinker Data from JSON ---
export interface ThinkerJsonData {
    slug: string;
    name: string;
    bio?: string;
    works: string[];
    quote?: string;
}

// --- Tag Data Interface ---
export interface TagData {
  name: string;
  slug: string;
} 