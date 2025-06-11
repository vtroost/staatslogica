import { getAllArticles } from '@/lib/articles';
import { getAllThinkers } from '@/lib/thinkers';
import type { Article } from '@/lib/types';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
  title: 'Categorieën | Staatslogica',
  description: 'Overzicht van alle analyses per categorie. Van economie tot politiek - ontmasker staatspropaganda met Staatslogica.',
  keywords: ['categorieën', 'analyse', 'politiek', 'economie', 'overheid', 'libertarisme']
};

type ArticleWithSourceTitle = Article & { sourceTitle?: string };

// Define analysis categories with their corresponding tags
const analysisCategories = [
  {
    name: 'Politiek',
    slug: 'politiek',
    description: 'Analyses van politieke besluitvorming en machtsstructuren',
    tags: ['politiek', 'coalitie', 'democratie', 'partijpolitiek', 'vvd', 'pvv', 'gl-pvda'],
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Economie',
    slug: 'economie', 
    description: 'Economische analyse vanuit Oostenrijkse school perspectief',
    tags: ['economie', 'inflatie', 'centrale-bank', 'koopkracht', 'centrale-planning', 'economische-planning'],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Overheidsinterventie',
    slug: 'overheidsinterventie',
    description: 'Kritische blik op overheidsinmenging in vrije markten',
    tags: ['overheidsinterventie', 'overheid', 'belastingdruk', 'bezuinigingen', 'begroting'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Woningmarkt',
    slug: 'woningmarkt',
    description: 'Analyse van woningmarktproblemen en overheidsfalen',
    tags: ['woningmarkt', 'huurbeleid', 'overheidsinterventie'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Milieu & Stikstof',
    slug: 'milieu',
    description: 'Kritische analyse van milieubeleid en regelgeving',
    tags: ['milieu', 'stikstof'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Verkeer & Boetes',
    slug: 'verkeer',
    description: 'Analyse van verkeersbeleid en overheidsinkomsten',
    tags: ['verkeersboetes', 'overheidsinkomsten', 'gezagskritiek'],
    color: 'from-orange-500 to-orange-600'
  }
];

export default function CategoriesPage() {
  const allArticles = getAllArticles();
  const allThinkers = getAllThinkers();
  
  // Sort articles by date (newest first)
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get articles for each category
  const categoryArticles = analysisCategories.map(category => ({
    ...category,
    articles: allArticles.filter(article => 
      article.tags?.some(tag => 
        category.tags.includes(tag.toLowerCase())
      )
    ).slice(0, 3) // Show top 3 articles per category
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
    "name": "Staatslogica Analyses per Categorie",
    "description": "Overzicht van alle analyses per categorie",
    "url": `${siteUrl}/categorieen`,
    "mainEntity": {
      "@type": "ItemList",
              "name": "Analysecategorieën",
        "itemListElement": categoryArticles.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Thing",
          "name": category.name,
          "description": category.description,
          "url": `${siteUrl}/tags/${category.slug}`,
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

      {/* Header */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Analyses per Categorie
            </h1>
            <p className="text-lg text-black text-opacity-90 max-w-3xl mx-auto leading-relaxed">
              Ontmasker staatspropaganda per categorie. Van economie tot politiek - alle analyses op één plek.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="w-full bg-white py-8 border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {analysisCategories.map(category => (
              <Link
                key={category.slug}
                href={`/tags/${category.slug}`}
                className="px-6 py-3 bg-gray-100 hover:bg-yellow-500 hover:text-black text-gray-700 rounded-lg font-bold text-sm transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          {categoryArticles.map(category => (
            <div key={category.slug} className="space-y-8">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-12 bg-gradient-to-b ${category.color} rounded-full`}></div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <Link
                  href={`/tags/${category.slug}`}
                  className="text-yellow-600 hover:text-yellow-700 font-bold text-sm transition-colors"
                >
                  Alle artikelen →
                </Link>
              </div>

              {/* Articles Grid */}
              {category.articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.map((article: ArticleWithSourceTitle) => (
                    <article key={article.slug} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                      {/* Article Image */}
                      <Link href={`/articles/${article.slug}`} className="block relative h-40 bg-gray-200">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                            <div className="text-white text-3xl font-bold opacity-70">
                              {article.title.charAt(0)}
                            </div>
                          </div>
                        )}
                      </Link>
                      
                      {/* Article Content */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-bold mb-2 leading-tight">
                          <Link 
                            href={`/articles/${article.slug}`} 
                            className="text-gray-900 hover:text-yellow-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                          <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                          {renderThinkerLinks(article.thinkers, "hover:underline text-yellow-600 font-bold")}
                        </div>
                        
                        {/* Spin/Description */}
                        {article.spin && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {article.spin.length > 80 ? `${article.spin.substring(0, 80)}...` : article.spin}
                          </p>
                        )}
                        
                        {/* Read More */}
                        <Link 
                          href={`/articles/${article.slug}`} 
                          className="text-yellow-600 hover:text-yellow-700 font-bold text-xs transition-colors"
                        >
                          Lees meer →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nog geen artikelen in deze categorie.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="w-full bg-white py-12 md:py-16 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Laatste artikelen</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allArticles.slice(0, 8).map((article: ArticleWithSourceTitle) => (
              <article key={article.slug} className="bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors p-4">
                <h3 className="font-bold mb-2 leading-tight">
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="text-gray-900 hover:text-yellow-600 transition-colors text-sm"
                  >
                    {article.title}
                  </Link>
                </h3>
                <div className="text-xs text-gray-500">
                  <span>{new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 