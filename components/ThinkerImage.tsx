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
    <div>
      <div>
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