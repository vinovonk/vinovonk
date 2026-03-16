// Markdown export generator voor proefsessies
import type { TastingSession, TastingNote } from '@/types/tasting-session';
import type { WsetWineTasting } from '@/types/wset-wine';

// Label lookup helpers - WSET SAT terminology
const labelMap: Record<string, string> = {
  // Clarity
  helder: 'Clear',
  troebel: 'Hazy',
  // Intensity (three levels)
  bleek: 'Pale',
  diep: 'Deep',
  // Intensity (five levels) / Five-point scale
  licht: 'Light',
  'medium-': 'Medium(−)',
  medium: 'Medium',
  'medium+': 'Medium(+)',
  uitgesproken: 'Pronounced',
  laag: 'Low',
  hoog: 'High',
  vol: 'Full',
  // Condition
  schoon: 'Clean',
  onzuiver: 'Unclean',
  // Development
  jeugdig: 'Youthful',
  in_ontwikkeling: 'Developing',
  volledig_ontwikkeld: 'Fully developed',
  voorbij_hoogtepunt: 'Past its best',
  // Sweetness
  droog: 'Dry',
  'off-dry': 'Off-dry',
  halfdroog: 'Off-dry',
  'medium-droog': 'Medium-dry',
  'medium-zoet': 'Medium-sweet',
  zoet: 'Sweet',
  luscious: 'Luscious',
  zeer_zoet: 'Luscious',
  // Finish
  kort: 'Short',
  lang: 'Long',
  eenvoudig: 'Simple',
  enige_complexiteit: 'Some complexity',
  zeer_complex: 'Very complex',
  // Quality
  gebrekkig: 'Faulty',
  slecht: 'Poor',
  acceptabel: 'Acceptable',
  goed: 'Good',
  zeer_goed: 'Very good',
  uitmuntend: 'Outstanding',
  // Readiness for drinking
  te_jong: 'Too young',
  nu_niet_geschikt: 'Not suitable for drinking or ageing',
  nu_met_potentieel: 'Suitable for drinking now, but has potential for ageing',
  te_oud: 'Past its best',
  nu_drinken: 'Drink now',
  // Aging potential (legacy field)
  geen: 'No aging potential',
  geschikt_voor_rijping: 'Suitable for aging',
  verdere_rijping: 'Further aging recommended',
  // Wine types
  wit: 'White wine',
  rosé: 'Rosé',
  rood: 'Red wine',
  mousserend: 'Sparkling wine',
  versterkt: 'Fortified wine',
  // Colour
  'citroengeel-groen': 'Lemon-green',
  citroengeel: 'Lemon',
  goud: 'Gold',
  amber: 'Amber',
  bruin: 'Brown',
  roze: 'Pink',
  zalm: 'Salmon',
  oranje: 'Orange',
  paars: 'Purple',
  robijn: 'Ruby',
  granaat: 'Garnet',
  tawny: 'Tawny',
};

function label(value: string | null | undefined): string {
  if (!value) return '—';
  return labelMap[value] || value;
}

function formatAromas(aromas: string[]): string {
  return aromas.length > 0 ? aromas.join(', ') : '—';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function generateWineMarkdown(note: TastingNote, index: number): string {
  const wine = note.tastingData as WsetWineTasting;
  const lines: string[] = [];

  // Header
  const meta = [
    label(wine.wijnType),
    wine.druivenras?.join(', '),
    [wine.regio, wine.land].filter(Boolean).join(', '),
    wine.prijs ? `€${wine.prijs}` : null,
  ].filter(Boolean).join(' | ');

  lines.push(`## ${index + 1}. ${wine.wijnNaam || 'Unknown wine'}${wine.producent ? ` — ${wine.producent}` : ''}`);
  if (meta) lines.push(`${wine.wijnType === 'rood' ? '🍷' : wine.wijnType === 'wit' ? '🥂' : '🍾'} ${meta}`);
  if (wine.jaargang !== undefined && wine.jaargang !== null) {
    lines.push(`**Vintage:** ${wine.jaargang === 0 ? 'NV (Non-Vintage)' : wine.jaargang}`);
  }
  lines.push('');

  // Appearance
  lines.push('### Appearance');
  lines.push(`- **Clarity:** ${label(wine.uiterlijk.helderheid)}`);
  lines.push(`- **Intensity:** ${label(wine.uiterlijk.intensiteit)}`);
  lines.push(`- **Colour:** ${label(wine.uiterlijk.kleur)}`);
  if (wine.uiterlijk.overig) lines.push(`- **Other observations:** ${wine.uiterlijk.overig}`);
  lines.push('');

  // Nose
  lines.push('### Nose');
  lines.push(`- **Condition:** ${label(wine.neus.conditie)}`);
  lines.push(`- **Intensity:** ${label(wine.neus.intensiteit)}`);
  lines.push(`- **Aroma characteristics:**`);
  lines.push(`  - Primary: ${formatAromas(wine.neus.aromaKenmerken.primair)}`);
  lines.push(`  - Secondary: ${formatAromas(wine.neus.aromaKenmerken.secundair)}`);
  lines.push(`  - Tertiary: ${formatAromas(wine.neus.aromaKenmerken.tertiair)}`);
  lines.push(`- **Development:** ${label(wine.neus.ontwikkeling)}`);
  lines.push('');

  // Palate
  lines.push('### Palate');
  lines.push(`- **Sweetness:** ${label(wine.gehemelte.zoetheid)}`);
  lines.push(`- **Acidity:** ${label(wine.gehemelte.zuurgraad)}`);
  if (wine.gehemelte.tannine) lines.push(`- **Tannin:** ${label(wine.gehemelte.tannine)}`);
  lines.push(`- **Alcohol:** ${label(wine.gehemelte.alcohol)}`);
  lines.push(`- **Body:** ${label(wine.gehemelte.body)}`);
  lines.push(`- **Flavour intensity:** ${label(wine.gehemelte.smaakIntensiteit)}`);
  lines.push(`- **Flavour characteristics:**`);
  lines.push(`  - Primary: ${formatAromas(wine.gehemelte.smaakKenmerken.primair)}`);
  lines.push(`  - Secondary: ${formatAromas(wine.gehemelte.smaakKenmerken.secundair)}`);
  lines.push(`  - Tertiary: ${formatAromas(wine.gehemelte.smaakKenmerken.tertiair)}`);
  lines.push(`- **Finish:** ${label(wine.gehemelte.afdronk.lengte)} / ${label(wine.gehemelte.afdronk.complexiteit)}`);
  lines.push('');

  // Conclusions
  lines.push('### Conclusions');
  lines.push(`- **Quality level:** ${label(wine.conclusie.kwaliteit)}`);
  lines.push(`- **Readiness for drinking:** ${label(wine.conclusie.drinkbaarheid)}`);
  if (wine.conclusie.rijpingspotentieel) lines.push(`- **Aging potential (legacy):** ${label(wine.conclusie.rijpingspotentieel)}`);
  lines.push('');

  // Personal notes
  if (note.persoonlijkeNotitie) {
    lines.push('### Personal notes');
    lines.push(`> ${note.persoonlijkeNotitie.split('\n').join('\n> ')}`);
    lines.push('');
  }

  // Score
  if (note.score !== undefined) {
    lines.push(`**Score:** ${note.score}/100`);
    lines.push('');
  }

  // Review schema JSON-LD (klaar voor Divi Code module)
  const schema = generateReviewSchema(note, wine);
  if (schema) {
    lines.push('### 📋 Review Schema — plak in Divi Code module');
    lines.push('');
    lines.push('```json');
    lines.push(schema);
    lines.push('```');
    lines.push('');
    lines.push('> ⚠️ Vul `YOUR_ARTICLE_URL` in met de echte URL van het artikel.');
    lines.push('');
  }

  return lines.join('\n');
}

function generateReviewSchema(note: TastingNote, wine: WsetWineTasting): string | null {
  if (note.score === undefined || note.score === null) return null;
  if (!wine.wijnNaam) return null;

  const productName = [
    wine.producent,
    wine.wijnNaam,
    wine.jaargang != null ? (wine.jaargang === 0 ? 'NV' : String(wine.jaargang)) : null,
  ].filter(Boolean).join(' ');

  const ratingValue = Math.round((note.score / 10) * 10) / 10; // 0-100 → 0-10, één decimaal

  const reviewDate = wine.details?.proefdatum || new Date().toISOString().split('T')[0];

  // Reviewtekst: persoonlijke notitie of automatisch samengesteld
  let reviewBody = note.persoonlijkeNotitie?.trim() || '';
  if (!reviewBody) {
    const parts: string[] = [];
    if (wine.conclusie.kwaliteit) parts.push(`Quality: ${label(wine.conclusie.kwaliteit)}.`);
    const primair = wine.neus.aromaKenmerken.primair;
    if (primair.length > 0) parts.push(`Nose: ${primair.join(', ')}.`);
    if (wine.gehemelte.afdronk.lengte) parts.push(`Finish: ${label(wine.gehemelte.afdronk.lengte)}.`);
    reviewBody = parts.join(' ');
  }

  const productDescription = [
    wine.druivenras?.join(', '),
    [wine.regio, wine.land].filter(Boolean).join(', '),
    wine.prijs ? `€${wine.prijs}` : null,
  ].filter(Boolean).join(' | ');

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    ...(productDescription ? { description: productDescription } : {}),
    review: {
      '@type': 'Review',
      url: 'YOUR_ARTICLE_URL',
      reviewRating: {
        '@type': 'Rating',
        ratingValue,
        bestRating: 10,
        worstRating: 0,
      },
      author: {
        '@type': 'Person',
        '@id': 'https://vinovonk.com/#/schema/person/9a09e3400e964b740ea7a14d0db846a1',
        name: 'Jeroen Vonk',
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://vinovonk.com/#organization',
        name: 'VinoVonk',
      },
      datePublished: reviewDate,
      ...(reviewBody ? { reviewBody } : {}),
    },
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

export function generateSessionMarkdown(session: TastingSession): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Tasting Session: ${session.naam}`);
  lines.push(`**Date:** ${formatDate(session.datum)}`);
  lines.push(`**Number of bottles:** ${session.flessen.length}`);
  if (session.beschrijving) lines.push(`\n${session.beschrijving}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Flessen
  session.flessen.forEach((fles, index) => {
    if (fles.drankType === 'wijn') {
      lines.push(generateWineMarkdown(fles, index));
    } else {
      // Generieke fallback voor andere dranken
      lines.push(`## ${index + 1}. ${(fles.tastingData as { naam?: string }).naam || 'Unknown'}`);
      lines.push('');
      lines.push('*Tasting notes available in the app*');
      lines.push('');
    }

    if (index < session.flessen.length - 1) {
      lines.push('---');
      lines.push('');
    }
  });

  return lines.join('\n');
}
