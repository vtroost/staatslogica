import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Verwijder expliciete globals.css import; Next.js importeert app/globals.css automatisch.
import "./globals.css";
import SiteLayout from "@/components/Layout"; // Use the component we moved

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Staatslogica | Libertarische Daganalyse',
    template: '%s | Staatslogica',
  },
  description: "Dagelijkse libertarische en anarchistische analyses van overheidsnieuws en politiek. Kritisch, satirisch, principieel.",
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
      </body>
    </html>
  );
}
