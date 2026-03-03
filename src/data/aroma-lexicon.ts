// WSET Aroma Lexicon — Nederlands
// Gestructureerd per categorie voor de aroma-picker component

export interface AromaCategorie {
  categorie: string;
  subcategorieen: {
    naam: string;
    aromas: string[];
  }[];
}

// === PRIMAIRE AROMA'S (van druif & gisting) ===
export const primaireAromas: AromaCategorie[] = [
  {
    categorie: 'Fruit',
    subcategorieen: [
      {
        naam: 'Citrusfruit',
        aromas: ['citroen', 'limoen', 'grapefruit', 'sinaasappelschil', 'bergamot'],
      },
      {
        naam: 'Groen fruit',
        aromas: ['appel', 'peer', 'kruisbes', 'druif'],
      },
      {
        naam: 'Steenfruit',
        aromas: ['perzik', 'abrikoos', 'nectarine', 'pruim'],
      },
      {
        naam: 'Tropisch fruit',
        aromas: ['ananas', 'mango', 'passievrucht', 'lychee', 'meloen', 'banaan', 'guave'],
      },
      {
        naam: 'Rood fruit',
        aromas: ['aardbei', 'framboos', 'rode kers', 'cranberry', 'rode bes', 'granaatappel'],
      },
      {
        naam: 'Zwart fruit',
        aromas: ['zwarte bes', 'braambes', 'zwarte kers', 'pruim', 'bosbes', 'moerbes'],
      },
      {
        naam: 'Gedroogd fruit',
        aromas: ['vijg', 'pruimedant', 'rozijn', 'dadel', 'gedroogde abrikoos'],
      },
    ],
  },
  {
    categorie: 'Bloemen',
    subcategorieen: [
      {
        naam: 'Bloemen',
        aromas: ['bloesem', 'roos', 'viooltje', 'lavendel', 'jasmijn', 'oranjebloesem', 'acacia', 'kamille'],
      },
    ],
  },
  {
    categorie: 'Kruiden & Groenten',
    subcategorieen: [
      {
        naam: 'Kruidachtig',
        aromas: ['groene paprika', 'gras', 'tomatenblad', 'asperge', 'erwt'],
      },
      {
        naam: 'Kruiden',
        aromas: ['munt', 'eucalyptus', 'tijm', 'rozemarijn', 'basilicum', 'oregano', 'venkel', 'dille'],
      },
    ],
  },
  {
    categorie: 'Specerijen',
    subcategorieen: [
      {
        naam: 'Specerijen',
        aromas: ['witte peper', 'zwarte peper', 'zoethout', 'kaneel', 'kruidnagel', 'nootmuskaat', 'gember', 'anijs'],
      },
    ],
  },
  {
    categorie: 'Overig primair',
    subcategorieen: [
      {
        naam: 'Mineraal',
        aromas: ['vuursteen', 'natte steen', 'krijt', 'leisteen', 'mineraal'],
      },
    ],
  },
];

// === SECUNDAIRE AROMA'S (van bereiding) ===
export const secundaireAromas: AromaCategorie[] = [
  {
    categorie: 'Gistrijping',
    subcategorieen: [
      {
        naam: 'Autolyse / Gist',
        aromas: ['brood', 'brioche', 'beschuit', 'gist', 'deeg', 'toast'],
      },
    ],
  },
  {
    categorie: 'Malolactische gisting',
    subcategorieen: [
      {
        naam: 'MLF',
        aromas: ['boter', 'room', 'kaas', 'yoghurt'],
      },
    ],
  },
  {
    categorie: 'Eikveroudering',
    subcategorieen: [
      {
        naam: 'Eik',
        aromas: ['vanille', 'kokosnoot', 'toast', 'rook', 'cederhout', 'koffie', 'chocolade', 'karamel', 'toffee'],
      },
      {
        naam: 'Eik specerijen',
        aromas: ['kruidnagel', 'nootmuskaat', 'kaneel', 'dille (Amerikaans eik)'],
      },
    ],
  },
];

// === TERTIAIRE AROMA'S (van flesrijping) ===
export const tertiaireAromas: AromaCategorie[] = [
  {
    categorie: 'Rijpingsaromas',
    subcategorieen: [
      {
        naam: 'Gestoofde/Gedroogde fruit',
        aromas: ['gestoofde pruim', 'gedroogde vijg', 'marmelade', 'kandijfruit', 'compote'],
      },
      {
        naam: 'Aards & Dierlijk',
        aromas: ['leer', 'tabak', 'aarde', 'paddenstoel', 'bosgrond', 'truffel', 'wild', 'mest'],
      },
      {
        naam: 'Oxidatief',
        aromas: ['amandel', 'hazelnoot', 'walnoot', 'honing', 'karamel', 'toffee'],
      },
      {
        naam: 'Overig tertiair',
        aromas: ['gedroogde kruiden', 'koffie', 'chocolade', 'teer', 'petroleum', 'medicinaal', 'jodium'],
      },
    ],
  },
];

// === Alle aroma's plat ===
export function getAllAromas(type: 'primair' | 'secundair' | 'tertiair'): string[] {
  const bron = type === 'primair' ? primaireAromas :
               type === 'secundair' ? secundaireAromas :
               tertiaireAromas;

  return bron.flatMap(cat =>
    cat.subcategorieen.flatMap(sub => sub.aromas)
  );
}

// Zoek aroma's
export function zoekAromas(zoekterm: string, type?: 'primair' | 'secundair' | 'tertiair'): string[] {
  const term = zoekterm.toLowerCase();
  const bronnen = type
    ? [type === 'primair' ? primaireAromas : type === 'secundair' ? secundaireAromas : tertiaireAromas]
    : [primaireAromas, secundaireAromas, tertiaireAromas];

  return bronnen.flatMap(bron =>
    bron.flatMap(cat =>
      cat.subcategorieen.flatMap(sub =>
        sub.aromas.filter(a => a.toLowerCase().includes(term))
      )
    )
  );
}
