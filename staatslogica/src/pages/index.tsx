import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Staatslogica</h1>
      <p>Welcome to Staatslogica, your source for satirical libertarian news analysis.</p>
      <p>Stay tuned for critiques from the minds of great thinkers!</p>
      {/* Placeholder image - replace later */}
      {/* <Image
        src="/images/placeholder.jpg"
        alt="Placeholder Image"
        width={500}
        height={300}
        className="mt-4"
      /> */}
    </div>
  );
} 