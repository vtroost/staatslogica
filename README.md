# Staatslogica

Een Next.js website voor kritische analyses en filosofische perspectieven op actuele gebeurtenissen, geïnspireerd door grote denkers uit de geschiedenis.

## Overzicht

Staatslogica is een moderne Next.js website die artikelen presenteert waarin actuele gebeurtenissen vanuit verschillende filosofische perspectieven worden geanalyseerd. De site bevat:

- **Artikel Weergave**: Blader door artikelen met rijke metadata, afbeeldingen en categorisering
- **Denker Profielen**: Leer over invloedrijke filosofen en denkers
- **Tag-gebaseerde Navigatie**: Verken content op onderwerp en thema
- **Archief**: Blader chronologisch door historische content
- **SEO Optimalisatie**: Dynamische sitemap generatie en uitgebreide metadata

## Huidige Functies

### Content Management
- **Statische MDX Artikelen**: Artikelen opgeslagen als MDX bestanden in `content/articles/`
- **Denker Profielen**: Gedetailleerde profielen in `content/thinkers/` met biografische informatie
- **Rijke Metadata**: Artikelen bevatten datums, tags, denker associaties en featured afbeeldingen
- **Afbeelding Integratie**: Ondersteuning voor artikel afbeeldingen via externe URLs en lokale assets
- **Nederlandse Content**: Volledig Nederlandse interface en content

### Gebruikerservaring
- **Featured Artikel**: Homepage benadrukt het nieuwste artikel met full-width weergave
- **Artikel Grid**: Overzichtelijke grid layout voor het bladeren door recente artikelen
- **Responsive Design**: Mobiel-vriendelijke interface met Tailwind CSS
- **Interactieve Navigatie**: Vloeiende overgangen en hover effecten
- **Social Sharing**: Ingebouwde deel knoppen voor social media

### SEO & Technische Functies
- **Dynamische Sitemap**: Automatisch gegenereerde sitemap op `/sitemap.xml` met alle pagina's
- **Gestructureerde Data**: JSON-LD opmaak voor artikelen en organisatie informatie
- **Meta Tags**: Uitgebreide Open Graph en Twitter Card ondersteuning
- **Robots.txt**: Juiste zoekmachine crawling richtlijnen
- **Performance**: Geoptimaliseerde afbeeldingen en statische generatie voor snelle laadtijden

### Navigatie & Discovery
- **Tag Pagina's**: Blader door artikelen op specifieke onderwerpen (`/tags/[tag]`)
- **Denker Pagina's**: Speciale pagina's voor elke filosoof (`/denkers/[slug]`)
- **Categorie Pagina's**: Thematische groepering (`/categorieen/[slug]`)
- **Onderwerpen**: Overzicht van alle onderwerpen (`/onderwerpen`)
- **Archief Pagina**: Chronologische lijst van alle artikelen (`/archive`)
- **Over Pagina**: Informatie over de site en haar missie
- **Zoekmachine Vriendelijk**: Alle pagina's geïndexeerd met juiste metadata

## Tech Stack

- **Framework**: Next.js 14 met App Router
- **Taal**: TypeScript
- **Content**: MDX bestanden met gray-matter voor frontmatter parsing
- **Styling**: Tailwind CSS met typography plugin
- **Afbeeldingen**: Next.js Image optimalisatie met externe URL ondersteuning
- **Deployment**: Netlify met server-side rendering ondersteuning
- **SEO**: Dynamische sitemap generatie en gestructureerde data

## Project Structuur

```
├── app/                     # Next.js App Router pagina's
│   ├── page.tsx            # Homepage met featured artikel en grid
│   ├── articles/[slug]/    # Individuele artikel pagina's
│   ├── denkers/[slug]/     # Denker profiel pagina's
│   ├── categorieen/[slug]/ # Categorie overzicht pagina's
│   ├── onderwerpen/        # Onderwerpen overzicht
│   ├── tags/[tag]/         # Tag-gebaseerde artikel lijsten
│   ├── archive/            # Archief pagina
│   ├── about/              # Over pagina
│   └── sitemap.ts          # Dynamische sitemap generatie
├── components/             # Herbruikbare React componenten
├── content/               # Statische content bestanden
│   ├── articles/          # MDX artikel bestanden
│   ├── thinkers/          # Denker profiel data
│   └── pages/             # Statische pagina content
├── lib/                   # Utility functies en data fetching
│   ├── articles.ts        # Artikel parsing en ophaling
│   ├── thinkers.ts        # Denker data beheer
│   ├── tags.ts            # Tag extractie en organisatie
│   └── types.ts           # TypeScript type definities
├── public/                # Statische assets
│   ├── robots.txt         # Zoekmachine richtlijnen
│   └── images/            # Statische afbeeldingen
└── netlify.toml           # Netlify deployment configuratie
```

## Setup en Ontwikkeling

1. **Clone de repository:**
   ```cmd
   git clone <repository-url>
   cd staatslogica
   ```

2. **Installeer dependencies:**
   ```cmd
   npm install
   ```

3. **Start de development server:**
   ```cmd
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in je browser

## Bouwen en Deployment

De site is geconfigureerd voor Next.js deployment met server-side functies:

```cmd
npm run build
npm start
```

### Netlify Deployment
De site wordt gedeployed op Netlify met de volgende configuratie:
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Framework**: Next.js met @netlify/plugin-nextjs
- **Features**: Server-side rendering, dynamische sitemap, en API routes

## Hoe Nieuwe Artikelen Toevoegen

### Methode 1: Handmatig Artikel Toevoegen

#### Stap 1: Maak een nieuw MDX bestand
Maak een nieuw bestand in de `content/articles/` directory met de volgende naamgeving:
```
YYYY-MM-DD-artikel-titel-met-hyphens.mdx
```

**Voorbeeld:** `2025-01-15-de-staat-als-hindernisparcours.mdx`

#### Stap 2: Voeg de juiste frontmatter toe
Elk artikel moet beginnen met YAML frontmatter tussen `---` markeringen:

```yaml
---
title: "De staat als hindernisparcours"
date: 2025-01-15
tags:
  - politiek
  - bureaucratie
  - economie
thinkers:
  - friedrich-hayek
  - ludwig-von-mises
spin: "Een korte beschrijving van het artikel's perspectief en standpunt"
sourceUrl: "https://example.com/origineel-artikel"
sourceTitle: "Titel van het Originele Artikel"
imageUrl: "https://example.com/image.jpg"
---
```

#### Stap 3: Schrijf de artikel inhoud
Na de frontmatter kun je de artikel inhoud schrijven in MDX formaat:

```mdx
**Vetgedrukte openingszin die de toon zet**

Hier begint je artikel inhoud. Je kunt gebruik maken van alle Markdown functies:

- Lijsten
- **Vetgedrukt**
- *Cursief*
- Links naar [externe sites](https://example.com)

## Kopjes

Verdere paragrafen met je analyse...

**Conclusie in vetgedrukt**

---

**Voetnoten** (optioneel)
¹ Referentie naar boeken of artikelen
```

### Vereiste en Optionele Velden

#### Verplichte Velden:
- `title`: De titel van het artikel (string)
- `date`: Publicatiedatum in YYYY-MM-DD formaat (string)

#### Optionele maar Aanbevolen Velden:
- `tags`: Array van onderwerp tags (string[])
- `thinkers`: Array van denker slugs (string[])
- `spin`: Korte beschrijving van het artikel's perspectief (string)
- `sourceUrl`: Link naar het originele artikel indien van toepassing (string)
- `sourceTitle`: Titel van het originele artikel (string)
- `imageUrl`: URL naar een featured afbeelding (string)

### Bestandsnaamconventies

**Juist:**
- `2025-01-15-de-staat-als-hindernisparcours.mdx`
- `2025-02-10-waarom-inflatie-diefstal-is.mdx`
- `2025-03-05-de-mythe-van-het-sociale-contract.mdx`

**Verkeerd:**
- `artikel-1.mdx` (geen datum)
- `2025-1-5-titel.mdx` (datum niet gepadded)
- `De Staat Als Hindernisparcours.mdx` (hoofdletters en spaties)

### Tag Richtlijnen

Gebruik consistente, Nederlandse tags in kleine letters:
- `politiek`, `economie`, `filosofie`
- `inflatie`, `belasting`, `regelgeving`
- `vrijheid`, `eigendomsrecht`, `markt`

### Denker Slugs

Verwijs naar bestaande denkers met hun slug:
- `friedrich-hayek`
- `ludwig-von-mises`
- `murray-rothbard`
- `ayn-rand`
- `henry-hazlitt`

### Afbeelding Best Practices

- Gebruik hoge kwaliteit afbeeldingen (minimaal 800px breed)
- Test afbeelding URLs voordat je ze toevoegt
- Voor lokale afbeeldingen: plaats in `public/images/uploads/`
- Gebruik beschrijvende bestandsnamen

### Methode 2: Via Decap CMS (indien geconfigureerd)

1. Ga naar `/admin` op de live site
2. Authenticeer met je Git provider
3. Klik op "New Article"
4. Vul alle velden in via de visual editor
5. Publiceer - het artikel wordt automatisch committed naar de repository

## Content Validatie

Het systeem valideert automatisch:
- ✅ Verplichte velden (title, date)
- ✅ Correct bestandsformaat (.mdx)
- ✅ Geldige frontmatter YAML
- ⚠️ Waarschuwingen voor ontbrekende optionele velden
- ⚠️ Ontbrekende of ongeldige afbeelding URLs

## Development Guidelines

- Gebruik TypeScript voor type veiligheid
- Volg bestaande code patronen en structuur
- Test afbeelding URLs voordat je ze toevoegt aan artikelen
- Houd consistente metadata bij alle artikelen
- Gebruik semantische HTML en juiste accessibility attributen
- Zorg ervoor dat alle nieuwe pagina's opgenomen worden in sitemap generatie

## Recente Updates

### Technische Verbeteringen (2025)
- ✅ **Nederlandse interface** - Volledig Nederlandse gebruikersinterface
- ✅ **Categorie systeem** - Thematische groepering van content
- ✅ **Verbeterde navigatie** - Onderwerpen overzicht en categorie pagina's
- ✅ **Gefixte sitemap generatie** - Dynamische sitemap werkt correct in productie
- ✅ **Opgeloste build issues** - TypeScript compilatie fouten opgelost
- ✅ **Google Search Console integratie** - Pagina's succesvol geïndexeerd
- ✅ **Verbeterde SEO** - Verbeterde robots.txt en gestructureerde data
- ✅ **Netlify optimalisatie** - Juiste Next.js plugin configuratie

### Performance & SEO
- **Snelle laadtijden** met Next.js optimalisatie
- **Volledige zoekmachine dekking** via dynamische sitemap
- **Social media ready** met Open Graph en Twitter Cards
- **Mobiel geoptimaliseerd** responsive design

## Deployment Status

- **✅ Productie**: Gedeployed op Netlify met volledige Next.js ondersteuning
- **✅ Sitemap**: Werkend op https://staatslogica.nl/sitemap.xml
- **✅ Google Search Console**: Succesvol geïndexeerd
- **✅ Performance**: Geoptimaliseerd voor snelheid en SEO
- **✅ Nederlandse Content**: Volledig Nederlandse interface

## Troubleshooting

### Artikel verschijnt niet op de site
1. Controleer of het bestand eindigt op `.mdx`
2. Verificeer dat title en date velden aanwezig zijn
3. Controleer of de frontmatter YAML geldig is
4. Herstart de development server (`npm run dev`)

### Afbeelding laadt niet
1. Test de afbeelding URL in een browser
2. Controleer of de URL correct is gespeld
3. Zorg ervoor dat de afbeelding publiek toegankelijk is

### Build fouten
1. Controleer console berichten voor specifieke fouten
2. Verificeer alle MDX bestanden op geldige syntax
3. Test lokaal met `npm run build` voordat je commit

## Quick Reference: Artikel Toevoegen

### Snelle Checklist
- [ ] Bestand naam: `YYYY-MM-DD-titel-met-hyphens.mdx`
- [ ] Verplichte frontmatter: `title` en `date`
- [ ] Tags in kleine letters en Nederlands
- [ ] Denker slugs controleren in `/content/thinkers/`
- [ ] Afbeelding URL testen
- [ ] Lokaal testen met `npm run dev`

### Template voor Nieuw Artikel

```mdx
---
title: "Artikel Titel"
date: 2025-01-15
tags:
  - tag1
  - tag2
thinkers:
  - denker-slug
spin: "Korte beschrijving van het perspectief"
sourceUrl: "https://example.com/origineel"
sourceTitle: "Originele Titel"
imageUrl: "https://example.com/image.jpg"
---

**Openingszin in vetgedrukt**

Artikel inhoud hier...

**Slotconclusie**
```

### Veelgebruikte Tags
- `politiek`, `economie`, `filosofie`, `geschiedenis`
- `inflatie`, `belasting`, `regelgeving`, `subsidie`
- `vrijheid`, `eigendomsrecht`, `markt`, `staat`
- `democratie`, `bureaucratie`, `verkiezingen`

### Beschikbare Denkers
Check `/content/thinkers/` voor volledige lijst, veel gebruikte:
- `friedrich-hayek`, `ludwig-von-mises`, `murray-rothbard`
- `ayn-rand`, `henry-hazlitt`, `saifedean-ammous`
- `thomas-sowell`, `milton-friedman`
