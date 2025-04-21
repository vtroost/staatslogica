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
        <>
            <h1>Welkom bij Staatslogica</h1>
            <p>
                Satirische nieuwsanalyses door de lens van libertarische denkers.
            </p>

            <h2>Laatste analyses</h2>

            {articles.length > 0 ? (
                <div>
                    {articles.slice(0, articlesToShow).map((article) => (
                         <div key={article.slug}>
                            <h2>
                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                            </h2>
                            <p>{article.date}</p>
                            <p>{article.spin}</p>
                            <div>
                                {article.tags.map((tag) => (
                                <TagBadge key={tag} tag={tag} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Er zijn nog geen artikelen gepubliceerd.</p>
            )}

            {articles.length > articlesToShow && (
                 <div>
                      {/* Optional: Link to an archive page later */}
                      <p>Meer artikelen...</p>
                 </div>
            )}
        </>
    );
} 