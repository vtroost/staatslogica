import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const metadata: Metadata = {
  title: 'Over Staatslogica',
  description: 'Ontdek de filosofie en het doel achter Staatslogica - dagelijkse analyses met een libertarische bril.',
};

// Function to get page content (similar to getArticleBySlug but simpler)
function getPageContent(pageName: string): { content: string } | null {
  const filePath = path.join(process.cwd(), 'content', 'pages', `${pageName}.md`);
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`Page content file not found: ${filePath}`);
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    // Use gray-matter even if no frontmatter is expected, to get the content part
    const { content } = matter(fileContents);
    return { content };
  } catch (error) {
    console.error(`Error reading page content file: ${filePath}`, error);
    return null;
  }
}

export default function AboutPage() {
  const pageData = getPageContent('about');

  if (!pageData) {
    // Handle case where content file is missing or unreadable
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <p className="text-red-500">Kon de inhoud van de 'Over' pagina niet laden.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      {/* Apply prose styling to the container where MDX content will be rendered */}
      <div className="prose lg:prose-lg">
        <MDXRemote source={pageData.content} />
      </div>
    </main>
  );
} 