import Image from 'next/image'; // Use next/image for optimization

type ThinkerImageProps = {
  name: string;
};

export const ThinkerImage = ({ name }: ThinkerImageProps) => {
  // Generate filename, handling potential multiple spaces or special characters
  const filename = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters

  const src = `/images/thinkers/${filename}.png`;

  return (
    <div className="flex justify-center mb-6"> {/* Increased margin bottom */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gray-300 overflow-hidden"> {/* Container for Image */}
        <Image
          src={src}
          alt={`Silhouet van ${name}`}
          layout="fill"
          objectFit="cover"
          // Optional: Add a placeholder or fallback
          onError={(e) => {
            // Optional: Handle image loading errors, e.g., show a default silhouette
            console.error(`Failed to load image for ${name} at ${src}`);
            // e.target.src = '/images/thinkers/default-silhouette.png'; // Example fallback
          }}
        />
      </div>
    </div>
  );
}; 