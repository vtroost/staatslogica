import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { Metadata } from 'next';
import Image from 'next/image'; // Import next/image
import { notFound } from 'next/navigation'; // Import notFound

// Define params type
type Params = {
    slug: string;
};

// Generate params for all articles
export async function generateStaticParams(): Promise<Params[]> {
    const slugs = getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        return {
            title: 'Artikel niet gevonden',
        };
    }

    return {
        title: `${article.title} | Staatslogica`,
        description: article.spin, // Use spin as description
        // Add other metadata fields as needed
    };
}

// Article Page Component
export default async function ArticlePage({ params }: { params: Params }) {
    const article = getArticleBySlug(params.slug);

    // Handle case where article is not found
    if (!article) {
        notFound(); // Trigger 404 page
    }

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <article className="prose lg:prose-xl max-w-none"> {/* Add prose classes */}
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                <p className="text-sm text-gray-500 mb-6">{article.date}</p>

                {/* Use next/image if URL exists */}
                {article.image?.url && (
                    <div className="relative w-full h-64 md:h-96 mb-6"> { /* Container for responsive image */}
                        <Image
                            src={article.image.url}
                            alt={article.image.alt}
                            layout="fill"
                            objectFit="cover" // Or "contain"
                            className="rounded-md"
                            priority // Consider adding priority for LCP images
                        />
                    </div>
                )}

                <blockquote className="border-l-4 pl-4 italic text-gray-600 mb-6 text-lg">{/* Larger spin quote */}
                    {article.spin}
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6"> { /* Use grid for analyses */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Libertaire Analyse</h2>
                        <p>{article.libertarianAnalysis}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Anarchistische Analyse</h2>
                        <p>{article.anarchistAnalysis}</p>
                    </section>
                </div>

                <blockquote className="italic text-gray-700 border-l-4 border-gray-400 pl-4 my-8"> {/* Styled quote */}
                    {article.quote}
                </blockquote>

                <div className="text-sm text-gray-500 mt-6 border-t pt-4"> {/* Footer metadata */}
                    <p><strong>Denker:</strong> {article.thinker}</p>
                    <p><strong>Tags:</strong> {article.tags.join(', ')}</p>
                </div>
            </article>
        </main>
    );
} 