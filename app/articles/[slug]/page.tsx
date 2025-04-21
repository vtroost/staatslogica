import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ThinkerImage } from '@/components/ThinkerImage';
import { TagBadge } from '@/components/TagBadge';

// Generate params for all articles
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const slugs = getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Enable generateMetadata again
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const article = getArticleBySlug(slug);
    if (!article) {
        return { title: 'Artikel niet gevonden' };
    }
    return {
        title: `${article.title} | Staatslogica`,
        description: article.spin,
    };
}

// Restore original Article Page Component logic (synchronous)
export default function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <article>
            {/* Thinker Image */}
            <ThinkerImage name={article.thinker} />

            {/* Main Image */}
            {article.image?.url && (
                <div>
                    <Image
                        src={article.image.url}
                        alt={article.image.alt}
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
            )}

             {/* Article Content with Prose Styling */}
            <div>
                <h1>{article.title}</h1>
                <p>{article.date}</p>
                <blockquote>{article.spin}</blockquote>
                <h2>Libertaire Analyse</h2>
                <p>{article.libertarianAnalysis}</p>
                <h2>Anarchistische Analyse</h2>
                <p>{article.anarchistAnalysis}</p>
                <blockquote>{article.quote}</blockquote>
             </div>

            {/* Footer Metadata: Thinker and Tags */}
            <div>
                <p><strong>Denker:</strong> {article.thinker}</p>
                <div>
                    <strong>Tags:</strong>
                    {article.tags.map((tag: string) => (
                        <TagBadge key={tag} tag={tag} />
                    ))}
                </div>
            </div>
        </article>
    );
} 