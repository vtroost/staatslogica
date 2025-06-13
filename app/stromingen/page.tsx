import { STROMINGEN } from '@/lib/stromingen';
import { getAllThinkers } from '@/lib/thinkers';
import StromingBadge from '@/components/StromingBadge';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stromingen',
  description: 'Ontdek de verschillende filosofische stromingen binnen het libertarische denken.',
};

export default function StromingPage() {
  const thinkers = getAllThinkers();

  return (
    <div className="w-full min-h-screen">
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Denkers', href: '/denkers' },
              { label: 'Stromingen' }
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
              Stromingen
            </h1>
            <div className="text-lg text-black text-opacity-90 leading-relaxed space-y-4">
              <p>
                Het libertarische denken kent verschillende filosofische stromingen, elk met hun eigen nuances en benadering van vrijheid, eigendomsrechten en de rol van de staat.
              </p>
              <p>
                Van klassiek-liberalen die pleiten voor een beperkte staat tot anarcho-kapitalisten die de staat geheel verwerpen - ontdek de rijke diversiteit binnen het vrijheidsdenken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stromingen Grid */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STROMINGEN.map(stroming => {
              const stromingThinkers = thinkers.filter(t => t.stroming === stroming.slug);
              
              return (
                <Link 
                  key={stroming.slug}
                  href={`/stromingen/${stroming.slug}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
                >
                  {/* Yellow Header Section */}
                  <div className="relative h-20 md:h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <h2 className="text-xl md:text-2xl font-bold text-black group-hover:text-gray-800 transition-colors px-4 text-center">
                      {stroming.name}
                    </h2>
                    
                    {/* Denker count badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-black bg-opacity-30 text-black px-3 py-1 text-xs font-bold rounded">
                        {stromingThinkers.length} denker{stromingThinkers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* White Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                      {stroming.description}
                    </p>
                    
                    {/* Denkers in this stroming */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Denkers:</p>
                      <div className="flex flex-wrap gap-2">
                        {stromingThinkers.slice(0, 4).map(thinker => (
                          <span
                            key={thinker.slug}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {thinker.name}
                          </span>
                        ))}
                        {stromingThinkers.length > 4 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{stromingThinkers.length - 4} meer
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer with divider and link */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <span className="text-yellow-600 font-bold">
                        Bekijk alle denkers
                      </span>
                      <span className="text-yellow-600 group-hover:text-yellow-700 font-bold">
                        →
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