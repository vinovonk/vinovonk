# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# VinoVonk

Proefnotities-app voor WSET Level 3, bedoeld voor persoonlijk lokaal gebruik.

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

## Architectuur

### Opslag — localStorage (client-side)

Alle data zit in de browser via `src/lib/storage-client.ts`. Dit is de enige actieve storage laag.

- `vinovonk_sessions_index` — lijst van alle sessies (`SessionSummary[]`)
- `vinovonk_session_{uuid}` — volledige sessiedata per sessie (`TastingSession`)

De enige actieve API route is `/api/export`.

### AI-modi (via `.env.local`)

| Waarde | Beschrijving |
|--------|-------------|
| `manual` | Geen AI, handmatig formulier (standaard) |
| `local` | Ollama (Mistral) + lokale Whisper |
| `cloud` | Claude API (Anthropic) + OpenAI Whisper |

Env var: `AI_MODE=manual|local|cloud`
Cloud keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
AI-provider abstractie: `src/lib/ai/provider.ts`

### Dranktypes

`wijn` | `spirit` | `bier` | `sake` | `champagne` | `alcoholvrij` | `anders`

Elk dranktype heeft een eigen form-component in `src/components/proeven/` en een eigen type in `src/types/`.

### Biodynamische kalender

`src/lib/biodynamisch.ts` — client-side berekening van de maanpositie (siderisch, vereenvoudigd Meeus-algoritme). Geen externe API, geen npm-pakket.

- `getBiodynamischInfo(date)` — geeft dagtype, label, sterrenbeeld, element, beschrijving, kleur, emoji
- `getMaanTekenWisselTijden(date)` — geeft start/eindtijd van het huidige maanteken
- `BiodynamischBadge` component — compact (lijst) en uitgebreid (dashboard) variant
- Dagtypen: Fruit dag (vuur), Bloem dag (lucht), Blad dag (water), Wortel dag (aarde)

## Conventies

- **Taal:** UI en code-comments in het **Nederlands**
- **Componentnamen:** Nederlands (bijv. `FotoCapture`, `VoiceRecorder`)
- **Geen server-side data** — gebruik altijd `src/lib/storage-client.ts`
- **Geen externe API calls** tenzij `AI_MODE=cloud`
- Gebruik bestaande shadcn/ui componenten voor nieuwe UI-elementen
