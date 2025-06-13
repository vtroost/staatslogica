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
      <div className={`${getCategoryColor(category.slug)} text-white py-16 relative overflow-hidden`}>
        {/* Background Images by Category */}
        {category.slug === 'economie-geld' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://bnr-external-prod.imgix.net/7T_QPr_RPdSl9GNHOE3zp_mpvP8.jpg)'
              }}
            />
            <div className="absolute inset-0 bg-green-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'overheidsmacht-interventie' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://www.christenunie.nl/l/nl/library/download/urn:uuid:261cb5ae-2eeb-43cc-9ef8-e98de978e6ec/me+politie.jpg?scaleType=3&width=1200&height=675)'
              }}
            />
            <div className="absolute inset-0 bg-red-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'politiek-bestuur' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'begrotingsbeleid-bezuinigingen' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-purple-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'vrijheid-individualisme' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-yellow-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'mobiliteit-infrastructuur' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-indigo-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'wonen-levensonderhoud' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-teal-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'arbeid-actie' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-orange-600 bg-opacity-70" />
          </>
        )}
        
        {category.slug === 'klimaat-milieu' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-emerald-600 bg-opacity-70" />
          </>
        )}

        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 inline-block">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{category.name}</h1>
            <p className="text-xl md:text-2xl opacity-90 text-white">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Libertarian Perspective Section - Modern Design */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Libertarisch Perspectief</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Onze analyse van deze categorie vanuit de principes van individuele vrijheid, eigendomsrechten en vrije markten.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Our Position Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ons Standpunt</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{context.libertarianPerspective}</p>
            </div>

            {/* Analysis Approach Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Analysebenadering</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{context.analysisApproach}</p>
            </div>

            {/* Key Thinkers Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Belangrijke Denkers</h3>
              </div>
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
                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-colors hover:scale-105 transform"
                      >
                        {thinker}
                      </Link>
                    );
                  } else {
                    // Render as regular span
                    return (
                      <span 
                        key={thinker} 
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
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

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Articles */}
          <div className="flex-1">
            {articles.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikelen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Geen artikelen gevonden</h2>
                <p className="text-gray-500">Er zijn nog geen artikelen in deze categorie.</p>
              </div>
            )}
          </div>

          {/* Sidebar - Other Categories */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ontdek andere categorieën</h3>
              <div className="space-y-3">
                {otherCategories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/categorieen/${cat.slug}`}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 transform ${getCategoryColor(cat.slug)} text-white hover:shadow-md`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 