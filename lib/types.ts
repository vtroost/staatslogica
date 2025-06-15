// Define the expected structure of the article frontmatter
// Adjust this interface based on the actual fields in your MDX files
export interface ArticleFrontmatter {
  title: string;
  date: string;
  published?: boolean;
  tags?: string[];
  thinkers?: string[];
  spin?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceTitle?: string;
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
  stroming?: string; // Added stroming field
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
  count?: number; // Optional count for performance tracking
}

// --- Category Data Interface ---
export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  topics: string[]; // Tags that belong to this category
  color: string;
  count?: number; // Optional count for performance tracking
}

// Add new interfaces for stromingen
export interface Stroming {
  slug: string;
  name: string;
  description: string;
  detailedDescription?: string; // Extended description for the stroming page
  keyPrinciples?: string[]; // Core principles of this stroming
  color: string; // CSS color for badge
  thinkers: string[]; // slugs of thinkers in this stroming
}

// --- Book Data Interfaces ---
export interface BookFrontmatter {
  title: string;
  author: string; // Author name (corresponds to thinker)
  authorSlug: string; // Slug reference to thinker
  publishYear: number;
  originalTitle?: string; // If translated
  publisher?: string;
  isbn?: string;
  pages?: number;
  language?: string;
  summary?: string; // Short summary for the library page
  tags?: string[]; // Related topics/themes
}

export interface Book extends BookFrontmatter {
  slug: string;
  content?: string; // Full book content/review from MD file
} 