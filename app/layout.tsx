import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Verwijder expliciete globals.css import; Next.js importeert app/globals.css automatisch.
import "./globals.css";
import SiteLayout from "@/components/Layout"; // Use the component we moved
// import Script from 'next/script'; // No longer needed here
import NetlifyIdentityWidget from "@/components/NetlifyIdentityWidget"; // Update path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Staatslogica | Libertarische Daganalyse',
    template: '%s | Staatslogica',
  },
  description: "Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek. Kritisch, satirisch, principieel.",
  keywords: ["libertarisme", "anarchisme", "staatstheorie", "politieke filosofie", "nederland", "nieuwsanalyse", "ludwig von mises", "ayn rand", "bastiat"],
  authors: [{ name: "Staatslogica" }],
  creator: "Staatslogica",
  publisher: "Staatslogica",
  metadataBase: new URL('https://staatslogica.nl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://staatslogica.nl',
    siteName: 'Staatslogica',
    title: 'Staatslogica | Libertarische Daganalyse',
    description: 'Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek. Kritisch, satirisch, principieel.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Staatslogica - Libertarische Daganalyse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staatslogica | Libertarische Daganalyse',
    description: 'Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        {/* We use SiteLayout here, assuming it provides header/footer etc. */}
        <SiteLayout>{children}</SiteLayout>
        {/* Render the Netlify Identity Widget client component */}
        <NetlifyIdentityWidget />
      </body>
    </html>
  );
}
