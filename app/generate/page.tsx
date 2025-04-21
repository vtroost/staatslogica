import React from 'react';
import { getAllThinkers, ThinkerData } from '@/lib/mdx';
import GenerateForm from '@/components/GenerateForm';

export default function GeneratePage() {
  const thinkersList = getAllThinkers();
  thinkersList.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">AI Artikel Generator</h1>
        <GenerateForm thinkersList={thinkersList} />
      </div>
    </div>
  );
} 