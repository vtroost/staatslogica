import { 
    getAllThinkers, 
    getThinkerBySlug, 
    getArticlesByThinker, 
    ThinkerData, 
    Article 
} from '@/lib/mdx';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Keep helper function if needed elsewhere, though getArticlesByThinker might use it internally
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface ThinkerPageProps {
  params: { slug: string };
}

// Generate static paths for each thinker slug from the definitive source
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const thinkers = getAllThinkers(); // Use the function that reads JSON + articles
  return thinkers.map(thinker => ({ slug: thinker.slug }));
}

// Generate metadata using the thinker data
export async function generateMetadata({ params }: ThinkerPageProps): Promise<Metadata> {
  const { slug } = params;
  const thinker = getThinkerBySlug(slug); // Fetch specific thinker data

  if (!thinker) {
    return {
      title: 'Denker niet gevonden | Staatslogica',
    };
  }

  return {
    title: `${thinker.name} | Staatslogica`,
    // Use first sentence of bio or a default description
    description: thinker.bio.split('.')[0] + '.' || `Artikelen en analyse vanuit het perspectief van ${thinker.name}.`,
  };
}


export default function ThinkerPage({ params }: ThinkerPageProps) {
    const { slug } = params;

    // Fetch the specific thinker's data
    const thinker = getThinkerBySlug(slug);

    // Fetch only the articles for this thinker
    const thinkerArticles = thinker ? getArticlesByThinker(slug) : [];

    // If the thinker doesn't exist in our data (JSON or derived), show 404
    if (!thinker) {
        notFound();
    }

    // Sort articles by date desc
    thinkerArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            {/* Thinker Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{thinker.name}</h1>

            {/* Bio Section - Now uses fetched data */}
            <section className="mb-10 text-gray-700">
                <p className="mb-4 text-base leading-relaxed">{thinker.bio}</p>
                {thinker.works && thinker.works.length > 0 && (
                    <div className="mb-4 text-sm">
                        <strong className="font-semibold text-gray-800">Bekende werken:</strong>
                        <span className="ml-2 text-gray-600">{thinker.works.join(', ')}</span>
                        {/* Or render as list:
                        <ul className="list-disc list-inside text-gray-600 text-sm mt-1">
                            {thinker.works.map(work => <li key={work}>{work}</li>)}
                        </ul>
                        */}
                    </div>
                )}
                {thinker.quote && (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 text-sm">
                        {thinker.quote}
                    </blockquote>
                )}
            </section>

            {/* Related Articles Grid */}
            <h2 className="text-2xl font-bold mb-6 pt-6 border-t">Artikelen vanuit dit perspectief ({thinkerArticles.length})</h2>
            {thinkerArticles.length > 0 ? (
                <div className="space-y-6">
                    {thinkerArticles.map((article) => (
                         // Using the article card style from the archive page
                        <div key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">
                                <Link href={`/articles/${article.slug}`} className="hover:underline">
                                    {article.title}
                                </Link>
                            </h3>
                            <div className="text-sm text-gray-500 mb-3 space-x-2">
                                {/* Re-use date formatting from archive page */}
                                <span>
                                    {new Date(article.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })} 
                                    {new Date(article.date).getHours() !== 0 || new Date(article.date).getMinutes() !== 0 || new Date(article.date).getSeconds() !== 0 
                                        ? ` om ${new Date(article.date).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
                                        : ''}
                                </span>
                                {/* No need to show thinker name again here */}
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
            ) : (
                 // This state might not be reachable if !thinker triggers notFound()
                 // But good as a fallback if articles might be empty for an existing thinker
                <p className="text-center text-gray-500">Geen artikelen gevonden voor {thinker.name}.</p>
            )}
        </div>
    );
} 