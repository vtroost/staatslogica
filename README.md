# Staatslogica !

Een moderne Next.js website voor libertarische analyses en politieke filosofie. Ontmasker staatspropaganda met heldere analyses geïnspireerd door grote denkers uit de geschiedenis.

## 🎯 Overzicht

**Staatslogica !** is een Nederlands politiek-filosofisch platform dat actuele gebeurtenissen analyseert vanuit libertarische en anarchistische perspectieven. De site combineert moderne webtechnologie met klassieke filosofische inzichten.

### ✨ Kernfuncties

- **📰 Artikel Platform**: Rijke MDX artikelen met uitgebreide metadata
- **👨‍💼 Denker Profielen**: Gedetailleerde profielen van invloedrijke filosofen
- **🏷️ Smart Tagging**: Intuïtieve navigatie via onderwerpen en categorieën
- **📊 SEO Geoptimaliseerd**: Volledige zoekmachine dekking met gestructureerde data
- **🎨 Modern Design**: Responsive interface met uitstekende UX
- **⚡ Performance**: Snelle laadtijden door Next.js optimalisatie

## 🚀 Live Site

🌐 **[staatslogica.nl](https://staatslogica.nl)**

### Recent Verbeterde Branding (2025)
- ✅ **Favicon**: Nieuwe distinctieve "S!" icoon in goud/rood
- ✅ **Titel**: "Staatslogica !" met uitroepteken in zoekmachine resultaten
- ✅ **Social Media**: Optimale weergave bij delen op sociale platforms

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
│   ├── favicon.svg       # Aangepaste favicon
│   ├── manifest.json     # PWA manifest
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
  - hans-hermann-hoppe
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

### Content Richtlijnen

#### Tags (gebruik Nederlandse termen)
- **Politiek**: `politiek`, `democratie`, `verkiezingen`, `propaganda`
- **Economie**: `economie`, `inflatie`, `belasting`, `markt`, `subsidie`
- **Filosofie**: `anarchisme`, `libertarisme`, `eigendomsrecht`, `vrijheid`

#### Beschikbare Denkers
- `ludwig-von-mises` - Oostenrijkse School econoom
- `friedrich-hayek` - Spontane orde theoreticus  
- `murray-rothbard` - Anarcho-kapitalist
- `ayn-rand` - Objectivistisch filosoof
- `henry-hazlitt` - Economische journalist
- `hans-hermann-hoppe` - Libertarisch theoreticus

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

## 🔄 Recent Updates

### Branding Improvements (Januari 2025)
- ✅ **Favicon**: Nieuwe SVG favicon met "S!" design
- ✅ **Manifest**: Bijgewerkt naar "Staatslogica !" met uitroepteken
- ✅ **Meta Tags**: Consistente branding door hele site
- ✅ **Search Results**: Optimale weergave in Google resultaten

### Technical Improvements
- ✅ **Next.js 14**: App Router met server components
- ✅ **TypeScript**: Volledige type safety
- ✅ **Performance**: Geoptimaliseerde bundle size
- ✅ **Netlify**: Perfecte deployment configuratie

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

## 📞 Contact & Support

**Website**: [staatslogica.nl](https://staatslogica.nl)  
**Email**: redactie@staatslogica.nl  
**Mission**: Ontmasker staatspropaganda met heldere analyses

---

*Staatslogica ! - Kritische denkers. Heldere analyses. Principiële standpunten.* 