import { getAllCategories, getCategoryBySlug, getArticlesByCategory } from '@/lib/categories';
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  const allThinkers = getAllThinkers();
  
  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(params.slug);
  
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
      <section className={`w-full bg-gradient-to-r ${category.color} py-12 md:py-16`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex justify-center items-center space-x-2 text-sm">
                <Link href="/" className="text-white text-opacity-80 hover:text-white">
                  Home
                </Link>
                <span className="text-white text-opacity-60">/</span>
                <Link href="/categorieen" className="text-white text-opacity-80 hover:text-white">
                  Categorieën
                </Link>
                <span className="text-white text-opacity-60">/</span>
                <span className="text-white font-medium">{category.name}</span>
              </nav>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {category.name}
            </h1>
            <p className="text-lg text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="w-full bg-white py-8 border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Onderwerpen in deze categorie
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {category.topics.map((topic, index) => (
              <Link
                key={index}
                href={`/tags/${topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                className="px-4 py-2 bg-gray-100 hover:bg-yellow-500 hover:text-black text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nog geen artikelen
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Er zijn nog geen artikelen gepubliceerd in de categorie "{category.name}". 
                Kom later terug voor nieuwe analyses!
              </p>
              <Link 
                href="/categorieen"
                className="inline-block mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
              >
                Bekijk andere categorieën
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="w-full bg-white border-t-4 border-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Andere categorieën
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {getAllCategories()
              .filter(cat => cat.slug !== category.slug)
              .slice(0, 6)
              .map(relatedCategory => (
              <Link
                key={relatedCategory.slug}
                href={`/categorieen/${relatedCategory.slug}`}
                className={`px-6 py-3 bg-gradient-to-r ${relatedCategory.color} text-white hover:opacity-90 rounded-lg font-medium text-sm transition-opacity shadow-md hover:shadow-lg`}
              >
                {relatedCategory.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 