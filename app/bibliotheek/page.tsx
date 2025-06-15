import { getAllBooks } from '@/lib/books';
import { getThinkerBySlug } from '@/lib/thinkers';
import BibliotheekContent from './BibliotheekContent';

// Helper function to extract short bio from thinker content
function extractShortBio(bioContent?: string): string {
  if (!bioContent) return '';
  
  // Look for the first paragraph after the frontmatter that's descriptive
  const lines = bioContent.split('\n').filter(line => line.trim() !== '');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip markdown headings, empty lines, and very short lines
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('##') && 
        trimmed.length > 50 && 
        trimmed.length < 300) {
      return trimmed;
    }
  }
  
  return '';
}

export default async function BibliotheekPage() {
    const allBooks = getAllBooks();
    
    // Get author details for each book
    const booksWithAuthors = await Promise.all(
        allBooks.map(async (book) => {
            const authorData = getThinkerBySlug(book.authorSlug);
            return {
                ...book,
                authorData: authorData ? {
                    ...authorData,
                    shortBio: extractShortBio(authorData.bioContent)
                } : null
            };
        })
    );

    return (
        <BibliotheekContent books={booksWithAuthors} />
    );
} 