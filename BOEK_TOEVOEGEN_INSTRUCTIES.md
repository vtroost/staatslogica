# Instructies voor het toevoegen van een boek aan de Bibliotheek

Dit document beschrijft hoe je een nieuw boek toevoegt aan de Staatslogica bibliotheek.

## Stap 1: Boek bestand aanmaken

Maak een nieuw markdown bestand in de `content/books/` directory:

```
content/books/[boek-slug].md
```

**Belangrijk**: Gebruik een duidelijke, URL-vriendelijke slug:
- Gebruik alleen kleine letters
- Vervang spaties door koppeltekens
- Geen speciale tekens (behalve koppeltekens)
- Bijvoorbeeld: `the-tragedy-of-the-euro.md`

## Stap 2: Frontmatter toevoegen

Voeg de volgende frontmatter toe aan het begin van het bestand:

```yaml
---
title: [Volledige titel van het boek]
author: [Volledige naam van de auteur]
authorSlug: [slug van de auteur zoals gebruikt in /denkers/]
publishYear: [Jaar van publicatie - getal]
originalTitle: [Originele titel indien vertaald - optioneel]
publisher: [Uitgever - optioneel]
isbn: [ISBN nummer - optioneel]
pages: [Aantal pagina's - getal, optioneel]
language: [Taal - optioneel]
summary: [Korte samenvatting voor op de bibliotheek pagina]
tags: ["tag1", "tag2", "tag3"]
---
```

### Voorbeeld frontmatter:
```yaml
---
title: The Tragedy of the Euro
author: Philipp Bagus
authorSlug: philipp-bagus
publishYear: 2010
originalTitle: The Tragedy of the Euro
publisher: Ludwig von Mises Institute
isbn: 978-1610163828
pages: 158
language: Nederlands
summary: De eerste systematische analyse van waarom de euro structureel gedoemd is tot mislukking - een voorspelling die uitkwam
tags: ["euro", "monetaire politiek", "europese unie", "economische crisis", "oostenrijkse school"]
---
```

## Stap 3: Content structuur

Voeg de volledige boekinhoud toe na de frontmatter. Gebruik deze structuur:

```markdown
# [Boektitel]

[Introductie paragraaf die context geeft]

## Kernthese

[Hoofdargument van het boek in 1-2 paragrafen]

## Hoofdargumenten

### 1. [Eerste hoofdargument]
[Uitleg van het eerste argument]

### 2. [Tweede hoofdargument]
[Uitleg van het tweede argument]

[Etc. voor alle belangrijke argumenten]

## [Relevante sectie titel]

[Bijvoorbeeld: "Voorspellingen die uitkwamen", "Relevantie voor Nederland", etc.]

## Citaten

[Belangrijke citaten uit het boek, in cursief]

*"Citaat 1"*

*"Citaat 2"*

## Conclusie

[Afsluiting die de relevantie en impact van het boek benadrukt]
```

## Stap 4: Hyperlinks toevoegen aan thinker profiel

Zoek in `content/thinkers/[auteur-slug].md` alle vermeldingen van de boektitel en vervang ze door hyperlinks:

**Voor:**
```markdown
*The Tragedy of the Euro* is een belangrijk boek
```

**Na:**
```markdown
[*The Tragedy of the Euro*](/bibliotheek/the-tragedy-of-the-euro) is een belangrijk boek
```

**Voor citaten:**
```markdown
*(The Tragedy of the Euro, 2010)*
```

**Na:**
```markdown
*([The Tragedy of the Euro](/bibliotheek/the-tragedy-of-the-euro), 2010)*
```

## Stap 5: Testen

Na het toevoegen van het boek:

1. **Build testen:**
   ```bash
   npm run build
   ```

2. **Controleer of het boek verschijnt:**
   - Ga naar `/bibliotheek` - het boek moet in de lijst staan
   - Ga naar `/bibliotheek/[boek-slug]` - de boekpagina moet werken
   - Controleer hyperlinks in het thinker profiel

3. **Controleer sortering:**
   - Boeken worden automatisch gesorteerd op `publishYear` (nieuwste eerst)

## Vereisten

### Verplichte velden in frontmatter:
- `title`
- `author` 
- `authorSlug` (moet overeenkomen met bestaande thinker)
- `publishYear`
- `summary`

### Optionele velden:
- `originalTitle`
- `publisher`
- `isbn`
- `pages`
- `language`
- `tags`

## Tips

1. **Auteur moet bestaan**: De `authorSlug` moet verwijzen naar een bestaande thinker in `/content/thinkers/`

2. **Goede samenvatting**: De `summary` verschijnt op de bibliotheek pagina - houd het kort maar krachtig (1-2 zinnen)

3. **Relevante tags**: Gebruik consistente tags die aansluiten bij bestaande content

4. **Markdown formatting**: Gebruik standaard markdown voor de content (koppen, lijsten, cursief, vet, etc.)

5. **Consistent taalgebruik**: Houd de toon consistent met bestaande content

## Automatische functies

Na het toevoegen van een boek wordt automatisch:
- Het boek toegevoegd aan de sitemap
- De bibliotheek pagina geüpdatet
- Statische routes gegenereerd
- SEO metadata aangemaakt

## Voorbeeld van een compleet boek bestand

Zie `content/books/the-tragedy-of-the-euro.md` voor een volledig voorbeeld van hoe een boek moet worden gestructureerd. 