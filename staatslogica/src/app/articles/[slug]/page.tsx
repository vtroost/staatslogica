import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { Metadata } from 'next';
import Image from 'next/image'; // Import next/image
import { notFound } from 'next/navigation'; // Import notFound
import { ThinkerImage } from '@/components/ThinkerImage'; // Import ThinkerImage
import { TagBadge } from '@/components/TagBadge'; // Import TagBadge

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

// Article Page Component - Updated with styling and components
export default async function ArticlePage({ params }: { params: Params }) {
    const article = getArticleBySlug(params.slug);

    // Handle case where article is not found
    if (!article) {
        notFound(); // Trigger 404 page
    }

    return (
        <main className="max-w-4xl mx-auto py-8 px-4"> {/* Slightly wider max-width */}
            <article>
                {/* Thinker Image */}
                <ThinkerImage name={article.thinker} />

                {/* Article Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">{article.title}</h1>
                <p className="text-sm text-gray-500 text-center mb-6">Gepubliceerd op: {article.date}</p>

                {/* Main Image */}
                {article.image?.url && (
                    <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-md"> {/* Added shadow */}
                        <Image
                            src={article.image.url}
                            alt={article.image.alt}
                            layout="fill"
                            objectFit="cover"
                            priority
                        />
                    </div>
                )}

                {/* Spin Quote */}
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-8 text-lg md:text-xl">
                    {article.spin}
                </blockquote>

                {/* Analyses Section - using prose for typography */}
                <div className="prose prose-lg lg:prose-xl max-w-none mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-3 border-b pb-1">Libertaire Analyse</h2>
                        <p>{article.libertarianAnalysis}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold mb-3 border-b pb-1">Anarchistische Analyse</h2>
                        <p>{article.anarchistAnalysis}</p>
                    </section>
                </div>

                {/* Thinker Quote */}
                <blockquote className="text-center border-l-4 border-gray-400 px-4 py-4 italic text-gray-800 my-10 bg-gray-50 rounded-md">
                    <p className="mb-2">"{article.quote}"</p>
                    <cite className="not-italic text-sm">- {article.thinker}</cite>
                </blockquote>

                {/* Footer Metadata: Thinker and Tags */}
                <div className="text-sm text-gray-600 mt-8 border-t pt-6">
                    <p className="mb-3"><strong>Denker:</strong> {article.thinker}</p>
                    <div>
                        <strong className="mr-2">Tags:</strong>
                        {article.tags.map((tag: string) => (
                            <TagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                </div>
            </article>
        </main>
    );
} 