import { getAllCategories, getCategoryBySlug, getArticlesByCategory, getCategoryColor, getOtherCategories, getCategoryContext } from '@/lib/categories';
import { getAllThinkers } from '@/lib/thinkers';
import type { Article } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Categorie niet gevonden',
    };
  }

  return {
    title: `${category.name} - Staatslogica`,
    description: `${category.description} - Bekijk alle analyses over ${category.name.toLowerCase()}.`,
    keywords: ['staatslogica', 'analyse', category.name.toLowerCase(), ...category.topics],
  };
}

type ArticleWithSourceTitle = Article & { sourceTitle?: string };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = getCategoryBySlug(slug);
  const context = getCategoryContext(slug);
  const allThinkers = getAllThinkers();
  
  if (!category || !context) {
    notFound();
  }

  const articles = getArticlesByCategory(slug);
  const otherCategories = getOtherCategories(slug);
  
  // Sort articles by date (newest first)
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Helper to render thinker links
  const renderThinkerLinks = (thinkerSlugs: string[] | undefined, linkClassName: string) => {
    if (!thinkerSlugs || thinkerSlugs.length === 0) return null;
    return (
      <span>
        {thinkerSlugs.map((slugOrObject, idx) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${getCategoryColor(category.slug)} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl md:text-2xl opacity-90">{category.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Libertarian Context Section */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Libertarisch Perspectief</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ons Standpunt</h3>
              <p className="text-gray-700 leading-relaxed">{context.libertarianPerspective}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysebenadering</h3>
              <p className="text-gray-700 leading-relaxed">{context.analysisApproach}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Belangrijke Denkers</h3>
              <div className="flex flex-wrap gap-2">
                {context.keyThinkers.map((thinker) => {
                  // Check if this thinker has a profile by comparing names
                  const thinkerProfile = allThinkers.find(t => 
                    t.name === thinker || 
                    t.name.toLowerCase() === thinker.toLowerCase() ||
                    t.name.replace(/\./g, '').trim() === thinker.replace(/\./g, '').trim()
                  );
                  
                  if (thinkerProfile) {
                    // Render as clickable link with colored background
                    return (
                      <Link
                        key={thinker}
                        href={`/denkers/${thinkerProfile.slug}`}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm font-medium transition-colors"
                      >
                        {thinker}
                      </Link>
                    );
                  } else {
                    // Render as regular span
                    return (
                      <span 
                        key={thinker} 
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {thinker}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikelen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article: ArticleWithSourceTitle) => (
                <article 
                  key={article.slug} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                >
                  {/* Article Image */}
                  <Link href={`/articles/${article.slug}`} className="block relative h-48 bg-gray-200">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <div className="text-white text-4xl font-bold opacity-70">
                          {article.title.charAt(0)}
                        </div>
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
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        📅 {new Date(article.date).toLocaleDateString('nl-NL', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      {renderThinkerLinks(article.thinkers, "hover:underline text-yellow-600 font-medium")}
                    </div>
                    
                    {/* Spin/Description */}
                    {article.spin && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {article.spin.length > 120 ? `${article.spin.substring(0, 120)}...` : article.spin}
                      </p>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Read More */}
                    <Link 
                      href={`/articles/${article.slug}`} 
                      className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-bold text-sm transition-colors"
                    >
                      Lees artikel →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm mb-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Geen artikelen gevonden</h2>
            <p className="text-gray-500">Er zijn nog geen artikelen in deze categorie.</p>
          </div>
        )}

        {/* Other Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Andere Categorieën</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCategories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/categorieen/${cat.slug}`}
                className={`${getCategoryColor(cat.slug)} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
              >
                <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                <p className="text-sm opacity-90 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 