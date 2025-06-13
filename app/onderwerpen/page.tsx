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
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight">
              Onderwerpen
            </h1>
            <div className="max-w-4xl">
              <p className="text-xl text-black text-opacity-90 mb-4 leading-relaxed">
                Ontdek de meest besproken thema's in onze analyses. Onderwerpen zijn georganiseerd in categorieën 
                voor beter overzicht. Hoe groter het onderwerp, hoe vaker we erover hebben geschreven.
              </p>
              <p className="text-lg text-black text-opacity-80 leading-relaxed">
                Elk onderwerp toont hoeveel artikelen erover zijn geschreven. Klik op een onderwerp om alle 
                gerelateerde analyses te bekijken, of verken een hele categorie om de bredere context te begrijpen. 
                Van economische interventies tot politieke machtsuitoefening - hier vind je alle thema's die 
                de staatsmachine blootleggen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with Topics */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
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
                        .sort((a, b) => b.count - a.count) // Sort by frequency (most used first)
                        .map((tag, index) => (
                        <Link
                          key={tag.slug}
                          href={`/tags/${tag.slug}`}
                          className={`
                            inline-block mx-1 my-1 px-3 py-1 rounded-lg font-medium
                            transition-all duration-300 ease-out
                            hover:scale-105 hover:shadow-md
                            ${getFontSize(tag.count)}
                            ${getOpacity(tag.count)}
                            bg-gradient-to-r ${category.color} text-white hover:opacity-80
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
                    .sort((a, b) => b.count - a.count) // Sort by frequency
                    .map((tag, index) => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      className={`
                        inline-block mx-1 my-1 px-3 py-1 rounded-lg font-medium
                        transition-all duration-300 ease-out
                        hover:scale-105 hover:shadow-md
                        ${getFontSize(tag.count)}
                        ${getOpacity(tag.count)}
                        bg-gray-500 text-white hover:bg-gray-600
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
    </div>
  );
} 