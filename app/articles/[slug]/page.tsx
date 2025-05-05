import fs from 'fs'; // Needed for generateStaticParams
import path from 'path'; // Needed for generateStaticParams and getArticleBySlug
import { getArticleBySlug, ArticleFrontmatter } from '@/lib/mdx'; // Use the new MDX utility and import interface
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import for RSC
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Link for thinker link
// Keep other imports like ThinkerImage, TagBadge if needed for layout
// import { ThinkerImage } from '@/components/ThinkerImage';
// import { TagBadge } from '@/components/TagBadge';

const DEFAULT_IMAGE_URL = '/images/placeholder.jpg'; // Define placeholder path

// Helper function to generate slug (needed for thinker link)
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
      const files = fs.readdirSync(articlesDirectory);
      return files
        .filter(f => f.endsWith('.mdx'))
        .map(file => ({ slug: file.replace(/\.mdx$/, '') }));
  } catch (error) {
      console.error("Error reading articles directory for static params:", error);
      return []; // Return empty array on error
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const articleData = getArticleBySlug(slug); // Fetch data using the new utility
    
    if (!articleData) {
        return { title: 'Artikel niet gevonden' };
    }

    // No need to cast here anymore, use articleData.data directly
    const frontmatter = articleData.data; 

    return {
        title: `${frontmatter.title} | Staatslogica`,
        description: frontmatter.spin || `Analyse vanuit het perspectief van ${frontmatter.thinker || 'een denker'}`,
        openGraph: {
            images: [frontmatter.imageUrl || '/default-og-image.jpg'], // Access directly
        },
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const article = getArticleBySlug(slug); // Use the utility to get parsed data and content

    if (!article) {
        notFound(); // Trigger 404 if article doesn't exist or fails to parse
    }

    // No need to cast here anymore
    const { data: frontmatter, content } = article;
    const imageUrl = frontmatter.imageUrl || DEFAULT_IMAGE_URL; // Use default if missing

    // Prepare breadcrumb items
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Denkbeelden', href: '/denkbeelden' },
    ];
    if (frontmatter.thinker && frontmatter.thinkerSlug) {
        breadcrumbItems.push({
            label: frontmatter.thinker,
            href: `/denkbeelden/${frontmatter.thinkerSlug}`,
        });
    }
    breadcrumbItems.push({ label: frontmatter.title, href: '#' }); // Current article, marked as non-navigable

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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                        {new Date(frontmatter.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {frontmatter.thinker && frontmatter.thinkerSlug && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            Denker: <Link href={`/denkbeelden/${frontmatter.thinkerSlug}`} className="hover:underline text-black font-medium">{frontmatter.thinker}</Link>
                        </span>
                    )}
                    {frontmatter.sourceUrl && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19v-6m0 0V5m0 8l-4-4m4 4l4-4" /></svg>
                            <a href={frontmatter.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-black">Bron</a>
                            <span className="text-xs text-gray-400">({new URL(frontmatter.sourceUrl).hostname})</span>
                        </span>
                    )}
                </div>
            </header>

            {/* Optional Spin/Quote */}
            {frontmatter.spin && (
                <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700 mb-10 bg-blue-50 py-2 px-3 rounded">
                    {frontmatter.spin}
                </blockquote>
            )}

            {/* Article Content */}
            <div className="mb-8">
                {frontmatter.thinker && (
                    <h2 className="text-xl font-semibold mb-4 border-t pt-6">Analyse vanuit het perspectief van {frontmatter.thinker}</h2>
                )}
                {/* Prose styling for MDX content, with improved blockquote and conclusion styles */}
                <div className="prose prose-lg max-w-none prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:px-3 prose-blockquote:rounded prose-blockquote:text-gray-700 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-5">
                    <MDXRemote source={content} />
                </div>
            </div>

            {/* Add Tags back if needed (Optional) */}
            {/*
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
            */}
        </article>
    );
} 