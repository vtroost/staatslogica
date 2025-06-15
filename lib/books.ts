import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Book, BookFrontmatter } from './types';
import { generateSlug } from './utils';
import { getThinkerBySlug } from './thinkers';

const booksContentDirectory = path.join(process.cwd(), 'content', 'books');

// Cache for books to avoid re-reading files
let booksCache: Book[] | null = null;
let booksCacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute cache duration

/**
 * Reads a single book's MD file and returns its parsed frontmatter and content.
 */
function readBookFile(filePath: string): { frontmatter: BookFrontmatter, content: string, slug: string } | null {
  try {
    const filename = path.basename(filePath);
    const slug = filename.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as BookFrontmatter;

    // Basic validation
    if (!frontmatter.title || !frontmatter.author || !frontmatter.authorSlug || !frontmatter.publishYear) {
      console.warn(`Book file ${filename} is missing required frontmatter fields. Skipping.`);
      return null;
    }

    return { frontmatter, content, slug };

  } catch (error) {
    console.error(`Error reading or parsing book file: ${filePath}`, error);
    return null;
  }
}

/**
 * Reads all book MD files from the content/books directory.
 */
function getAllBookFileData(): ({ frontmatter: BookFrontmatter, content: string, slug: string })[] {
  let files: string[] = [];
  try {
    if (fs.existsSync(booksContentDirectory)) {
      files = fs.readdirSync(booksContentDirectory).filter(file => file.endsWith('.md'));
    } else {
      console.warn(`Books content directory not found: ${booksContentDirectory}`);
      return [];
    }
  } catch (error) {
    console.error(`Error reading books directory: ${booksContentDirectory}`, error);
    return [];
  }

  return files.map(filename => readBookFile(path.join(booksContentDirectory, filename)))
              .filter((data): data is { frontmatter: BookFrontmatter; content: string; slug: string } => data !== null);
}

/**
 * Retrieves all books sorted by publication year (newest first).
 */
export function getAllBooks(): Book[] {
  const now = Date.now();
  
  // Return cached books if cache is still valid
  if (booksCache && (now - booksCacheTimestamp) < CACHE_DURATION) {
    return booksCache;
  }

  const allBookFiles = getAllBookFileData();

  const books = allBookFiles.map(fileData => ({
    ...fileData.frontmatter,
    slug: fileData.slug,
    content: fileData.content,
  } as Book));

  // Sort by publication year (newest first)
  books.sort((a, b) => b.publishYear - a.publishYear);
  
  // Update cache
  booksCache = books;
  booksCacheTimestamp = now;

  return books;
}

/**
 * Retrieves book details by slug.
 */
export function getBookBySlug(slug: string): Book | null {
  const filePath = path.join(booksContentDirectory, `${slug}.md`);
  const fileData = readBookFile(filePath);

  if (!fileData) {
    return null; // Book MD file not found or failed to parse
  }

  return {
    ...fileData.frontmatter,
    slug: fileData.slug,
    content: fileData.content,
  };
}

/**
 * Filters books by author slug.
 */
export function getBooksByAuthor(authorSlug: string): Book[] {
  const allBooks = getAllBooks();
  return allBooks.filter(book => book.authorSlug === authorSlug);
}

/**
 * Get a book with enriched author data.
 */
export function getBookWithAuthor(slug: string): (Book & { authorData?: any }) | null {
  const book = getBookBySlug(slug);
  if (!book) return null;

  const authorData = getThinkerBySlug(book.authorSlug);
  
  return {
    ...book,
    authorData,
  };
} 