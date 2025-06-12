import { getAllArticles } from '@/lib/articles'; 
import { getAllThinkers } from '@/lib/thinkers';
import type { Article, ThinkerData } from '@/lib/types'; 
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import TimelineComponent from './TimelineComponent';

// Define Params type
type Params = {
    tag: string;
};

// Extend Article type for sourceTitle
type ArticleWithSourceTitle = Article & { sourceTitle?: string };

// Define a type for article grouped by month/year
type GroupedArticles = {
    [key: string]: ArticleWithSourceTitle[];
};

// Generate static params for all unique tags
export async function generateStaticParams(): Promise<Params[]> {
    const articles: Article[] = getAllArticles();
    const uniqueTags = new Set<string>();

    articles.forEach((article: Article) => {
        if (Array.isArray(article.tags)) {
            article.tags.forEach(tag => {
                const slug = tag.toLowerCase().replace(/\s+/g, '-');
                uniqueTags.add(slug);
            });
        }
    });

    return Array.from(uniqueTags).map(tag => ({ tag }));
}

// Optimized metadata generation - reuse articles from function parameter
function findDisplayTagName(articles: Article[], tagName: string): string {
    let displayTagName = tagName;
    
    for (const article of articles) {
        if (Array.isArray(article.tags)) {
            const foundTag = article.tags.find(t => t.toLowerCase().replace(/\s+/g, '-') === tagName);
            if (foundTag) {
                displayTagName = foundTag;
                break;
            }
        }
    }
    
    return displayTagName;
}

// Generate metadata for Tag page
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const tagName = decodeURIComponent(params.tag);
    const allArticles: Article[] = getAllArticles(); // Single call here
    const displayTagName = findDisplayTagName(allArticles, tagName);

    return {
        title: `${displayTagName} | Staatslogica`,
        description: `Alle artikelen over ${displayTagName}. Kritische analyses vanuit het perspectief van grote denkers.`,
    };
}

// Tag Page Component
export default async function TagPage({ params }: { params: Params }) {
    const requestedTagSlug = params.tag.toLowerCase();
    const allArticlesData: Article[] = getAllArticles(); // Single call for the entire component
    const allThinkers = getAllThinkers();

    // Filter articles: match requested slug against normalized slugs of article tags
    const articles: Article[] = allArticlesData.filter((article: Article) => 
        Array.isArray(article.tags) && article.tags.some(tag => tag.toLowerCase().replace(/\s+/g, '-') === requestedTagSlug)
    );

    // Sort articles by date (newest first)
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Find the original tag name (with original casing) for display
    const displayTagName = findDisplayTagName(articles.length > 0 ? [articles[0]] : allArticlesData, requestedTagSlug);

    // If no articles found, show 404
    if (articles.length === 0) {
        notFound();
    }

    // Use all articles in the grid (no featured article)
    const taggedArticles = articles as ArticleWithSourceTitle[];
    
    // Group articles by month & year for the timeline
    const groupedArticles: GroupedArticles = {};
    taggedArticles.forEach(article => {
        const date = new Date(article.date);
        const key = format(date, 'MMMM yyyy', { locale: nl });
        
        if (!groupedArticles[key]) {
            groupedArticles[key] = [];
        }
        
        groupedArticles[key].push(article);
    });

    // Helper to render thinker links
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
                        currentSlug = (slugOrObject as any).slug || 'unknown-thinker';
                        displayName = (slugOrObject as any).name || 'Unknown Thinker';
                        key = currentSlug + '-' + idx;
                    } else {
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
        return tags[0];
    };

    return (
        <>
            {/* Header Section */}
            <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="mb-6">
                            <span className="inline-block bg-black bg-opacity-30 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide rounded">
                                Onderwerp
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
                            {displayTagName}
                        </h1>
                        <p className="text-lg text-black text-opacity-90 max-w-3xl mx-auto leading-relaxed">
                            {taggedArticles.length} artikel{taggedArticles.length !== 1 ? 'en' : ''} over dit onderwerp
                        </p>
                    </div>
                </div>
            </section>

            {/* Articles Grid with Timeline */}
            <section className="w-full bg-gray-50 py-12 md:py-16 border-t-4 border-yellow-400">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Alle artikelen
                        </h2>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Timeline Component */}
                        <div className="md:w-1/4">
                            <TimelineComponent groupedArticles={groupedArticles} />
                        </div>
                        
                        {/* Articles Grid */}
                        <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {taggedArticles.slice(0, 9).map((article: ArticleWithSourceTitle) => (
                                <article key={article.slug} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                                    {/* Article Image */}
                                    <Link href={`/articles/${article.slug}`} className="block relative h-48 bg-gray-200">
                                        {article.imageUrl ? (
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                <div className="text-black text-4xl font-bold opacity-70">
                                                    {article.title.charAt(0)}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Main Tag Overlay */}
                                        {getMainTag(article.tags) && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="inline-block bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase tracking-wide rounded shadow-md">
                                                    {getMainTag(article.tags)}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                    
                                    {/* Article Content */}
                                    <div className="p-6">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold mb-3 leading-tight">
                                            <Link 
                                                href={`/articles/${article.slug}`} 
                                                className="text-gray-900 hover:text-yellow-600 transition-colors"
                                            >
                                                {article.title}
                                            </Link>
                                        </h3>
                                        
                                        {/* Metadata */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
                                            <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}</span>
                                            {renderThinkerLinks(article.thinkers, "hover:underline text-yellow-600 font-bold")}
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
                                            className="text-yellow-600 hover:text-yellow-700 font-bold text-sm transition-colors"
                                        >
                                            Lees meer →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Topics Section */}
            <section className="w-full bg-white border-t-4 border-yellow-400 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gerelateerde onderwerpen</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        {/* Get unique tags from all articles in this topic */}
                        {Array.from(new Set(
                            articles.flatMap(article => 
                                article.tags?.filter(tag => 
                                    tag.toLowerCase().replace(/\s+/g, '-') !== requestedTagSlug
                                ) || []
                            )
                        )).slice(0, 10).map(tag => (
                            <Link
                                key={tag}
                                href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                                className="inline-block bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-black px-4 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                        <Link
                            href="/onderwerpen"
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold transition-colors"
                        >
                            Alle onderwerpen →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
} 