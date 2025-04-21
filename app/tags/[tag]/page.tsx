import { getAllArticles } from '@/lib/mdx'; // Updated import path
// Remove Article type import if not explicitly needed or redefine based on mdx.ts structure
// import { Article } from '@/lib/articles'; 
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TagBadge } from '@/components/TagBadge'; // Keep TagBadge if used

// Define Params type
type Params = {
    tag: string;
};

// Generate static params for all unique tags
export async function generateStaticParams(): Promise<Params[]> {
    const articles = getAllArticles(); // Use new function
    const uniqueTags = new Set<string>();

    articles.forEach(article => {
        // Ensure tags exist and is an array before iterating
        if (Array.isArray(article.tags)) {
            article.tags.forEach(tag => {
                // Normalize tag for URL (ensure consistent with TagBadge component)
                const slug = tag.toLowerCase().replace(/\s+/g, '-');
                uniqueTags.add(slug);
            });
        }
    });

    return Array.from(uniqueTags).map(tag => ({ tag }));
}

// Optional: Generate metadata for Tag page
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const tagName = decodeURIComponent(params.tag);
    const allArticles = getAllArticles(); // Use new function
    let displayTagName = tagName; 

    for (const article of allArticles) {
        // Ensure tags exist and is an array
        if (Array.isArray(article.tags)) {
            const foundTag = article.tags.find(t => t.toLowerCase().replace(/\s+/g, '-') === tagName);
            if (foundTag) {
                displayTagName = foundTag; // Use original casing
                break;
            }
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
    const allArticles = getAllArticles(); // Use new function

    // Filter articles: match requested slug against normalized slugs of article tags
    const articles = allArticles.filter((article) =>
        Array.isArray(article.tags) && article.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === requestedTagSlug)
    );

    // Find the original tag name (with original casing) for display
    let displayTagName = requestedTagSlug; // Default to slugified version
    if (articles.length > 0 && Array.isArray(articles[0].tags)) {
         const foundTag = articles[0].tags.find(t => t.toLowerCase().replace(/\s+/g, '-') === requestedTagSlug);
         if (foundTag) {
            displayTagName = foundTag; // Get original casing from the first matching article
         }
    }

    // Removed the notFound() call here to simply display a message if no articles are found
    // if (articles.length === 0) {
    //     notFound();
    // }

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            {/* Display the tag name with better styling */}
            <h1 className="text-2xl font-bold mb-6">
                Artikelen met tag: <span className="font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded">{displayTagName}</span>
            </h1>
            {articles.length > 0 ? (
                <div className="space-y-6"> 
                    {articles.map((article) => (
                        <div key={article.slug} className="border p-4 rounded hover:shadow transition"> {/* Consistent styling */}
                           <Link href={`/articles/${article.slug}`} className="block group">
                                <h2 className="text-xl font-semibold group-hover:text-blue-600">{article.title}</h2>
                                <p className="text-sm text-gray-500 mt-1 mb-2">{article.date}</p>
                                {/* Display spin if it exists */}
                                {article.spin && <p className="italic text-sm text-gray-600 mb-2">{article.spin}</p>}
                           </Link>
                            {/* Display tags if they exist */}
                            {Array.isArray(article.tags) && article.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {article.tags.map((tag: string) => (
                                        // Use TagBadge or simple span
                                        <TagBadge key={tag} tag={tag} />
                                        // <span key={tag} className="inline-block bg-gray-200 px-2 py-1 text-xs rounded">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                 // Improved message when no articles are found for the tag
                <p>Geen artikelen gevonden met de tag "{displayTagName}". Probeer een andere tag of bekijk <Link href="/" className="text-blue-600 hover:underline">alle artikelen</Link>.</p>
            )}
        </main>
    );
} 