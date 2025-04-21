import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over Staatslogica',
  description: 'Ontdek de filosofie en het doel achter Staatslogica - dagelijkse analyses met een libertarische bril.',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <article className="prose lg:prose-lg">
        <h1>Over Staatslogica</h1>
        <p>
          Staatslogica is een dagelijkse analyse van wat "normaal" wordt gevonden in media en politiek.
          We stellen vragen die zelden gesteld worden, en doen dat met de bril van denkers als Mises, Rothbard, Spooner, Hazlitt, en Rand.
        </p>
        <p>
          Wij geloven niet in representatieve democratie, geweldsmonopolies of collectieve dwang als legitieme basis voor een samenleving.
          Het non-agressie principe is leidend.
        </p>
        <p>
          Maar we geloven ook niet in doelloos cynisme. We willen inzicht geven en aanzetten tot kritisch denken over de rol van de staat, niet per se angst aanjagen of polariseren.
          Onze analyses zijn bedoeld als intellectuele oefening en reflectie, vaak met een satirische ondertoon.
        </p>
        <p>
          De teksten worden deels gegenereerd met behulp van AI, getraind op de werken van genoemde denkers, en vervolgens redactioneel bewerkt en verfijnd.
        </p>
      </article>
    </main>
  );
} 