import { notFound } from 'next/navigation';
import { getBookWithAuthor, getAllBooks } from '@/lib/books';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface BookPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all books
export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

// Generate metadata for the book page
export async function generateMetadata({ params }: BookPageProps) {
  const book = getBookWithAuthor(params.slug);
  
  if (!book) {
    return {
      title: 'Boek niet gevonden',
    };
  }

  return {
    title: `${book.title} - ${book.author}`,
    description: book.summary || `${book.title} door ${book.author} (${book.publishYear})`,
  };
}

export default function BookPage({ params }: BookPageProps) {
  const book = getBookWithAuthor(params.slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Bibliotheek', href: '/bibliotheek' },
              { label: book.title }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      {/* Book Header */}
      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="lg:flex lg:items-center lg:gap-8">
            {/* Author Image */}
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              <div className="w-32 h-32 md:w-40 md:h-40 mx-auto lg:mx-0 relative">
                <Image
                  src={`/uploads/${book.authorSlug}.png`}
                  alt={book.author}
                  width={160}
                  height={160}
                  className="object-contain opacity-90"
                  style={{ 
                    mixBlendMode: 'multiply'
                  }}
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
                {book.title}
              </h1>
              
              <div className="text-lg text-black text-opacity-90 mb-4">
                <p>
                  door{' '}
                  <Link 
                    href={`/denkers/${book.authorSlug}`}
                    className="font-bold hover:underline"
                  >
                    {book.author}
                  </Link>
                </p>
              </div>

              <div className="text-black text-opacity-80 space-x-4 mb-4">
                <span className="font-semibold">{book.publishYear}</span>
                {book.publisher && <span>• {book.publisher}</span>}
                {book.pages && <span>• {book.pages} pagina's</span>}
                {book.isbn && <span>• ISBN: {book.isbn}</span>}
              </div>

              {book.summary && (
                <p className="text-lg text-black text-opacity-90 leading-relaxed max-w-3xl">
                  {book.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {book.tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Book Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:hover:text-yellow-700 prose-strong:text-gray-900 prose-em:text-gray-800 prose-blockquote:border-yellow-400 prose-blockquote:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
            {book.content && <MDXRemote source={book.content} />}
          </div>

          {/* Author Info */}
          {book.authorData && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Over de auteur</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={`/uploads/${book.authorSlug}.png`}
                    alt={book.author}
                    width={64}
                    height={64}
                    className="object-contain opacity-90 bg-yellow-400 rounded-lg p-2"
                    style={{ 
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Link 
                    href={`/denkers/${book.authorSlug}`}
                    className="font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    {book.author}
                  </Link>
                  {book.authorData.title && (
                    <p className="text-gray-600 text-sm mt-1">{book.authorData.title}</p>
                  )}
                  <Link 
                    href={`/denkers/${book.authorSlug}`}
                    className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium mt-2 text-sm"
                  >
                    Meer over {book.author} →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Back to Library */}
          <div className="mt-8 text-center">
            <Link 
              href="/bibliotheek"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-bold transition-colors"
            >
              ← Terug naar bibliotheek
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 