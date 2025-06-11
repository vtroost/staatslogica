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
    default: 'Staatslogica | Kritische denkers. Heldere analyses.',
    template: '%s | Staatslogica',
  },
  description: "Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers. Satirisch, scherp en altijd principieel.",
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
    siteName: 'StaatsLogica',
    title: 'Staatslogica | Kritische denkers. Heldere analyses.',
    description: 'Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers. Satirisch, scherp en altijd principieel.',
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
    title: 'Staatslogica | Kritische denkers. Heldere analyses.',
    description: 'Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers.',
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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for the organization and website
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StaatsLogica",
      "alternateName": "Staatslogica",
      "url": "https://staatslogica.nl",
      "logo": "https://staatslogica.nl/favicon.svg",
      "description": "Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers.",
      "foundingDate": "2024",
      "sameAs": []
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "StaatsLogica",
      "alternateName": "Staatslogica",
      "url": "https://staatslogica.nl",
      "description": "Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers.",
      "publisher": {
        "@type": "Organization",
        "name": "StaatsLogica"
      },
      "inLanguage": "nl-NL"
    }
  ];

  return (
    <html lang="nl">
      <head>
        {/* Structured data for organization and website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body>
        {/* We use SiteLayout here, assuming it provides header/footer etc. */}
        <SiteLayout>{children}</SiteLayout>
        {/* Render the Netlify Identity Widget client component */}
        <NetlifyIdentityWidget />
      </body>
    </html>
  );
}
