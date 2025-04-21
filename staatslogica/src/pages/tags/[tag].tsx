import { useRouter } from 'next/router';

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;

  return (
    <div>
      <h1>Tag: {tag}</h1>
      <p>This is the placeholder content for tag: {tag}.</p>
    </div>
  );
} 