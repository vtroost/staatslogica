import fs from 'fs'; // Needed for generateStaticParams
import path from 'path'; // Needed for generateStaticParams and getArticleBySlug
import matter from 'gray-matter'; // Keep if getArticleBySlug is not used directly
import { getArticleBySlug } from '@/lib/mdx'; // Use the new MDX utility
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import for RSC
// Keep other imports like ThinkerImage, TagBadge if needed for layout
// import { ThinkerImage } from '@/components/ThinkerImage';
// import { TagBadge } from '@/components/TagBadge';

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

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
    return {
        title: `${articleData.data.title} | Staatslogica`,
        description: articleData.data.spin || 'Libertarische analyse', // Use spin or fallback description
        // Add other metadata like open graph image if available in frontmatter
        // openGraph: {
        //     images: [articleData.data.image?.url || '/default-og-image.jpg'],
        // },
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const article = getArticleBySlug(slug); // Use the utility to get parsed data and content

    if (!article) {
        notFound(); // Trigger 404 if article doesn't exist or fails to parse
    }

    const { data, content } = article; // Destructure frontmatter data and MDX content

    return (
        // Apply prose styling to the main article container
        <article className="prose prose-lg mx-auto px-4 py-8 max-w-3xl"> 
            {/* Optional: Add ThinkerImage or other components back if needed */}
            {/* <ThinkerImage name={data.thinker} /> */}

            <h1>{data.title}</h1>
            <p className="text-gray-500 text-sm">Gepubliceerd op: {data.date}</p>
            
            {/* Display optional frontmatter fields */}
            {data.spin && <blockquote className="italic">{data.spin}</blockquote>}
            {data.quote && <p className="text-sm"><strong>Quote:</strong> {data.quote}</p>}
            {data.thinker && <p className="text-sm"><strong>Denker:</strong> {data.thinker}</p>}
            
            {/* Render the MDX content */}
            <MDXRemote source={content} />

            {/* Optional: Add Tags back if needed */}
            {/* 
            {data.tags && data.tags.length > 0 && (
                <div className="mt-8 border-t pt-4">
                    <strong>Tags:</strong>
                    {data.tags.map((tag: string) => (
                        <TagBadge key={tag} tag={tag} />
                    ))}
                </div>
            )}
            */}
        </article>
    );
} 