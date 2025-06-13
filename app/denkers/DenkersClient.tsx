'use client';

import { getStromingBySlug } from '@/lib/stromingen';
import StromingBadge from '@/components/StromingBadge';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Stroming } from '@/lib/types';

interface DenkersClientProps {
  thinkers: any[];
  stromingen: Stroming[];
}

export default function DenkersClient({ thinkers, stromingen }: DenkersClientProps) {
  const [selectedStroming, setSelectedStroming] = useState<string | null>(null);

  const filteredThinkers = selectedStroming 
    ? thinkers.filter(thinker => thinker.stroming === selectedStroming)
    : thinkers;

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
                In een wereld waarin media en politiek vaak maar één verhaal vertellen, is het cruciaal om verder te kijken dan de staatspropaganda. Echte intellectuele vrijheid vereist dat we luisteren naar stemmen die durven te twijfelen aan de gevestigde orde.
              </p>
              <p>
                Deze denkers bieden perspectieven die mainstream media zelden belichten: van Frédéric Bastiat's waarschuwingen tegen legale plundering tot Rothbard's ontmaskering van staatsmacht, van Mises' economische inzichten tot Spooner's juridische rebellie. Ontdek waarom hun ideeën relevanter zijn dan ooit.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/stromingen"
                  className="inline-flex items-center gap-2 bg-black bg-opacity-20 text-black px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all font-medium"
                >
                  Bekijk per stroming
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Compact Filter Badges */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Filter op stroming
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedStroming(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStroming === null 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Alle denkers ({thinkers.length})
              </button>

              {stromingen.map(stroming => {
                const count = thinkers.filter(t => t.stroming === stroming.slug).length;
                return (
                  <button
                    key={stroming.slug}
                    onClick={() => setSelectedStroming(stroming.slug)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStroming === stroming.slug 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {stroming.name} ({count})
                  </button>
                );
              })}
              
              <Link 
                href="/stromingen"
                className="px-4 py-2 rounded-lg text-sm font-medium text-yellow-600 hover:text-yellow-700 border border-yellow-200 hover:border-yellow-300 transition-colors"
              >
                Meer info →
              </Link>
            </div>
          </div>

          {/* Selected Stroming Description */}
          {selectedStroming && (
            <div className="mb-8 bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getStromingBySlug(selectedStroming)?.name}
              </h3>
              <p className="text-gray-600">
                {getStromingBySlug(selectedStroming)?.description}
              </p>
            </div>
          )}

          {/* Thinkers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThinkers.map(thinker => {
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
