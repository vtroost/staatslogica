import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const metadata: Metadata = {
  title: 'Over Staatslogica',
  description: 'Ontdek de filosofie achter onze scherpe analyses van staatsmacht en media. Logica, consistentie en het non-agressieprincipe als leidraad.',
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
    <div className="w-full min-h-screen">
      
      {/* Header Section */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 relative overflow-hidden">
        {/* Background Pattern/Texture */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block bg-black bg-opacity-30 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-lg">
                Missie & Visie
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              Over Staatslogica
            </h1>
            
            {/* Introduction */}
            <div className="text-lg text-black text-opacity-90 leading-relaxed font-medium">
              <p>
                Dagelijkse oefening in helder denken — we becommentariëren nieuws dat vaak gedachteloos het staatsnarratief herhaalt en zetten daar logica, consistentie en het non-agressieprincipe tegenover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Apply consistent prose styling */}
              <div className="prose prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mb-4 prose-h2:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg prose-strong:text-gray-900 prose-strong:font-bold prose-em:text-yellow-700 prose-em:font-medium prose-a:text-yellow-600 prose-a:font-medium hover:prose-a:text-yellow-700 prose-ul:my-6 prose-li:text-gray-700 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:italic prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-800 prose-blockquote:font-medium">
                <MDXRemote source={pageData.content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 