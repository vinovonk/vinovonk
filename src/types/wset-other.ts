// Generiek proefformulier voor bier, sake en andere dranken

export type AnderDrankType = 'bier' | 'sake' | 'cider' | 'mede' | 'anders';

export interface GenericTasting {
  // Meta
  naam: string;
  type: AnderDrankType;
  stijl?: string; // bijv. "IPA", "Junmai Daiginjo"
  producent?: string;
  land?: string;
  alcoholPercentage?: number;
  prijs?: number;

  // 1. Uiterlijk
  uiterlijk: {
    helderheid: 'helder' | 'troebel' | null;
    kleur: string | null;
    schuim?: string; // voor bier
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
    bitterheid?: 'laag' | 'medium' | 'hoog' | null; // relevant voor bier
    body: 'licht' | 'medium' | 'vol' | null;
    koolzuur?: 'laag' | 'medium' | 'hoog' | null;
    smaken: string[];
    afdronk: 'kort' | 'medium' | 'lang' | null;
  };

  // 4. Conclusie
  conclusie: {
    kwaliteit: 'slecht' | 'acceptabel' | 'goed' | 'zeer_goed' | 'uitmuntend' | null;
  };
}

export function createEmptyGenericTasting(): GenericTasting {
  return {
    naam: '',
    type: 'bier',
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
