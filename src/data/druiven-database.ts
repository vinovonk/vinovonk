// Database van druivenrassen per type en regio
// Voor autocomplete en suggesties

export interface DruifInfo {
  naam: string;
  type: 'wit' | 'rood' | 'beide';
  landen: string[];
  regio?: string[];
}

export const POPULAIRE_DRUIVEN: DruifInfo[] = [
  // Rode druiven
  { naam: 'Cabernet Sauvignon', type: 'rood', landen: ['Frankrijk', 'USA', 'Australië', 'Chili', 'Argentinië'] },
  { naam: 'Merlot', type: 'rood', landen: ['Frankrijk', 'USA', 'Italië', 'Chili'] },
  { naam: 'Pinot Noir', type: 'rood', landen: ['Frankrijk', 'USA', 'Nieuw-Zeeland', 'Duitsland', 'Nederland'], regio: ['Champagne', 'Bourgogne'] },
  { naam: 'Meunier', type: 'rood', landen: ['Frankrijk'], regio: ['Champagne'] },
  { naam: 'Syrah', type: 'rood', landen: ['Frankrijk', 'Australië', 'USA'] },
  { naam: 'Shiraz', type: 'rood', landen: ['Australië', 'Zuid-Afrika'] },
  { naam: 'Grenache', type: 'rood', landen: ['Frankrijk', 'Spanje', 'Australië'] },
  { naam: 'Tempranillo', type: 'rood', landen: ['Spanje', 'Portugal'] },
  { naam: 'Sangiovese', type: 'rood', landen: ['Italië'] },
  { naam: 'Nebbiolo', type: 'rood', landen: ['Italië'] },
  { naam: 'Barbera', type: 'rood', landen: ['Italië'] },
  { naam: 'Malbec', type: 'rood', landen: ['Argentinië', 'Frankrijk'] },
  { naam: 'Carménère', type: 'rood', landen: ['Chili'] },
  { naam: 'Zinfandel', type: 'rood', landen: ['USA'] },
  { naam: 'Primitivo', type: 'rood', landen: ['Italië'] },
  { naam: 'Mourvèdre', type: 'rood', landen: ['Frankrijk', 'Spanje'] },
  { naam: 'Carignan', type: 'rood', landen: ['Frankrijk', 'Spanje'] },
  { naam: 'Gamay', type: 'rood', landen: ['Frankrijk'] },
  { naam: 'Touriga Nacional', type: 'rood', landen: ['Portugal'] },
  { naam: 'Spätburgunder', type: 'rood', landen: ['Duitsland'] },
  { naam: 'Dornfelder', type: 'rood', landen: ['Duitsland'] },
  { naam: 'Portugieser', type: 'rood', landen: ['Duitsland', 'Oostenrijk'] },
  { naam: 'Trollinger', type: 'rood', landen: ['Duitsland'] },
  { naam: 'Lemberger', type: 'rood', landen: ['Duitsland'] },

  // Witte druiven
  { naam: 'Chardonnay', type: 'wit', landen: ['Frankrijk', 'USA', 'Australië', 'Nieuw-Zeeland', 'Duitsland', 'Nederland'], regio: ['Champagne', 'Bourgogne', 'Chablis'] },
  { naam: 'Chardonnay Rosé', type: 'wit', landen: ['Frankrijk'], regio: ['Champagne'] },
  { naam: 'Pinot Blanc', type: 'wit', landen: ['Frankrijk', 'Duitsland', 'Italië'], regio: ['Champagne', 'Alsace'] },
  { naam: 'Pinot Gris', type: 'wit', landen: ['Frankrijk', 'Duitsland', 'USA'], regio: ['Champagne', 'Alsace'] },
  { naam: 'Arbane', type: 'wit', landen: ['Frankrijk'], regio: ['Champagne'] },
  { naam: 'Petit Meslier', type: 'wit', landen: ['Frankrijk'], regio: ['Champagne'] },
  { naam: 'Sauvignon Blanc', type: 'wit', landen: ['Frankrijk', 'Nieuw-Zeeland', 'Chili', 'Zuid-Afrika'] },
  { naam: 'Riesling', type: 'wit', landen: ['Duitsland', 'Frankrijk', 'Australië', 'USA', 'Nederland'] },
  { naam: 'Pinot Grigio', type: 'wit', landen: ['Italië', 'USA'] },
  { naam: 'Viognier', type: 'wit', landen: ['Frankrijk', 'USA', 'Australië'] },
  { naam: 'Gewürztraminer', type: 'wit', landen: ['Frankrijk', 'Duitsland'] },
  { naam: 'Chenin Blanc', type: 'wit', landen: ['Frankrijk', 'Zuid-Afrika'] },
  { naam: 'Sémillon', type: 'wit', landen: ['Frankrijk', 'Australië'] },
  { naam: 'Albariño', type: 'wit', landen: ['Spanje', 'Portugal'] },
  { naam: 'Verdejo', type: 'wit', landen: ['Spanje'] },
  { naam: 'Grüner Veltliner', type: 'wit', landen: ['Oostenrijk'] },
  { naam: 'Moscato', type: 'wit', landen: ['Italië'] },
  { naam: 'Muscat', type: 'wit', landen: ['Frankrijk', 'Italië', 'Griekenland'] },
  { naam: 'Vermentino', type: 'wit', landen: ['Italië', 'Frankrijk'] },
  { naam: 'Assyrtiko', type: 'wit', landen: ['Griekenland'] },
  { naam: 'Silvaner', type: 'wit', landen: ['Duitsland'] },
  { naam: 'Müller-Thurgau', type: 'wit', landen: ['Duitsland', 'Oostenrijk', 'Nederland'] },
  { naam: 'Auxerrois', type: 'wit', landen: ['Nederland', 'Frankrijk', 'Duitsland'] },
  { naam: 'Regent', type: 'rood', landen: ['Nederland', 'Duitsland'] },
  { naam: 'Johanniter', type: 'wit', landen: ['Nederland', 'Duitsland'] },
  { naam: 'Solaris', type: 'wit', landen: ['Nederland', 'Duitsland'] },
  { naam: 'Kerner', type: 'wit', landen: ['Duitsland'] },
  { naam: 'Scheurebe', type: 'wit', landen: ['Duitsland'] },
  { naam: 'Bacchus', type: 'wit', landen: ['Duitsland'] },

  // Beide (voor rosé etc)
  { naam: 'Grenache Blanc', type: 'wit', landen: ['Frankrijk', 'Spanje'] },
  { naam: 'Cinsault', type: 'beide', landen: ['Frankrijk', 'Zuid-Afrika'] },
];

// Filter druiven op basis van wijntype
export function getSuggesties(
  wijnType: 'wit' | 'rosé' | 'rood' | 'mousserend' | 'versterkt',
  land?: string,
  zoekterm?: string,
  regio?: string
): DruifInfo[] {
  let filtered = POPULAIRE_DRUIVEN;

  // Filter op type
  if (wijnType === 'wit') {
    filtered = filtered.filter(d => d.type === 'wit' || d.type === 'beide');
  } else if (wijnType === 'rood') {
    filtered = filtered.filter(d => d.type === 'rood' || d.type === 'beide');
  } else if (wijnType === 'rosé' || wijnType === 'mousserend') {
    // Rosé en mousserend kunnen van beide types zijn
    // Champagne gebruikt bijvoorbeeld Chardonnay (wit), Pinot Noir en Pinot Meunier (rood)
    filtered = POPULAIRE_DRUIVEN;
  }

  // Filter op land (indien opgegeven)
  if (land) {
    const landFiltered = filtered.filter(d =>
      d.landen.some(l => l.toLowerCase().includes(land.toLowerCase()))
    );
    // Als er matches zijn op land, gebruik die, anders alle
    if (landFiltered.length > 0) {
      filtered = landFiltered;
    }
  }

  // Filter op zoekterm
  if (zoekterm && zoekterm.length > 0) {
    const term = zoekterm.toLowerCase();
    filtered = filtered.filter(d =>
      d.naam.toLowerCase().includes(term)
    );
  }

  // Prioritize region-specific grapes if region is provided
  if (regio) {
    filtered.sort((a, b) => {
      const aMatchesRegio = a.regio?.some(r =>
        r.toLowerCase() === regio.toLowerCase()
      );
      const bMatchesRegio = b.regio?.some(r =>
        r.toLowerCase() === regio.toLowerCase()
      );

      // Both match or both don't match → maintain current order
      if (aMatchesRegio === bMatchesRegio) return 0;
      // a matches region → comes first
      return aMatchesRegio ? -1 : 1;
    });
  }

  return filtered;
}

// Snelle lookup voor validatie
export function isDruifGeldig(naam: string): boolean {
  return POPULAIRE_DRUIVEN.some(d =>
    d.naam.toLowerCase() === naam.toLowerCase()
  );
}
