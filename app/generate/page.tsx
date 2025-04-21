'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// Verwijder de directe import van openai
// import { openai } from '@/lib/openai';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

const thinkers = [
  'Ayn Rand',
  'Ludwig von Mises',
  'Murray Rothbard',
  'Thomas Sowell',
  'Frédéric Bastiat',
  // Voeg hier meer denkers toe indien nodig
];

export default function GeneratePage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [thinker, setThinker] = useState(thinkers[0]); // Default to the first thinker
  const [extraInstruction, setExtraInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Slugify helper (simple version)
    const todayDate = new Date().toISOString().split('T')[0];
    const thinkerSlug = slugify(thinker);
    const slug = "placeholder"; // Still placeholder, consider generating from title later?

    // Refined prompt with stricter JSON instructions
    const apiPrompt: string = `
Je bent een libertarische denker, geïnspireerd door ${thinker}.
Analyseer het volgende nieuwsartikel kritisch. Focus op het identificeren van de centrale "spin", waarom dit een door de overheid gecreëerd probleem is, welke aannames het artikel maakt, en wat een vrijemarkt- of vrijwillig alternatief zou zijn.

Lever je analyse aan in **exact** de JSON-structuur hieronder. Het is cruciaal dat het output een **valide JSON** string is. 
**Gebruik ALTIJD dubbele aanhalingstekens ("") rond alle keys en string-waarden.** Gebruik GEEN single quotes ('') of backticks (``). Zorg ervoor dat alle strings correct zijn escaped indien nodig.

JSON Structuur:
{
  "slug": "${slug}", 
  "title": "Scherpe, pakkende titel in het Nederlands",
  "date": "${todayDate}",
  "tags": ["nederlandse-tag1", "nederlandse-tag2"], 
  "thinker": "${thinker}",
  "image": {
    "url": "/images/og/${thinkerSlug}.jpg",
    "alt": "${thinker}"
  },
  "spin": "Korte cynische samenvatting (Nederlands)",
  "libertarianAnalysis": "Libertarische analyse in het Nederlands...",
  "anarchistAnalysis": "Anarchistische analyse in het Nederlands...",
  "quote": "Een relevant citaat van ${thinker} (vertaald of origineel)"
}

Let op: De output MOET beginnen met { en eindigen met }, zonder enige tekst ervoor of erna. Het moet direct parseerbaar zijn met JSON.parse().

Artikel URL:
${url}

Optionele instructie van redacteur:
${extraInstruction || 'Geen'}
`;

    console.log("Generated Prompt (Refined):", apiPrompt);

    try {
      // Maak een fetch request naar de API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: apiPrompt }), // Stuur de prompt mee in de body
      });

      // Controleer of de request succesvol was
      if (!response.ok) {
        // Probeer de foutmelding uit de response body te halen
        const errorData = await response.json().catch(() => ({ error: 'Unknown error fetching data' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Haal de AI response uit de JSON body
      const data = await response.json();
      const generatedContent = data.response; // Assuming this is the string containing potential JSON

      console.log('Raw API Route response:', generatedContent); // Log the raw response

      // Attempt to parse the JSON string
      let articleData;
      try {
          // Trim whitespace that might interfere with parsing
          articleData = JSON.parse(generatedContent.trim());
      } catch (parseError) {
          console.error("Failed to parse generated content as JSON:", parseError);
          console.error("Invalid JSON string received:", generatedContent); // Log the problematic string
          // Type check for error message
          const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
          throw new Error(`Received invalid JSON data from the generation API. Please check the AI response format. Error: ${errorMessage}`);
      }

      // Construct URL with query parameter for app router
      const queryString = new URLSearchParams({ articleData: JSON.stringify(articleData) }).toString();
      router.push(`/generate/preview?${queryString}`);

    } catch (error) {
      console.error("Error during generation or redirect:", error);
      const alertMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${alertMessage}`); // Simple alert for now
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">AI Artikel Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              📎 Artikel URL (NOS)
            </label>
            <input
              type="url"
              name="url"
              id="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://nos.nl/..."
            />
          </div>

          <div>
            <label htmlFor="thinker" className="block text-sm font-medium text-gray-700 mb-1">
              🧠 Denker
            </label>
            <select
              id="thinker"
              name="thinker"
              value={thinker}
              onChange={(e) => setThinker(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {thinkers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="extraInstruction" className="block text-sm font-medium text-gray-700 mb-1">
              💬 Instructieveld <span className="text-gray-500">(optioneel)</span>
            </label>
            <textarea
              id="extraInstruction"
              name="extraInstruction"
              rows={3}
              value={extraInstruction}
              onChange={(e) => setExtraInstruction(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Bijv: Focus op de economische implicaties..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Genereren...' : 'Genereer Concept'} {/* Change button text when loading */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 