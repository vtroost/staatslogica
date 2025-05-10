import { getAllThinkers } from '@/lib/thinkers';
import Link from 'next/link';
import { Metadata } from 'next';

// Metadata for the Denkers page
export const metadata: Metadata = {
  title: 'Denkers | Staatslogica',
  description: 'Ontdek de verschillende denkers en perspectieven die Staatslogica analyseert.',
};

export default function ThinkersPage() {
    const thinkers = getAllThinkers();
    // Sort by year of birth (ascending), living thinkers ("geboren YYYY") come after deceased
    thinkers.sort((a, b) => {
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
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Denkers</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {thinkers.map(thinker => {
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
                            className="group block p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center"
                        >
                            <img
                                src={`/uploads/${thinker.slug}.png`}
                                alt={thinker.name}
                                className="w-20 h-20 object-contain mb-4 rounded-full bg-gray-100 border border-gray-200 group-hover:scale-105 transition-transform"
                            />
                            <h2 className="text-lg font-semibold mb-1 text-gray-900">{thinker.name}</h2>
                            {years && (
                                <div className="text-sm text-gray-500 mb-2">{years}</div>
                            )}
                            {thinker.articleCount > 0 && (
                                <p className="text-sm text-gray-600">
                                    {thinker.articleCount} artikel{thinker.articleCount !== 1 ? 'en' : ''}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
} 