import { getAllArticles } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import { getAllCategories, getArticlesByCategory } from '@/lib/categories';
import Breadcrumb from '@/components/Breadcrumb';
import type { Article } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: 'Thema\'s',
  description: 'Overzicht van alle analyses per thema. Van economie tot politiek - ontmasker het \'staatsnarratief\' met Staatslogica.',
  keywords: ['thema\'s', 'analyse', 'politiek', 'economie', 'overheid', 'libertarisme']
};

type ArticleWithSourceTitle = Article & { sourceTitle?: string };

export default function CategoriesPage() {
  const allArticles = getAllArticles();
  const allThinkers = getAllThinkers();
  const allCategories = getAllCategories();
  
  // Sort articles by date (newest first)
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get articles for each category
  const categoryArticles = allCategories.map(category => ({
    ...category,
    articles: getArticlesByCategory(category.slug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2) // Show top 2 articles per category
  }));

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

  // Structured data for news sections
  const siteUrl = 'https://staatslogica.nl';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
            "name": "Staatslogica Analyses per Thema",
        "description": "Overzicht van alle analyses per thema",
        "url": `${siteUrl}/themas`,
    "mainEntity": {
      "@type": "ItemList",
              "name": "Analysethema's",
      "itemListElement": categoryArticles.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Thing",
          "name": category.name,
          "description": category.description,
          "url": `${siteUrl}/themas/${category.slug}`,
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": category.articles.length,
            "itemListElement": category.articles.map((article, articleIndex) => ({
              "@type": "ListItem",
              "position": articleIndex + 1,
              "item": {
                "@type": "Article",
                "headline": article.title,
                "url": `${siteUrl}/articles/${article.slug}`,
                "datePublished": article.date,
                "author": {
                  "@type": "Organization",
                  "name": "Staatslogica"
                }
              }
            }))
          }
        }
      }))
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Thema\'s' }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      {/* Header */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-left">
            
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Analyses per Thema
            </h1>
            <div className="max-w-4xl">
              <p className="text-lg text-black text-opacity-90 mb-4 leading-relaxed">
                Ontmasker het 'staatsnarratief' per thema. Van economie tot politiek - alle analyses op één plek. Duik in een thema om gerelateerde artikelen te bekijken, inclusief 
                de belangrijkste denkers en hun inzichten die onze analyses vormgeven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryArticles.map((category) => (
              <div
                key={category.slug}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Category Header */}
                <Link href={`/themas/${category.slug}`}>
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white h-[160px] flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity relative overflow-hidden`}>
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
                    {category.slug === 'oorlog-veiligheid' && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: 'url(https://www.defensie.nl/binaries/content/gallery/defensie/content-afbeeldingen/actueel/nieuws/2024/12/06/kisten.jpg?download)'
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-600 bg-opacity-70" />
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

                    <div className="flex-1 overflow-hidden relative z-10">
                      <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 mb-3">
                        <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between relative z-10">
                      <span className="text-white text-opacity-80 text-sm">
                        {category.count || 0} artikel{(category.count || 0) !== 1 ? 'en' : ''}
                      </span>
                      <span className="text-white text-opacity-90 text-sm font-medium">
                        Bekijk thema →
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Theme Introduction */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-400 pl-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {category.description.length > 150 ? category.description.substring(0, 150) + '...' : category.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topics & Onderwerpen */}
                <div className="px-6 pb-6">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4">
                    Onderwerpen in dit thema
                  </h4>
                  
                  {/* Always show first 6 topics (approximately 2 rows) */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.topics.slice(0, 6).map((topic, index) => (
                      <Link
                        key={index}
                        href={`/tags/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-2 py-1 bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 text-xs rounded-md transition-colors duration-200 border border-transparent hover:border-yellow-300"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Collapsible section for remaining topics */}
                  {category.topics.length > 6 && (
                    <details className="group">
                      <summary className="cursor-pointer text-yellow-600 hover:text-yellow-700 text-sm font-medium list-none flex items-center gap-1">
                        <span className="transform transition-transform group-open:rotate-90">▶</span>
                        Toon {category.topics.length - 6} meer onderwerpen
                      </summary>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {category.topics.slice(6).map((topic, index) => (
                          <Link
                            key={index + 6}
                            href={`/tags/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                            className="px-2 py-1 bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 text-xs rounded-md transition-colors duration-200 border border-transparent hover:border-yellow-300"
                          >
                            {topic}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="w-full bg-white border-t-4 border-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {allCategories.length}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Hoofdthema's
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {allCategories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Totaal artikelen
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {allCategories.reduce((sum, cat) => sum + cat.topics.length, 0)}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Onderwerpen
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {Math.max(...allCategories.map(cat => cat.count || 0))}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Grootste thema
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 