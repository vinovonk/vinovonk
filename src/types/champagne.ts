// CIVC Champagne Specialist — Tasting Methodology
// Based on the CIVC (Comité Interprofessionnel du Vin de Champagne) approach

import type { WsetWineTasting } from '@/types/wset-wine';

export type ChampagneCuveeType = 'nv' | 'millesime' | 'prestige';
export type ChampagneStijl = 'blanc_de_blancs' | 'blanc_de_noirs' | 'assemblage' | 'rose_assemblage' | 'rose_saignee';
export type ChampagneDosage = 'brut_nature' | 'extra_brut' | 'brut' | 'extra_sec' | 'sec' | 'demi_sec' | 'doux';
export type ChampagneProducerType = 'nm' | 'rm' | 'cm' | 'rc' | 'sr' | 'nd' | 'ma';
export type ChampagneClassificatie = 'grand_cru' | 'premier_cru' | 'village';

export type ChampagneKleur = 'lemon' | 'gold' | 'deep_gold' | 'amber' | 'copper' | 'salmon' | 'pink' | 'deep_pink';
export type BelGrootte = 'fine' | 'medium' | 'coarse';
export type BelPersistentie = 'persistent' | 'moderate' | 'weak';
export type MousseKwaliteit = 'fine_creamy' | 'pleasant' | 'coarse';
export type ChampagneHelderheid = 'clear' | 'hazy' | 'cloudy';

export type ChampagneIntensiteit = 'low' | 'medium-' | 'medium' | 'medium+' | 'pronounced';
export type AutolytischKarakter = 'none' | 'light' | 'pronounced';
export type OxidatiefKarakter = 'none' | 'light' | 'pronounced';

export type ChampagneAanval = 'fresh' | 'ripe' | 'soft';
export type ChampagneZoetheid = 'bone_dry' | 'dry' | 'off_dry' | 'medium_dry' | 'medium_sweet' | 'sweet';
export type ChampagneZuurgraad = 'low' | 'medium-' | 'medium' | 'medium+' | 'high';
export type ChampagneBody = 'light' | 'medium' | 'full';
export type ChampagneAfdronk = 'short' | 'medium' | 'long';
export type ChampagneComplexiteit = 'simple' | 'medium' | 'complex';

export type ChampagneKwaliteit = 'acceptable' | 'good' | 'very_good' | 'outstanding';
export type ChampagneDrinkbaarheid = 'drink_now' | 'can_age' | 'needs_age' | 'past_peak';

export interface ChampagneTasting {
  // Metadata
  cuveeNaam: string;
  producent?: string;
  regio?: string;
  land?: string;
  cuveeType: ChampagneCuveeType | null;
  stijl: ChampagneStijl | null;
  dosage: ChampagneDosage | null;
  dosageGl?: number; // Exacte dosage van de fles in g/L
  jaargang?: number;
  disgorgeerdatum?: string;
  druivenrassen: string[];
  producerType: ChampagneProducerType | null;
  classificatie: ChampagneClassificatie | null;

  // 1. Visueel (Appearance)
  visueel: {
    kleur: ChampagneKleur | null;
    belGrootte: BelGrootte | null;
    belPersistentie: BelPersistentie | null;
    mousse: MousseKwaliteit | null;
    helderheid: ChampagneHelderheid | null;
    overig?: string;
  };

  // 2. Neus (Nose)
  neus: {
    intensiteit: ChampagneIntensiteit | null;
    autolytischKarakter: AutolytischKarakter | null;
    oxidatiefKarakter: OxidatiefKarakter | null;
    aromas: string[];
    overig?: string;
  };

  // 3. Mondgevoel (Palate)
  mondgevoel: {
    mousse: MousseKwaliteit | null;
    aanval: ChampagneAanval | null;
    zoetheid: ChampagneZoetheid | null;
    zuurgraad: ChampagneZuurgraad | null;
    body: ChampagneBody | null;
    smaakIntensiteit: ChampagneIntensiteit | null;
    smaakAromas: string[];
    afdronkLengte: ChampagneAfdronk | null;
    complexiteit: ChampagneComplexiteit | null;
    overig?: string;
  };

  // 4. Conclusie
  conclusie: {
    kwaliteit: ChampagneKwaliteit | null;
    drinkbaarheid: ChampagneDrinkbaarheid | null;
    rijpingspotentieel?: string;
    voedselparing?: string;
  };

  // 5. VinoVonk Details (gedeeld met WSET type)
  details?: WsetWineTasting['details'];
}

export function createEmptyChampagneTasting(): ChampagneTasting {
  return {
    cuveeNaam: '',
    druivenrassen: [],
    cuveeType: null,
    stijl: null,
    dosage: null,
    producerType: null,
    classificatie: null,
    visueel: {
      kleur: null,
      belGrootte: null,
      belPersistentie: null,
      mousse: null,
      helderheid: null,
      overig: '',
    },
    neus: {
      intensiteit: null,
      autolytischKarakter: null,
      oxidatiefKarakter: null,
      aromas: [],
      overig: '',
    },
    mondgevoel: {
      mousse: null,
      aanval: null,
      zoetheid: null,
      zuurgraad: null,
      body: null,
      smaakIntensiteit: null,
      smaakAromas: [],
      afdronkLengte: null,
      complexiteit: null,
      overig: '',
    },
    conclusie: {
      kwaliteit: null,
      drinkbaarheid: null,
      rijpingspotentieel: '',
      voedselparing: '',
    },
    details: {
      herkomst: null,
      betaaldeSamenwerking: false,
      waarTeKoop: '',
      proefdatum: new Date().toISOString().split('T')[0],
      gerechtCombinatie: '',
      geproefMetPersonen: '',
      serveerTemperatuur: '',
      sparksPodcast: false,
      podcastAflevering: '',
      publicatieStatus: null,
      opnieuwKopen: null,
      prijsKwaliteitVerhouding: null,
      aanbevolenVoor: [],
    },
  };
}
