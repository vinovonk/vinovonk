// WSET Level 3 Wine SAT — Alle opties volgens officieel WSET SAT formulier
// Termen gebaseerd op WSET Systematic Approach to Tasting® (SAT)
// Nederlandse vertalingen waar van toepassing, WSET-specifieke termen behouden

import type {
  Helderheid, IntensiteitDrie, IntensiteitVijf, SchaalVijf,
  Conditie, Ontwikkeling, KleurWit, KleurRosé, KleurRood,
  Zoetheid, Body, AfdronkLengte, Complexiteit,
  Kwaliteit, Drinkbaarheid, Rijpingspotentieel, WijnType, MousseIntensiteit
} from '@/types/wset-wine';

// === Dranktype opties ===
export const wijnTypeOpties: { waarde: WijnType; label: string }[] = [
  { waarde: 'wit', label: 'Wit' },
  { waarde: 'rosé', label: 'Rosé' },
  { waarde: 'rood', label: 'Rood' },
  { waarde: 'mousserend', label: 'Mousserend' },
  { waarde: 'versterkt', label: 'Versterkt' },
];

// === 1. APPEARANCE / UITERLIJK ===

// WSET: clear – hazy (faulty?)
export const helderheidOpties: { waarde: Helderheid; label: string }[] = [
  { waarde: 'helder', label: 'Clear' },
  { waarde: 'troebel', label: 'Hazy' },
];

// WSET: pale – medium – deep
export const intensiteitDrieOpties: { waarde: IntensiteitDrie; label: string }[] = [
  { waarde: 'bleek', label: 'Pale' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'diep', label: 'Deep' },
];

// WSET White: lemon-green – lemon – gold – amber – brown
export const kleurWitOpties: { waarde: KleurWit; label: string; hex: string }[] = [
  { waarde: 'citroengeel-groen', label: 'Lemon-green', hex: '#e8e5a0' },
  { waarde: 'citroengeel', label: 'Lemon', hex: '#f0e68c' },
  { waarde: 'goud', label: 'Gold', hex: '#daa520' },
  { waarde: 'amber', label: 'Amber', hex: '#cf8f2e' },
  { waarde: 'bruin', label: 'Brown', hex: '#8b6914' },
];

// WSET Rosé: pink – salmon – orange
export const kleurRoséOpties: { waarde: KleurRosé; label: string; hex: string }[] = [
  { waarde: 'roze', label: 'Pink', hex: '#ffb6c1' },
  { waarde: 'zalm', label: 'Salmon', hex: '#fa8072' },
  { waarde: 'oranje', label: 'Orange', hex: '#e8915a' },
];

// WSET Red: purple – ruby – garnet – tawny – brown
export const kleurRoodOpties: { waarde: KleurRood; label: string; hex: string }[] = [
  { waarde: 'paars', label: 'Purple', hex: '#722f6b' },
  { waarde: 'robijn', label: 'Ruby', hex: '#9b111e' },
  { waarde: 'granaat', label: 'Garnet', hex: '#7b3f3f' },
  { waarde: 'tawny', label: 'Tawny', hex: '#a0522d' },
  { waarde: 'bruin', label: 'Brown', hex: '#6b3a2e' },
];

// === 2. NOSE / NEUS ===

// WSET: clean – unclean (faulty?)
export const conditieOpties: { waarde: Conditie; label: string }[] = [
  { waarde: 'schoon', label: 'Clean' },
  { waarde: 'onzuiver', label: 'Unclean' },
];

// WSET: light – medium(-) – medium – medium(+) – pronounced
export const intensiteitVijfOpties: { waarde: IntensiteitVijf; label: string }[] = [
  { waarde: 'licht', label: 'Light' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'uitgesproken', label: 'Pronounced' },
];

// WSET: youthful – developing – fully developed – tired/past its best
export const ontwikkelingOpties: { waarde: Ontwikkeling; label: string }[] = [
  { waarde: 'jeugdig', label: 'Youthful' },
  { waarde: 'in_ontwikkeling', label: 'Developing' },
  { waarde: 'volledig_ontwikkeld', label: 'Fully developed' },
  { waarde: 'voorbij_hoogtepunt', label: 'Tired / past its best' },
];

// === 3. PALATE / GEHEMELTE ===

// WSET Sparkling: delicate – creamy – aggressive
export const mousseOpties: { waarde: MousseIntensiteit; label: string }[] = [
  { waarde: 'delicaat', label: 'Delicate' },
  { waarde: 'romig', label: 'Creamy' },
  { waarde: 'agressief', label: 'Aggressive' },
];

// WSET: dry – off-dry – medium-dry – medium-sweet – sweet – luscious
export const zoetheidOpties: { waarde: Zoetheid; label: string }[] = [
  { waarde: 'droog', label: 'Dry' },
  { waarde: 'off-dry', label: 'Off-dry' },
  { waarde: 'medium-droog', label: 'Medium-dry' },
  { waarde: 'medium-zoet', label: 'Medium-sweet' },
  { waarde: 'zoet', label: 'Sweet' },
  { waarde: 'luscious', label: 'Luscious' },
];

// WSET 5-puntsschaal: low – medium(-) – medium – medium(+) – high
export const schaalVijfOpties: { waarde: SchaalVijf; label: string }[] = [
  { waarde: 'laag', label: 'Low' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'hoog', label: 'High' },
];

// WSET: light – medium(-) – medium – medium(+) – full
export const bodyOpties: { waarde: Body; label: string }[] = [
  { waarde: 'licht', label: 'Light' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'vol', label: 'Full' },
];

// WSET Finish: short – medium(-) – medium – medium(+) – long
export const afdronkLengteOpties: { waarde: AfdronkLengte; label: string }[] = [
  { waarde: 'kort', label: 'Short' },
  { waarde: 'medium-', label: 'Medium-' },
  { waarde: 'medium', label: 'Medium' },
  { waarde: 'medium+', label: 'Medium+' },
  { waarde: 'lang', label: 'Long' },
];

// Niet standaard WSET wijn SAT, maar nuttig als extra veld
export const complexiteitOpties: { waarde: Complexiteit; label: string }[] = [
  { waarde: 'eenvoudig', label: 'Simple' },
  { waarde: 'enige_complexiteit', label: 'Some complexity' },
  { waarde: 'zeer_complex', label: 'Complex' },
];

// === 4. CONCLUSIONS / CONCLUSIE ===

// WSET: faulty – poor – acceptable – good – very good – outstanding
export const kwaliteitOpties: { waarde: Kwaliteit; label: string; beschrijving: string }[] = [
  { waarde: 'gebrekkig', label: 'Faulty', beschrijving: 'Wijn met een duidelijk gebrek' },
  { waarde: 'slecht', label: 'Poor', beschrijving: 'Geen BLIC-elementen aanwezig' },
  { waarde: 'acceptabel', label: 'Acceptable', beschrijving: '1 BLIC-element aanwezig' },
  { waarde: 'goed', label: 'Good', beschrijving: '2 BLIC-elementen aanwezig' },
  { waarde: 'zeer_goed', label: 'Very good', beschrijving: '3 BLIC-elementen aanwezig' },
  { waarde: 'uitmuntend', label: 'Outstanding', beschrijving: 'Alle 4 BLIC-elementen' },
];

// WSET: drink now, not suitable for ageing / can drink now, potential for ageing / too young / too old
export const drinkbaarheidOpties: { waarde: Drinkbaarheid; label: string }[] = [
  { waarde: 'nu_niet_geschikt', label: 'Drink now, not suitable for ageing' },
  { waarde: 'nu_met_potentieel', label: 'Can drink now, potential for ageing' },
  { waarde: 'te_jong', label: 'Too young to drink' },
  { waarde: 'te_oud', label: 'Too old' },
];

export const rijpingspotentieelOpties: { waarde: Rijpingspotentieel; label: string }[] = [
  { waarde: 'geen', label: 'Geen rijpingspotentieel' },
  { waarde: 'geschikt_voor_rijping', label: 'Geschikt voor verdere rijping' },
  { waarde: 'verdere_rijping', label: 'Verdere rijping nodig' },
];
