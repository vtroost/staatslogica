import { getAllArticles, Article } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { useMemo } from 'react';

// Add static metadata for the homepage
export const metadata: Metadata = {
  title: 'Staatslogica | Kritische denkers. Heldere analyses.',
  description: 'Dagelijkse AI-gegenereerde nieuwsanalyses vanuit het perspectief van grote denkers. Kritisch, satirisch, principieel.',
};

// Helper function to generate slug (consistent with the thinker page)
function generateSlug(name: string): string {
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

    return (
        <>
            {/* Blauwe hero met nieuwste artikel */}
            <section className="w-full bg-blue-900 py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-4 text-left">
                    {latest && (
                        <>
                            <div className="mb-4 text-sm text-blue-200">Bron: {latest.sourceUrl ? <a href={latest.sourceUrl} className="underline hover:text-white" target="_blank" rel="noopener noreferrer">{new URL(latest.sourceUrl).hostname}</a> : 'Onbekend'}</div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{latest.title}</h1>
                            {latest.spin && <p className="text-lg text-blue-100 mb-8">{latest.spin}</p>}
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
                        {rest.slice(0, articlesToShow - 1).map((article) => (
                            <li key={article.slug} className="border-b border-gray-200 pb-6">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mb-1">
                                    <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    {article.thinker && article.thinkerSlug && (
                                        <span>
                                            door <Link href={`/denkbeelden/${article.thinkerSlug}`} className="hover:underline text-black font-medium">{article.thinker}</Link>
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Bron: {article.sourceUrl ? (
                                        <>
                                            {article.sourceUrl && (
                                                <>
                                                    {new URL(article.sourceUrl).hostname}
                                                    {article.sourceTitle && (
                                                        <>
                                                            {'  '}
                                                            <a href={article.sourceUrl} className="italic underline hover:text-black" target="_blank" rel="noopener noreferrer">"{article.sourceTitle}"</a>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    ) : 'Onbekend'}
                                </div>
                                <h3 className="text-xl font-semibold mb-1">
                                    <Link href={`/articles/${article.slug}`} className="hover:underline text-gray-900">
                                        {article.title}
                                    </Link>
                                </h3>
                                {article.spin && <p className="text-gray-700 mb-2">{article.spin}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
                <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                    <div className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Staatslogica</div>
                    <div className="flex space-x-4">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.11 2.9 3.97 2.93A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z" /></svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-700">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.68 0H1.32A1.32 1.32 0 0 0 0 1.32v21.36A1.32 1.32 0 0 0 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09A1.32 1.32 0 0 0 24 22.68V1.32A1.32 1.32 0 0 0 22.68 0" /></svg>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
} 