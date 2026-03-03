// Alcoholvrije dranken — proefformulier

export type AlcoholVrijSubType = 'proxy-wijn' | 'spirit-0' | 'thee' | 'anders';

export interface AlcoholVrijTasting {
  // Meta
  naam: string;
  subType: AlcoholVrijSubType;
  customSubType?: string; // vrij tekstveld als subType === 'anders'
  merk?: string;
  stijl?: string; // bijv. "Rood proxy", "Gin 0%", "Groene thee"
  producent?: string;
  land?: string;
  prijs?: number;

  // 1. Uiterlijk
  uiterlijk: {
    helderheid: 'helder' | 'troebel' | null;
    kleur: string | null;
    overig?: string;
  };

  // 2. Neus
  neus: {
    intensiteit: 'licht' | 'medium' | 'uitgesproken' | null;
    aromas: string[];
  };

  // 3. Gehemelte
  gehemelte: {
    zoetheid: 'droog' | 'halfdroog' | 'medium' | 'zoet' | null;
    zuurgraad: 'laag' | 'medium' | 'hoog' | null;
    body: 'licht' | 'medium' | 'vol' | null;
    bitterheid?: 'laag' | 'medium' | 'hoog' | null;
    tannine?: 'laag' | 'medium' | 'hoog' | null; // relevant voor proxy-wijn
    koolzuur?: 'laag' | 'medium' | 'hoog' | null;
    smaken: string[];
    afdronk: 'kort' | 'medium' | 'lang' | null;
  };

  // 4. Conclusie
  conclusie: {
    kwaliteit: 'slecht' | 'acceptabel' | 'goed' | 'zeer_goed' | 'uitmuntend' | null;
    vergelijkingMetAlcohol?: string; // hoe verhoudt het zich tot de alcoholische variant?
  };
}

export function createEmptyAlcoholVrijTasting(): AlcoholVrijTasting {
  return {
    naam: '',
    subType: 'proxy-wijn',
    uiterlijk: { helderheid: null, kleur: null },
    neus: { intensiteit: null, aromas: [] },
    gehemelte: {
      zoetheid: null,
      zuurgraad: null,
      body: null,
      smaken: [],
      afdronk: null,
    },
    conclusie: { kwaliteit: null },
  };
}
