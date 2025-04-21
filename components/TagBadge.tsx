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
    >
      #{tag}
    </Link>
  );
}; 