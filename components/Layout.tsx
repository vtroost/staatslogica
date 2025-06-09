'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';

// Add an icon component or import one if you have a library
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// Mobile menu toggle icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

type LayoutProps = {
  children: ReactNode;
};

// This is the main layout structure component, different from app/layout.tsx
// It might be used within specific page layouts if needed, but is not the RootLayout.
export default function SiteLayout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen"> {/* Ensure footer sticks to bottom */}
      {/* Enhanced Header with Gadsden Flag Colors */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-black hover:text-gray-800 transition-colors">
              Staatslogica
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link href="/" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Artikelen</Link>
                <Link href="/denkers" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Denkers</Link>
                <Link href="/about" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Over</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                type="button"
                className="text-black hover:text-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black bg-opacity-20 rounded-lg mt-2 mb-4">
                <Link 
                  href="/" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Artikelen
                </Link>
                <Link 
                  href="/denkers" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Denkers
                </Link>
                <Link 
                  href="/about" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Over
                </Link>
              </div>
            </div>
          )}
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