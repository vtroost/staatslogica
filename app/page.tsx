import { getAllArticles } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica | Kritische denkers. Heldere analyses.',
  description: 'Dagelijkse AI-gegenereerde nieuwsanalyses vanuit het perspectief van grote denkers. Kritisch, satirisch, principieel.',
};

// Helper function to generate slug (consistent with the thinker page)
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function HomePage() {
    const articles = getAllArticles();
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Let's show the latest 6 for a 2x3 grid on desktop
    const articlesToShow = 6;

    return (
        <>
            {/* Hero Section */}
            <section className="w-full bg-gray-100 py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kritische denkers. Heldere analyses. Geen overheidsfluff.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8">
                        Dagelijkse AI-gegenereerde nieuwsanalyses vanuit het perspectief van grote denkers.
                    </p>
                    <a
                        href="#latest-articles" // Anchor link to the article grid
                        className="inline-block bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Lees de laatste analyse
                    </a>
                </div>
            </section>

            {/* Latest Articles Grid */}
            <section id="latest-articles" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Laatste artikelen</h2>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.slice(0, articlesToShow).map((article) => (
                            <div key={article.slug} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                                {/* Optional: Add image here if available */}
                                {/* <img src={article.imageUrl || '/placeholder.jpg'} alt="" className="w-full h-40 object-cover"/> */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                                      <Link href={`/articles/${article.slug}`} className="hover:underline">
                                        {article.title}
                                      </Link>
                                    </h3>
                                    {/* Assuming 'thinker' is in frontmatter - Now linked */}
                                    {article.thinker && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            Door: <Link href={`/denkbeelden/${generateSlug(article.thinker)}`} className="hover:underline text-black font-medium">{article.thinker}</Link>
                                        </p>
                                    )}
                                    {/* Use 'spin' as the blurb */}
                                    {article.spin && (
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">{article.spin}</p>
                                    )}
                                    <div className="mt-auto flex justify-between items-center">
                                        <p className="text-xs text-gray-400">{article.date}</p>
                                        <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-black hover:underline">
                                            Lees artikel →
                                        </Link>
                                    </div>
                                    {/* Optional: Add tags back if needed */}
                                    {/* {article.tags && article.tags.length > 0 && (...)} */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Er zijn nog geen artikelen gepubliceerd.</p>
                )}

                {/* Optional: Link to an archive page - Styled as a button */}
                {articles.length > articlesToShow && (
                    <div className="mt-12 text-center">
                        <Link href="/archive" className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded font-semibold hover:bg-gray-300 transition-colors">
                           Bekijk alle artikelen
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
} 