import { getAllThinkers, getThinkerBySlug } from '@/lib/thinkers';
import { STROMINGEN } from '@/lib/stromingen';
import DenkersClient from './DenkersClient';

// Helper function to extract tagline from bio content
function extractTagline(bioContent?: string): string {
  if (!bioContent) return '';
  
  // Look for the first paragraph after the frontmatter that's not a heading
  const lines = bioContent.split('\n').filter(line => line.trim() !== '');
  
  // Find the first line that looks like a descriptive tagline (usually after the name)
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip markdown headings, empty lines, and very short lines
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('##') && 
        trimmed.length > 20 && 
        trimmed.length < 200) {
      return trimmed;
    }
  }
  
  return '';
}

export default async function ThinkersPage() {
    const allThinkers = getAllThinkers();
    
    // Get detailed data for each thinker to extract taglines
    const thinkersWithTaglines = await Promise.all(
        allThinkers.map(async (thinker) => {
            const detailedThinker = getThinkerBySlug(thinker.slug);
            return {
                ...thinker,
                tagline: extractTagline(detailedThinker?.bioContent)
            };
        })
    );
    
    // Sort by year of birth (ascending), living thinkers ("geboren YYYY") come after deceased
    thinkersWithTaglines.sort((a, b) => {
        // Extract birth year and if still alive
        const extractYearInfo = (t: any) => {
            if (t.title) {
                // Match (YYYY–YYYY) or (geboren YYYY)
                const deceased = t.title.match(/\((\d{4})[–-](\d{4})\)/);
                if (deceased) return { year: parseInt(deceased[1], 10), alive: false };
                const living = t.title.match(/geboren (\d{4})/i);
                if (living) return { year: parseInt(living[1], 10), alive: true };
            }
            return { year: Infinity, alive: true };
        };
        const aInfo = extractYearInfo(a);
        const bInfo = extractYearInfo(b);
        if (aInfo.year !== bInfo.year) return aInfo.year - bInfo.year;
        // If same year, deceased comes before living
        if (aInfo.alive !== bInfo.alive) return aInfo.alive ? 1 : -1;
        return 0;
    });

    return (
        <DenkersClient 
            thinkers={thinkersWithTaglines} 
            stromingen={STROMINGEN}
        />
    );
} 