import { getAllArticles } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import type { Article, ThinkerData } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { useMemo } from 'react';
import React from 'react';
import ArticleCard from '@/components/ArticleCard';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica !',
  description: 'Doorzie staatspropaganda met scherpe analyses vanuit het perspectief van grote libertarische denkers. Elke dag nieuwe inzichten die mainstream media verzwijgt.',
};

// Helper function to generate slug (consistent with the thinker page)
function generateSlug(name: string): string {
  if (typeof name !== 'string' || !name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Breid het Article type uit zodat sourceTitle optioneel is
type ArticleWithSourceTitle = Article & { sourceTitle?: string };

export default function HomePage() {
    const articles = getAllArticles();
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Laatste artikel als featured, rest voor de grid
    const [featuredArticle, ...restArticles] = articles as ArticleWithSourceTitle[];

    const allThinkers = getAllThinkers();

    // Structured data for the homepage articles
    const siteUrl = 'https://staatslogica.nl';
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Staatslogica Artikelen",
        "description": "Laatste analyses van politieke gebeurtenissen vanuit libertarisch perspectief",
        "url": siteUrl,
        "numberOfItems": Math.min(articles.length, 10),
        "itemListElement": articles.slice(0, 10).map((article, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Article",
                "@id": `${siteUrl}/articles/${article.slug}`,
                "headline": article.title,
                "description": article.spin || `Libertarische analyse over ${article.title.toLowerCase()}`,
                "url": `${siteUrl}/articles/${article.slug}`,
                "datePublished": article.date,
                "dateModified": article.date,
                "author": {
                    "@type": "Organization",
                    "name": "Staatslogica"
                },
                "publisher": {
                    "@type": "Organization", 
                    "name": "Staatslogica",
                    "logo": `${siteUrl}/favicon.svg`
                },
                "image": article.imageUrl || `${siteUrl}/og-image.jpg`,
                "keywords": article.tags?.join(', ') || 'politiek, analyse',
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${siteUrl}/articles/${article.slug}`
                }
            }
        }))
    };

    // Helper to render thinker links (for featured article only)
    const renderThinkerLinks = (thinkerSlugs: string[] | undefined, linkClassName: string) => {
        if (!thinkerSlugs || thinkerSlugs.length === 0) return null;
        return (
            <span>
                Inspiratie: {thinkerSlugs.map((slugOrObject, idx) => {
                    let currentSlug: string;
                    let displayName: string;
                    let key: string;

                    if (typeof slugOrObject === 'string') {
                        currentSlug = slugOrObject;
                        key = slugOrObject;
                        const thinker = allThinkers.find(t => t.slug === currentSlug);
                        displayName = thinker ? thinker.name : currentSlug;
                    } else if (typeof slugOrObject === 'object' && slugOrObject !== null) {
                        // Attempt to gracefully handle an object, likely from incorrect MDX
                        currentSlug = (slugOrObject as any).slug || 'unknown-thinker';
                        displayName = (slugOrObject as any).name || 'Unknown Thinker';
                        key = currentSlug + '-' + idx; // Ensure key is unique if slug is missing
                    } else {
                        // Skip if it's neither string nor object (e.g. null/undefined in array)
                        return null;
                    }

                    return (
                        <React.Fragment key={key}>
                            {idx > 0 && ', '}
                            <Link href={`/denkers/${currentSlug}`} className={linkClassName}>
                                {displayName}
                            </Link>
                        </React.Fragment>
                    );
                })}
            </span>
        );
    };

    // Helper to get main tag for display (for featured article only)
    const getMainTag = (tags: string[] | undefined) => {
        if (!tags || tags.length === 0) return null;
        return tags[0]; // Return the first tag as the main one
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            
            {/* Featured Article - Full Width */}
            {featuredArticle && (
                <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 relative overflow-hidden">
                    {/* Background Image */}
                    {featuredArticle.imageUrl && (
                        <div className="absolute inset-0">
                            <Image
                                src={featuredArticle.imageUrl}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover opacity-30"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        </div>
                    )}
                    
                    <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
                        <div className="max-w-3xl">
                            {/* Main Tag */}
                            {getMainTag(featuredArticle.tags) && (
                                <div className="mb-4">
                                    <span className="inline-block bg-black bg-opacity-30 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded">
                                        {getMainTag(featuredArticle.tags)}
                                    </span>
                                </div>
                            )}
                            
                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {featuredArticle.title}
                            </h1>
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white text-opacity-95 mb-6">
                                <span>{new Date(featuredArticle.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                {renderThinkerLinks(featuredArticle.thinkers, "hover:underline text-white font-bold hover:text-gray-200")}
                            </div>

                            {/* Spin/Description */}
                            {featuredArticle.spin && (
                                <p className="text-lg text-white text-opacity-95 mb-8 leading-relaxed font-medium">
                                    {featuredArticle.spin}
                                </p>
                            )}
                            
                            {/* Read More Button */}
                            <Link
                                href={`/articles/${featuredArticle.slug}`}
                                className="inline-block bg-black text-yellow-400 px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Lees analyse
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Grid */}
            <section className="w-full bg-gray-50 py-12 md:py-16 border-t-4 border-yellow-400">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nieuwste artikelen</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restArticles.slice(0, 9).map((article: ArticleWithSourceTitle) => (
                            <ArticleCard 
                                key={article.slug}
                                article={article}
                                allThinkers={allThinkers}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
} 