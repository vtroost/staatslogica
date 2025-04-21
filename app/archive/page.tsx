'use client'; // Needed for useState and event handlers

import { useState, useMemo, useEffect } from 'react';
import { getAllArticles, getAllThinkers, Article, ThinkerData } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

// Helper function to generate slug (consistent across pages)
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Note: We can't generate static metadata in a 'use client' component directly.
// If needed, generate metadata in a parent layout or use a separate server component.
/*
export const metadata: Metadata = {
  title: 'Archief | Staatslogica',
  description: 'Blader door alle gepubliceerde artikelen en analyses van Staatslogica.',
};
*/

export default function ArchivePage() {
    // State for articles, thinkers, and filter
    const [articles, setArticles] = useState<Article[]>([]);
    const [thinkers, setThinkers] = useState<ThinkerData[]>([]);
    const [selectedThinker, setSelectedThinker] = useState<string>('all'); // 'all' or thinker slug
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data on component mount
    useEffect(() => {
        // Fetching data client-side since this is interactive
        const fetchedArticles = getAllArticles();
        const fetchedThinkers = getAllThinkers();

        // Sort articles by date initially
        fetchedArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // Sort thinkers for the dropdown
        fetchedThinkers.sort((a, b) => a.name.localeCompare(b.name));

        setArticles(fetchedArticles);
        setThinkers(fetchedThinkers);
        setIsLoading(false);
    }, []);

    // Filter articles based on selected thinker
    const filteredArticles = useMemo(() => {
        if (selectedThinker === 'all') {
            return articles;
        }
        return articles.filter(article =>
            article.thinker && generateSlug(article.thinker) === selectedThinker
        );
    }, [articles, selectedThinker]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedThinker(event.target.value);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Archief</h1>

            {/* Filter Section */}
            <div className="mb-8 flex justify-end">
                <select
                    value={selectedThinker}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-4 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                    aria-label="Filter artikelen per denker"
                >
                    <option value="all">Alle denkers</option>
                    {thinkers.map(thinker => (
                        <option key={thinker.slug} value={thinker.slug}>
                            {thinker.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Article List */}
            {isLoading ? (
                <p className="text-center text-gray-500">Artikelen laden...</p>
            ) : filteredArticles.length > 0 ? (
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