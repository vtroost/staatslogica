import { getAllArticles } from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Helper function to generate slug (consistent with the attempt in mdx.ts)
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface ThinkerPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: ThinkerPageProps): Promise<Metadata> {
  const { slug } = params;
  const allArticles = getAllArticles(); // Get all articles
  // Find the first article matching the thinker slug to get the name
  const thinkerArticle = allArticles.find(article => article.thinker && generateSlug(article.thinker) === slug);

  if (!thinkerArticle || !thinkerArticle.thinker) {
    return {
      title: 'Thinker Not Found | Staatslogica',
    };
  }

  return {
    title: `${thinkerArticle.thinker} | Staatslogica`,
    description: `Articles and analysis from the perspective of ${thinkerArticle.thinker}.`,
  };
}


export default function ThinkerPage({ params }: ThinkerPageProps) {
    const { slug } = params;
    console.log(`[ThinkerPage] Received slug: ${slug}`); // Log received slug

    const allArticles = getAllArticles();
    console.log(`[ThinkerPage] Total articles fetched: ${allArticles.length}`); // Log total articles

    // Filter articles by the current thinker slug
    const thinkerArticles = allArticles.filter(article => {
        const articleThinkerSlug = article.thinker ? generateSlug(article.thinker) : null;
        // Log comparison for the first few articles for debugging
        if (allArticles.indexOf(article) < 5) { // Log first 5 comparisons
            console.log(`[ThinkerPage] Comparing: URL slug "${slug}" with Article thinker "${article.thinker}" (slug: "${articleThinkerSlug}") -> Match: ${articleThinkerSlug === slug}`);
        }
        return articleThinkerSlug === slug;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc

    console.log(`[ThinkerPage] Filtered articles count for slug "${slug}": ${thinkerArticles.length}`); // Log filtered count

    // If no articles for this slug, or thinker name is missing, show 404
    if (thinkerArticles.length === 0) { // Simplified check
        console.log(`[ThinkerPage] No articles found for slug "${slug}". Triggering notFound().`); // Log before notFound
        notFound();
    }

    // Get thinker's name from the first article (they should all be the same)
    const thinkerName = thinkerArticles[0].thinker; // Should be safe now due to the check above
    console.log(`[ThinkerPage] Displaying page for thinker: ${thinkerName}`); // Log successful case

    // Placeholder for Bio section - Implement when thinker data is available
    /*
    const thinkerBio = "Placeholder bio...";
    const thinkerWorks = ["Work 1", "Work 2"];
    const thinkerQuote = "Placeholder quote...";
    */

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            {/* Thinker Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">{thinkerName}</h1>

            {/* Placeholder: Bio Section - Uncomment and populate when data is ready */}
            {/*
            <section className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Over {thinkerName}</h2>
                <p className="text-gray-700 mb-4">{thinkerBio}</p>
                {thinkerWorks.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-800">Bekende werken:</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                            {thinkerWorks.map(work => <li key={work}>{work}</li>)}
                        </ul>
                    </div>
                )}
                {thinkerQuote && (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                        {thinkerQuote}
                    </blockquote>
                )}
            </section>
            */}

            {/* Related Articles Grid */}
            <h2 className="text-2xl font-bold mb-8">Artikelen vanuit dit perspectief</h2>
            {thinkerArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {thinkerArticles.map((article) => (
                        // Re-using the same card structure as the homepage
                        <div key={article.slug} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">
                                    <Link href={`/articles/${article.slug}`} className="hover:underline">
                                        {article.title}
                                    </Link>
                                </h3>
                                {/* Don't need to display thinker name here again */}
                                {article.spin && (
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">{article.spin}</p>
                                )}
                                <div className="mt-auto flex justify-between items-center">
                                    <p className="text-xs text-gray-400">{article.date}</p>
                                    <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-black hover:underline">
                                        Lees artikel →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // This case should technically be handled by notFound(), but added for completeness
                <p className="text-center text-gray-500">Geen artikelen gevonden voor {thinkerName}.</p>
            )}
        </div>
    );
}

// Optional: Generate static paths if you know all thinker slugs beforehand
// export async function generateStaticParams() {
//   const allArticles = getAllArticles();
//   const thinkerSlugs = new Set<string>();
//   allArticles.forEach(article => {
//     if (article.thinker) {
//       thinkerSlugs.add(generateSlug(article.thinker));
//     }
//   });
//   return Array.from(thinkerSlugs).map(slug => ({ slug }));
// } 