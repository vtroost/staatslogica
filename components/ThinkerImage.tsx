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

  const src = `/images/thinkers/${filename}.jpg`;

  return (
    <div className="flex justify-center mb-4">
      <div className="relative w-28 h-28 rounded-full border border-gray-300 overflow-hidden">
        <Image
          src={src}
          alt={`Silhouet van ${name}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}; 