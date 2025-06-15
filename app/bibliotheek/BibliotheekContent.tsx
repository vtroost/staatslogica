import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/types';

interface BibliotheekContentProps {
  books: (Book & { authorData?: any })[];
}

export default function BibliotheekContent({ books }: BibliotheekContentProps) {
  return (
    <div className="w-full min-h-screen">
      {/* Compact Breadcrumb */}
      <div className="w-full bg-yellow-500 border-b border-yellow-600">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Bibliotheek' }
            ]}
            variant="yellow"
          />
        </div>
      </div>

      <section className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Bibliotheek
            </h1>
            <div className="text-lg text-black text-opacity-90 leading-relaxed">
              <p>
                Een selectie van invloedrijke boeken geschreven door de denkers die het staatsnarratief doorprikken. 
                Ontdek de werken die de logica van vrijheid blootleggen en de intellectuele wapens bieden om politieke propaganda te ontmaskeren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-gray-50 py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Er zijn nog geen boeken toegevoegd aan de bibliotheek.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {books.length} boek{books.length !== 1 ? 'en' : ''}
                  </h2>
                </div>
              </div>

              {/* Books List */}
              <div className="space-y-8">
                {books.map(book => {
                  const authorData = book.authorData;
                  
                  return (
                    <div 
                      key={book.slug}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="lg:flex">
                        {/* Author Image and Info */}
                        <div className="lg:w-80 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 flex flex-col items-center justify-center">
                          <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                            <Image
                              src={`/uploads/${book.authorSlug}.png`}
                              alt={book.author}
                              width={96}
                              height={96}
                              className="object-contain opacity-90"
                              style={{ 
                                mixBlendMode: 'multiply'
                              }}
                            />
                          </div>
                          
                          <div className="text-center">
                            <Link 
                              href={`/denkers/${book.authorSlug}`}
                              className="font-bold text-black hover:text-gray-800 transition-colors"
                            >
                              {book.author}
                            </Link>
                            {authorData?.shortBio && (
                              <p className="text-black text-opacity-80 text-sm mt-2 leading-relaxed">
                                {authorData.shortBio.length > 120 ? 
                                  `${authorData.shortBio.substring(0, 120)}...` : 
                                  authorData.shortBio
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <Link 
                                href={`/bibliotheek/${book.slug}`}
                                className="group"
                              >
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                                  {book.title}
                                </h3>
                              </Link>
                              <div className="text-sm text-gray-600 space-x-4">
                                <span>{book.publishYear}</span>
                                {book.publisher && <span>• {book.publisher}</span>}
                                {book.pages && <span>• {book.pages} pagina's</span>}
                              </div>
                            </div>
                          </div>

                          {book.summary && (
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {book.summary}
                            </p>
                          )}

                          {book.tags && book.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {book.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {book.isbn && (
                                <span>ISBN: {book.isbn}</span>
                              )}
                            </div>
                            
                            <Link 
                              href={`/bibliotheek/${book.slug}`}
                              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-bold transition-colors"
                            >
                              Lees meer →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
} 