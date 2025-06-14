'use client';

import { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import type { Article, ThinkerData } from '@/lib/types';

// Breid het Article type uit zodat sourceTitle optioneel is
type ArticleWithSourceTitle = Article & { sourceTitle?: string };

interface LoadMoreArticlesProps {
  initialArticles: ArticleWithSourceTitle[];
  allArticles: ArticleWithSourceTitle[];
  allThinkers: ThinkerData[];
  initialLimit: number;
}

export default function LoadMoreArticles({ 
  initialArticles, 
  allArticles, 
  allThinkers, 
  initialLimit 
}: LoadMoreArticlesProps) {
  const [displayedArticles, setDisplayedArticles] = useState<ArticleWithSourceTitle[]>(initialArticles);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  
  const loadMore = () => {
    const newLimit = currentLimit + 9;
    const newArticles = allArticles.slice(0, newLimit);
    setDisplayedArticles(newArticles);
    setCurrentLimit(newLimit);
  };

  const hasMore = currentLimit < allArticles.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article: ArticleWithSourceTitle) => (
          <ArticleCard 
            key={article.slug}
            article={article}
            allThinkers={allThinkers}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Laad meer artikelen
          </button>
        </div>
      )}
    </>
  );
} 