import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image'; // Import Image component

// Define the structure of an article based on the JSON
interface Article {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thinker: string;
  image: {
    url: string;
    alt: string;
  };
  spin: string;
  libertarianAnalysis: string;
  anarchistAnalysis: string;
  quote: string;
}

interface ArticlePageProps {
  article: Article;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  const filenames = fs.readdirSync(articlesDirectory);

  const paths = filenames
    .filter(filename => filename.endsWith('.json')) // Ensure we only process JSON files
    .map((filename) => ({
      params: { slug: filename.replace('.json', '') },
    }));

  return { paths, fallback: false }; // fallback: false means pages for non-existent slugs will 404
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  if (!slug) {
    return { notFound: true }; // Return 404 if slug is not available
  }

  const filePath = path.join(process.cwd(), 'content/articles', `${slug}.json`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const article: Article = JSON.parse(fileContents);

    // Ensure the slug in the file matches the requested slug (optional but good practice)
    if (article.slug !== slug) {
      console.warn(`Slug mismatch: file ${slug}.json contains slug ${article.slug}`);
      // Depending on requirements, you might want to return notFound: true here
    }

    return { props: { article } };
  } catch (error) {
    console.error(`Error reading or parsing article file ${filePath}:`, error);
    return { notFound: true }; // Return 404 if file doesn't exist or is invalid JSON
  }
};

// Define the page component
const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
  const router = useRouter();

  // Show a loading state while Next.js generates the page if fallback is true/blocking
  // Not strictly needed with fallback: false, but good practice
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <article className="prose lg:prose-xl max-w-none">
      {/* Basic Article Structure */}
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-gray-600 text-sm mb-4">
        <span>{article.date}</span> | <span>Denker: {article.thinker}</span> | Tags: {article.tags.join(', ')}
      </div>

      {/* Optional Image - Check if URL exists */}
      {article.image?.url && (
          <div className="relative w-full h-64 md:h-96 mb-6"> { /* Adjust height as needed */}
             <Image
                src={article.image.url}
                alt={article.image.alt}
                layout="fill"
                objectFit="cover" // Or "contain" depending on preference
                className="rounded-md"
             />
          </div>
      )}

      <p className="lead italic mb-6">{article.spin}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Libertaire Analyse</h2>
          <p>{article.libertarianAnalysis}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Anarchistische Analyse</h2>
          <p>{article.anarchistAnalysis}</p>
        </section>
      </div>

      <blockquote className="border-l-4 border-gray-500 pl-4 italic my-6">
        {article.quote}
      </blockquote>

    </article>
  );
};

export default ArticlePage; 