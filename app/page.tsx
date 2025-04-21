import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { TagBadge } from '@/components/TagBadge';
import { Metadata } from 'next';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica | Libertarische daganalyse',
  description: 'Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek. Kritisch, satirisch, principieel.',
};

export default function HomePage() {
    // Get all articles, already sorted by date descending by getAllArticles
    const articles = getAllArticles();
    const articlesToShow = 10; // Number of articles to display on homepage

    return (
        <main className="prose prose-slate lg:prose-xl max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Welkom bij Staatslogica</h1>
            <p className="text-lg text-center text-gray-600 mb-10">
                Satirische nieuwsanalyses door de lens van libertarische denkers.
            </p>

            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Laatste analyses</h2>

            {articles.length > 0 ? (
                <div className="mt-8">
                    {articles.slice(0, articlesToShow).map((article) => (
                        <div key={article.slug} className="py-4 mb-6 border-b last:border-b-0">
                            <h3 className="text-xl font-semibold mb-1">
                                <Link href={`/articles/${article.slug}`} className="text-blue-700 hover:underline no-underline prose-a:no-underline">
                                    {article.title}
                                </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                {article.date} | Denker: {article.thinker}
                            </p>
                            <p className="mt-2 italic text-gray-700 mb-4">{article.spin}</p>
                            {/* Show tags */}
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Er zijn nog geen artikelen gepubliceerd.</p>
            )}

            {articles.length > articlesToShow && (
                 <div className="mt-10 text-center">
                      {/* Optional: Link to an archive page later */}
                      <p className="text-gray-500">Meer artikelen...</p>
                 </div>
            )}
        </main>
    );
} 