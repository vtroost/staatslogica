import React from 'react';
'use client';

import { useState } from 'react';

const thinkers = [
  'Ayn Rand',
  'Ludwig von Mises',
  'Murray Rothbard',
  'Thomas Sowell',
  'Frédéric Bastiat',
  // Voeg hier meer denkers toe indien nodig
];

export default function GeneratePage() {
  const [url, setUrl] = useState('');
  const [thinker, setThinker] = useState(thinkers[0]); // Default to the first thinker
  const [extraInstruction, setExtraInstruction] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Voorkom standaard formulierinzending

    // Slugify helper (simple version)
    const slugify = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word chars and hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    const todayDate = new Date().toISOString().split('T')[0];
    const thinkerSlug = slugify(thinker);
    const slug = "placeholder"; // Hardcoded for now

    const prompt = `
You are a libertarian thinker, inspired by ${thinker}.
Please analyze the following news article critically. Focus on identifying the central "spin", why this is a government-created problem, what assumptions the article makes, and what a free-market or voluntary alternative would be.

Output your analysis in this exact JSON structure:

{
  "slug": "${slug}",
  "title": "Sharp, punchy title",
  "date": "${todayDate}",
  "tags": ["tag1", "tag2"],
  "thinker": "${thinker}",
  "image": {
    "url": "/images/og/${thinkerSlug}.jpg",
    "alt": "${thinker}"
  },
  "spin": "Short cynical summary of the article's core message",
  "libertarianAnalysis": "...",
  "anarchistAnalysis": "...",
  "quote": "A relevant quote from ${thinker}"
}

Article URL:
${url}

Optional instruction from editor:
${extraInstruction || 'None'}
`;

    console.log(prompt);
    // In een latere stap voegen we hier de backend call toe
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Genereer Concept (Log Input)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 