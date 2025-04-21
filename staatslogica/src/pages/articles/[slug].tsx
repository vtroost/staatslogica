import { useRouter } from 'next/router';

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Article: {slug}</h1>
      <p>This is the placeholder content for article: {slug}.</p>
    </div>
  );
} 