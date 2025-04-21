import { getAllArticles, Article } from '@/lib/articles'; // Import Article type
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TagBadge } from '@/components/TagBadge'; // Import TagBadge for consistency

// Define Params type
type Params = {
    tag: string;
};

// Generate static params for all unique tags
export async function generateStaticParams(): Promise<Params[]> {
    const articles = getAllArticles();
    const uniqueTags = new Set<string>();

    articles.forEach(article => {
        article.tags.forEach(tag => {
            // Normalize tag for URL (ensure consistent with TagBadge component)
            const slug = tag.toLowerCase().replace(/\s+/g, '-');
            uniqueTags.add(slug);
        });
    });

    return Array.from(uniqueTags).map(tag => ({ tag }));
}

// Optional: Generate metadata for Tag page
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    // Decode the tag slug if needed (e.g., handling URL encoding)
    const tagName = decodeURIComponent(params.tag);
    // Attempt to find original casing
    const allArticles = getAllArticles();
    let displayTagName = tagName; // Default
    for (const article of allArticles) {
        const foundTag = article.tags.find(t => t.toLowerCase().replace(/\s+/g, '-') === tagName);
        if (foundTag) {
            displayTagName = foundTag;
            break;
        }
    }

    return {
        title: `Artikelen getagd met "${displayTagName}" | Staatslogica`,
        description: `Een overzicht van alle artikelen op Staatslogica getagd met ${displayTagName}.`,
    };
}

// Tag Page Component
export default async function TagPage({ params }: { params: Params }) {
    const requestedTagSlug = params.tag.toLowerCase();
    const allArticles = getAllArticles();

    // Filter articles: match requested slug against normalized slugs of article tags
    const articles = allArticles.filter((article) =>
        article.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === requestedTagSlug)
    );

    // Find the original tag name (with original casing) for display
    let displayTagName = requestedTagSlug; // Default
    for (const article of articles) {
        const foundTag = article.tags.find(t => t.toLowerCase().replace(/\s+/g, '-') === requestedTagSlug);
        if (foundTag) {
            displayTagName = foundTag;
            break;
        }
    }

    if (articles.length === 0) {
        // Optional: could show a specific message or redirect
        console.warn(`No articles found for tag slug: ${requestedTagSlug}`);
        // You could use notFound() here for a 404 page if no articles match the tag
        // notFound();
    }

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Artikelen met tag: <span className="bg-blue-100 text-blue-800 text-xl font-medium px-3 py-1 rounded-full">#{displayTagName}</span></h1>
            {articles.length > 0 ? (
                <div className="space-y-8"> {/* Add spacing between articles */}
                    {articles.map((article) => (
                        <div key={article.slug} className="pb-4 border-b last:border-b-0"> {/* Add border */}
                            <h2 className="text-xl font-semibold mb-1">
                                <Link href={`/articles/${article.slug}`} className="text-blue-700 hover:underline">
                                    {article.title}
                                </Link>
                            </h2>
                            <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                            <p className="mt-2 italic text-gray-600">{article.spin}</p>
                            {/* Show tags for context */}
                            <div className="mt-3 flex flex-wrap gap-2"> {/* Use flex-wrap for tags */}
                                {article.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Geen artikelen gevonden met de tag "{displayTagName}".</p>
            )}
        </main>
    );
} 