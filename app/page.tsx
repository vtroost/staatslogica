import { getAllArticles } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica | Libertarische daganalyse',
  description: 'Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek. Kritisch, satirisch, principieel.',
};

export default function HomePage() {
    // Get all articles from the new MDX utility
    const articles = getAllArticles(); 
    // Add sorting if getAllArticles doesn't sort (e.g., by date)
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const articlesToShow = 10; // Keep this limit or adjust as needed

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            {/* Optional: Add back title/description if needed */}
            {/* 
            <h1>Welkom bij Staatslogica</h1>
            <p>Satirische nieuwsanalyses door de lens van libertarische denkers.</p> 
            */}
            
            <h1 className="text-2xl font-bold mb-6">Laatste analyses</h1>

            {articles.length > 0 ? (
                <div className="space-y-6"> {/* Add spacing between articles */}
                    {articles.slice(0, articlesToShow).map((article) => (
                         <div key={article.slug} className="border p-4 rounded hover:shadow transition">
                            <Link href={`/articles/${article.slug}`} className="block group">
                                <h2 className="text-xl font-semibold group-hover:text-blue-600">{article.title}</h2>
                                <p className="text-sm text-gray-500 mt-1 mb-2">{article.date}</p>
                                {/* Display spin if it exists */}
                                {article.spin && <p className="italic text-sm text-gray-600 mb-2">{article.spin}</p>}
                            </Link>
                            {/* Display tags if they exist */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {article.tags.map((tag: string) => (
                                        <span key={tag} className="inline-block bg-gray-200 px-2 py-1 text-xs rounded">
                                            {tag}
                                        </span>
                                        // Or use TagBadge component if preferred:
                                        // <TagBadge key={tag} tag={tag} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Er zijn nog geen artikelen gepubliceerd.</p>
            )}

            {/* Optional: Link to an archive page */}
            {articles.length > articlesToShow && (
                 <div className="mt-8 text-center">
                      <Link href="/archive" className="text-blue-600 hover:underline">
                         Bekijk alle artikelen
                      </Link>
                 </div>
            )}
        </main>
    );
} 