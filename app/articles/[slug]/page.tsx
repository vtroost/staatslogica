import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import path from 'path';
import React from 'react';
import fs from 'fs';

// Constants
const DEFAULT_IMAGE_URL = '/images/default-article.jpg';

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

const XIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const WhatsAppIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const articleData = getArticleBySlug(slug);
    
    if (!articleData) {
        return { title: 'Artikel niet gevonden' };
    }

    const frontmatter = articleData.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://staatslogica.nl';
    
    // Fetch thinker names for description
    let thinkerNames = 'een denker';
    if (frontmatter.thinkers && frontmatter.thinkers.length > 0) {
        const allThinkersData = getAllThinkers();
        const names = frontmatter.thinkers.map(slugOrObject => {
            let currentSlug: string;
            let displayName: string;
            if (typeof slugOrObject === 'string') {
                currentSlug = slugOrObject;
                const thinker = allThinkersData.find(t => t.slug === currentSlug);
                displayName = thinker ? thinker.name : currentSlug;
            } else if (typeof slugOrObject === 'object' && slugOrObject !== null) {
                displayName = (slugOrObject as any).name || 'Unknown Thinker';
            } else {
                displayName = 'Unknown';
            }
            return displayName;
        });
        if (names.length > 0) thinkerNames = names.join(', ');
    }

    return {
        metadataBase: new URL(siteUrl),
        title: `${frontmatter.title} | Staatslogica`,
        description: frontmatter.spin || `Analyse vanuit het perspectief van ${thinkerNames}`,
        openGraph: {
            images: [frontmatter.imageUrl || '/default-og-image.jpg'],
        },
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const { data: frontmatter, content } = article;
    const imageUrl = frontmatter.imageUrl || DEFAULT_IMAGE_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://staatslogica.nl';
    const articleUrl = `${siteUrl}/articles/${slug}`;
    const encodedUrl = encodeURIComponent(articleUrl);
    const encodedTitle = encodeURIComponent(frontmatter.title);
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

    const allThinkersData = getAllThinkers();

    const thinkersToDisplay = frontmatter.thinkers
        ? frontmatter.thinkers.map((slugOrObject, idx) => {
            let currentSlug: string;
            let displayName: string;

            if (typeof slugOrObject === 'string') {
                currentSlug = slugOrObject;
                const thinker = allThinkersData.find(t => t.slug === currentSlug);
                displayName = thinker ? thinker.name : currentSlug;
            } else if (typeof slugOrObject === 'object' && slugOrObject !== null) {
                currentSlug = (slugOrObject as any).slug || `unknown-thinker-${idx}`;
                displayName = (slugOrObject as any).name || 'Unknown Thinker';
            } else {
                currentSlug = `unknown-thinker-${idx}`;
                displayName = 'Unknown';
            }
            return { name: displayName, slug: currentSlug };
          })
        : [];

    // Create structured data for the article
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": frontmatter.title,
        "description": frontmatter.spin || `Analyse vanuit het perspectief van ${thinkersToDisplay.map(t => t.name).join(', ')}`,
        "image": frontmatter.imageUrl || `${siteUrl}/og-image.jpg`,
        "author": {
            "@type": "Organization",
            "name": "Staatslogica",
            "url": siteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "Staatslogica",
            "url": siteUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/favicon.ico`
            }
        },
        "datePublished": frontmatter.date,
        "dateModified": frontmatter.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        },
        "keywords": frontmatter.tags?.join(', ') || '',
        "articleSection": "Political Analysis",
        "inLanguage": "nl-NL"
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
            
            {/* Yellow accent strip */}
            <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
            
            <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Article Content */}
                <article className="flex-1 max-w-2xl font-sans">
                    {/* Only render image if present and non-empty */}
                    {frontmatter.imageUrl && frontmatter.imageUrl.trim() !== '' && (
                        <div className="mb-8 aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                            <Image
                                src={frontmatter.imageUrl}
                                alt={frontmatter.title || 'Article feature image'}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">{frontmatter.title}</h1>
                        
                        {/* First line: Date left, Social links right */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                                {new Date(frontmatter.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <div className="flex items-center gap-3">
                                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" title="Deel op X" className="text-gray-400 hover:text-yellow-600 transition-colors">
                                    <XIcon />
                                </a>
                                <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" title="Deel via WhatsApp" className="text-gray-400 hover:text-yellow-600 transition-colors">
                                    <WhatsAppIcon />
                                </a>
                            </div>
                        </div>

                        {/* Second line: Source link */}
                        {frontmatter.sourceUrl && (
                            <div className="text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                    <a href={frontmatter.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-600 font-medium">
                                        {(() => {
                                            const hostname = new URL(frontmatter.sourceUrl).hostname;
                                            const sourceName = hostname === 'nos.nl' ? 'NOS' : 
                                                             hostname === 'nu.nl' ? 'NU.nl' : 
                                                             hostname === 'ad.nl' ? 'AD' :
                                                             hostname === 'telegraaf.nl' ? 'Telegraaf' :
                                                             hostname === 'volkskrant.nl' ? 'Volkskrant' :
                                                             hostname === 'nrc.nl' ? 'NRC' :
                                                             hostname.replace('www.', '').toUpperCase();
                                            return `${sourceName}: ${frontmatter.sourceTitle || 'Lees artikel'}`;
                                        })()}
                                    </a>
                                </span>
                            </div>
                        )}
                    </header>

                    {/* Spin */}
                    {frontmatter.spin && (
                        <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-800 mb-10 bg-yellow-50 py-3 px-4 rounded-lg font-medium">
                            {frontmatter.spin}
                        </blockquote>
                    )}

                    {/* Article Content */}
                    <div className="mb-8">
                        <div className="prose prose-lg max-w-none prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5 prose-a:text-yellow-600 prose-a:font-medium hover:prose-a:text-yellow-700">
                            <MDXRemote source={content} />
                        </div>
                    </div>

                    {/* Tags */}
                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                        <div className="mt-12 border-t pt-6">
                            <strong className="text-sm text-gray-500">Tags:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {frontmatter.tags.map((tag: string) => (
                                    <span key={tag} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* Thinker Sidebar */}
                {thinkersToDisplay.length > 0 && (
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-8">
                            <h2 className="text-lg font-semibold mb-6 text-gray-900 text-center">Geïnspireerd door</h2>
                            <div className="space-y-6">
                                {thinkersToDisplay.map((thinker) => (
                                    <Link
                                        key={thinker.slug}
                                        href={`/denkers/${thinker.slug}`}
                                        className="block group"
                                    >
                                        <div className="text-center">
                                            {/* Thinker Image */}
                                            <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                                                <Image
                                                    src={`/uploads/${thinker.slug}.png`}
                                                    alt={thinker.name}
                                                    fill
                                                    className="object-cover opacity-90"
                                                    style={{ filter: 'brightness(0)' }}
                                                />
                                            </div>
                                            {/* Thinker Name */}
                                            <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                                {thinker.name}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
        </>
    );
} 