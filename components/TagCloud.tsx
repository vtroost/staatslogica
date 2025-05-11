import Link from 'next/link';
import { getAllTags } from '../lib/tags'; // Assuming lib is one level up from components

export default function TagCloud() {
  const tags = getAllTags();

  if (!tags || tags.length === 0) {
    return null; // Don't render anything if there are no tags
  }

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            href={`/tags/${tag.slug}`}
            key={tag.slug}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-150"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
} 