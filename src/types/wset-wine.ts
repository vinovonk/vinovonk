// WSET Level 3 Systematic Approach to Tasting — Wine
// Gebaseerd op het officiële WSET SAT formulier

export type WijnType = 'wit' | 'rosé' | 'rood' | 'mousserend' | 'versterkt';

// VinoVonk specifieke types
export type Herkomst = 'gekocht' | 'pr_sample' | 'cadeau' | 'event' | 'podcast';

// Mousse (alleen voor mousserend)
export type MousseIntensiteit = 'delicaat' | 'romig' | 'agressief';
export type PublicatieStatus = 'concept' | 'klaar_voor_publicatie' | 'gepubliceerd';
export type OpnieuwKopen = 'ja' | 'misschien' | 'nee';
export type AanbevolenVoor = 'beginners' | 'gevorderden' | 'feest' | 'diner' | 'cadeautip';

// Schaalwaarden
export type Helderheid = 'helder' | 'troebel';
export type IntensiteitDrie = 'bleek' | 'medium' | 'diep';
export type IntensiteitVijf = 'licht' | 'medium-' | 'medium' | 'medium+' | 'uitgesproken';
export type SchaalVijf = 'laag' | 'medium-' | 'medium' | 'medium+' | 'hoog';
export type Conditie = 'schoon' | 'onzuiver';
export type Ontwikkeling = 'jeugdig' | 'in_ontwikkeling' | 'volledig_ontwikkeld' | 'voorbij_hoogtepunt';

// Kleuren per wijntype
export type KleurWit = 'citroengeel-groen' | 'citroengeel' | 'goud' | 'amber' | 'bruin';
export type KleurRosé = 'roze' | 'zalm' | 'oranje';
export type KleurRood = 'paars' | 'robijn' | 'granaat' | 'tawny' | 'bruin';
export type WijnKleur = KleurWit | KleurRosé | KleurRood;

// Zoetheid (WSET: dry – off-dry – medium-dry – medium-sweet – sweet – luscious)
export type Zoetheid = 'droog' | 'off-dry' | 'medium-droog' | 'medium-zoet' | 'zoet' | 'luscious';

// Body
export type Body = 'licht' | 'medium-' | 'medium' | 'medium+' | 'vol';

// Afdronk
export type AfdronkLengte = 'kort' | 'medium-' | 'medium' | 'medium+' | 'lang';
export type Complexiteit = 'eenvoudig' | 'enige_complexiteit' | 'zeer_complex';

// Kwaliteit (BLIC: Balance, Length, Intensity, Complexity)
export type Kwaliteit = 'gebrekkig' | 'slecht' | 'acceptabel' | 'goed' | 'zeer_goed' | 'uitmuntend';
// WSET: "drink now, not suitable for ageing / can drink now, has potential for ageing / too young / too old"
export type Drinkbaarheid = 'nu_niet_geschikt' | 'nu_met_potentieel' | 'te_jong' | 'te_oud';
// Kept for backward compatibility — nu samengevoegd in drinkbaarheid
export type Rijpingspotentieel = 'geen' | 'geschikt_voor_rijping' | 'verdere_rijping';

// Aroma kenmerken
export interface AromaKenmerken {
  primair: string[];    // fruit, bloemen, kruiden (van druif/gisting)
  secundair: string[];  // gist, boter, eik (van bereiding)
  tertiair: string[];   // leer, tabak, gedroogd fruit (van rijping)
}

// Hoofdstructuur WSET Level 3 Wine SAT
export interface WsetWineTasting {
  // Meta informatie
  wijnNaam: string;
  producent?: string;
  regio?: string;
  land?: string;
  druivenras?: string[];
  jaargang?: number;
  prijs?: number;
  wijnType: WijnType;

  // 1. Uiterlijk (3 punten)
  uiterlijk: {
    helderheid: Helderheid | null;
    intensiteit: IntensiteitDrie | null;
    kleur: WijnKleur | null;
    overig?: string; // tranen, pétillance, etc.
  };

  // 2. Neus (7 punten)
  neus: {
    vibe?: string; // persoonlijke eerste indruk
    conditie: Conditie | null;
    intensiteit: IntensiteitVijf | null;
    aromaKenmerken: AromaKenmerken;
    ontwikkeling: Ontwikkeling | null;
  };

  // 3. Gehemelte (10 punten)
  gehemelte: {
    zoetheid: Zoetheid | null;
    zuurgraad: SchaalVijf | null;
    tannine: SchaalVijf | null; // alleen relevant bij rood
    mousseIntensiteit: MousseIntensiteit | null; // alleen relevant bij mousserend
    alcohol: SchaalVijf | null;
    body: Body | null;
    smaakIntensiteit: IntensiteitVijf | null;
    smaakKenmerken: AromaKenmerken;
    afdronk: {
      lengte: AfdronkLengte | null;
      complexiteit: Complexiteit | null;
    };
  };

  // 4. Conclusie (8 punten)
  conclusie: {
    kwaliteit: Kwaliteit | null;
    drinkbaarheid: Drinkbaarheid | null;
    rijpingspotentieel: Rijpingspotentieel | null;
  };

  // 5. VinoVonk Details (optioneel)
  details?: {
    // Herkomst & Verkoop
    herkomst: Herkomst | null;
    betaaldeSamenwerking: boolean;
    waarTeKoop?: string;

    // Proef Context
    proefdatum?: string; // ISO date string
    gerechtCombinatie?: string;
    geproefMetPersonen?: string;
    serveerTemperatuur?: string;

    // VinoVonk Content
    sparksPodcast: boolean;
    podcastAflevering?: string;
    publicatieStatus: PublicatieStatus | null;

    // Persoonlijke Beoordeling
    opnieuwKopen: OpnieuwKopen | null;
    prijsKwaliteitVerhouding: number | null; // 1-5 sterren
    aanbevolenVoor: AanbevolenVoor[];
  };
}

// Lege/standaard tasting voor nieuw formulier
export function createEmptyWineTasting(): WsetWineTasting {
  return {
    wijnNaam: '',
    wijnType: 'rood',
    uiterlijk: {
      helderheid: null,
      intensiteit: null,
      kleur: null,
      overig: '',
    },
    neus: {
      vibe: '',
      conditie: null,
      intensiteit: null,
      aromaKenmerken: {
        primair: [],
        secundair: [],
        tertiair: [],
      },
      ontwikkeling: null,
    },
    gehemelte: {
      zoetheid: null,
      zuurgraad: null,
      tannine: null,
      mousseIntensiteit: null,
      alcohol: null,
      body: null,
      smaakIntensiteit: null,
      smaakKenmerken: {
        primair: [],
        secundair: [],
        tertiair: [],
      },
      afdronk: {
        lengte: null,
        complexiteit: null,
      },
    },
    conclusie: {
      kwaliteit: null,
      drinkbaarheid: null,
      rijpingspotentieel: null,
    },
    details: {
      herkomst: null,
      betaaldeSamenwerking: false,
      waarTeKoop: '',
      proefdatum: new Date().toISOString().split('T')[0], // Vandaag
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
