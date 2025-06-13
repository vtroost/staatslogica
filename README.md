# Staatslogica !

Een moderne Next.js website voor libertarische analyses en politieke filosofie. Ontmasker het 'staatsnarratief' met heldere, vrijheidsgerichte analyses.

## 🎯 Overzicht

**Staatslogica !** is een Nederlands politiek-filosofisch platform dat actuele gebeurtenissen analyseert vanuit libertarische en anarchistische perspectieven. De site combineert moderne webtechnologie met klassieke filosofische inzichten.

### ✨ Kernfuncties

- **📰 Artikel Platform**: Rijke MDX artikelen met uitgebreide metadata
- **👨‍💼 Denker Profielen**: Gedetailleerde profielen van invloedrijke filosofen en economen
- **🏷️ Smart Tagging**: Intuïtieve navigatie via onderwerpen en categorieën
- **📊 SEO Geoptimaliseerd**: Volledige zoekmachine dekking met gestructureerde data
- **🎨 Modern Design**: Responsive interface met uitstekende UX
- **⚡ Performance**: Snelle laadtijden door Next.js optimalisatie

## 🚀 Live Site

🌐 **[staatslogica.nl](https://staatslogica.nl)**

**Branding**: Site toont "Staatslogica !" met uitroepteken in zoekresultaten en gebruikt geoptimaliseerde favicon voor betere zoekmachine weergave.

## 🛠️ Tech Stack

| Technologie | Versie | Doel |
|-------------|--------|------|
| **Next.js** | 14+ | Full-stack React framework met App Router |
| **TypeScript** | 5+ | Type-safe development |
| **Tailwind CSS** | 3+ | Utility-first styling |
| **MDX** | 3+ | Rich content authoring |
| **Netlify** | - | Hosting met serverless functions |

## 📁 Project Structuur

```
staatslogica/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout met SEO metadata
│   ├── page.tsx           # Homepage
│   ├── articles/[slug]/   # Artikel pagina's
│   ├── denkers/[slug]/    # Denker profielen
│   ├── categorieen/       # Categorie overzichten
│   ├── tags/[tag]/        # Tag-based filtering
│   ├── archive/           # Chronologisch archief
│   └── sitemap.ts         # Dynamische sitemap
├── components/            # Herbruikbare UI componenten
├── content/              # Content bestanden
│   ├── articles/         # MDX artikelen
│   ├── thinkers/         # Denker data
│   └── pages/            # Statische pagina's
├── lib/                  # Utility functies
├── public/               # Statische assets
│   ├── favicon.svg       # SVG favicon met bestaand design
│   ├── manifest.json     # PWA manifest met "Staatslogica !"
│   └── robots.txt        # SEO configuratie
└── netlify.toml          # Deployment configuratie
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn

### Installatie

```bash
# Clone repository
git clone https://github.com/yourusername/staatslogica.git
cd staatslogica

# Installeer dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Build & Deploy

```bash
# Production build
npm run build

# Test production build
npm start

# Deploy naar Netlify (automatisch via Git)
git push origin main
```

## ✍️ Content Beheer

### Nieuw Artikel Toevoegen

#### 1. Creëer MDX Bestand
```bash
# Bestandsnaam format: YYYY-MM-DD-titel-slug.mdx
content/articles/2025-01-20-de-staat-als-maffia.mdx
```

#### 2. Voeg Frontmatter Toe
```yaml
---
title: "De staat als maffia"
date: 2025-01-20
tags:
  - politiek
  - anarchisme
  - staatstheorie
thinkers:
  - murray-rothbard
  - walter-block
spin: "Waarom de staat moreel niet verschilt van georganiseerde misdaad"
sourceUrl: "https://example.com/original"
sourceTitle: "Original Article Title"
imageUrl: "https://example.com/image.jpg"
---
```

#### 3. Schrijf Content
```mdx
**De staat presenteert zichzelf als beschermer van de samenleving.**

Maar wat als we de staat analyseren als wat het werkelijk is: een organisatie die leeft van gedwongen betalingen en geweld?

## Het Beschermingsracket

Murray Rothbard toonde aan dat de staat...

**Conclusie: De staat is moreel bankroet.**
```

#### 4. Controleer Tag Categorieën
**BELANGRIJK**: Alle tags moeten toegewezen zijn aan een categorie in `lib/categories.ts`.

```bash
# Voer deze check uit na het toevoegen van nieuwe artikelen
node scripts/check-tags.js
```

Zorg ervoor dat:
- Alle tags uit je artikel voorkomen in een van de categorieën in `lib/categories.ts`
- Nieuwe tags worden toegevoegd aan de juiste categorie
- De check toont `Unmapped tags: 0`

Als er unmapped tags zijn, voeg ze toe aan de juiste categorie in `lib/categories.ts`:

```typescript
{
  name: 'Economie & Geld',
  topics: ['economie', 'inflatie', 'NIEUWE-TAG-HIER', ...]
}
```

### Content Richtlijnen

#### Tags (gebruik Nederlandse termen)
- **Politiek**: `politiek`, `democratie`, `verkiezingen`, `propaganda`
- **Economie**: `economie`, `inflatie`, `belasting`, `markt`, `subsidie`
- **Filosofie**: `anarchisme`, `libertarisme`, `eigendomsrecht`, `vrijheid`

#### Beschikbare Denkers (chronologisch op geboortejaar)
- `adam-smith` - Grondlegger moderne economie en moraalfilosoof (1723–1790)
- `frederic-bastiat` - Franse liberale econoom (1801–1850)
- `lysander-spooner` - Amerikaanse anarchist en jurist (1808–1887)
- `ludwig-von-mises` - Oostenrijkse School econoom (1881–1973)
- `ayn-rand` - Objectivistisch filosoof (1905–1982)
- `milton-friedman` - Nobelprijswinnaar en monetarist (1912–2006)
- `friedrich-hayek` - Spontane orde theoreticus (1899–1992)
- `henry-hazlitt` - Economische journalist (1894–1993)
- `murray-rothbard` - Anarcho-kapitalist (1926–1995)
- `ron-paul` - Amerikaanse politicus en libertariër (geboren 1935)
- `walter-block` - Anarcho-kapitalist en libertarisch theoreticus (geboren 1941)
- `hans-hermann-hoppe` - Libertarisch theoreticus (geboren 1949)
- `jesus-huerta-de-soto` - Spaanse econoom en bankkriticus (geboren 1956)
- `larken-rose` - Anarcho-libertariër en staatsfilosoof (geboren 1969)
- `saifedean-ammous` - Libanees-Palestijnse econoom en Bitcoin-advocaat (geboren 1980)

**Denker Format Regels**:
- **Overleden denkers**: `Name (1881–1973)`
- **Levende denkers**: `Name (geboren 1956)`
- **Volgorde**: Altijd chronologisch op geboortejaar

## 🔧 Development

### Handige Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Content helpers
npm run validate-content  # Validate all MDX files
npm run generate-sitemap  # Generate sitemap locally
node scripts/check-tags.js # Check all tags are mapped to categories
```

### Code Conventies

- **TypeScript**: Strict mode, expliciete types
- **Components**: Functionele componenten met hooks
- **Styling**: Tailwind CSS, geen custom CSS
- **Commits**: Conventional commits format

## 📊 SEO & Performance

### Huidige Status
- ✅ **Google Search Console**: Volledig geïndexeerd
- ✅ **Pagespeed**: 90+ score voor desktop en mobile
- ✅ **Core Web Vitals**: Alle metrics groen
- ✅ **Sitemap**: Dynamisch gegenereerd op `/sitemap.xml`
- ✅ **Robots.txt**: Geoptimaliseerd voor crawling

### SEO Features
- **Structured Data**: JSON-LD voor artikelen en organisatie
- **Meta Tags**: Volledige Open Graph en Twitter Cards
- **Canonical URLs**: Duplicate content preventie
- **Alt Text**: Toegankelijkheid voor afbeeldingen

## 🎨 Design System

### Kleuren
```css
/* Primary Brand Colors */
--gold: #FFD700        /* Staatslogica gold */
--red: #FF4444         /* Accent red */
--dark: #333333        /* Text dark */
--light: #F8F9FA       /* Background light */
```

### Typography
- **Headings**: Inter font, bold weights
- **Body**: Inter font, regular/medium
- **Code**: Monospace, syntax highlighting

## 🐛 Troubleshooting

### Veelvoorkomende Issues

**Artikel verschijnt niet**
```bash
# Check bestandsnaam format
ls content/articles/2025-01-20-titel.mdx

# Valideer frontmatter
npm run validate-content

# Restart dev server
npm run dev
```

**Build errors**
```bash
# Check TypeScript errors
npm run type-check

# Validate MDX files
npm run validate-content

# Clean and rebuild
rm -rf .next && npm run build
```

**Afbeelding laadt niet**
- Controleer URL toegankelijkheid
- Test afbeelding formaat (JPG/PNG/WebP)
- Verificeer Content-Type headers

## 📈 Analytics & Monitoring

### Monitoring Tools
- **Google Search Console**: Indexering en prestaties
- **Netlify Analytics**: Traffic en performance
- **Core Web Vitals**: User experience metrics

### Key Metrics
- **Organic Traffic**: Groei via SEO optimalisatie
- **Engagement**: Time on page, bounce rate
- **Technical**: Page load times, error rates

## 🤝 Contributing

### Voor Nieuwe Artikelen
1. Fork het project
2. Maak een feature branch (`git checkout -b article/nieuwe-analyse`)
3. Voeg artikel toe volgens format
4. Commit changes (`git commit -m 'Artikel: Nieuwe analyse toegevoegd'`)
5. Push naar branch (`git push origin article/nieuwe-analyse`)
6. Open een Pull Request

### Code Contributions
- Volg bestaande code stijl
- Voeg tests toe waar nodig
- Update documentatie
- Test lokaal voordat je commit

### Content Regels
- **Denkers**: Altijd chronologisch op geboortejaar ordenen
- **Levende denkers**: Gebruik "geboren <jaar>" format
- **Overleden denkers**: Gebruik "(<geboortejaar>–<sterfjaar>)" format
- **Tags**: Nederlandse termen, kleine letters
- **Bestandsnamen**: `YYYY-MM-DD-titel-slug.mdx` format

## 📞 Contact & Support

**Website**: [staatslogica.nl](https://staatslogica.nl)  
**Email**: redactie@staatslogica.nl  
**Mission**: Ontmasker het 'staatsnarratief' met heldere, vrijheidsgerichte analyses

---

*Staatslogica ! - Kritische denkers. Heldere analyses. Principiële standpunten.* 