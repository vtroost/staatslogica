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

    // Prepare breadcrumb items
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Denkbeelden', href: '/denkbeelden' },
    ];
    if (frontmatter.thinker) {
        breadcrumbItems.push({
            label: frontmatter.thinker,
            href: `/denkbeelden/${generateSlug(frontmatter.thinker)}`,
        });
    }
    breadcrumbItems.push({ label: frontmatter.title, href: '#' }); // Current article, marked as non-navigable

    return (
        <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
            {/* Add Breadcrumbs */}
            <Breadcrumb items={breadcrumbItems} />

            {/* 1. Feature Image */}
            {frontmatter.imageUrl && (
                <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
                    <Image
                        src={frontmatter.imageUrl}
                        alt={frontmatter.title || 'Article feature image'}
                        fill
                        className="object-cover"
                        priority // Prioritize loading for LCP
                    />
                </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{frontmatter.title}</h1>
                <div className="text-sm text-gray-500 space-x-2">
                    <span>Gepubliceerd op: {frontmatter.date}</span>
                    {frontmatter.thinker && (
                        <>
                            <span>|</span>
                            <span>Denker: <Link href={`/denkbeelden/${generateSlug(frontmatter.thinker)}`} className="hover:underline text-black font-medium">{frontmatter.thinker}</Link></span>
                        </>
                    )}
                </div>

                {/* 2. Link to original source */}
                {frontmatter.sourceUrl && (
                    <p className="text-sm text-gray-600 mt-4 bg-gray-100 p-3 rounded inline-block">
                        Gebaseerd op:&nbsp;
                        <a href={frontmatter.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
                            Origineel artikel
                        </a>
                         ({new URL(frontmatter.sourceUrl).hostname}) {/* Show domain */}
                    </p>
                )}
            </header>

            {/* Optional Spin/Quote */}
            {frontmatter.spin && (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-8">
                    {frontmatter.spin}
                </blockquote>
            )}

            {/* 3. Single Analysis Block */}
            <div className="mb-8">
                {frontmatter.thinker && (
                    <h2 className="text-xl font-semibold mb-4 border-t pt-6">
                        Analyse vanuit het perspectief van {frontmatter.thinker}
                    </h2>
                )}
                {/* 4. Apply prose styling to the MDX content area */}
                <div className="prose prose-lg max-w-none">
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