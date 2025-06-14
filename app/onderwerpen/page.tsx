import { getAllArticles } from '@/lib/articles';
import { getAllCategories, getCategoryForTag } from '@/lib/categories';
import Breadcrumb from '@/components/Breadcrumb';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alle Onderwerpen - Staatslogica',
  description: 'Overzicht van alle onderwerpen behandeld in Staatslogica analyses.',
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

  return (
    <>
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Alle Onderwerpen' }
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
              Alle Onderwerpen
            </h1>
            <div className="max-w-4xl">
              <p className="text-lg text-black text-opacity-90 mb-4 leading-relaxed">
                Ontdek alle onderwerpen en tags georganiseerd per thema. Elk onderwerp toont hoeveel artikelen erover zijn geschreven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with Topics in Cards */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories
              .filter(category => tagsByCategory.has(category.slug))
              .map(category => {
                const categoryTags = tagsByCategory.get(category.slug) || [];
                
                return (
                  <div
                    key={category.slug}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Category Header */}
                    <Link href={`/themas/${category.slug}`}>
                      <div className={`bg-gradient-to-r ${category.color} p-6 text-white h-[120px] flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity`}>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-white">{category.name}</h3>
                          <p className="text-white text-opacity-90 text-sm leading-relaxed line-clamp-2">
                            {categoryTags.length} onderwerp{categoryTags.length !== 1 ? 'en' : ''}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white text-opacity-80 text-sm">
                            {categoryTags.reduce((sum, tag) => sum + tag.count, 0)} artikel{categoryTags.reduce((sum, tag) => sum + tag.count, 0) !== 1 ? 'en' : ''}
                          </span>
                          <span className="text-white text-opacity-90 text-sm font-medium">
                            Bekijk thema →
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Tags */}
                    <div className="p-6">
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                          Onderwerpen
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {categoryTags
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 12) // Limit to 12 tags per category
                            .map((tag) => (
                            <Link
                              key={tag.slug}
                              href={`/tags/${tag.slug}`}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              title={`${tag.count} artikel${tag.count !== 1 ? 'en' : ''}`}
                            >
                              {tag.name}
                              <span className="ml-1 text-xs text-gray-500">({tag.count})</span>
                            </Link>
                          ))}
                          {categoryTags.length > 12 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              +{categoryTags.length - 12} meer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Uncategorized Topics Card */}
            {uncategorizedTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white h-[120px] flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-white">Overige onderwerpen</h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      {uncategorizedTags.length} onderwerp{uncategorizedTags.length !== 1 ? 'en' : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-opacity-80 text-sm">
                      {uncategorizedTags.reduce((sum, tag) => sum + tag.count, 0)} artikel{uncategorizedTags.reduce((sum, tag) => sum + tag.count, 0) !== 1 ? 'en' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Onderwerpen
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {uncategorizedTags
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 12)
                        .map((tag) => (
                        <Link
                          key={tag.slug}
                          href={`/tags/${tag.slug}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title={`${tag.count} artikel${tag.count !== 1 ? 'en' : ''}`}
                        >
                          {tag.name}
                          <span className="ml-1 text-xs text-gray-500">({tag.count})</span>
                        </Link>
                      ))}
                      {uncategorizedTags.length > 12 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          +{uncategorizedTags.length - 12} meer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="w-full bg-white border-t-4 border-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {categories.filter(category => tagsByCategory.has(category.slug)).length}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Thema's
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {tagsWithFrequency.length}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Totaal onderwerpen
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {tagsWithFrequency.reduce((sum, tag) => sum + tag.count, 0)}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Totaal artikelen
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {Math.max(...tagsWithFrequency.map(tag => tag.count))}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Meest behandeld
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 