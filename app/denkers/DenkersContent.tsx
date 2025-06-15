import Breadcrumb from '@/components/Breadcrumb';
import ThinkerCard from '@/components/ThinkerCard';
import Link from 'next/link';
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
            <div className="text-lg text-black text-opacity-90 leading-relaxed">
              <p>
              In een tijd waarin media en politiek één verhaal lijken te vertellen, is het des te belangrijker om kennis te maken met stemmen die zich niet schikken naar de logica van macht. Ware intellectuele vrijheid begint waar twijfel aan de staat wordt toegestaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
                    {/* Introduction Text with Stroming Labels */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900">De vier stromingen</h2>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
              <div className="flex-1 text-gray-700 leading-relaxed space-y-4 mb-6 lg:mb-0">
                <p>
                  De denkers op deze site vertegenwoordigen vier stromingen die elkaar soms overlappen, maar elk op hun manier het staatsdenken uitdagen:
                  klassiek-liberalen die pleiten voor een minimale overheid, libertariërs die vrijwilligheid als hoogste principe beschouwen, anarcho-kapitalisten die elk gezag buiten het individu verwerpen, en anarchisten die de psychologische wortels van onderwerping blootleggen.
                </p>
                <p>
                  Van Bastiat's waarschuwing tegen "legale roof", tot Mises' analyse van economische prikkels; van Rand's lofzang op rationeel egoïsme tot Spooner's juridische afrekening met de grondwet — hun inzichten zijn vandaag relevanter dan ooit. Ontdek de logica van vrijheid.
                </p>
              </div>
              
              {/* Stroming Labels - Now on the right */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="flex flex-wrap lg:flex-col gap-3">
                  {stromingen.map(stroming => {
                    return (
                      <Link 
                        key={stroming.slug}
                        href={`/stromingen/${stroming.slug}`}
                        className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-2 rounded-lg hover:bg-yellow-500 transition-all font-medium text-sm lg:justify-start"
                      >
                        {stroming.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Thinkers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {thinkers.map(thinker => (
              <ThinkerCard key={thinker.slug} thinker={thinker} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
