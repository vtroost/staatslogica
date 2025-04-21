import { getAllThinkers, ThinkerData } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

// Metadata for the Denkbeelden page
export const metadata: Metadata = {
  title: 'Denkbeelden | Staatslogica',
  description: 'Ontdek de filosofische perspectieven en denkers die Staatslogica gebruikt voor nieuwsanalyse.',
};

export default function DenkbeeldenPage() {
    // Fetch all thinkers using the function from lib/mdx
    const thinkers = getAllThinkers()
        // Sort alphabetically by name
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center border-b pb-4">Denkbeelden</h1>

            {thinkers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {thinkers.map((thinker) => (
                        <div key={thinker.slug} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="p-6 flex-grow flex flex-col">
                                <h2 className="text-xl font-semibold mb-3">{thinker.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">{thinker.bio}</p>

                                {/* Optional Quote */}
                                {thinker.quote && (
                                    <blockquote className="border-l-4 border-gray-200 pl-3 italic text-sm text-gray-500 mb-5">
                                        {thinker.quote}
                                    </blockquote>
                                )}

                                {/* Link to thinker profile page */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Link
                                        href={`/denkbeelden/${thinker.slug}`}
                                        className="inline-block text-sm font-medium text-black hover:underline"
                                    >
                                        Bekijk artikelen →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Er zijn momenteel geen denkers beschikbaar.</p>
            )}
        </div>
    );
} 