import { getAllArticles } from '@/lib/articles'; 
import { getAllThinkers } from '@/lib/thinkers';
import Breadcrumb from '@/components/Breadcrumb';
import type { Article, ThinkerData } from '@/lib/types'; 
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import ArticleCard from '@/components/ArticleCard';

// Define Params type
type Params = {
    tag: string;
};

// Extend Article type for sourceTitle
type ArticleWithSourceTitle = Article & { sourceTitle?: string };

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



    return (
        <>
            {/* Compact Breadcrumb */}
            <div className="w-full bg-yellow-500 border-b border-yellow-600">
                <div className="max-w-6xl mx-auto">
                    <Breadcrumb 
                       items={[
                         { label: 'Home', href: '/' },
                         { label: 'Onderwerpen', href: '/onderwerpen' },
                         { label: displayTagName }
                       ]}
                       variant="yellow"
                     />
                </div>
            </div>

            {/* Header Section */}
            <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="max-w-4xl text-left mb-8">
                        
                    </div>
                    
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

            {/* Articles Grid */}
            <section className="w-full bg-gray-50 py-12 md:py-16 border-t-4 border-yellow-400">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Alle artikelen
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {taggedArticles.map((article: ArticleWithSourceTitle) => (
                            <ArticleCard 
                                key={article.slug}
                                article={article}
                                allThinkers={allThinkers}
                            />
                        ))}
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