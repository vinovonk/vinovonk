# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# VinoVonk

Systematisch proefdagboek voor wijn & champagne — gemaakt door Jeroen Vonk (VinoVonk.com). Bedoeld voor persoonlijk lokaal gebruik als input voor artikelen en content. Alle data staat in de browser (localStorage), geen backend of database.

## Commando's

```bash
npm run dev -- -p 3001   # Dev server (poort 3001, want 3000 is bezet)
npm run build            # Productie build
npm run lint             # ESLint
```

## Tech stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI)
- **Fonts:**
  - **Roboto** (`--font-roboto`) — primaire body- en UI-font, geregistreerd als `--font-sans` en `--font-heading`
  - **Lora** (`--font-lora`) — beschikbaar via `.font-body` klasse (serif, voor leestekst)
  - **Cormorant Garamond** (`--font-cormorant`) — beschikbaar via `.font-display` klasse (voor decoratieve koppen)
  - **Geist Mono** (`--font-geist-mono`) — voor code/monospace
- **Toasts:** Sonner
- **Kleurthema:** OKLch — primary is diep bordeaux/wijnrood (`oklch(0.38 0.11 15)`), achtergrond warm crème

## Architectuur

### Navigatie & data flow

```
Dashboard (/)
  → /sessie/nieuw           — maak sessie (naam + beschrijving)
  → /sessie/[id]            — sessiedetail (lijst flessen)
    → /sessie/[id]/fles/[flesId]  — proefnotitie per fles
/archief                    — alle sessies met zoekfunctie
/over                       — over de app, de maker en de methode
/instellingen               — thema, backup, link naar /over
```

De fles-pagina detecteert `drankType` en laadt het juiste formulier. Voor wijn/champagne geldt een twee-staps flow (info → proeven), overige dranktypes tonen een enkelvoudig formulier.

### Opslag — localStorage (client-side)

Alle data zit in de browser via `src/lib/storage-client.ts`. Dit is de enige actieve storage laag.

- `vinovonk_sessions_index` — lijst van alle sessies (`SessionSummary[]`)
- `vinovonk_session_{uuid}` — volledige sessiedata per sessie (`TastingSession`)
- Foto's: base64 JPEG in localStorage (gecomprimeerd via Canvas API, max 900px breed)

De enige actieve API route is `/api/export` (PDF/Markdown export).

### Type-hiërarchie

```
TastingSession
├── id, naam, datum, beschrijving, biodynamischDagType
└── flessen: TastingNote[]
    ├── id, drankType, fotoPath (base64), score (0-100)
    └── tastingData: TastingData  ← UNION TYPE
```

`TastingData` is een union van 5 dranktype-specifieke types, elk gedefinieerd in `src/types/`:

| Type | Bestand | Formulier |
|------|---------|-----------|
| `WsetWineTasting` | `wset-wine.ts` | `WsetForm` + 5 tab-components |
| `ChampagneTasting` | `champagne.ts` | `ChampagneForm` (eigen tabs) |
| `WsetSpiritsTasting` | `wset-spirits.ts` | `SpiritsForm` |
| `GenericTasting` | `wset-other.ts` | `GenericForm` (bier, sake, cider) |
| `AlcoholVrijTasting` | `alcoholvrij.ts` | `AlcoholVrijForm` |

Type guards in de fles-pagina: `isWineData()`, `isChampagneData()`, `isSpiritsData()`, etc.

Elk type heeft een `createEmpty*Tasting()` factory functie.

### Formulier-architectuur

Wijn- en champagne-formulieren gebruiken **`forwardRef` + `useImperativeHandle`** om `getData()` en `mergeAIData()` bloot te stellen aan de parent (fles-pagina).

**Tab-structuur (wijn):**
```
WsetForm
├── WsetAppearance   — uiterlijk (helderheid, intensiteit, kleur)
├── WsetNose         — neus (vibe-veld*, conditie, intensiteit, aroma's)
├── WsetPalate       — gehemelte (zoetheid, zuur, tannine, alcohol, body, afdronk)
├── WsetConclusion   — conclusie (kwaliteit, drinkbaarheid, rijpingspotentieel)
└── WsetDetails      — details (herkomst, prijs, notities)
```

**Gedeelde sub-componenten in `src/components/proeven/`:**
- `ButtonGroup<T>` — radio-groep voor schaalwaarden (helderheid, intensiteit)
- `AromaPicker` — drie-niveaus picker (primair/secundair/tertiair) met zoekfunctie
- `AutocompleteInput` — doorzoekbare combobox (regio's, producenten)
- `DruivenInput` — multi-select voor druivenrassen
- `FotoCapture` — foto-upload met compressie

### Dranktypes

`wijn` | `spirit` | `bier` | `sake` | `champagne` | `alcoholvrij` | `anders`

Elk dranktype heeft een eigen form-component in `src/components/proeven/` en een eigen type in `src/types/`.

### Twee-staps flow (wijn & champagne)

Wijn en champagne hebben een twee-staps proefproces:
1. **Info-fase** — wijnnaam, druif, land, regio, foto (in `fles/[flesId]/page.tsx`)
2. **Proeven-fase** — SAT-tabs: Appearance → Nose → Palate → Conclusions → Details

De stap-indicator toont genummerde cirkels met verbindingslijn. De "Volgende" knop is sticky op mobile (boven de bottom nav).

Het **Vibe-veld** staat bovenaan de Nose-tab: een persoonlijke, vrije-tekst eerste indruk (in `wset-nose.tsx` en `champagne-form.tsx`). Visueel onderscheiden van reguliere velden met een warm getint kader (`border-primary/15 bg-primary/[0.03]`).

### Validatie-navigatie

Bij opslaan controleert het formulier verplichte velden. Als er velden ontbreken:
- Automatische navigatie naar de tab met het eerste ontbrekende veld
- Toast met gegroepeerde veldnamen per tab + action button ("Ga naar [tab]")
- Geïmplementeerd in `wset-form.tsx` en `champagne-form.tsx`

### Data-bestanden (src/data/)

Opties, lexicons en databases voor autocomplete en schaalwaarden:
- `aroma-lexicon.ts` — drie-niveaus aromalijst (primair/secundair/tertiair)
- `wset-wine-options.ts` — WSET-schalen (Helderheid, Zoetheid, Body, Kwaliteit, etc.)
- `champagne-options.ts` — champagne-specifieke opties (cuvée, dosage, stijl)
- `wset-spirits-options.ts` — spirits-schalen
- `wijn-regio-database.ts` — `zoekLanden()`, `zoekRegios()` voor autocomplete
- `druiven-database.ts` — druivenrassen lookup

### Biodynamische kalender

`src/lib/biodynamisch.ts` — client-side berekening van de maanpositie (siderisch, vereenvoudigd Meeus-algoritme). Geen externe API, geen npm-pakket.

- `getBiodynamischInfo(date)` — geeft dagtype, label, sterrenbeeld, element, beschrijving, kleur, emoji
- `getMaanTekenWisselTijden(date)` — geeft start/eindtijd van het huidige maanteken
- `BiodynamischBadge` component — compact (lijst) en uitgebreid (dashboard) variant
- Dagtypen: Fruit dag (vuur), Bloem dag (lucht), Blad dag (water), Wortel dag (aarde)

### AI-modi (via `.env.local`)

| Waarde | Beschrijving |
|--------|-------------|
| `manual` | Geen AI, handmatig formulier (standaard) |
| `local` | Ollama (Mistral) + lokale Whisper |
| `cloud` | Claude API (Anthropic) + OpenAI Whisper |

Env var: `AI_MODE=manual|local|cloud`
Cloud keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
AI-provider abstractie: `src/lib/ai/provider.ts`

### Brutalist design systeem

De app gebruikt een **selectief brutalist** visueel systeem:

- **`.shadow-brutalist`** — `box-shadow: 4px 4px 0 0 oklch(0.15 0 0)` (licht) / `oklch(0.38 0 0)` (donker), gedefinieerd in `globals.css`
- **Lijstkaarten** — `rounded-none shadow-none border-l-[3px] border-l-primary`, eerste kaart heeft volledige border, volgende kaarten `border-t-0` (aaneengesloten)
- **Nummers** — `text-2xl font-black text-foreground/10 w-10 tabular-nums`, zero-padded (`01`, `02`, ...)
- **Sectieheaders** — `text-xs font-bold tracking-widest uppercase text-muted-foreground border-l-[3px] border-l-primary pl-2`
- **Hoofdtitels** — `font-black tracking-tight` (geen uppercase, behalve de hero `VINOVONK`)
- **Uppercase** — alleen hero brand mark (`VINOVONK`) en sectieheaders. Nooit op: nav, buttons, kaartkoppen, tags, meta-tekst.

### Copyrichtlijnen

- Gebruik **niet** "WSET Level 3" of "WSET SAT" in zichtbare UI-tekst (handelsmerk)
- Gebruik **wel** "SAT-methode", "Systematic Approach to Tasting" of "systematisch proeven"
- Voor champagne: verwijs naar **CIVC-methode** of "CIVC (Comité Interprofessionnel du Vin de Champagne)"
- App-tagline: **"Systematisch proefdagboek · wijn & champagne"**

## Conventies

- **Taal:** UI en code-comments in het **Nederlands**
- **Componentnamen:** Nederlands (bijv. `FotoCapture`, `VoiceRecorder`)
- **Geen server-side data** — gebruik altijd `src/lib/storage-client.ts`
- **Geen externe API calls** tenzij `AI_MODE=cloud`
- Gebruik bestaande shadcn/ui componenten voor nieuwe UI-elementen
- Mobile-first responsive design met safe area insets (`env(safe-area-inset-bottom)`)
