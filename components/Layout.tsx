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
            <Link href="/" className="text-xl font-bold text-black hover:text-gray-800 transition-colors flex items-center gap-1 whitespace-nowrap">
              <svg viewBox="0 0 381.633 190.191" height="1em" width="auto" fill="black" aria-hidden="true" focusable="false" className="inline-block align-middle">
                <path d="M382.1,149.308H254.725c-2.7-31.371-10.745-61.986-28.563-77.7a53.376,53.376,0,0,0-13.715-8.639,50.9,50.9,0,0,1-46.49,29.859c-.593,0-1.187,0-1.781-.054A50.962,50.962,0,0,1,132.535,80.3a51.691,51.691,0,0,1-7.883-8.585c-.27-.378-.539-.81-.81-1.188l-1.458,2.538-2.7,4.59L90.419,127.387a4.62,4.62,0,0,1-4.05,2.322,4.7,4.7,0,0,1-4.05-7.02l22.839-38.876,3.943-6.749c3.185-5.723,6.262-11.285,9.233-16.63,1.026-1.836,2.052-3.672,3.078-5.453.755-1.4,1.565-2.754,2.322-4.1.432-.7.648-1.4,1.026-2.106a41.94,41.94,0,0,0,39.685,34.664H165.9a41.563,41.563,0,0,0,37.634-23.757,42.075,42.075,0,0,0,4.049-16.522A41.687,41.687,0,0,0,167.361.013h-1.512a41.485,41.485,0,0,0-40.712,32.828,12.021,12.021,0,0,0-3.887-3.672,13.689,13.689,0,0,0-4.427-1.674,17.413,17.413,0,0,0-17.765,8.045s-39.956,64.2-49.3,79.048c-8.693,13.823-5.615,28.293,1.35,34.719H.464v15.28H381.99v-15.28Zm-290.113,0c12.041-10.691,20.356-18.628,28.725-26.619.27,10.691.594,20.3.81,26.619Z"/>
              </svg>
              Staatslogica !
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link href="/" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Artikelen</Link>
                <Link href="/themas" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Thema's</Link>
                <Link href="/denkers" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Denkers</Link>
                <Link href="/bibliotheek" className="text-black hover:text-gray-800 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition-all duration-150 font-medium">Bibliotheek</Link>
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
            <div className="sm:hidden flex flex-col items-end">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white bg-opacity-95 shadow-xl rounded-lg mt-2 mb-4 min-w-[200px]">
                <Link 
                  href="/" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Artikelen
                </Link>
                <Link 
                  href="/themas" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Thema's
                </Link>
                <Link 
                  href="/denkers" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Denkers
                </Link>
                <Link 
                  href="/bibliotheek" 
                  className="block px-3 py-2 text-black hover:text-gray-800 hover:bg-black hover:bg-opacity-10 rounded-md font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bibliotheek
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
            © {new Date().getFullYear()} Staatslogica - Alle rechten voorbehouden
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