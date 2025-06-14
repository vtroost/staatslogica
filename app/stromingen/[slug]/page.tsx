import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import { STROMINGEN, getStromingBySlug } from '@/lib/stromingen';
import ThinkerCard from '@/components/ThinkerCard';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
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
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              {stroming.name}
            </h1>
            <div className="text-lg text-black text-opacity-90 leading-relaxed">
              <p>{stroming.detailedDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 lg:relative">
          {/* Stroming Labels - Positioned at top right */}
          <div className="lg:absolute lg:top-0 lg:right-4 mb-6 lg:mb-0">
            <div className="lg:w-80">
              <div className="flex flex-wrap lg:flex-col gap-3">
                <Link 
                  href="/denkers"
                  className="inline-flex items-center gap-2 bg-black bg-opacity-20 text-black px-3 py-2 rounded-lg hover:bg-opacity-30 transition-all font-medium text-sm lg:justify-start"
                >
                  ← Alle denkers
                </Link>
                {STROMINGEN.map(stromingItem => {
                  const isActive = stromingItem.slug === params.slug;
                  return (
                    <Link 
                      key={stromingItem.slug}
                      href={`/stromingen/${stromingItem.slug}`}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-sm lg:justify-start ${
                        isActive 
                          ? 'bg-yellow-600 text-black hover:bg-yellow-700' 
                          : 'bg-yellow-400 text-black hover:bg-yellow-500'
                      }`}
                    >
                      {stromingItem.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kernprincipes */}
          {stroming.keyPrinciples && (
            <div className="mb-8 lg:max-w-4xl">
              <div className="flex items-center mb-4">
                <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Kernprincipes</h2>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
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
            {thinkersWithTaglines.map(thinker => (
              <ThinkerCard 
                key={thinker.slug} 
                thinker={thinker} 
                overrideStroming={stroming}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 