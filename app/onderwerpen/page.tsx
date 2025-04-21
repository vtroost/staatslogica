import { getAllTags, TagData } from '@/lib/mdx';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onderwerpen | Staatslogica',
  description: 'Blader door artikelen op onderwerp/tag.',
};

export default function OnderwerpenPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Onderwerpen</h1>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <Link 
              key={tag.slug} 
              href={`/onderwerpen/${tag.slug}`}
              className="inline-block bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-gray-800 hover:text-black transition-colors duration-150 shadow-sm"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nog geen onderwerpen (tags) gevonden in artikelen.</p>
      )}
    </div>
  );
} 