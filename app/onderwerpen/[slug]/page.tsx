import { getAllTags, getArticlesByTag, TagData, Article } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Helper function to generate slug (if not already imported)
// Ensure this is consistent with the one in lib/mdx.ts
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface TagPageProps {
  params: { slug: string };
}

// Generate static paths for each tag
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const tags = getAllTags();
  return tags.map(tag => ({ slug: tag.slug }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = params;
  const tags = getAllTags(); // Fetch all tags to find the name
  const currentTag = tags.find(tag => tag.slug === slug);

  if (!currentTag) {
    return { title: 'Onderwerp niet gevonden | Staatslogica' };
  }

  return {
    title: `Onderwerp: ${currentTag.name} | Staatslogica`,
    description: `Artikelen over het onderwerp ${currentTag.name}.`,
  };
}

// The page component
export default function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  const articles = getArticlesByTag(slug);
  const tags = getAllTags(); // Fetch again to get the name for display
  const currentTag = tags.find(tag => tag.slug === slug);

  if (!currentTag || articles.length === 0) {
    // If the tag doesn't exist OR no articles have this tag, show 404
    // Or you could show a "No articles found for this tag" message if currentTag exists but articles is empty
    notFound(); 
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Page Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Onderwerp: {currentTag.name}
      </h1>

      {/* Article List (similar to archive page) */}
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/articles/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            <div className="text-sm text-gray-500 mb-3 space-x-2">
               {/* Re-use date formatting from archive page */}
               <span>
                   {new Date(article.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} 
                   {new Date(article.date).getHours() !== 0 || new Date(article.date).getMinutes() !== 0 || new Date(article.date).getSeconds() !== 0 
                       ? ` om ${new Date(article.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
                       : ''}
               </span>
              {article.thinker && (
                  <>
                      <span>|</span>
                      {/* Link to thinker page */}
                      <span>Door: <Link href={`/denkbeelden/${generateSlug(article.thinker)}`} className="hover:underline text-black font-medium">{article.thinker}</Link></span>
                  </>
              )}
            </div>
            {article.spin && (
              <p className="text-gray-600 text-sm mb-4 italic">{article.spin}</p>
            )}
            <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-black hover:underline">
              Lees artikel →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 