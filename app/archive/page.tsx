// Remove 'use client'; - This is now a Server Component

// Remove client-side hooks
// import { useState, useMemo, useEffect } from 'react'; 

// Update imports for refactored modules
import { getAllArticles } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import type { Article, ThinkerData } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import React from 'react';

// Helper function to generate slug (consistent across pages)
function generateSlug(name: string): string {
  return name
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Metadata can be static again
export const metadata: Metadata = {
  title: 'Archief | Staatslogica',
  description: 'Blader door alle gepubliceerde artikelen en analyses van Staatslogica.',
};

export default function ArchivePage() {
    // Fetch data directly on the server
    const allArticles: Article[] = getAllArticles();
    const thinkers: ThinkerData[] = getAllThinkers();

    // Sort data
    allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    thinkers.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Archief</h1>

            {/* Thinkers Navigation */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Denkers</h2>
                <div className="flex flex-wrap gap-2">
                    {thinkers.map((thinker: ThinkerData) => (
                        <Link 
                            key={thinker.slug} 
                            href={`/denkers/${thinker.slug}`}
                            className="flex items-center space-x-1.5 px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200"
                        >
                            <span>{thinker.name}</span>
                            {thinker.articleCount > 0 && (
                                <span className="inline-block bg-gray-400 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                    {thinker.articleCount}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* All Articles List */}
            <div className="space-y-6">
                {allArticles.map((article: Article) => (
                    <div key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">
                            <Link href={`/articles/${article.slug}`} className="hover:underline">
                                {article.title}
                            </Link>
                        </h2>
                        <div className="text-sm text-gray-500 mb-3 space-x-2">
                            <span>
                                {new Date(article.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {article.thinkers && article.thinkers.length > 0 && (
                                <>
                                    <span>|</span>
                                    <span>
                                        Perspectief: {article.thinkers.map((slugOrObject, idx) => {
                                            let currentSlug: string;
                                            let displayName: string;
                                            let key: string;

                                            if (typeof slugOrObject === 'string') {
                                                currentSlug = slugOrObject;
                                                key = slugOrObject;
                                                const thinker = thinkers.find(t => t.slug === currentSlug);
                                                displayName = thinker ? thinker.name : currentSlug;
                                            } else if (typeof slugOrObject === 'object' && slugOrObject !== null) {
                                                currentSlug = (slugOrObject as any).slug || `unknown-archive-${idx}`;
                                                displayName = (slugOrObject as any).name || 'Unknown Thinker';
                                                key = currentSlug + '-' + idx; 
                                            } else {
                                                return null; // Skip if not string or object
                                            }
                                            
                                            return (
                                                <React.Fragment key={key}>
                                                    {idx > 0 && ', '}
                                                    <Link href={`/denkers/${currentSlug}`} className="hover:underline text-black font-medium">
                                                        {displayName}
                                                    </Link>
                                                </React.Fragment>
                                            );
                                        })}
                                    </span>
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
        </div>
    );
} 