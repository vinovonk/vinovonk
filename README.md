# VinoVonk

Persoonlijke proefnotities-app voor WSET Level 3. Noteer, bewaar en exporteer je tasting notes voor wijn, champagne, spirits, bier, sake en meer — volledig lokaal in je browser, zonder account of server.

## Features

- Proefnotities per fles, gestructureerd naar WSET-methodiek
- Ondersteuning voor meerdere dranktypes: wijn, champagne, spirits, bier, sake, alcoholvrij, anders
- **Vibe-veld** — persoonlijke eerste indruk bij het ruiken, vrije tekst in elke taal
- **Twee-staps flow** — wijn & champagne: eerst info invullen, dan proeven met visuele progress indicator
- **Validatie-navigatie** — bij ontbrekende velden automatisch naar de juiste tab met toast-feedback
- **Biodynamische kalender** — dagtype op basis van maanpositie (Maria Thun methode): Fruit dag, Bloem dag, Blad dag of Wortel dag. Zichtbaar op het dashboard en opgeslagen per sessie
- Optionele AI-ondersteuning voor gesproken notities en automatische invulling
- Lokale opslag via `localStorage` — geen backend, geen account
- Responsive design met sticky navigatie op mobile
- Dark mode & light mode

## Installatie

```bash
git clone https://github.com/vinovonk/vinovonk.git
cd vinovonk
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
- Fonts: Roboto (UI), Lora (leestekst), Cormorant Garamond (display)

## Licentie

MIT — zie [LICENSE](./LICENSE). Vrij te gebruiken, aanpassen en verspreiden, mits de oorspronkelijke auteursvermelding behouden blijft.
