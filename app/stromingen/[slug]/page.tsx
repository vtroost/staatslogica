import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import { STROMINGEN, getStromingBySlug } from '@/lib/stromingen';
import StromingBadge from '@/components/StromingBadge';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Helper function to extract tagline from bio content
function extractTagline(bioContent?: string): string {
  if (!bioContent) return '';
  
  const lines = bioContent.split('\n').filter(line => line.trim() !== '');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('##') && 
        trimmed.length > 20 && 
        trimmed.length < 200) {
      return trimmed;
    }
  }
  
  return '';
}

// Generate static params for all stromingen
export async function generateStaticParams() {
  return STROMINGEN.map((stroming) => ({
    slug: stroming.slug,
  }));
}

// Generate metadata for each stroming page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const stroming = getStromingBySlug(params.slug);
  
  if (!stroming) {
    return {
      title: 'Stroming niet gevonden',
    };
  }

  return {
    title: `${stroming.name}`,
    description: `Ontdek ${stroming.name.toLowerCase()} denkers: ${stroming.description}`,
  };
}

export default async function StromingPage({ params }: { params: { slug: string } }) {
  const stroming = getStromingBySlug(params.slug);
  
  if (!stroming) {
    notFound();
  }

  const allThinkers = getAllThinkers();
  
  // Filter thinkers for this stroming
  const stromingThinkers = allThinkers.filter(thinker => thinker.stroming === params.slug);
  
  // Get detailed data for each thinker to extract taglines
  const thinkersWithTaglines = await Promise.all(
    stromingThinkers.map(async (thinker) => {
      const detailedThinker = getThinkerBySlug(thinker.slug);
      return {
        ...thinker,
        tagline: extractTagline(detailedThinker?.bioContent)
      };
    })
  );
  
  // Sort by year of birth (ascending), living thinkers come after deceased
  thinkersWithTaglines.sort((a, b) => {
    const extractYearInfo = (t: any) => {
      if (t.title) {
        const deceased = t.title.match(/\((\d{4})[–-](\d{4})\)/);
        if (deceased) return { year: parseInt(deceased[1], 10), alive: false };
        const living = t.title.match(/geboren (\d{4})/i);
        if (living) return { year: parseInt(living[1], 10), alive: true };
      }
      return { year: Infinity, alive: true };
    };
    const aInfo = extractYearInfo(a);
    const bInfo = extractYearInfo(b);
    if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
    if (aInfo.alive !== bInfo.alive) return aInfo.alive ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full min-h-screen">
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Denkers', href: '/denkers' },
              { label: stroming.name }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      {/* Header Section */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl md:text-5xl font-bold text-black leading-tight">
                {stroming.name}
              </h1>
              <Link 
                href="/denkers"
                className="inline-flex items-center gap-2 bg-black bg-opacity-20 text-black px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all font-medium text-sm whitespace-nowrap ml-4"
              >
                ← Alle denkers
              </Link>
            </div>
            <div className="text-lg text-black text-opacity-90 leading-relaxed">
              <p>{stroming.detailedDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Kernprincipes */}
          {stroming.keyPrinciples && (
            <div className="max-w-4xl mb-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Kernprincipes</h2>
              </div>
              <div className="text-gray-700 leading-relaxed mb-8">
                <ul className="list-disc list-inside space-y-2">
                  {stroming.keyPrinciples.map((principle, index) => (
                    <li key={index}>{principle}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Thinkers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {thinkersWithTaglines.map(thinker => {
              let years = '';
              if (thinker.title) {
                const match = thinker.title.match(/\(([^)]+)\)/);
                if (match) years = match[1];
              }
              
              return (
                <Link 
                  key={thinker.slug}
                  href={`/denkers/${thinker.slug}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <div className="relative w-24 h-24 md:w-28 md:h-28">
                      <Image
                        src={`/uploads/${thinker.slug}.png`}
                        alt={thinker.name}
                        width={112}
                        height={112}
                        className="object-contain opacity-90 group-hover:scale-105 transition-transform duration-300"
                        style={{ 
                          filter: thinker.slug === 'saifedean-ammous' 
                            ? 'contrast(1000%) brightness(1.5) hue-rotate(45deg) saturate(10)' 
                            : 'brightness(0)' 
                        }}
                      />
                    </div>
                    
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      <StromingBadge stroming={stroming} size="sm" />
                      {years && (
                        <span className="inline-block bg-black bg-opacity-30 text-black px-3 py-1 text-xs font-bold rounded">
                          {years}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                      {thinker.name}
                    </h2>
                    
                    <div className="flex-grow mb-4">
                      {thinker.tagline && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {thinker.tagline.length > 120 ? `${thinker.tagline.substring(0, 120)}...` : thinker.tagline}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-base mt-auto pt-4 border-t border-gray-100">
                      {thinker.articleCount > 0 ? (
                        <span className="text-yellow-600 font-bold">
                          {thinker.articleCount} artikel{thinker.articleCount !== 1 ? 'en' : ''}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Geen artikelen
                        </span>
                      )}
                      
                      <span className="text-yellow-600 group-hover:text-yellow-700 font-bold">
                        Lees meer →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 