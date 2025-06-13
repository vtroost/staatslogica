import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article & { sourceTitle?: string };
  allThinkers?: Array<{ name: string; slug: string }>;
  categoryColor?: string;
}

export default function ArticleCard({ article, allThinkers = [], categoryColor }: ArticleCardProps) {
  // Helper to render thinker links
  const renderThinkerLinks = (thinkerSlugs: string[] | undefined, linkClassName: string) => {
    if (!thinkerSlugs || thinkerSlugs.length === 0) return null;
    return (
      <span>
        Inspiratie: {thinkerSlugs.map((slugOrObject, idx) => {
          let currentSlug: string;
          let displayName: string;
          let key: string;

          if (typeof slugOrObject === 'string') {
            currentSlug = slugOrObject;
            key = slugOrObject;
            const thinker = allThinkers.find(t => t.slug === currentSlug);
            displayName = thinker ? thinker.name : currentSlug;
          } else if (typeof slugOrObject === 'object' && slugOrObject !== null) {
            currentSlug = (slugOrObject as any).slug || 'unknown-thinker';
            displayName = (slugOrObject as any).name || 'Unknown Thinker';
            key = currentSlug + '-' + idx;
          } else {
            return null;
          }

          return (
            <React.Fragment key={key}>
              {idx > 0 && ', '}
              <Link href={`/denkers/${currentSlug}`} className={linkClassName}>
                {displayName}
              </Link>
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  // Helper to get main tag for display
  const getMainTag = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return null;
    return tags[0];
  };

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Article Image */}
      <Link href={`/articles/${article.slug}`} className="block relative h-48 bg-gray-200">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full ${categoryColor ? `bg-gradient-to-br ${categoryColor}` : 'bg-gradient-to-br from-yellow-400 to-yellow-500'} flex items-center justify-center`}>
            <div className={`text-4xl font-bold opacity-70 ${categoryColor ? 'text-white' : 'text-black'}`}>
              {article.title.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Main Tag Overlay */}
        {getMainTag(article.tags) && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase tracking-wide rounded shadow-md">
              {getMainTag(article.tags)}
            </span>
          </div>
        )}
      </Link>
      
      {/* Article Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 leading-tight">
          <Link 
            href={`/articles/${article.slug}`} 
            className="text-gray-900 hover:text-yellow-600 transition-colors"
          >
            {article.title}
          </Link>
        </h3>
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
          <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          {renderThinkerLinks(article.thinkers, "hover:underline text-yellow-600 font-bold")}
        </div>
        
        {/* Spin/Description */}
        {article.spin && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {article.spin.length > 120 ? `${article.spin.substring(0, 120)}...` : article.spin}
          </p>
        )}
        
        {/* Read More */}
        <Link 
          href={`/articles/${article.slug}`} 
          className="text-yellow-600 hover:text-yellow-700 font-bold text-sm transition-colors"
        >
          Lees meer →
        </Link>
      </div>
    </article>
  );
} 