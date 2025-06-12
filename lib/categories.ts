import type { CategoryData } from './types';
import { generateSlug } from './utils';
import { getAllArticles } from './articles';

// Define the new category structure based on the user's proposal
export const categories: CategoryData[] = [
  {
    name: 'Economie & Geld',
    slug: 'economie-geld',
    description: 'Analyse van economische processen, inflatie, centrale banken en alternatieve geldsystemen',
    topics: ['inflatie', 'centrale banken', 'centrale bank', 'fiatgeld', 'bitcoin', 'economie', 'loonvorming', 'belasting', 'belastingen', 'time preference'],
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Overheidsmacht & Interventie',
    slug: 'overheidsmacht-interventie',
    description: 'Kritische analyse van overheidsinterventie en centralisatie van macht',
    topics: ['overheidsinterventie', 'centrale planning', 'centralisatie', 'publieke sector', 'staatsmonopolie', 'gezagskritiek'],
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
    topics: ['individualisme', 'staatsburgerschap'],
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
    topics: ['staking'],
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