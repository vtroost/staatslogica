import { getAllArticles } from '@/lib/articles';
import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import type { Article, ThinkerData } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

// Helper function to generate slug (consistent across pages)
function generateSlug(name: string): string {
  return name
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

interface ThinkerPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for each thinker
export async function generateStaticParams() {
  const thinkers = getAllThinkers();
  return thinkers.map(thinker => ({
    slug: thinker.slug,
  }));
}

export async function generateMetadata({ params }: ThinkerPageProps): Promise<Metadata> {
  const thinker = getThinkerBySlug(params.slug);
  if (!thinker) {
    return {
      title: 'Denkbeeld niet gevonden | Staatslogica',
    };
  }
  return {
    title: `${thinker.name} | Staatslogica`,
    description: `Artikelen en analyses van ${thinker.name} op Staatslogica.`,
  };
}

export default function ThinkerPage({ params }: ThinkerPageProps) {
  const { slug } = params;
  const thinker = getThinkerBySlug(slug);
  if (!thinker) notFound();

  // Get bio markdown content
  const bioContent = thinker.bioContent || null;

  // Image path (use /uploads/[slug].png)
  const imagePath = `/uploads/${slug}.png`;
  // Check if image exists in public/uploads
  let imageExists = false;
  try {
    imageExists = fs.existsSync(path.join(process.cwd(), 'public', 'uploads', `${slug}.png`));
  } catch (e) {
    imageExists = false;
  }

  // Get articles for this thinker
  const allArticles = getAllArticles();
  const thinkerArticles = allArticles.filter(article => article.thinkerSlug === slug);
  thinkerArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Extract name and years from the title in the frontmatter
  let displayName = thinker.name;
  let displayYears = '';
  if (thinker.title) {
    const match = thinker.title.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (match) {
      displayName = match[1];
      displayYears = match[2];
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 mb-10">
        <div className="flex-shrink-0 flex flex-col items-center w-full sm:w-auto">
          {imageExists ? (
            <Image
              src={imagePath}
              alt={thinker.name}
              width={160}
              height={160}
              className="rounded-full object-cover border border-gray-300 shadow-md w-36 h-36 sm:w-40 sm:h-40 mb-4 sm:mb-0"
              priority
            />
          ) : (
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-300 shadow-md mb-4 sm:mb-0">
              <svg xmlns='http://www.w3.org/2000/svg' className='w-16 h-16' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14c3.866 0 7-1.343 7-3V7a7 7 0 10-14 0v4c0 1.657 3.134 3 7 3z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14v7m0 0H9m3 0h3' /></svg>
            </div>
          )}
        </div>
        <div className="flex-1 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center sm:text-left border-b pb-3">
            {displayName}
            {displayYears && (
              <span className="ml-2 text-xl font-normal text-gray-500">({displayYears})</span>
            )}
          </h1>
          {bioContent ? (
            <div className="prose prose-lg max-w-none text-gray-800 mx-auto sm:mx-0">
              <MDXRemote source={bioContent} />
            </div>
          ) : (
            <p className="text-gray-500 text-center sm:text-left">Geen biografie beschikbaar.</p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">Artikelen van {thinker.name}</h2>
        {thinkerArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {thinkerArticles.map(article => (
              <div key={article.slug} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-2">
                  <Link href={`/articles/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                <div className="text-xs text-gray-500 mb-2">
                  <span>{new Date(article.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {article.spin && (
                  <p className="text-gray-600 text-sm mb-4 italic">{article.spin}</p>
                )}
                <div className="mt-auto pt-2">
                  <Link href={`/articles/${article.slug}`} className="text-sm font-medium text-black hover:underline">
                    Lees artikel →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center sm:text-left">Geen artikelen gevonden voor {thinker.name}.</p>
        )}
      </div>
    </div>
  );
} 