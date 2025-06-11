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
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
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
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "editorial",
        "email": "redactie@staatslogica.nl"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": ["WebSite", "NewsWebSite"],
      "name": "StaatsLogica",
      "alternateName": "Staatslogica",
      "url": "https://staatslogica.nl",
      "description": "Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote libertarische denkers.",
      "publisher": {
        "@type": "Organization",
        "name": "StaatsLogica",
        "logo": "https://staatslogica.nl/favicon.svg"
      },
      "inLanguage": "nl-NL",
      "about": {
        "@type": "Thing",
        "name": "Politieke Analyse"
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "Nederland"
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Politieke Analyses",
        "description": "Libertarische analyses van actuele gebeurtenissen"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://staatslogica.nl"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Archief",
          "item": "https://staatslogica.nl/archive"
        },
        {
          "@type": "ListItem",
          "position": 3, 
          "name": "Denkers",
          "item": "https://staatslogica.nl/denkers"
        }
      ]
    }
  ];

  return (
    <html lang="nl">
      <head>
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Staatslogica RSS Feed"
          href="/feed.xml"
        />
        {/* iOS Safari meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Staatslogica" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#FFD700" />
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
