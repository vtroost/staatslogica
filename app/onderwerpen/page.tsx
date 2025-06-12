import { getAllArticles } from '@/lib/articles';
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

// Interface for tag with frequency
interface TagWithFrequency {
  name: string;
  slug: string;
  count: number;
}

export default function OnderwerpenPage() {
  const articles = getAllArticles();
  
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

  // Convert to array and sort by frequency
  const tagsWithFrequency: TagWithFrequency[] = Array.from(tagFrequency.entries())
    .map(([slug, count]) => ({
      name: tagNames.get(slug) || slug,
      slug,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate font sizes based on frequency
  const maxCount = Math.max(...tagsWithFrequency.map(tag => tag.count));
  const minCount = Math.min(...tagsWithFrequency.map(tag => tag.count));
  
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-2xl';
    
    const ratio = (count - minCount) / (maxCount - minCount);
    
    if (ratio >= 0.8) return 'text-5xl md:text-6xl';
    if (ratio >= 0.6) return 'text-4xl md:text-5xl';
    if (ratio >= 0.4) return 'text-3xl md:text-4xl';
    if (ratio >= 0.2) return 'text-2xl md:text-3xl';
    return 'text-xl md:text-2xl';
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
              Ontdek de meest besproken thema's in onze analyses. Hoe groter het onderwerp, 
              hoe vaker we erover hebben geschreven. Klik op een onderwerp om alle gerelateerde artikelen te zien.
            </p>
          </div>
        </div>
      </section>

      {/* Word Cloud Section */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Alle onderwerpen ({tagsWithFrequency.length})
            </h2>
          </div>

          {tagsWithFrequency.length > 0 ? (
            <div className="text-center space-y-4 leading-relaxed">
              {/* Shuffle the tags for a more organic cloud appearance */}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Geen onderwerpen gevonden.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white border-t-4 border-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {tagsWithFrequency.length}
              </div>
              <div className="text-gray-600 font-medium">
                Verschillende onderwerpen
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
                Meest behandeld onderwerp
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 