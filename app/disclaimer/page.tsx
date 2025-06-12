import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Belangrijke informatie over de inhoud en intenties van Staatslogica.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Warning Header */}
      <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-2 tracking-tight">
            WAARSCHUWING
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Central Warning Image */}
        <div className="text-center mb-12">
          <div className="inline-block border-4 border-yellow-400 border-dashed p-6 bg-black bg-opacity-50 rounded-lg shadow-2xl">
            <Image
              src="/uploads/let-op-buiten-toezicht.png"
              alt="Let op: Onafhankelijk denken gedetecteerd"
              width={500}
              height={400}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Disclaimer Content */}
        <div className="bg-white rounded-lg p-8 shadow-xl max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Disclaimer
          </h2>
          
          <div className="prose lg:prose-lg mx-auto">
            <p>
              De inhoud van Staatslogica is bedoeld ter analyse, educatie en satirische reflectie.
              Het vertegenwoordigt niet noodzakelijkerwijs de mening van individuen geassocieerd met de site, noch die van de geanalyseerde denkers in hun volle complexiteit.
            </p>
            <p>
              We roepen expliciet <strong>niet</strong> op tot geweld, haatzaaien, of onwettige activiteiten.
              Wij onderschrijven het non-agressie principe en verwerpen initiatie van geweld of dwang, tenzij ter directe zelfverdediging tegen fysiek geweld.
            </p>
            <p>
              Kritiek op overheidsbeleid, politieke ideologieën of maatschappelijke normen is een fundamenteel onderdeel van vrije meningsuiting en intellectueel debat.
              Het stellen van kritische vragen is geen vorm van agressie of bedreiging.
            </p>
            <p>
              De gebruikte analyses en citaten zijn interpretaties en selecties. Voor een volledig begrip verwijzen we naar de originele werken van de betreffende denkers.
              Eventuele fouten in analyse of interpretatie zijn voor rekening van de redactie.
            </p>
          </div>
        </div>

        {/* Voltaire Quote */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-8 shadow-2xl max-w-2xl mx-auto border-4 border-black">
            <blockquote className="text-xl md:text-2xl font-bold text-black leading-relaxed">
              "De waarheid vereist geen wetten om haar te beschermen."
            </blockquote>
            <div className="mt-4 text-lg font-semibold text-black">
              — Voltaire
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 