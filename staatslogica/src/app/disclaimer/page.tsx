import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Staatslogica',
  description: 'Belangrijke informatie over de inhoud en intenties van Staatslogica.',
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <article className="prose lg:prose-lg">
        <h1>Disclaimer</h1>
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
      </article>
    </main>
  );
} 