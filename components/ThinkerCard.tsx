import Link from 'next/link';
import Image from 'next/image';
import { getStromingBySlug } from '@/lib/stromingen';
import { getBooksByAuthor } from '@/lib/books';
import StromingBadge from '@/components/StromingBadge';
import type { Stroming } from '@/lib/types';

interface ThinkerCardProps {
  thinker: {
    slug: string;
    name: string;
    title?: string;
    tagline?: string;
    articleCount: number;
    stroming?: string;
  };
  overrideStroming?: Stroming; // Optional override for specific stroming pages
}

export default function ThinkerCard({ thinker, overrideStroming }: ThinkerCardProps) {
  // Extract years from title
  let years = '';
  if (thinker.title) {
    const match = thinker.title.match(/\(([^)]+)\)/);
    if (match) years = match[1];
  }
  
  // Get stroming (use override if provided, otherwise get from thinker)
  const stroming = overrideStroming || (thinker.stroming ? getStromingBySlug(thinker.stroming) : null);
  
  // Check if thinker has books
  const hasBooks = getBooksByAuthor(thinker.slug).length > 0;
  
  return (
    <Link 
      href={`/denkers/${thinker.slug}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          <Image
            src={`/uploads/${thinker.slug}.png`}
            alt={thinker.name}
            width={112}
            height={112}
            className="object-contain opacity-90 group-hover:scale-105 transition-transform duration-300"
            style={{ 
              mixBlendMode: 'multiply'
            }}
          />
        </div>
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {stroming && (
            <StromingBadge stroming={stroming} size="sm" />
          )}
          {years && (
            <span className="inline-block bg-black bg-opacity-30 text-black px-3 py-1 text-xs font-bold rounded">
              {years}
            </span>
          )}
        </div>
        
        {hasBooks && (
          <Link 
            href="/bibliotheek"
            className="absolute bottom-3 right-3 bg-blue-600 bg-opacity-90 text-white px-3 py-1 text-xs font-bold rounded hover:bg-opacity-100 transition-all z-10"
          >
            bibliotheek →
          </Link>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
          {thinker.name}
        </h2>
        
        <div className="flex-grow mb-4">
          {thinker.tagline && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {thinker.tagline.length > 120 ? `${thinker.tagline.substring(0, 120)}...` : thinker.tagline}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-base mt-auto pt-4 border-t border-gray-100">
          {thinker.articleCount > 0 ? (
            <span className="text-yellow-600 font-bold">
              {thinker.articleCount} artikel{thinker.articleCount !== 1 ? 'en' : ''}
            </span>
          ) : (
            <span className="text-gray-400">
              Geen artikelen
            </span>
          )}
          
          <span className="text-yellow-600 group-hover:text-yellow-700 font-bold">
            Lees meer →
          </span>
        </div>
      </div>
    </Link>
  );
} 