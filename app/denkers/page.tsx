import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';

// Metadata for the Denkers page
export const metadata: Metadata = {
  title: 'Denkers | Staatslogica',
  description: 'Ontdek de verschillende denkers en perspectieven die Staatslogica analyseert.',
};

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

export default async function ThinkersPage() {
    const thinkers = getAllThinkers();
    
    // Get detailed data for each thinker to extract taglines
    const thinkersWithTaglines = await Promise.all(
        thinkers.map(async (thinker) => {
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
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Header Section */}
            <section className="w-full bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Denkers</h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        In een wereld waarin media en politiek vaak maar één verhaal vertellen, is het cruciaal om verder te kijken dan de staatspropaganda. Echte intellectuele vrijheid vereist dat we luisteren naar stemmen die durven te twijfelen aan de gevestigde orde.
                    </p>
                    <p className="text-lg text-gray-600 max-w-3xl mt-4">
                        Deze denkers bieden perspectieven die mainstream media zelden belichten: van Bastiat's waarschuwingen tegen legale plundering tot Rothbard's ontmaskering van staatsmacht, van Mises' economische inzichten tot Spooner's juridische rebellie. Ontdek waarom hun ideeën relevanter zijn dan ooit.
                    </p>
                </div>
            </section>

            {/* Thinkers Grid */}
            <section className="w-full py-12 md:py-16">
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
                                    className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Silhouette Image Section */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
                                        <div className="relative w-24 h-24 md:w-28 md:h-28">
                                            <Image
                                                src={`/uploads/${thinker.slug}.png`}
                                                alt={thinker.name}
                                                width={112}
                                                height={112}
                                                className="object-contain opacity-90 group-hover:scale-105 transition-transform duration-300"
                                                style={{ filter: 'brightness(0) invert(1)' }}
                                            />
                                        </div>
                                        
                                        {/* Years overlay */}
                                        {years && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 text-xs font-medium rounded">
                                                    {years}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-6">
                                        {/* Name */}
                                        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {thinker.name}
                                        </h2>
                                        
                                        {/* Tagline */}
                                        {thinker.tagline && (
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                {thinker.tagline.length > 120 ? `${thinker.tagline.substring(0, 120)}...` : thinker.tagline}
                                            </p>
                                        )}
                                        
                                        {/* Article Count */}
                                        <div className="flex items-center justify-between text-sm">
                                            {thinker.articleCount > 0 ? (
                                                <span className="text-blue-700 font-medium">
                                                    {thinker.articleCount} artikel{thinker.articleCount !== 1 ? 'en' : ''}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Geen artikelen
                                                </span>
                                            )}
                                            
                                            <span className="text-blue-700 group-hover:text-blue-900 font-medium">
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