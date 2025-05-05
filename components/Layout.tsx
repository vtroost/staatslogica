import React, { ReactNode } from 'react';
import Link from 'next/link';

// Add an icon component or import one if you have a library
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

type LayoutProps = {
  children: ReactNode;
};

// This is the main layout structure component, different from app/layout.tsx
// It might be used within specific page layouts if needed, but is not the RootLayout.
export default function SiteLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen"> {/* Ensure footer sticks to bottom */}
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
            Staatslogica
          </Link>

          {/* Right side container for Menu and Search */}
          <div className="flex items-center space-x-8">
            {/* Menu Items */}
            <div className="hidden sm:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-colors duration-150">Artikelen</Link>
              <Link href="/denkbeelden" className="text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-colors duration-150">Denkbeelden</Link>
              <Link href="/about" className="text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-colors duration-150">Over</Link>
            </div>

            {/* Search Bar Placeholder (UI Only) */}
            <div className="relative hidden md:block"> {/* Hide on smaller screens initially */}
              <input
                type="search"
                placeholder="Zoeken..." // Placeholder text
                className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-colors duration-150"
                // No onChange or value needed yet
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </div>
            {/* Consider adding a mobile menu toggle here later */}
          </div>
        </nav>
      </header>

      {/* Use flex-grow to push footer down */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Staatslogica - Alle rechten voorbehouden (Satire)
            <div className="mt-2 space-x-4">
                <Link href="/about" className="hover:underline">Over Staatslogica</Link>
                <span>|</span>
                <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            </div>
        </div>
      </footer>
    </div>
  );
} 