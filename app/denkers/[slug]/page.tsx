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
function generateSlug(name: unknown): string {
  if (typeof name !== 'string' || !name) return '';
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
      title: 'Denker niet gevonden | Staatslogica',
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
  // Filter articles where the current thinker's slug is in the article's thinkers array
  const thinkerArticles = allArticles.filter(article => 
    article.thinkers && article.thinkers.includes(slug)
  );
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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row gap-10">
      {/* Main Column: Bio and Image */}
      <div className="flex-1 min-w-0">
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
      </div>

      {/* Sticky Sidebar: Article List */}
      <aside className="w-full lg:w-80 flex-shrink-0 lg:pl-6">
        <div className="lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Artikelen in de geest van {thinker.name}</h2>
          {thinkerArticles.length > 0 ? (
            <ul className="space-y-4">
              {thinkerArticles.map(article => (
                <li key={article.slug}>
                  <Link href={`/articles/${article.slug}`} className="block group">
                    <span className="text-sm text-gray-500 group-hover:text-black transition-colors">
                      {new Date(article.date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <br />
                    <span className="font-medium text-gray-900 group-hover:underline group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Geen artikelen gevonden die aansluiten bij het gedachtegoed van {thinker.name}.</p>
          )}
        </div>
      </aside>
    </div>
  );
} 