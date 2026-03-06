# VinoVonk

Persoonlijke proefnotities-app voor WSET Level 3. Noteer, bewaar en exporteer je tasting notes voor wijn, spirits, bier, sake en meer — volledig lokaal in je browser, zonder account of server.

## Features

- Proefnotities per fles, gestructureerd naar WSET-methodiek
- Ondersteuning voor meerdere dranktypes: wijn, spirits, bier, sake, alcoholvrij, anders
- Optionele AI-ondersteuning voor gesproken notities en automatische invulling
- Lokale opslag via `localStorage` — geen backend, geen account
- Dark mode

## Installatie

```bash
git clone https://github.com/<gebruikersnaam>/vinovonk-app.git
cd vinovonk-app
npm install
cp .env.local.example .env.local
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

## AI-ondersteuning (optioneel)

Stel `AI_MODE` in via `.env.local`:

| Waarde | Beschrijving |
|--------|-------------|
| `manual` | Geen AI, handmatig formulier invullen (standaard) |
| `local` | Ollama (Mistral) + lokale Whisper — volledig offline |
| `cloud` | Claude API (Anthropic) + OpenAI Whisper |

Voor `cloud`-modus: voeg `ANTHROPIC_API_KEY` en `OPENAI_API_KEY` toe aan `.env.local`.

## Tech stack

- [Next.js 16](https://nextjs.org/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Sonner](https://sonner.emilkowal.ski/) voor toasts
