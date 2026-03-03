// WSET Systematic Approach to Tasting — Spirits

export type SpiritType = 'whisky' | 'gin' | 'rum' | 'cognac' | 'vodka' | 'tequila' | 'brandy' | 'likeur' | 'anders';

export type SchaalVijf = 'laag' | 'medium-' | 'medium' | 'medium+' | 'hoog';
export type IntensiteitVijf = 'licht' | 'medium-' | 'medium' | 'medium+' | 'uitgesproken';
export type IntensiteitDrie = 'bleek' | 'medium' | 'diep';

export interface WsetSpiritsTasting {
  // Meta
  naam: string;
  merk?: string;
  type: SpiritType;
  land?: string;
  leeftijd?: string; // bijv. "12 jaar"
  alcoholPercentage?: number;
  prijs?: number;

  // 1. Uiterlijk
  uiterlijk: {
    helderheid: 'helder' | 'troebel' | null;
    intensiteit: IntensiteitDrie | null;
    kleur: string | null; // vrij tekstveld: helder, goud, amber, etc.
  };

  // 2. Neus
  neus: {
    conditie: 'schoon' | 'onzuiver' | null;
    intensiteit: IntensiteitVijf | null;
    aromaKenmerken: {
      grondstof: string[];    // graan, fruit, suikerriet
      verwerking: string[];   // gist, fermentatie
      rijping: string[];      // vanille, specerijen, hout, karamel
      overig: string[];
    };
  };

  // 3. Gehemelte
  gehemelte: {
    zoetheid: 'droog' | 'halfdroog' | 'medium' | 'zoet' | null;
    smaakIntensiteit: IntensiteitVijf | null;
    textuur: string[]; // ruw, glad, waterig, mondvullend, verwarmend
    smaakKenmerken: {
      grondstof: string[];
      verwerking: string[];
      rijping: string[];
      overig: string[];
    };
    afdronk: {
      lengte: 'kort' | 'medium-' | 'medium' | 'medium+' | 'lang' | null;
      complexiteit: 'neutraal' | 'eenvoudig' | 'enige_complexiteit' | 'zeer_complex' | null;
    };
  };

  // 4. Conclusie
  conclusie: {
    kwaliteit: 'gebrekkig' | 'slecht' | 'acceptabel' | 'goed' | 'zeer_goed' | 'uitmuntend' | null;
  };
}

export function createEmptySpiritsTasting(): WsetSpiritsTasting {
  return {
    naam: '',
    type: 'whisky',
    uiterlijk: { helderheid: null, intensiteit: null, kleur: null },
    neus: {
      conditie: null,
      intensiteit: null,
      aromaKenmerken: { grondstof: [], verwerking: [], rijping: [], overig: [] },
    },
    gehemelte: {
      zoetheid: null,
      smaakIntensiteit: null,
      textuur: [],
      smaakKenmerken: { grondstof: [], verwerking: [], rijping: [], overig: [] },
      afdronk: { lengte: null, complexiteit: null },
    },
    conclusie: { kwaliteit: null },
  };
}
