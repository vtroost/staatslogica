import type { Stroming } from './types';

export const STROMINGEN: Stroming[] = [
  {
    slug: 'klassiek-liberaal',
    name: 'Klassiek-liberaal',
    description: 'Voorstanders van vrije markt, beperkte overheid en eigendomsrechten — maar niet noodzakelijk anarchisme',
    detailedDescription: 'Het klassiek liberalisme ontstond in de 18e eeuw als reactie op het mercantilisme en absolutisme. Deze stroming benadrukt de waarde van individuele vrijheid, vrije markten en beperkte overheidsinterventie. Klassiek liberalen geloven dat spontane orde en concurrentie tot betere uitkomsten leiden dan centrale planning. Ze accepteren een minimale staat voor het beschermen van eigendomsrechten en het handhaven van contracten, maar zijn sceptisch over uitgebreide overheidsprogramma\'s.',
    keyPrinciples: [
      'Vrije markteconomie met minimale regulering',
      'Beperkte overheid die zich focust op rechtsstaat',
      'Individuele vrijheid en verantwoordelijkheid',
      'Eigendomsrechten als basis van de samenleving',
      'Spontane orde door vrijwillige uitwisseling'
    ],
    color: 'bg-gray-100 text-gray-800 border border-gray-200',
    thinkers: ['adam-smith', 'friedrich-hayek', 'milton-friedman', 'henry-hazlitt', 'ron-paul']
  },
  {
    slug: 'libertarier',
    name: 'Libertariër',
    description: 'Radicaal vrije markt, natuurlijke rechten, vrijwilligheid — trekken richting anarchisme',
    detailedDescription: 'Het libertarisme gaat verder dan het klassiek liberalisme door een radicalere interpretatie van individuele vrijheid. Libertariërs geloven in natuurlijke rechten die voorafgaan aan de staat en zien vrijwillige interactie als de enige legitieme basis voor sociale organisatie. Ze zijn veel kritischer op staatsmacht dan klassiek liberalen en sommigen evolueren naar anarchistische posities. Deze stroming benadrukt dat initiatie van geweld altijd moreel verwerpelijk is.',
    keyPrinciples: [
      'Non-agressie principe: geen initiatie van geweld',
      'Natuurlijke rechten op leven, vrijheid en eigendom',
      'Radicaal vrije markt zonder staatsinterventie',
      'Vrijwillige associatie als basis van samenleving',
      'Extreme skepsis jegens alle vormen van staatsmacht'
    ],
    color: 'bg-gray-100 text-gray-800 border border-gray-200',
    thinkers: ['ayn-rand', 'frederic-bastiat', 'ludwig-von-mises', 'saifedean-ammous']
  },
  {
    slug: 'anarcho-kapitalistisch',
    name: 'Anarcho-kapitalistisch',
    description: 'Streven naar een volledig vrijwillige samenleving zonder staat — met eigendomsrechten en privaat rechtssysteem',
    detailedDescription: 'Het anarcho-kapitalisme is de logische conclusie van het libertaire denken: een volledig vrijwillige samenleving zonder monopolistische staat. Anarcho-kapitalisten geloven dat alle diensten die de staat nu levert - inclusief rechtspraak, beveiliging en arbitrage - beter en ethischer door private ondernemingen geleverd kunnen worden. Ze zien de staat als een inherent gewelddadige en inefficiënte organisatie die concurrenten uitsluit door geweld.',
    keyPrinciples: [
      'Volledige afschaffing van de staat',
      'Private eigendomsrechten als absolute basis',
      'Vrije markt concurrentie in alle sectoren',
      'Private rechtssystemen en beveiligingsdiensten',
      'Vrijwillige financiering van alle diensten'
    ],
    color: 'bg-gray-100 text-gray-800 border border-gray-200',
    thinkers: ['murray-rothbard', 'walter-block', 'jesus-huerta-de-soto']
  },
  {
    slug: 'anarchistisch',
    name: 'Anarchistisch',
    description: 'Focus op vrijwilligheid, anti-staats, vaak buiten marktkader',
    detailedDescription: 'Het anarchisme in bredere zin focust op de afwijzing van alle hiërarchische autoriteit, maar niet noodzakelijk binnen een markteconomisch kader. Deze denkers concentreren zich vooral op het blootleggen van de illusie van politieke autoriteit en het bevorderen van vrijwillige samenwerking. Ze benadrukken dat echte autoriteit alleen voortkomt uit waarheid en expertise, niet uit geweld of positie.',
    keyPrinciples: [
      'Afwijzing van alle hiërarchische autoriteit',
      'Vrijwillige samenwerking als ideaal',
      'Ontmaskering van politieke illusies',
      'Morele autoriteit boven positie-autoriteit',
      'Directe actie en burgerlijke ongehoorzaamheid'
    ],
    color: 'bg-gray-100 text-gray-800 border border-gray-200',
    thinkers: ['lysander-spooner', 'etienne-de-la-boetie', 'larken-rose']
  }
];

// Helper function to get stroming by slug
export function getStromingBySlug(slug: string): Stroming | undefined {
  return STROMINGEN.find(stroming => stroming.slug === slug);
}

// Helper function to get stroming for a thinker
export function getStromingForThinker(thinkerSlug: string): Stroming | undefined {
  return STROMINGEN.find(stroming => stroming.thinkers.includes(thinkerSlug));
}

// Helper function to get all thinkers for a stroming
export function getThinkersForStroming(stromingSlug: string): string[] {
  const stroming = getStromingBySlug(stromingSlug);
  return stroming ? stroming.thinkers : [];
} 