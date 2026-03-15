# VinoVonk

**Systematisch proefdagboek · wijn & champagne**

Gemaakt door [Jeroen Vonk](https://vinovonk.com) — wijnschrijver, educator en podcast-host. De app is een persoonlijk proefdagboek om waarnemingen vast te leggen en te bewaren als input voor artikelen, afleveringen en content op VinoVonk.com.

Volledig lokaal in je browser — geen account, geen server, geen cloud.

🌐 **Live:** [vinovonk.vercel.app](https://vinovonk.vercel.app)

---

## Features

- Proefnotities per fles, gestructureerd per dranktype
- **Wijn** — SAT-methode (Systematic Approach to Tasting): verschijning → neus → gehemelte → conclusie
- **Champagne** — CIVC-methode (Comité Interprofessionnel du Vin de Champagne): perlage, mousse, autolytische aroma's, dosage
- **Overige dranktypes** — spirits, bier, sake, alcoholvrij, anders
- **Vibe-veld** — persoonlijke eerste indruk bij het ruiken, vrije tekst
- **Twee-staps flow** — wijn & champagne: eerst info invullen, dan proeven met visuele progress indicator
- **Validatie-navigatie** — bij ontbrekende velden automatisch naar de juiste tab
- **Biodynamische kalender** — dagtype op basis van maanpositie (Fruit, Bloem, Blad, Wortel dag)
- **Foto's per fles** — gecomprimeerd opgeslagen als base64 in localStorage
- Optionele AI-ondersteuning voor gesproken notities en automatische invulling
- Responsive design met sticky navigatie op mobile
- Dark mode & light mode

## Design

Selectief brutalist visueel systeem op een warm crème achtergrond:

- **Kleur** — primary is diep bordeaux/wijnrood (`oklch(0.42 0.20 25)`, vergelijkbaar met `#B71C1C`)
- **Goud accent** — `#C8960C` voor decoratieve details
- **Lijstkaarten** — aansluitend (touching cards) met rode linkerborder
- **Brutalist shadow** — `4px 4px 0` offset in donker grijs
- **Typografie** — Roboto (UI), Lora (leestekst), Cormorant Garamond (display)

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

- [Next.js 16](https://nextjs.org/) + TypeScript + React 19
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [Sonner](https://sonner.emilkowal.ski/) voor toasts
- Opslag via `localStorage` — geen backend of database
- Fonts: Roboto, Lora, Cormorant Garamond, Geist Mono

## Opslag & privacy

Alle data blijft in je browser via `localStorage` — er is geen server, geen account en geen cloud-opslag. Notities, foto's en sessies verlaten het apparaat nooit. De app werkt volledig offline na de eerste keer laden.

## Security

De app is gebouwd met een defensief security-model. Overzicht van maatregelen:

| Maatregel | Bestand | Details |
|-----------|---------|---------|
| **Backup-import validatie** | `src/lib/validation.ts` | Zod-schema valideert elk veld vóór opslag in localStorage. Max 8MB, alleen `vinovonk_*` keys. |
| **Security headers** | `next.config.ts` | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy` |
| **Foto-upload validatie** | `src/components/proeven/foto-capture.tsx` | MIME-type whitelist (JPEG/PNG/WebP/HEIC), max 15MB vóór Canvas-compressie |
| **localStorage quota** | `src/lib/storage-client.ts` | `QuotaExceededError` wordt opgevangen en getoond als toast |
| **AI-response validatie** | `src/lib/validation.ts` | Zod-schema op Claude/Ollama JSON-output, met fallback op ongeldige data |
| **AI request timeout** | `src/lib/ai/cloud-claude.ts` | 15s timeout op Claude API; 30s op Ollama |
| **AI error sanitization** | `src/lib/ai/cloud-*.ts` | Ruwe API-foutberichten worden niet doorgestuurd naar de gebruiker |
| **SSRF-bescherming** | `src/lib/ai/local-ollama.ts` | Ollama URL wordt gevalideerd — alleen `localhost`/`127.0.0.1`/`::1` toegestaan |
| **Input-lengtebeperkingen** | `src/app/sessie/nieuw/page.tsx` | `maxLength` op naam (200) en beschrijving (2000) |

API-sleutels (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) zijn server-side only en worden nooit in de client-bundle meegenomen.

## Licentie

MIT — zie [LICENSE](./LICENSE). Vrij te gebruiken, aanpassen en verspreiden, mits de oorspronkelijke auteursvermelding behouden blijft.
