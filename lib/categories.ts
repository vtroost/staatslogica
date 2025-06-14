import type { CategoryData } from './types';
import { generateSlug } from './utils';
import { getAllArticles } from './articles';

/**
 * Category definitions with associated tags and metadata
 */
export const categories: CategoryData[] = [
  {
    name: 'Economie & Geld',
    slug: 'economie-geld',
    description: 'Waar marktlogica botst op staatsuitgaven, inflatie en fiatfantasieën',
    topics: ['economie', 'inflatie', 'belasting', 'vrije-markt', 'fiatgeld', 'time preference', 'belastingen', 'begroting', 'economische-groei', 'geldstelsel', 'consumentenbescherming', 'bitcoin', 'markt', 'marktverstoringen', 'privatisering', 'subsidie', 'kapitalisme', 'economische-drogreden', 'bankwezen', 'centrale-banken', 'loonvorming', 'overheidsuitgaven', 'pensioen'],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Overheidsmacht & Interventie',
    slug: 'overheidsmacht-interventie',
    description: 'Ontrafelingen van dwang, planning en marktverstoring',
    topics: ['overheidsmacht', 'interventie', 'technocratie','subsidies', 'bureaucratie', 'controle', 'surveillance', 'autoritarisme', 'regelgeving', 'staatsmacht', 'centralisatie', 'dwang', 'propaganda', 'overheid', 'staatsmonopolie', 'overheidsinterventie', 'centrale-planning', 'gezagskritiek', 'NS', 'infrastructuur', 'mobiliteit', 'verkeersboetes', 'staking', 'arbeidsongeschiktheid'],
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Politiek & Bestuur',
    slug: 'politiek-bestuur',
    description: 'De schijnbewegingen van representatie, coalitie en Kamerklucht',
    topics: ['politiek', 'politieke partijen', 'publieke sector', 'coalitie', 'democratie', 'referenda', 'betrouwbare politici'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Begrotingsbeleid & Bezuinigingen',
    slug: 'begrotingsbeleid-bezuinigingen',
    description: 'Als de overheid moet besparen op de gevolgen van haar eigen uitgaven',
    topics: ['begroting', 'bezuinigingen', 'DNB'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Vrijheid & Individualisme',
    slug: 'vrijheid-individualisme',
    description: 'Over zelfbeschikking, morele autonomie en het recht om met rust gelaten te worden',
    topics: ['individualisme', 'staatsburgerschap','menselijke-waardigheid'],
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'Oorlog & Veiligheid',
    slug: 'oorlog-veiligheid',
    description: 'Hoe oorlog de gezondheid van de staat wordt en veiligheid een excuus voor controle',
    topics: ['oorlog', 'defensie', 'veiligheid', 'militaire-interventie', 'buitenlandse-politiek', 'terrorisme', 'oorlogseconomie', 'militair-industrieel-complex', 'neutraliteit', 'zelfverdediging', 'geopolitiek', 'NAVO', 'militarisme', 'dienstplicht'],
    color: 'from-slate-500 to-slate-600'
  },
  {
    name: 'Wonen & Levensonderhoud',
    slug: 'wonen-levensonderhoud',
    description: 'Wanneer woningnood niet het gevolg is van schaarste, maar van beleid',
    topics: ['woningmarkt', 'woningbouw', 'geboortecijfer'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Klimaat & Milieu',
    slug: 'klimaat-milieu',
    description: 'Waar morele paniek beleidsinstrument wordt en de CO₂-bewijslast kantelt',
    topics: ['milieu-klimaat', 'milieu', 'klimaat','klimaatverandering','klimaatbeleid'],
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    name: 'Gezondheid & Zorg',
    slug: 'gezondheid-zorg',
    description: 'Waar staatsmonopolie op gezondheid leidt tot wachtlijsten, bureaucratie en medische autoritarisme',
    topics: ['gezondheidszorg', 'zorgverzekering', 'ziekenhuizen', 'medische-interventie', 'gezondheidsbeleid', 'zorgmonopolie', 'medische-regelgeving', 'farmaceutische-industrie', 'preventie', 'zorguitgaven', 'medische-dwang', 'vaccinaties', 'zorgpremies', 'wachtlijsten', 'artsentekort', 'zorgcrisis', 'medische-ethiek', 'lichaamsautonomie', 'zorgtoeslagen', 'ggz', 'ouderenzorg', 'thuiszorg', 'zorgverlof', 'medische-privacy'],
    color: 'from-cyan-500 to-cyan-600'
  }
];

// Cache for categories to avoid recalculation
let categoriesCache: CategoryData[] | null = null;
let categoriesCacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute cache duration

/**
 * Get all categories with article counts
 */
export function getAllCategories(): CategoryData[] {
  const now = Date.now();
  
  // Return cached categories if cache is still valid
  if (categoriesCache && (now - categoriesCacheTimestamp) < CACHE_DURATION) {
    return categoriesCache;
  }

  const articles = getAllArticles();
  
  // Calculate article counts for each category
  const categoriesWithCounts = categories.map(category => {
    const count = articles.filter(article => 
      Array.isArray(article.tags) && 
      article.tags.some(tag => 
        category.topics.some(topic => 
          generateSlug(tag) === generateSlug(topic)
        )
      )
    ).length;
    
    return {
      ...category,
      count
    };
  });

  // Update cache
  categoriesCache = categoriesWithCounts;
  categoriesCacheTimestamp = now;

  return categoriesWithCounts;
}

/**
 * Get a specific category by slug
 */
export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return getAllCategories().find(category => category.slug === slug);
}

/**
 * Get articles for a specific category
 */
export function getArticlesByCategory(categorySlug: string): ReturnType<typeof getAllArticles> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];

  const allArticles = getAllArticles();
  return allArticles.filter(article => 
    Array.isArray(article.tags) && 
    article.tags.some(tag => 
      category.topics.some(topic => 
        generateSlug(tag) === generateSlug(topic)
      )
    )
  );
}

/**
 * Get category for a specific tag
 */
export function getCategoryForTag(tagName: string): CategoryData | undefined {
  const tagSlug = generateSlug(tagName);
  return categories.find(category => 
    category.topics.some(topic => generateSlug(topic) === tagSlug)
  );
}

/**
 * Get the color class for a category
 */
export function getCategoryColor(categorySlug: string): string {
  const category = categories.find(cat => cat.slug === categorySlug);
  return category?.color ? `bg-gradient-to-r ${category.color}` : 'bg-gray-500';
}

/**
 * Get other categories (excluding the current one)
 */
export function getOtherCategories(currentSlug: string): CategoryData[] {
  return categories.filter(cat => cat.slug !== currentSlug).slice(0, 8);
}

/**
 * Get libertarian context and analysis info for a category
 */
export function getCategoryContext(categorySlug: string): { 
  content: string;
  keyThinkers: string[];
  quote: string;
  quoteAuthor: string;
  quoteSource?: string;
} | null {
  const contexts = {
    'economie-geld': {
      content: 'Economie wordt vaak gepresenteerd als een neutrale wetenschap, maar dat is een illusie. Achter elke monetaire theorie schuilt een visie op macht, eigendom en vrijheid. Wanneer centrale banken geld drukken, verdwijnt welvaart niet — ze wordt alleen herverdeeld van spaarders naar schuldenaren.\n\nInflatie is geen natuurramp maar een beleidskeuze. Markten worden verstoord door interventie, niet door gebrek aan regulering. Vrije markten belonen waardecreatie, terwijl staatsinmenging rent-seeking beloont.\n\nElke economische wet die beloofd wordt problemen op te lossen, creëert nieuwe problemen. Subsidies maken afhankelijk wat zelfstandig zou kunnen zijn. Regulering beschermt gevestigde belangen tegen concurrentie.',
      keyThinkers: ['Ludwig von Mises', 'Friedrich von Hayek', 'Murray Rothbard', 'Saifedean Ammous', 'Ron Paul', 'Frédéric Bastiat', 'Henry Hazlitt'],
      quote: 'Inflation, being a fraudulent increase in the supply of money, is a form of theft... and a powerful engine of government control.',
      quoteAuthor: 'Murray Rothbard',
      quoteSource: 'The Mystery of Banking, 1983'
    },
    'overheidsmacht-interventie': {
      content: 'Goede bedoelingen leiden zelden tot goede uitkomsten wanneer ze via dwang worden opgelegd. Elke interventie creëert nieuwe problemen die vervolgens meer interventie rechtvaardigen. Dit is geen bug van het systeem — het is de feature.\n\nRegulering beschermt vaak niet de burger, maar de gereguleerde. Subsidies gaan naar degenen met de beste lobbyisten, niet naar degenen met de beste ideeën. Centrale planning faalt niet door incompetentie, maar door gebrek aan informatie.\n\nBeleidsmakers beloven controle te bieden over complexe systemen die inherent oncontroleerbaar zijn. Bureaucratieën groeien niet om problemen op te lossen, maar om zichzelf in stand te houden.',
      keyThinkers: ['Friedrich von Hayek', 'Ludwig von Mises', 'Murray Rothbard', 'Etienne de La Boetie', 'Frédéric Bastiat', 'Milton Friedman'],
      quote: 'The curious task of economics is to demonstrate to men how little they really know about what they imagine they can design.',
              quoteAuthor: 'Friedrich von Hayek',
      quoteSource: 'The Fatal Conceit, 1988'
    },
    'politiek-bestuur': {
      content: 'Democratie wordt vaak verheven tot bijna religieuze status, maar stemmen maakt macht niet moreel. Wanneer 51% van de mensen besluit om de andere 49% te beroven, is dat nog steeds diefstal — alleen dan georganiseerd.\n\nPolitici beloven oplossingen voor problemen die zij vaak zelf hebben gecreëerd. Coalitievorming draait niet om het algemeen belang, maar om het verdelen van de buit. Representatie is een façade voor rent-seeking.\n\nWetgeving wordt geschreven door lobbyisten en goedgekeurd door politici die de teksten vaak niet eens lezen. Democratische legitimiteit wordt gebruikt om individuele rechten te schenden. Politiek is georganiseerde plundering met een democratisch vernisje.',
      keyThinkers: ['James Buchanan', 'Gordon Tullock', 'Etienne de La Boetie', 'Ron Paul', 'Lysander Spooner', 'Larken Rose', 'Anthony de Jasay', 'Hans-Hermann Hoppe'],
      quote: 'The State is that great fiction by which everyone tries to live at the expense of everyone else.',
      quoteAuthor: 'Frédéric Bastiat',
      quoteSource: 'The Law, 1850'
    },
    'begrotingsbeleid-bezuinigingen': {
      content: 'Overheidsbegrotingen zijn geen neutrale boekhoudkundige oefening. Elke euro die de staat uitgeeft moet eerst ergens anders worden weggenomen. "Gratis" bestaat niet — alleen onzichtbare rekeningen die later verschijnen.\n\n"Bezuinigingen" betekenen zelden minder uitgaven, meestal alleen langzamere groei van uitgaven. Staatsschuld is een belasting op toekomstige generaties die nog geen stem hebben. Elke subsidie is een herverdeling van arm naar rijk.\n\nBegrotingen worden opgesteld met optimistische aannames en uitgevoerd met teleurstellende realiteit. Uitgaven zijn concreet en zichtbaar, kosten zijn abstract en verspreid. Dat is geen toeval — het is design.',
      keyThinkers: ['James Buchanan', 'Milton Friedman', 'Robert Higgs', 'Alberto Alesina'],
      quote: 'There is nothing so permanent as a temporary government program.',
      quoteAuthor: 'Milton Friedman',
      quoteSource: 'Interview with William F. Buckley Jr., 1975'
    },
    'vrijheid-individualisme': {
      content: 'Vrijheid is niet het recht om te doen wat je wilt, maar het recht om met rust gelaten te worden. Collectivisme presenteert zich als solidariteit, maar het is gewoon individuele verantwoordelijkheid uitbesteed aan de staat.\n\nPositieve rechten zijn altijd iemand anders zijn verplichtingen. "Rechten" op huisvesting, zorg of onderwijs zijn eigenlijk claims op andermans arbeid. Echte rechten kosten anderen niets — ze vragen alleen rust.\n\nCollectieve besluitvorming wordt gebruikt om individuele keuzes te overstijgen. Democratie wordt gebruikt om minderheidsrechten te schenden. Solidariteit wordt afgedwongen met belastingen en boetes.',
      keyThinkers: ['John Stuart Mill', 'Robert Nozick', 'Murray Rothbard', 'Ayn Rand', 'Lysander Spooner', 'Larken Rose'],
      quote: 'The only purpose for which power can be rightfully exercised over any member of a civilized community, against his will, is to prevent harm to others.',
            quoteAuthor: 'John Stuart Mill',
      quoteSource: 'On Liberty, 1859'
    },
    'oorlog-veiligheid': {
      content: 'Oorlog is de gezondheid van de staat, zoals Randolph Bourne al schreef in 1918. Niets vergroot overheidsmacht zo effectief als oorlog of de dreiging ervan. Burgerrechten verdwijnen, belastingen stijgen, en dissidenten worden het zwijgen opgelegd — allemaal in naam van nationale veiligheid.\n\nHet militair-industrieel complex gedijt bij conflict, niet bij vrede. Buitenlandse interventies worden verkocht als humanitaire missies, maar dienen meestal strategische of economische belangen. Defensie-uitgaven zijn vaak meer over subsidie aan wapenindustrie dan over werkelijke verdediging.\n\nEchte veiligheid ontstaat door vrije handel, diplomatiek en het respecteren van soevereiniteit — niet door militaire projectie of regime change. Neutraliteit en niet-agressie zijn geen zwakte, maar wijsheid.',
      keyThinkers: ['Murray Rothbard', 'Robert Higgs', 'Scott Horton', 'Ron Paul', 'Lew Rockwell', 'Ludwig von Mises'],
      quote: 'The State thrives on war - unless, of course, it is defeated and crushed - because war expands its power and control over society to the maximum.',
      quoteAuthor: 'Murray Rothbard',
      quoteSource: 'Anatomy of the State, 1974'
    },
    'wonen-levensonderhoud': {
      content: 'Woningnood wordt vaak gepresenteerd als een gevolg van schaarste, maar schaarste is zelden natuurlijk. Wanneer bouwen verboden wordt, prijzen gecontroleerd worden, en eigendom belast wordt, ontstaat er kunstmatige schaarste.\n\nHuurcontrole beschermt zittende huurders ten koste van nieuwe huurders. Sociale woningbouw verdringt private woningbouw. Planningsregels beschermen bestaande eigenaren tegen concurrentie van nieuwe ontwikkelingen.\n\nElke interventie in de woningmarkt lost één probleem op door drie nieuwe te creëeren. Huurcontrole leidt tot onderhoudstekort, sociale woningbouw tot wachtlijsten, en bestemmingsplannen tot schaarste.',
      keyThinkers: ['Thomas Sowell', 'Richard Epstein', 'Edward Glaeser', 'Alain Bertaud'],
      quote: 'The next time some academics tell you how to run the economy, ask them how come they didn\'t get rich themselves.',
      quoteAuthor: 'Thomas Sowell',
      quoteSource: 'Basic Economics, 2000'
    },

    'klimaat-milieu': {
      content: 'Klimaatpaniek wordt gepresenteerd als wetenschap, maar het is vaak politiek. Morele paniek is een krachtig instrument om individuele vrijheden in te perken en staatsmacht uit te breiden — en dat weten beleidsmakers maar al te goed.\n\nKlimaatbeleid treft altijd de armen het hardst en de rijken het minst. Koolstofbelastingen zijn regressief, energie-armoede is reëel, en groene subsidies gaan naar de connecties van politici, niet naar effectieve oplossingen.\n\nEigendomsrechten beschermen het milieu beter dan regulering. Vervuiling is vaak een gevolg van onduidelijke eigendom, niet van teveel vrijheid. Innovatie ontstaat door concurrentie, niet door centrale planning.',
      keyThinkers: ['Murray Rothbard', 'Walter Block', 'Terry Anderson', 'Julian Simon'],
      quote: 'The market economy succeeds by rewarding success and penalizing failure, in both cases giving the right incentives for redirecting resources to their most valued use.',
      quoteAuthor: 'Terry Anderson',
      quoteSource: 'Free Market Environmentalism, 1991'
    },
    'gezondheid-zorg': {
      content: 'Het "recht op zorg" is geen recht maar een claim op andermans arbeid. Wanneer de staat gezondheid centraliseert, ontstaan er wachtlijsten, bureaucratie en medische autoritarisme. Artsen worden ambtenaren, patiënten worden nummers.\n\nZorgverzekeringen zijn geen verzekeringen maar herverdeling. Wanneer consumenten niet direct betalen voor zorg, verdwijnt de prijswerking. Wanneer aanbieders geen concurrentie kennen, verdwijnt innovatie. Staatsmonopolie op zorg leidt tot schaarste, niet tot toegankelijkheid.\n\nEchte zorg ontstaat door vrijwillige uitwisseling tussen arts en patiënt. Concurrentie tussen zorgverleners leidt tot betere kwaliteit en lagere prijzen. Medische dwang — of het nu vaccinaties of lockdowns zijn — is incompatibel met lichaamsautonomie.',
      keyThinkers: ['Murray Rothbard', 'Hans-Hermann Hoppe', 'Walter Block', 'Thomas Szasz', 'Ron Paul', 'Ludwig von Mises'],
      quote: 'The proverb warns that "You should not bite the hand that feeds you." But maybe you should, if it prevents you from feeding yourself.',
      quoteAuthor: 'Thomas Szasz',
      quoteSource: 'The Second Sin, 1973'
    }
  };

  return contexts[categorySlug as keyof typeof contexts] || null;
} 