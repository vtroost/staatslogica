import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import { STROMINGEN, getStromingBySlug } from '@/lib/stromingen';
import StromingBadge from '@/components/StromingBadge';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface StromingPageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for each stroming
export async function generateStaticParams() {
  return STROMINGEN.map(stroming => ({
    slug: stroming.slug,
  }));
}

export async function generateMetadata({ params }: StromingPageProps): Promise<Metadata> {
  const stroming = getStromingBySlug(params.slug);
  if (!stroming) {
    return {
      title: 'Stroming niet gevonden | Staatslogica',
    };
  }
  return {
    title: `${stroming.name} | Stromingen | Staatslogica`,
    description: `Ontdek alle denkers binnen de ${stroming.name.toLowerCase()}e stroming: ${stroming.description}`,
  };
}

// Helper function to extract tagline from bio content
function extractTagline(bioContent?: string): string {
  if (!bioContent) return '';
  
  // Look for the first paragraph after the frontmatter that's not a heading
  const lines = bioContent.split('\n').filter(line => line.trim() !== '');
  
  // Find the first line that looks like a descriptive tagline (usually after the name)
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip markdown headings, empty lines, and very short lines
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

export default async function StromingDetailPage({ params }: StromingPageProps) {
  const { slug } = params;
  const stroming = getStromingBySlug(slug);
  
  if (!stroming) notFound();

  // Get all thinkers for this stroming
  const allThinkers = getAllThinkers();
  const stromingThinkers = allThinkers.filter(thinker => thinker.stroming === stroming.slug);

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

  // Sort by year of birth (ascending), living thinkers ("geboren YYYY") come after deceased
  thinkersWithTaglines.sort((a, b) => {
    // Extract birth year and if still alive
    const extractYearInfo = (t: any) => {
      if (t.title) {
        // Match (YYYY–YYYY) or (geboren YYYY)
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
    // If same year, deceased comes before living
    if (aInfo.alive !== bInfo.alive) return aInfo.alive ? 1 : -1;
    return 0;
  });

  return (
    <>
      {/* Full-width yellow overlay to eliminate any grey backgrounds */}
      <div className="fixed top-16 left-0 right-0 h-24 bg-gradient-to-r from-yellow-500 to-yellow-600 z-40"></div>
      
      <div className="w-full min-h-screen relative z-50">
        {/* Compact Breadcrumb - Connected to header */}
        <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Denkers', href: '/denkers' },
                { label: 'Stromingen', href: '/stromingen' },
                { label: stroming.name }
              ]}
              variant="yellow"
            />
          </div>
        </div>

        {/* Header Section */}
        <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl">

              <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight">
                {stroming.name}
              </h1>
              
              {/* Detailed Description */}
              {stroming.detailedDescription && (
                <div className="mb-8">
                  <p className="text-lg text-black text-opacity-90 leading-relaxed mb-6">
                    {stroming.detailedDescription}
                  </p>
                </div>
              )}
              
              {/* Key Principles */}
              {stroming.keyPrinciples && stroming.keyPrinciples.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black mb-4">Kernprincipes</h2>
                  <ul className="space-y-2">
                    {stroming.keyPrinciples.map((principle, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-black bg-opacity-60 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-black text-opacity-80 leading-relaxed">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Thinkers Grid */}
        <section className="w-full bg-gray-50 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {thinkersWithTaglines.map(thinker => {
                // Extract years from title, e.g., 'Name (1801–1850)'
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
                    {/* Silhouette Image Section */}
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
                      
                      {/* Years overlay */}
                      {years && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-block bg-black bg-opacity-30 text-black px-3 py-1 text-xs font-bold rounded">
                            {years}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Name */}
                      <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {thinker.name}
                      </h2>
                      
                      {/* Tagline */}
                      <div className="flex-grow mb-4">
                        {thinker.tagline && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {thinker.tagline.length > 120 ? `${thinker.tagline.substring(0, 120)}...` : thinker.tagline}
                          </p>
                        )}
                      </div>
                      
                      {/* Article Count - Always at bottom */}
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
    </>
  );
} 