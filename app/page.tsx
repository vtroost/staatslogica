import { getAllArticles } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import type { Article, ThinkerData } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { useMemo } from 'react';
import React from 'react';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica | Kritische denkers. Heldere analyses.',
  description: 'Dagelijkse AI-gegenereerde nieuwsanalyses vanuit het perspectief van grote denkers. Kritisch, satirisch, principieel.',
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

    // Helper to render thinker links
    const renderThinkerLinks = (thinkerSlugs: string[] | undefined, linkClassName: string) => {
        if (!thinkerSlugs || thinkerSlugs.length === 0) return null;
        return (
            <span>
                Perspectief: {thinkerSlugs.map((slugOrObject, idx) => {
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

    // Helper to get main tag for display
    const getMainTag = (tags: string[] | undefined) => {
        if (!tags || tags.length === 0) return null;
        return tags[0]; // Return the first tag as the main one
    };

    return (
        <>
            {/* Featured Article - Full Width */}
            {featuredArticle && (
                <section className="w-full bg-gradient-to-r from-red-600 to-orange-500 relative overflow-hidden">
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
                                    <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 text-sm font-medium uppercase tracking-wide rounded">
                                        {getMainTag(featuredArticle.tags)}
                                    </span>
                                </div>
                            )}
                            
                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {featuredArticle.title}
                            </h1>
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white text-opacity-90 mb-6">
                                <span>{new Date(featuredArticle.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                {renderThinkerLinks(featuredArticle.thinkers, "hover:underline text-white font-medium")}
                            </div>

                            {/* Spin/Description */}
                            {featuredArticle.spin && (
                                <p className="text-lg text-white text-opacity-95 mb-8 leading-relaxed">
                                    {featuredArticle.spin}
                                </p>
                            )}
                            
                            {/* Read More Button */}
                            <Link
                                href={`/articles/${featuredArticle.slug}`}
                                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Lees analyse
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles Grid */}
            <section className="w-full bg-gray-50 py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">Nieuwste artikelen</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restArticles.slice(0, 9).map((article: ArticleWithSourceTitle) => (
                            <article key={article.slug} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                                {/* Article Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {article.imageUrl ? (
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <div className="text-white text-4xl font-bold opacity-50">
                                                {article.title.charAt(0)}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Main Tag Overlay */}
                                    {getMainTag(article.tags) && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-block bg-black bg-opacity-75 text-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded">
                                                {getMainTag(article.tags)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Article Content */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold mb-3 leading-tight">
                                        <Link 
                                            href={`/articles/${article.slug}`} 
                                            className="text-gray-900 hover:text-blue-700 transition-colors"
                                        >
                                            {article.title}
                                        </Link>
                                    </h3>
                                    
                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
                                        <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}</span>
                                        {renderThinkerLinks(article.thinkers, "hover:underline text-gray-700 font-medium")}
                                    </div>
                                    
                                    {/* Spin/Description */}
                                    {article.spin && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                            {article.spin.length > 120 ? `${article.spin.substring(0, 120)}...` : article.spin}
                                        </p>
                                    )}
                                    
                                    {/* Read More */}
                                    <Link 
                                        href={`/articles/${article.slug}`} 
                                        className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors"
                                    >
                                        Lees meer →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
} 