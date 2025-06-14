import { getAllCategories, getCategoryBySlug, getArticlesByCategory, getCategoryColor, getOtherCategories, getCategoryContext } from '@/lib/categories';
import { getAllThinkers } from '@/lib/thinkers';
import Breadcrumb from '@/components/Breadcrumb';
import type { Article } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';

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
      title: 'Thema niet gevonden',
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



  return (
    <>
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
             items={[
               { label: 'Home', href: '/' },
               { label: 'Thema\'s', href: '/themas' },
               { label: category.name }
             ]}
             variant="yellow"
           />
        </div>
      </div>

      {/* Header Hero */}
      <div className={`relative w-full py-10 md:py-12 overflow-hidden bg-gradient-to-r ${category.color}`}>
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
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 inline-block text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{category.name}</h1>
                <p className="text-xl md:text-2xl opacity-90 text-white">{category.description}</p>
              </div>
              <Link 
                href="/themas"
                className="inline-flex items-center gap-2 bg-black bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all font-medium text-sm whitespace-nowrap ml-4"
              >
                ← Alle thema's
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Libertarian Perspective Section - New narrative approach */}
      <section className="w-full bg-gray-50 py-8 md:py-10 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">{category.name} onder de loep</h2>
          </div>
          
                    <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content - left 2/3 */}
            <div className="lg:col-span-2">
              <div className="text-gray-700 leading-relaxed space-y-6 mb-8">
                {context.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "text-lg" : ""}>
                    {paragraph}
                  </p>
                ))}
                
                {/* Quote section with thinker silhouette */}
                <blockquote className="border-l-4 border-yellow-400 pl-6 py-4 bg-white rounded-r-lg shadow-sm my-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {(() => {
                        // Find thinker profile for the quote author
                        const quoteThinker = allThinkers.find(t => 
                          t.name === context.quoteAuthor || 
                          t.name.toLowerCase() === context.quoteAuthor.toLowerCase() ||
                          t.name.replace(/\./g, '').trim() === context.quoteAuthor.replace(/\./g, '').trim()
                        );
                        
                        if (quoteThinker) {
                          return (
                            <Link
                              href={`/denkers/${quoteThinker.slug}`}
                              className="group block"
                            >
                              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                                <Image
                                  src={`/uploads/${quoteThinker.slug}.png`}
                                  alt={quoteThinker.name}
                                  width={64}
                                  height={64}
                                  className="object-cover opacity-90"
                                  style={{ 
                                    mixBlendMode: 'multiply'
                                  }}
                                />
                              </div>
                            </Link>
                          );
                        } else {
                          return (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c3.866 0 7-1.343 7-3V7a7 7 0 10-14 0v4c0 1.657 3.134 3 7 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m0 0H9m3 0h3" />
                              </svg>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div className="flex-1">
                                             <p className="text-gray-800 italic text-lg leading-relaxed mb-2">
                         "{context.quote}"
                       </p>
                       <footer className="text-gray-600 text-sm">
                         — {context.quoteAuthor}
                         {context.quoteSource && (
                           <span className="text-gray-500 text-xs ml-2">
                             ({context.quoteSource})
                           </span>
                         )}
                       </footer>
                    </div>
                  </div>
                </blockquote>
              </div>
            </div>
            
            {/* Sidebar - right 1/3 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voor wie verder wil denken</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  De inzichten in dit thema zijn geïnspireerd door economen en denkers die marktwerking doordenken tot in de details:
                </p>
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
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors hover:scale-105 transform"
                        >
                          {thinker}
                        </Link>
                      );
                    } else {
                      // Render as regular span
                      return (
                        <span 
                          key={thinker} 
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
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
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Main Content - Articles */}
        <div>
          {articles.length > 0 ? (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Artikelen</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: ArticleWithSourceTitle) => (
                  <ArticleCard 
                    key={article.slug}
                    article={article}
                    allThinkers={allThinkers}
                    categoryColor={category.color}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Geen artikelen gevonden</h2>
              <p className="text-gray-500">Er zijn nog geen artikelen in dit thema.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 