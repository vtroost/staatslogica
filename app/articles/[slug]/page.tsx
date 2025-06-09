import fs from 'fs'; // Needed for generateStaticParams
import path from 'path'; // Needed for generateStaticParams and getArticleBySlug
import { getArticleBySlug } from '@/lib/articles'; 
import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers'; // Ensure this is imported
import type { ArticleFrontmatter, ThinkerData } from '@/lib/types'; 
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import for RSC
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Link for thinker link
import React from 'react'; // Import React for React.Fragment
// Keep other imports like ThinkerImage, TagBadge if needed for layout
// import { ThinkerImage } from '@/components/ThinkerImage';
// import { TagBadge } from '@/components/TagBadge';

const DEFAULT_IMAGE_URL = '/images/placeholder.jpg'; // Define placeholder path

// Helper function to generate slug (needed for thinker link)
function generateSlug(name: string): string {
  return (name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

// Breadcrumb component
const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
    <ol className="flex items-center space-x-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:underline hover:text-black">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-700">{item.label}</span> // Current page
          )}
        </li>
      ))}
    </ol>
  </nav>
);

// SVG Icon Components (can be moved to a separate file later)
const XIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
      const files = fs.readdirSync(articlesDirectory);
      return files
        .filter(f => f.endsWith('.mdx'))
        .map(file => {
          let slug = file.replace(/\.mdx$/, '');
          // Normalize the slug further to handle potential special characters in filenames
          // This aims to match common slugification practices more closely.
          slug = slug.toLowerCase()
                     .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                     .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except alphanumeric, space, hyphen
                     .trim()
                     .replace(/\s+/g, '-') // Replace spaces (and multiple spaces) with single hyphen
                     .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
          return { slug };
        });
  } catch (error) {
      console.error("Error reading articles directory for static params:", error);
      return []; // Return empty array on error
  }
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

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Denkers', href: '/denkers' },
    ];
    if (frontmatter.thinkers && frontmatter.thinkers.length > 0) {
        const firstThinkerInput = frontmatter.thinkers[0];
        let firstThinkerSlug: string | undefined;

        if (typeof firstThinkerInput === 'string') {
            firstThinkerSlug = firstThinkerInput;
        } else if (typeof firstThinkerInput === 'object' && firstThinkerInput !== null) {
            firstThinkerSlug = (firstThinkerInput as any).slug;
        }

        if (firstThinkerSlug) {
            const firstThinker = allThinkersData.find(t => t.slug === firstThinkerSlug);
            if (firstThinker) {
                breadcrumbItems.push({
                    label: firstThinker.name, 
                    href: `/denkers/${firstThinker.slug}`,
                });
            }
        }
    }
    breadcrumbItems.push({ label: frontmatter.title, href: '#' });

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

    return (
        <article className="max-w-2xl mx-auto px-4 py-12 md:py-16 font-sans">
            {/* Improved Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-400">
                <ol className="flex items-center space-x-1">
                    {breadcrumbItems.map((item, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && <span className="mx-1">/</span>}
                            {item.href ? (
                                <Link href={item.href} className="hover:underline hover:text-black">{item.label}</Link>
                            ) : (
                                <span className="font-medium text-gray-500">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                        {new Date(frontmatter.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {thinkersToDisplay.length > 0 && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            Perspectief: 
                            {thinkersToDisplay.map((thinker, index) => (
                                <React.Fragment key={thinker.slug}>
                                    {index > 0 && <>, </>}
                                    <Link href={`/denkers/${thinker.slug}`} className="hover:underline text-black font-medium">
                                        {thinker.name}
                                    </Link>
                                </React.Fragment>
                            ))}
                        </span>
                    )}
                    {frontmatter.sourceUrl && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg> {/* Link Icon */} 
                            <a href={frontmatter.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-black">Bron</a>
                            <span className="text-xs text-gray-400">({new URL(frontmatter.sourceUrl).hostname})</span>
                        </span>
                    )}
                    {/* Share Links */} 
                    <span className="flex items-center gap-3">
                        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" title="Deel op X" className="text-gray-400 hover:text-black transition-colors">
                            <XIcon />
                        </a>
                        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" title="Deel via WhatsApp" className="text-gray-400 hover:text-green-600 transition-colors">
                            <WhatsAppIcon />
                        </a>
                    </span>
                </div>
            </header>

            {/* Spin */}
            {frontmatter.spin && (
                <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700 mb-10 bg-blue-50 py-2 px-3 rounded">
                    {frontmatter.spin}
                </blockquote>
            )}

            {/* Article Content */}
            <div className="mb-8">
                {/* Prose styling for MDX content, with improved blockquote and conclusion styles */}
                <div className="prose prose-lg max-w-none prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:px-3 prose-blockquote:rounded prose-blockquote:text-gray-700 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5">
                    <MDXRemote source={content} />
                </div>
            </div>

            {/* Add Tags back if needed (Optional) */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-12 border-t pt-6">
                    <strong className="text-sm text-gray-500">Tags:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {frontmatter.tags.map((tag: string) => (
                            <span key={tag} className="inline-block bg-gray-200 px-2 py-1 text-xs rounded">
                                {tag}
                            </span>
                            // Or use TagBadge component
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
} 