import { getAllArticles } from '@/lib/articles';
import { getAllCategories, getCategoryForTag } from '@/lib/categories';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Onderwerpen',
  description: 'Ontdek alle onderwerpen en tags op Staatslogica. Verken de meest besproken thema\'s in onze politieke analyses.',
};

// Helper function to generate slug (consistent with existing tag system)
function generateSlug(name: string): string {
  if (typeof name !== 'string' || !name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Interface for tag with frequency and category
interface TagWithFrequency {
  name: string;
  slug: string;
  count: number;
  category?: string;
  categorySlug?: string;
  categoryColor?: string;
}

export default function OnderwerpenPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  
  // Calculate tag frequencies
  const tagFrequency = new Map<string, number>();
  const tagNames = new Map<string, string>(); // Store original names
  
  articles.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tagName => {
        const slug = generateSlug(tagName);
        if (slug) {
          tagFrequency.set(slug, (tagFrequency.get(slug) || 0) + 1);
          if (!tagNames.has(slug)) {
            tagNames.set(slug, tagName);
          }
        }
      });
    }
  });

  // Convert to array and add category information
  const tagsWithFrequency: TagWithFrequency[] = Array.from(tagFrequency.entries())
    .map(([slug, count]) => {
      const tagName = tagNames.get(slug) || slug;
      const category = getCategoryForTag(tagName);
      
      return {
        name: tagName,
        slug,
        count,
        category: category?.name,
        categorySlug: category?.slug,
        categoryColor: category?.color
      };
    })
    .sort((a, b) => b.count - a.count);

  // Group tags by category
  const tagsByCategory = new Map<string, TagWithFrequency[]>();
  const uncategorizedTags: TagWithFrequency[] = [];

  tagsWithFrequency.forEach(tag => {
    if (tag.category && tag.categorySlug) {
      if (!tagsByCategory.has(tag.categorySlug)) {
        tagsByCategory.set(tag.categorySlug, []);
      }
      tagsByCategory.get(tag.categorySlug)!.push(tag);
    } else {
      uncategorizedTags.push(tag);
    }
  });

  // Calculate font sizes based on frequency
  const maxCount = Math.max(...tagsWithFrequency.map(tag => tag.count));
  const minCount = Math.min(...tagsWithFrequency.map(tag => tag.count));
  
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-lg';
    
    const ratio = (count - minCount) / (maxCount - minCount);
    
    if (ratio >= 0.8) return 'text-3xl md:text-4xl';
    if (ratio >= 0.6) return 'text-2xl md:text-3xl';
    if (ratio >= 0.4) return 'text-xl md:text-2xl';
    if (ratio >= 0.2) return 'text-lg md:text-xl';
    return 'text-base md:text-lg';
  };

  const getOpacity = (count: number) => {
    if (maxCount === minCount) return 'opacity-80';
    
    const ratio = (count - minCount) / (maxCount - minCount);
    
    if (ratio >= 0.8) return 'opacity-100';
    if (ratio >= 0.6) return 'opacity-90';
    if (ratio >= 0.4) return 'opacity-80';
    if (ratio >= 0.2) return 'opacity-70';
    return 'opacity-60';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block bg-black bg-opacity-30 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide rounded">
                Verken Onderwerpen
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Onderwerpen
            </h1>
            <p className="text-xl text-black text-opacity-90 max-w-3xl mx-auto leading-relaxed">
              Ontdek de meest besproken thema's in onze analyses. Onderwerpen zijn georganiseerd in categorieën 
              voor beter overzicht. Hoe groter het onderwerp, hoe vaker we erover hebben geschreven.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <section className="w-full bg-white py-8 border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Blader per categorie
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Link
                key={category.slug}
                href={`/categorieen/${category.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-yellow-500 hover:text-black text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                {category.name} ({category.count || 0})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories with Topics */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Onderwerpen per categorie
            </h2>
          </div>

          <div className="space-y-12">
            {categories
              .filter(category => tagsByCategory.has(category.slug))
              .map(category => {
                const categoryTags = tagsByCategory.get(category.slug) || [];
                
                return (
                  <div key={category.slug} className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-1 h-12 bg-gradient-to-b ${category.color} rounded-full`}></div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mt-1">{category.description}</p>
                        </div>
                      </div>
                      <Link
                        href={`/categorieen/${category.slug}`}
                        className="text-yellow-600 hover:text-yellow-700 font-bold text-sm transition-colors"
                      >
                        Alle artikelen →
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 leading-relaxed">
                      {categoryTags
                        .sort(() => Math.random() - 0.5) // Shuffle for organic appearance
                        .map((tag, index) => (
                        <Link
                          key={tag.slug}
                          href={`/tags/${tag.slug}`}
                          className={`
                            inline-block mx-1 my-1 px-3 py-1 rounded-lg font-bold
                            transition-all duration-300 ease-out
                            hover:scale-110 hover:rotate-1 hover:shadow-lg
                            ${getFontSize(tag.count)}
                            ${getOpacity(tag.count)}
                            ${index % 3 === 0 
                              ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100' 
                              : index % 3 === 1 
                              ? 'text-gray-800 hover:text-black hover:bg-gray-100'
                              : 'text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50'
                            }
                          `}
                          title={`${tag.count} artikel${tag.count !== 1 ? 'en' : ''}`}
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Uncategorized Topics */}
            {uncategorizedTags.length > 0 && (
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full"></div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Overige onderwerpen
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Onderwerpen die nog niet zijn ingedeeld in een categorie
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 leading-relaxed">
                  {uncategorizedTags
                    .sort(() => Math.random() - 0.5)
                    .map((tag, index) => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      className={`
                        inline-block mx-1 my-1 px-3 py-1 rounded-lg font-bold
                        transition-all duration-300 ease-out
                        hover:scale-110 hover:rotate-1 hover:shadow-lg
                        ${getFontSize(tag.count)}
                        ${getOpacity(tag.count)}
                        text-gray-600 hover:text-gray-800 hover:bg-white
                      `}
                      title={`${tag.count} artikel${tag.count !== 1 ? 'en' : ''}`}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Topics Cloud */}
      <section className="w-full bg-white py-16 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Alle onderwerpen ({tagsWithFrequency.length})
            </h2>
          </div>

          {tagsWithFrequency.length > 0 ? (
            <div className="text-center space-y-4 leading-relaxed">
              {tagsWithFrequency
                .sort(() => Math.random() - 0.5)
                .map((tag, index) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className={`
                    inline-block mx-2 my-1 px-3 py-1 rounded-lg font-bold
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:rotate-1 hover:shadow-lg
                    ${getFontSize(tag.count)}
                    ${getOpacity(tag.count)}
                    ${tag.category 
                      ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }
                  `}
                  title={`${tag.count} artikel${tag.count !== 1 ? 'en' : ''} ${tag.category ? `(${tag.category})` : ''}`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Geen onderwerpen gevonden.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600 font-medium">
                Categorieën
              </div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {tagsWithFrequency.length}
              </div>
              <div className="text-gray-600 font-medium">
                Onderwerpen
              </div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {articles.length}
              </div>
              <div className="text-gray-600 font-medium">
                Totaal artikelen
              </div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {maxCount}
              </div>
              <div className="text-gray-600 font-medium">
                Meest behandeld
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 