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

    // Laatste 6 artikelen voor een 2x3 grid op desktop
    const articlesToShow = 6;
    const [latest, ...rest] = articles as ArticleWithSourceTitle[];

    const allThinkers = getAllThinkers();

    // Helper to render thinker links
    const renderThinkerLinks = (thinkerSlugs: string[] | undefined, linkClassName: string) => {
        if (!thinkerSlugs || thinkerSlugs.length === 0) return null;
        return (
            <span>
                Perspectief: {thinkerSlugs.map((slug, idx) => {
                    const thinker = allThinkers.find(t => t.slug === slug);
                    const name = thinker ? thinker.name : slug;
                    return (
                        <React.Fragment key={slug}>
                            {idx > 0 && ', '}
                            <Link href={`/denkers/${slug}`} className={linkClassName}>
                                {name}
                            </Link>
                        </React.Fragment>
                    );
                })}
            </span>
        );
    };

    return (
        <>
            {/* Blauwe hero met nieuwste artikel */}
            <section className="w-full bg-blue-900 py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-4 text-left">
                    {latest && (
                        <>
                            {/* Title First */}
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{latest.title}</h1>
                            
                            {/* Metadata Row Below Title */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-200 mb-4">
                                <span>{new Date(latest.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                {renderThinkerLinks(latest.thinkerSlugs, "hover:underline text-white font-medium")}
                                {latest.sourceUrl && (
                                    <span>
                                        Bron: <a href={latest.sourceUrl} className="underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">{new URL(latest.sourceUrl).hostname}</a> 
                                    </span>
                                )}
                            </div>

                            {/* Spin/Description */} 
                            {latest.spin && <p className="text-lg text-blue-100 mb-8">{latest.spin}</p>}
                            
                            {/* Button */} 
                            <a
                                href={`/articles/${latest.slug}`}
                                className="inline-block bg-white text-blue-900 px-6 py-3 rounded font-semibold hover:bg-blue-100 border border-white transition-colors"
                            >
                                Lees analyse
                            </a>
                        </>
                    )}
                </div>
            </section>

            {/* Overige artikelen als lijst */}
            <section className="w-full bg-white py-12 md:py-16">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-left">Nieuwste artikelen</h2>
                    <ul className="space-y-8">
                        {rest.slice(0, articlesToShow - 1).map((article: ArticleWithSourceTitle) => (
                            // Wrap each item in a card
                            <li key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Article Title first and prominent */} 
                                <h3 className="text-xl font-semibold mb-2">
                                    <Link href={`/articles/${article.slug}`} className="text-gray-900 hover:text-blue-700 transition-colors">
                                        {article.title}
                                    </Link>
                                </h3>
                                {/* Metadata row */} 
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                                    <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    {renderThinkerLinks(article.thinkerSlugs, "hover:underline text-gray-700 font-medium")}
                                    {/* Simplified Source Link */} 
                                    {article.sourceUrl && (
                                        <span>
                                            Bron: <a href={article.sourceUrl} className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">{new URL(article.sourceUrl).hostname}</a>
                                        </span>
                                    )}
                                </div>
                                {/* Spin/Intro text */} 
                                {article.spin && <p className="text-gray-700 mb-4">{article.spin}</p>}
                                {/* Read More Link */} 
                                <div> {/* Wrapper div for alignment if needed */}
                                    <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                                        Lees analyse →
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Footer is handled by Layout.tsx */}
        </>
    );
} 