// Biodynamische kalender utility
// Berekent dagtype op basis van maanpositie in het siderische dierenriemteken.
// Gebaseerd op het werk van Maria Thun — gebruikt door wijnprofessionals zoals Cees van Casteren MW.
//
// Algoritme: Jean Meeus "Astronomical Algorithms" (vereenvoudigd, hoofdstuk 47)
// Nauwkeurigheid: ±1-2° — voldoende, want de maan staat 2-3 dagen per teken.

export type BiodynamischDagType = 'fruit' | 'bloem' | 'blad' | 'wortel';

export interface BiodynamischInfo {
  dagType: BiodynamischDagType;
  label: string;
  sterrenbeeld: string;
  element: string;
  beschrijving: string;
  aanbeveling: string;
  kleur: string; // Tailwind CSS klassen voor badge
  emoji: string;
}

// Sterrenbeelden in volgorde (siderisch, elk 30°, startend bij 0° = Ram)
const STERRENBEELDEN: Array<{ naam: string; element: string; dagType: BiodynamischDagType }> = [
  { naam: 'Ram',          element: 'Vuur',  dagType: 'fruit'  },
  { naam: 'Stier',        element: 'Aarde', dagType: 'wortel' },
  { naam: 'Tweelingen',   element: 'Lucht', dagType: 'bloem'  },
  { naam: 'Kreeft',       element: 'Water', dagType: 'blad'   },
  { naam: 'Leeuw',        element: 'Vuur',  dagType: 'fruit'  },
  { naam: 'Maagd',        element: 'Aarde', dagType: 'wortel' },
  { naam: 'Weegschaal',   element: 'Lucht', dagType: 'bloem'  },
  { naam: 'Schorpioen',   element: 'Water', dagType: 'blad'   },
  { naam: 'Boogschutter', element: 'Vuur',  dagType: 'fruit'  },
  { naam: 'Steenbok',     element: 'Aarde', dagType: 'wortel' },
  { naam: 'Waterman',     element: 'Lucht', dagType: 'bloem'  },
  { naam: 'Vissen',       element: 'Water', dagType: 'blad'   },
];

const DAG_INFO: Record<
  BiodynamischDagType,
  Pick<BiodynamischInfo, 'label' | 'beschrijving' | 'aanbeveling' | 'kleur' | 'emoji'>
> = {
  fruit: {
    label: 'Fruit dag',
    beschrijving:
      'Wijn is open, fruitig en expressief. De beste omstandigheden om te proeven en te beoordelen.',
    aanbeveling: 'Uitstekend moment voor een proefsessie',
    kleur: 'bg-green-100 text-green-800 border-green-200',
    emoji: '🍇',
  },
  bloem: {
    label: 'Bloem dag',
    beschrijving:
      'Wijn is aromatisch en fris. Een goede dag om te proeven, vooral voor witte en aromatische wijnen.',
    aanbeveling: 'Goede dag voor een proefsessie',
    kleur: 'bg-purple-100 text-purple-800 border-purple-200',
    emoji: '🌸',
  },
  blad: {
    label: 'Blad dag',
    beschrijving: 'Wijn kan gesloten of licht grassig zijn. Minder ideaal voor serieuze beoordeling.',
    aanbeveling: 'Matige dag voor proeven',
    kleur: 'bg-teal-100 text-teal-800 border-teal-200',
    emoji: '🌿',
  },
  wortel: {
    label: 'Wortel dag',
    beschrijving:
      'Wijn smaakt plat, tannineus of gesloten. Vermijd serieuze beoordelingen op wortel dagen (aanbeveling Cees van Casteren MW).',
    aanbeveling: 'Vermijd serieuze proefsessies vandaag',
    kleur: 'bg-amber-100 text-amber-800 border-amber-200',
    emoji: '🌱',
  },
};

function toRad(graden: number): number {
  return (graden * Math.PI) / 180;
}

// Berekent de siderische ecliptische longitude van de maan (graden, 0–360)
function getMaanSiderischeLongitude(datum: Date): number {
  // Julian Day Number
  const JD = datum.getTime() / 86400000 + 2440587.5;
  // Eeuwen vanaf J2000.0
  const T = (JD - 2451545.0) / 36525;

  // Maan's gemiddelde longitude (graden)
  const L = 218.3164477 + 481267.88123421 * T;

  // Hoeken voor correctietermen (radialen)
  const M  = toRad(134.9633964 + 477198.8675055 * T); // Maan's gemiddelde anomalie
  const Ms = toRad(357.5291092 + 35999.0502909  * T); // Zon's gemiddelde anomalie
  const D  = toRad(297.8501921 + 445267.1114034 * T); // Maan's gemiddelde elongatie
  const F  = toRad(93.2720950  + 483202.0175233 * T); // Argument van latitude

  // Correcties op longitude (belangrijkste termen, Meeus tabel 47.A)
  const dL =
    6.288750 * Math.sin(M) +
    1.274018 * Math.sin(2 * D - M) +
    0.658309 * Math.sin(2 * D) +
    0.213616 * Math.sin(2 * M) -
    0.185596 * Math.sin(Ms) -
    0.114336 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * M) +
    0.057212 * Math.sin(2 * D - Ms - M) +
    0.053320 * Math.sin(2 * D + M);

  // Tropische longitude
  const lambdaTropisch = L + dL;

  // Siderische longitude: trek ayanamsa (precessie) af
  // Ayanamsa ≈ 23.85° in 2000, stijgt ~50.29 boogseconden per jaar
  const ayanamsa = 23.85 + (T * 100 * 50.29) / 3600;

  return ((lambdaTropisch - ayanamsa) % 360 + 360) % 360;
}

export function getBiodynamischDagType(datum: Date): BiodynamischDagType {
  const longitude = getMaanSiderischeLongitude(datum);
  const idx = Math.floor(longitude / 30);
  return STERRENBEELDEN[idx].dagType;
}

export function getBiodynamischInfo(datum: Date): BiodynamischInfo {
  const longitude = getMaanSiderischeLongitude(datum);
  const idx = Math.floor(longitude / 30);
  const sterrenbeeld = STERRENBEELDEN[idx];
  const dagInfo = DAG_INFO[sterrenbeeld.dagType];

  return {
    dagType: sterrenbeeld.dagType,
    sterrenbeeld: sterrenbeeld.naam,
    element: sterrenbeeld.element,
    ...dagInfo,
  };
}

// Zoekt het moment waarop de maan het huidige teken verlaat (±1u nauwkeurig)
export function getMaanTekenWisselTijden(datum: Date): { start: Date; eind: Date } {
  const huidigIdx = Math.floor(getMaanSiderischeLongitude(datum) / 30);
  const stapMs = 60 * 60 * 1000; // 1 uur

  // Zoek begin: ga terug totdat het teken verandert
  let start = new Date(datum);
  for (let i = 0; i < 72; i++) {
    const vorige = new Date(start.getTime() - stapMs);
    if (Math.floor(getMaanSiderischeLongitude(vorige) / 30) !== huidigIdx) break;
    start = vorige;
  }

  // Zoek eind: ga vooruit totdat het teken verandert
  let eind = new Date(datum);
  for (let i = 0; i < 72; i++) {
    const volgende = new Date(eind.getTime() + stapMs);
    if (Math.floor(getMaanSiderischeLongitude(volgende) / 30) !== huidigIdx) break;
    eind = volgende;
  }

  return { start, eind };
}
