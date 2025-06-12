import type { CategoryData } from './types';
import { generateSlug } from './utils';
import { getAllArticles } from './articles';

// Define the new category structure based on the user's proposal
export const categories: CategoryData[] = [
  {
    name: 'Economie & Geld',
    slug: 'economie-geld',
    description: 'Analyse van economische processen, inflatie, centrale banken en alternatieve geldsystemen',
    topics: ['inflatie', 'centrale banken', 'fiatgeld', 'bitcoin', 'economie', 'loonvorming', 'belasting', 'belastingen', 'time preference'],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Overheidsmacht & Interventie',
    slug: 'overheidsmacht-interventie',
    description: 'Kritische analyse van overheidsinterventie en centralisatie van macht',
    topics: ['overheidsinterventie', 'centrale planning', 'centralisatie', 'publieke sector', 'staatsmonopolie', 'gezagskritiek', 'bureaucratie'],
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Politiek & Bestuur',
    slug: 'politiek-bestuur',
    description: 'Analyse van politieke processen, partijen en democratische instellingen',
    topics: ['politiek', 'politieke partijen', 'coalitie', 'democratie', 'referenda', 'betrouwbare politici'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Begrotingsbeleid & Bezuinigingen',
    slug: 'begrotingsbeleid-bezuinigingen',
    description: 'Analyse van overheidsuitgaven, begrotingsbeleid en bezuinigingsmaatregelen',
    topics: ['begroting', 'bezuinigingen', 'DNB'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Vrijheid & Individualisme',
    slug: 'vrijheid-individualisme',
    description: 'Verkenning van individuele vrijheden en staatsburgerschap',
    topics: ['individualisme', 'staatsburgerschap','menselijke-waardigheid'],
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'Mobiliteit & Infrastructuur',
    slug: 'mobiliteit-infrastructuur',
    description: 'Analyse van transport, infrastructuur en mobiliteitsbeleid',
    topics: ['NS', 'infrastructuur', 'mobiliteit', 'verkeersboetes'],
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Wonen & Levensonderhoud',
    slug: 'wonen-levensonderhoud',
    description: 'Onderzoek naar woningmarkt en demografische ontwikkelingen',
    topics: ['woningmarkt', 'geboortecijfer'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Arbeid & Actie',
    slug: 'arbeid-actie',
    description: 'Analyse van arbeidsmarkt en collectieve acties',
    topics: ['staking','arbeidsongeschiktheid'],
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Klimaat & Milieu',
    slug: 'klimaat-milieu',
    description: 'Kritische blik op klimaat- en milieubeleid',
    topics: ['milieu-klimaat', 'milieu', 'klimaat'],
    color: 'from-emerald-500 to-emerald-600'
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
  libertarianPerspective: string; 
  analysisApproach: string; 
  keyThinkers: string[]; 
} | null {
  const contexts = {
    'economie-geld': {
      libertarianPerspective: 'De Oostenrijkse School van economie vormt de basis van onze economische analyses. We geloven in vrije markten, geldsanering, en het afschaffen van centrale bankinterventie. Inflatie wordt gezien als een verborgen belasting die welvaart vernietigt en ongelijkheid vergroot.',
      analysisApproach: 'Onze analyses richten zich op het blootleggen van economische interventies, de perverse gevolgen van monetair beleid, en het tonen van hoe vrije markten tot welvaart en voorspoed leiden. We analyseren inflatie, belastingdruk, en regulering vanuit het perspectief van individuele vrijheid.',
      keyThinkers: ['Ludwig von Mises', 'Friedrich A. von Hayek', 'Murray Rothbard', 'Saifedean Ammous', 'Ron Paul', 'Frédéric Bastiat', 'Henry Hazlitt']
    },
    'overheidsmacht-interventie': {
      libertarianPerspective: 'Overheidsinterventie wordt gezien als een inbreuk op individuele vrijheid en eigendomsrechten. Elke vorm van dwang door de staat wordt kritisch geanalyseerd, of het nu gaat om regulering, subsidies, of directe controle over markten.',
      analysisApproach: 'We ontleden hoe overheidsinterventie onbedoelde gevolgen heeft, markten verstoort, en innovatie belemmert. Onze analyses tonen het falen van centrale planning en de superioriteit van spontane orde en vrijwillige samenwerking.',
      keyThinkers: ['Friedrich A. von Hayek', 'Ludwig von Mises', 'Murray Rothbard', 'Etienne de La Boetie', 'Frédéric Bastiat', 'Milton Friedman']
    },
    'politiek-bestuur': {
      libertarianPerspective: 'Democratie wordt niet als een doel op zich gezien, maar als een middel. We zijn kritisch over majoritarisme en pleiten voor constitutionele beperkingen van staatsmacht. Politieke macht corrumpeert en moet daarom maximaal worden beperkt.',
      analysisApproach: 'Onze politieke analyses richten zich op het tonen van politiek falen, rent-seeking gedrag, en de illusie van democratische legitimiteit. We analyseren hoe politieke besluitvorming vaak ten koste gaat van individuele rechten en economische efficiëntie.',
      keyThinkers: ['James Buchanan', 'Gordon Tullock', 'Etienne de La Boetie', 'Ron Paul', 'Lysander Spooner', 'Larken Rose', 'Anthony de Jasay', 'Hans-Hermann Hoppe']
    },
    'begrotingsbeleid-bezuinigingen': {
      libertarianPerspective: 'Overheidsuitgaven worden gezien als verspilling van schaarse middelen die beter door de markt kunnen worden gealloceerd. Echte bezuinigingen betekenen het verkleinen van de staat, niet alleen het vertragen van uitgavengroei.',
      analysisApproach: 'We analyseren begrotingen vanuit het perspectief van belastingdruk, staatsschuld, en crowding-out effecten. Onze analyses tonen hoe overheidsuitgaven private investeringen verdringen en economische groei belemmeren.',
      keyThinkers: ['James Buchanan', 'Milton Friedman', 'Robert Higgs', 'Alberto Alesina']
    },
    'vrijheid-individualisme': {
      libertarianPerspective: 'Individuele vrijheid en zelfbeschikking staan centraal. We geloven in negatieve rechten (recht om met rust gelaten te worden) boven positieve rechten (recht op voorzieningen van anderen). Elk individu is eigenaar van zichzelf.',
      analysisApproach: 'Onze analyses onderzoeken hoe collectivistische ideologieën individuele vrijheid ondermijnen. We tonen het belang van eigendomsrechten, vrijwillige associatie, en persoonlijke verantwoordelijkheid voor een welvarende samenleving.',
      keyThinkers: ['John Stuart Mill', 'Robert Nozick', 'Murray Rothbard', 'Ayn Rand', 'Lysander Spooner', 'Larken Rose']
    },
    'mobiliteit-infrastructuur': {
      libertarianPerspective: 'Infrastructuur kan efficiënter door private partijen worden geleverd dan door de overheid. Monopolies zoals NS en staatswegen leiden tot inefficiëntie, slechte service, en misallocatie van middelen.',
      analysisApproach: 'We analyseren hoe staatsmonopolies in transport en infrastructuur leiden tot hoge kosten, slechte kwaliteit, en gebrek aan innovatie. Onze analyses pleiten voor privatisering, concurrentie, en marktwerking in deze sectoren.',
      keyThinkers: ['Murray Rothbard', 'Walter Block', 'Gabriel Roth', 'Daniel Klein']
    },
    'wonen-levensonderhoud': {
      libertarianPerspective: 'Huisvesting is een marktgoed, geen mensenrecht. Overheidsinmenging in woningmarkten leidt tot tekorten, prijsverstoringen, en misallocatie. Vrije markten zorgen voor betaalbare huisvesting voor iedereen.',
      analysisApproach: 'Onze analyses tonen hoe huurcontrole, sociale woningbouw, en planningsregels de woningmarkt verstoren. We onderzoeken hoe vrijmaking van grondmarkten en afschaffing van regulering tot meer en betere woningen zou leiden.',
      keyThinkers: ['Thomas Sowell', 'Richard Epstein', 'Edward Glaeser', 'Alain Bertaud']
    },
    'arbeid-actie': {
      libertarianPerspective: 'Werk is een vrijwillige uitwisseling tussen werkgever en werknemer. Vakbonden en stakingsrecht kunnen legitiem zijn, maar niet met dwang of geweld. Minimumlonen en arbeidsregulering schaden vooral laaggeschoolden.',
      analysisApproach: 'We analyseren hoe arbeidsregulering werkloosheid veroorzaakt en flexibiliteit belemmert. Onze analyses tonen hoe vrije arbeidsmarkten tot hogere lonen en betere arbeidsomstandigheden leiden dan dwangmaatregelen.',
      keyThinkers: ['Murray Rothbard', 'Walter Williams', 'Thomas Sowell', 'Morgan Reynolds']
    },
    'klimaat-milieu': {
      libertarianPerspective: 'Milieuproblemen kunnen het best worden opgelost via eigendomsrechten en marktmechanismen, niet via overheidsregulering. Vervuiling is vaak het gevolg van onduidelijke eigendomsrechten en externe effecten.',
      analysisApproach: 'Onze analyses zijn kritisch over klimaatalarmisme en tonen hoe marktoplossingen effectiever zijn dan overheidsdwang. We onderzoeken hoe eigendomsrechten, innovatie, en vrijwillige samenwerking milieuproblemen kunnen oplossen.',
      keyThinkers: ['Murray Rothbard', 'Walter Block', 'Terry Anderson', 'Julian Simon']
    }
  };

  return contexts[categorySlug as keyof typeof contexts] || null;
} 