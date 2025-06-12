import Link from 'next/link'; // Import Link
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagina niet gevonden (404)',
};

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center text-center px-4"> {/* Adjust min-height based on header/footer */}
      <div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oeps! Deze pagina bestaat niet (meer).</p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Terug naar de homepage
        </Link>
      </div>
    </main>
  );
} 