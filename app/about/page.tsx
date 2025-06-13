import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
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
      
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Over' }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      {/* Header Section */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Over Staatslogica
            </h1>
            
            {/* Description */}
            <div className="text-lg text-black text-opacity-90 leading-relaxed space-y-4">
              <p className="text-xl font-bold text-black">
                Dagelijkse oefening in helder denken.
              </p>
              <p>
                Staatslogica becommentarieert nieuws dat gedachteloos het staatsnarratief herhaalt — berichten die dwang normaal maken, controle als vooruitgang verkopen, en collectieve offers verheerlijken.
              </p>
              <p className="text-base text-black text-opacity-90 leading-relaxed">
                Wij zetten daar iets radicaal eenvoudigs tegenover: <strong>logica, consistentie en het non-agressieprincipe.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-5xl bg-white rounded-lg shadow-sm p-8 md:p-12">
            {/* Content with consistent website styling */}
            <div className="prose prose-lg max-w-none prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:text-gray-800 prose-blockquote:font-medium prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl prose-h3:font-bold prose-h3:text-gray-900 prose-p:mb-5 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:font-medium hover:prose-a:text-yellow-700 prose-strong:text-gray-900 prose-strong:font-bold prose-hr:border-yellow-200 prose-hr:my-8">
              <MDXRemote source={pageData.content} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 