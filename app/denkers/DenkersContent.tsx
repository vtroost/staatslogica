import { getStromingBySlug } from '@/lib/stromingen';
import StromingBadge from '@/components/StromingBadge';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import type { Stroming } from '@/lib/types';

interface DenkersContentProps {
  thinkers: any[];
  stromingen: Stroming[];
}

export default function DenkersContent({ thinkers, stromingen }: DenkersContentProps) {
  return (
    <div className="w-full min-h-screen">
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Denkers' }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Denkers
            </h1>
            <div className="text-lg text-black text-opacity-90 leading-relaxed space-y-4">
              <p>
              In een tijd waarin media en politiek één verhaal lijken te vertellen, is het des te belangrijker om kennis te maken met stemmen die zich niet schikken naar de logica van macht. Ware intellectuele vrijheid begint waar twijfel aan de staat wordt toegestaan.
              </p>
              <p>
              De denkers op deze site vertegenwoordigen vier stromingen die elkaar soms overlappen, maar elk op hun manier het staatsdenken uitdagen:
              klassiek-liberalen die pleiten voor een minimale overheid, libertariërs die vrijwilligheid als hoogste principe beschouwen, anarcho-kapitalisten die elk gezag buiten het individu verwerpen, en anarchisten die de psychologische wortels van onderwerping blootleggen.
              </p>
              <p>
              Van Bastiat's waarschuwing tegen “legale roof”, tot Mises' analyse van economische prikkels; van Rand's lofzang op rationeel egoïsme tot Spooner's juridische afrekening met de grondwet — hun inzichten zijn vandaag relevanter dan ooit. Ontdek de logica van vrijheid.
              </p>
              

            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Stroming Labels */}
          <div className="flex flex-wrap gap-3 mb-6">
            {stromingen.map(stroming => {
              return (
                <Link 
                  key={stroming.slug}
                  href={`/stromingen/${stroming.slug}`}
                  className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-2 rounded-lg hover:bg-yellow-500 transition-all font-medium text-sm"
                >
                  {stroming.name}
                </Link>
              );
            })}
          </div>

          {/* Thinkers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {thinkers.map(thinker => {
              let years = '';
              if (thinker.title) {
                const match = thinker.title.match(/\(([^)]+)\)/);
                if (match) years = match[1];
              }
              
              const stroming = getStromingBySlug(thinker.stroming);
              
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
                      {stroming && (
                        <StromingBadge stroming={stroming} size="sm" />
                      )}
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
