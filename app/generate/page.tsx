'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { buildArticlePrompt } from '@/lib/prompts';
import { getAllThinkers, ThinkerData } from '@/lib/mdx';
// Verwijder de directe import van openai
// import { openai } from '@/lib/openai';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export default function GeneratePage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [selectedThinkerName, setSelectedThinkerName] = useState('');
  const [thinkersList, setThinkersList] = useState<ThinkerData[]>([]);
  const [extraInstruction, setExtraInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchedThinkers = getAllThinkers();
      fetchedThinkers.sort((a, b) => a.name.localeCompare(b.name));
      setThinkersList(fetchedThinkers);
      if (fetchedThinkers.length > 0) {
        setSelectedThinkerName(fetchedThinkers[0].name);
      }
    } catch (error) {
      console.error("Error fetching thinkers:", error);
    } finally {
      setIsListLoading(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!selectedThinkerName) {
        alert('Please select a thinker.');
        setIsLoading(false);
        return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const selectedThinkerData = thinkersList.find(t => t.name === selectedThinkerName);
    const thinkerSlug = selectedThinkerData ? selectedThinkerData.slug : slugify(selectedThinkerName);

    const apiPrompt = buildArticlePrompt({
      thinker: selectedThinkerName,
      thinkerSlug,
      date: todayDate,
      url,
      extraInstruction,
    });

    console.log("Generated Prompt (Refined):", apiPrompt);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: apiPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error fetching data' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedContent = data.response;

      console.log('Raw API Route response:', generatedContent);

      let articleData;
      try {
          articleData = JSON.parse(generatedContent.trim());
      } catch (parseError) {
          console.error("Failed to parse generated content as JSON:", parseError);
          console.error("Invalid JSON string received:", generatedContent);
          const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
          throw new Error(`Received invalid JSON data from the generation API. Please check the AI response format. Error: ${errorMessage}`);
      }

      const queryString = new URLSearchParams({ articleData: JSON.stringify(articleData) }).toString();
      router.push(`/generate/preview?${queryString}`);

    } catch (error) {
      console.error("Error during generation or redirect:", error);
      const alertMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${alertMessage}`);
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
              value={selectedThinkerName}
              onChange={(e) => setSelectedThinkerName(e.target.value)}
              disabled={isListLoading}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
            >
              {isListLoading ? (
                <option>Laden...</option>
              ) : thinkersList.length === 0 ? (
                 <option>Geen denkers gevonden</option>
              ) : (
                thinkersList.map((thinker) => (
                  <option key={thinker.slug} value={thinker.name}>
                    {thinker.name}
                  </option>
                ))
              )}
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
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Genereren...' : 'Genereer Concept'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 