import Link from 'next/link'; // Import Link for future use

type TagBadgeProps = {
  tag: string;
};

export const TagBadge = ({ tag }: TagBadgeProps) => {
  // Basic slugification for URL, can be refined later
  const slug = tag.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`/tags/${slug}`} // Link to the tag page (implement later)
      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-150 ease-in-out"
      // Added mb-2 for spacing when tags wrap
    >
      #{tag}
    </Link>
  );
}; 