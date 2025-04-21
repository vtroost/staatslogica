import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <Link href="/" className="text-xl font-bold">Staatslogica</Link>
          <div>
            <Link href="/" className="mr-4">Home</Link>
            <Link href="/about" className="mr-4">About</Link>
            {/* Add more links as needed */}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-auto">
        © {new Date().getFullYear()} Staatslogica - All Rights Reserved (Satire)
      </footer>
    </div>
  );
} 