import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

// This is the main layout structure component, different from app/layout.tsx
// It might be used within specific page layouts if needed, but is not the RootLayout.
export default function SiteLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-800 text-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
            Staatslogica
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">Over</Link>
            <Link href="/disclaimer" className="hover:text-gray-300 transition-colors">Disclaimer</Link>
            {/* Add more links as needed */}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-auto text-gray-600 text-sm">
        <div className="container mx-auto">
            © {new Date().getFullYear()} Staatslogica - Alle rechten voorbehouden (Satire)
            <div className="mt-2 space-x-4">
                <Link href="/about" className="hover:underline">Over Staatslogica</Link>
                <span>|</span>
                <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
                {/* Optional: Link to privacy policy or contact */}
            </div>
        </div>
      </footer>
    </div>
  );
} 