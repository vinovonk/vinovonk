// Database van wijnlanden en hun bekende regio's
// Voor autocomplete

export interface LandInfo {
  naam: string;
  regios: string[];
}

export const WIJN_LANDEN: LandInfo[] = [
  {
    naam: 'Frankrijk',
    regios: [
      'Bordeaux',
      'Bourgogne',
      'Champagne',
      'Rhône',
      'Loire',
      'Alsace',
      'Languedoc-Roussillon',
      'Provence',
      'Beaujolais',
      'Jura',
      'Savoie',
      'Sud-Ouest',
    ],
  },
  {
    naam: 'Italië',
    regios: [
      'Toscane',
      'Piemonte',
      'Veneto',
      'Lombardije',
      'Friuli-Venezia Giulia',
      'Trentino-Alto Adige',
      'Emilia-Romagna',
      'Umbrië',
      'Abruzzo',
      'Campanië',
      'Puglia',
      'Sicilië',
      'Sardinië',
    ],
  },
  {
    naam: 'Spanje',
    regios: [
      'Rioja',
      'Ribera del Duero',
      'Priorat',
      'Rías Baixas',
      'Penedès',
      'Jerez',
      'Rueda',
      'Toro',
      'Navarra',
      'Catalonia',
    ],
  },
  {
    naam: 'Portugal',
    regios: [
      'Douro',
      'Dão',
      'Alentejo',
      'Vinho Verde',
      'Bairrada',
      'Lisboa',
      'Madeira',
    ],
  },
  {
    naam: 'Duitsland',
    regios: [
      'Mosel',
      'Rheingau',
      'Pfalz',
      'Rheinhessen',
      'Baden',
      'Franken',
      'Nahe',
    ],
  },
  {
    naam: 'Oostenrijk',
    regios: [
      'Wachau',
      'Kremstal',
      'Kamptal',
      'Burgenland',
      'Steiermark',
    ],
  },
  {
    naam: 'USA',
    regios: [
      'Napa Valley',
      'Sonoma',
      'Paso Robles',
      'Santa Barbara',
      'Oregon',
      'Washington State',
      'New York',
    ],
  },
  {
    naam: 'Australië',
    regios: [
      'Barossa Valley',
      'Margaret River',
      'Hunter Valley',
      'McLaren Vale',
      'Yarra Valley',
      'Coonawarra',
      'Adelaide Hills',
    ],
  },
  {
    naam: 'Nieuw-Zeeland',
    regios: [
      'Marlborough',
      'Central Otago',
      'Hawke\'s Bay',
      'Martinborough',
    ],
  },
  {
    naam: 'Chili',
    regios: [
      'Maipo Valley',
      'Colchagua Valley',
      'Casablanca Valley',
      'Aconcagua',
    ],
  },
  {
    naam: 'Argentinië',
    regios: [
      'Mendoza',
      'Salta',
      'Patagonia',
    ],
  },
  {
    naam: 'Zuid-Afrika',
    regios: [
      'Stellenbosch',
      'Paarl',
      'Constantia',
      'Swartland',
      'Walker Bay',
    ],
  },
  {
    naam: 'Griekenland',
    regios: [
      'Santorini',
      'Naoussa',
      'Nemea',
    ],
  },
  {
    naam: 'Nederland',
    regios: [
      'Limburg',
      'Gelderland',
      'Noord-Brabant',
      'Zuid-Holland',
      'Utrecht',
      'Groesbeek',
      'Maastricht',
    ],
  },
];

// Haal alle landen op (voor autocomplete)
export function getAlleLanden(): string[] {
  return WIJN_LANDEN.map(l => l.naam);
}

// Haal regio's op voor een land
export function getRegiosVoorLand(land?: string): string[] {
  if (!land) return [];

  const landInfo = WIJN_LANDEN.find(
    l => l.naam.toLowerCase() === land.toLowerCase()
  );

  return landInfo?.regios || [];
}

// Zoek landen op basis van zoekterm
export function zoekLanden(zoekterm: string): string[] {
  if (!zoekterm) return getAlleLanden();

  const term = zoekterm.toLowerCase();
  return WIJN_LANDEN
    .filter(l => l.naam.toLowerCase().includes(term))
    .map(l => l.naam);
}

// Zoek regio's op basis van land en zoekterm
export function zoekRegios(land?: string, zoekterm?: string): string[] {
  const regios = getRegiosVoorLand(land);

  if (!zoekterm) return regios;

  const term = zoekterm.toLowerCase();
  return regios.filter(r => r.toLowerCase().includes(term));
}
