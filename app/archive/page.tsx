// Remove 'use client'; - This is now a Server Component

// Remove client-side hooks
// import { useState, useMemo, useEffect } from 'react'; 
import { getAllArticles, getAllThinkers, Article, ThinkerData } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

// Helper function to generate slug (consistent across pages)
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Metadata can be static again
export const metadata: Metadata = {
  title: 'Archief | Staatslogica',
  description: 'Blader door alle gepubliceerde artikelen en analyses van Staatslogica.',
};

// Accept searchParams as a prop for Server Components
interface ArchivePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ArchivePage({ searchParams }: ArchivePageProps) {
    // Fetch data directly on the server
    const allArticles = getAllArticles();
    const thinkers = getAllThinkers();

    // Sort data
    allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    thinkers.sort((a, b) => a.name.localeCompare(b.name));

    // Get selected thinker from URL query parameters
    const selectedThinker = typeof searchParams?.thinker === 'string' ? searchParams.thinker : 'all';

    // Filter articles based on selected thinker
    const filteredArticles = selectedThinker === 'all'
        ? allArticles
        : allArticles.filter(article =>
            article.thinker && generateSlug(article.thinker) === selectedThinker
          );

    // No need for isLoading state

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Archief</h1>

            {/* Filter Section - Needs adjustment for server component */}
            {/* We'll use Links or a simple form to change the URL param */}
            <div className="mb-8 flex justify-end">
                {/* Simple Link-based filter buttons (Example) */}
                <div className="flex space-x-2 border border-gray-300 rounded p-1 bg-white">
                    <Link 
                        href="/archive"
                        className={`px-3 py-1 rounded text-sm ${selectedThinker === 'all' ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                    >
                        Alle
                    </Link>
                    {thinkers.map(thinker => (
                        <Link 
                            key={thinker.slug} 
                            href={`/archive?thinker=${thinker.slug}`}
                            className={`px-3 py-1 rounded text-sm ${selectedThinker === thinker.slug ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                        >
                            {thinker.name}
                        </Link>
                    ))}
                </div>
                {/* Alternative: Keep <select> but wrap in a client component or use a form */}
            </div>

            {/* Article List (remains mostly the same) */}
            {filteredArticles.length > 0 ? (
                <div className="space-y-6">
                    {filteredArticles.map((article) => (
                        <div key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                            <h2 className="text-xl font-semibold mb-2">
                                <Link href={`/articles/${article.slug}`} className="hover:underline">
                                    {article.title}
                                </Link>
                            </h2>
                            <div className="text-sm text-gray-500 mb-3 space-x-2">
                                <span>{article.date}</span>
                                {article.thinker && (
                                    <>
                                        <span>|</span>
                                        <span>Door: <Link href={`/denkbeelden/${generateSlug(article.thinker)}`} className="hover:underline text-black font-medium">{article.thinker}</Link></span>
                                    </>
                                )}
                            </div>
                            {article.spin && (
                                <p className="text-gray-600 text-sm mb-4 italic">{article.spin}</p>
                            )}
                            <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-black hover:underline">
                                Lees artikel →
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Geen artikelen gevonden {selectedThinker !== 'all' ? `voor ${thinkers.find(t => t.slug === selectedThinker)?.name || 'deze selectie'}` : '.'}
                </p>
            )}
        </div>
    );
} 