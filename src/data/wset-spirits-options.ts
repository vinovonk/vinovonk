// WSET Level 3 Spirits SAT — Opties volgens officieel WSET formulier
// Termen gebaseerd op WSET Systematic Approach to Tasting Spirits® (SAT)

import type { SpiritType } from '@/types/wset-spirits';

export const spiritTypeOpties: { waarde: SpiritType; label: string; hex?: string }[] = [
  { waarde: 'whisky', label: 'Whisky' },
  { waarde: 'gin', label: 'Gin' },
  { waarde: 'rum', label: 'Rum' },
  { waarde: 'cognac', label: 'Cognac/Brandy' },
  { waarde: 'vodka', label: 'Vodka' },
  { waarde: 'tequila', label: 'Tequila/Mezcal' },
  { waarde: 'brandy', label: 'Brandy' },
  { waarde: 'likeur', label: 'Likeur' },
  { waarde: 'anders', label: 'Anders' },
];

// WSET Spirits: clear – hazy (faulty?)
export const spiritsHelderheidOpties = [
  { waarde: 'helder', label: 'Clear' },
  { waarde: 'troebel', label: 'Hazy' },
];

// WSET Spirits: water-white – pale – medium – deep – opaque
export const spiritsKleurIntensiteitOpties = [
  { waarde: 'waterhelder', label: 'Water-white' },
  { waarde: 'bleek', label: 'Pale' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'diep', label: 'Deep' },
  { waarde: 'opaak', label: 'Opaque' },
];

// WSET Spirits Colour: colourless – lemon – gold – amber – brown + diverse
export const spiritsKleurOpties = [
  { waarde: 'kleurloos', label: 'Colourless' },
  { waarde: 'lemon', label: 'Lemon' },
  { waarde: 'goud', label: 'Gold' },
  { waarde: 'amber', label: 'Amber' },
  { waarde: 'bruin', label: 'Brown' },
];

// WSET Spirits: clean – unclean (faulty?)
export const spiritsConditieOpties = [
  { waarde: 'schoon', label: 'Clean' },
  { waarde: 'onzuiver', label: 'Unclean' },
];

// WSET Spirits: neutral – light – medium(-) – medium – medium(+) – pronounced
export const spiritsIntensiteitOpties = [
  { waarde: 'neutraal', label: 'Neutral' },
  { waarde: 'licht', label: 'Light' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'uitgesproken', label: 'Pronounced' },
];

// WSET Spirits: dry – off-dry – medium – sweet
export const spiritsZoetheidOpties = [
  { waarde: 'droog', label: 'Dry' },
  { waarde: 'off-dry', label: 'Off-dry' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'zoet', label: 'Sweet' },
];

// WSET Spirits Texture: rough, smooth, watery, mouthfilling, warming
export const spiritsTextuurOpties = [
  { waarde: 'ruw', label: 'Rough' },
  { waarde: 'glad', label: 'Smooth' },
  { waarde: 'waterig', label: 'Watery' },
  { waarde: 'mondvullend', label: 'Mouthfilling' },
  { waarde: 'verwarmend', label: 'Warming' },
];

// WSET Spirits Finish Length: short – medium(-) – medium – medium(+) – long
export const spiritsAfdronkLengteOpties = [
  { waarde: 'kort', label: 'Short' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'lang', label: 'Long' },
];

// WSET Spirits Finish Nature: neutral – simple – some complexity – very complex
export const spiritsComplexiteitOpties = [
  { waarde: 'neutraal', label: 'Neutral' },
  { waarde: 'eenvoudig', label: 'Simple' },
  { waarde: 'enige_complexiteit', label: 'Some complexity' },
  { waarde: 'zeer_complex', label: 'Very complex' },
];

// WSET Spirits: faulty – poor – acceptable – good – very good – outstanding
export const spiritsKwaliteitOpties = [
  { waarde: 'gebrekkig', label: 'Faulty' },
  { waarde: 'slecht', label: 'Poor' },
  { waarde: 'acceptabel', label: 'Acceptable' },
  { waarde: 'goed', label: 'Good' },
  { waarde: 'zeer_goed', label: 'Very good' },
  { waarde: 'uitmuntend', label: 'Outstanding' },
];

// Spirits aroma categorieën (WSET: raw materials, processing, oak and maturation)
export const spiritsAromaCategorieen = {
  grondstof: {
    label: 'Raw materials',
    aromas: [
      'graan', 'mout', 'brood', 'koekje', 'haver',
      'suikerriet', 'melasse', 'honing',
      'druif', 'appel', 'peer', 'pruim',
      'agave', 'peper', 'rokerig',
      'jeneverbes', 'koriander', 'angelica',
      'aardappel', 'mais', 'rogge', 'tarwe',
    ],
  },
  verwerking: {
    label: 'Processing',
    aromas: [
      'gist', 'brood', 'biscuit',
      'bloemen', 'fruit', 'citrus',
      'tropisch fruit', 'banaan', 'ananas',
      'ester', 'solvent',
    ],
  },
  rijping: {
    label: 'Oak & maturation',
    aromas: [
      'vanille', 'karamel', 'toffee', 'butterscotch',
      'chocolade', 'koffie', 'cacao',
      'kaneel', 'kruidnagel', 'nootmuskaat',
      'cederhout', 'eikenhout', 'sandelhout',
      'rook', 'turf', 'as',
      'leer', 'tabak',
      'noten', 'amandel', 'hazelnoot',
      'gedroogd fruit', 'rozijnen', 'dadels',
    ],
  },
  overig: {
    label: 'Other',
    aromas: [
      'mineraal', 'zeezout', 'jodium',
      'kruiden', 'munt', 'eucalyptus',
      'hars', 'was', 'honingraat',
    ],
  },
};
