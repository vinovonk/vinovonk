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
- **Fonts:** Geist Sans, Geist Mono, Cormorant Garamond (`font-display` voor italic kopjes)
- **Toasts:** Sonner

## Architectuur

### Opslag — localStorage (client-side)

Alle data zit in de browser via `src/lib/storage-client.ts`. Dit is de actieve storage laag.

- `vinovonk_sessions_index` — lijst van alle sessies (`SessionSummary[]`)
- `vinovonk_session_{uuid}` — volledige sessiedata per sessie (`TastingSession`)

`src/lib/storage.ts` is de **verouderde** server-side filesystem versie (niet meer in gebruik).
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

`wijn` | `spirit` | `bier` | `sake` | `alcoholvrij` | `anders`

Elk dranktype heeft een eigen form-component in `src/components/proeven/` en een eigen type in `src/types/`.

## Conventies

- **Taal:** UI en code-comments in het **Nederlands**
- **Componentnamen:** Nederlands (bijv. `FotoCapture`, `VoiceRecorder`)
- **Geen server-side data** — gebruik altijd `src/lib/storage-client.ts`
- **Geen externe API calls** tenzij `AI_MODE=cloud`
- Gebruik bestaande shadcn/ui componenten voor nieuwe UI-elementen
