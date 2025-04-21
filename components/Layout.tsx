import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

// This is the main layout structure component, different from app/layout.tsx
// It might be used within specific page layouts if needed, but is not the RootLayout.
export default function SiteLayout({ children }: LayoutProps) {
  return (
    <div>
      <header>
        <nav>
          <Link href="/">
            Staatslogica
          </Link>
          <div>
            <Link href="/">Home</Link>
            <Link href="/about">Over</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            {/* Add more links as needed */}
          </div>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <div>
            © {new Date().getFullYear()} Staatslogica - Alle rechten voorbehouden (Satire)
            <div>
                <Link href="/about">Over Staatslogica</Link>
                <span>|</span>
                <Link href="/disclaimer">Disclaimer</Link>
                {/* Optional: Link to privacy policy or contact */}
            </div>
        </div>
      </footer>
    </div>
  );
} 