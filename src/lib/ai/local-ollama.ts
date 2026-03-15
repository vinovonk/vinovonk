// Lokale AI via Ollama — gratis, draait op je Mac
import type { StructureringResult } from './provider';
import { createEmptyWineTasting, type WsetWineTasting } from '@/types/wset-wine';
import { validateAiResponse } from '@/lib/validation';

const RAW_OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

// Valideer dat Ollama URL naar localhost wijst (voorkom SSRF)
function validateOllamaUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    const allowedHosts = ['localhost', '127.0.0.1', '::1'];
    if (!allowedHosts.includes(url.hostname)) {
      console.error(`Ollama URL "${url.hostname}" is niet localhost — geblokkeerd`);
      return 'http://localhost:11434';
    }
    return urlString;
  } catch {
    return 'http://localhost:11434';
  }
}

const OLLAMA_URL = validateOllamaUrl(RAW_OLLAMA_URL);

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

const SYSTEM_PROMPT = `Je bent een WSET Level 3 gecertificeerde sommelier die proefnotities analyseert.

TAAK: Analyseer het volgende transcript van een proefnotitie en extraheer alle informatie in een gestructureerd JSON-formaat volgens het WSET Level 3 Systematic Approach to Tasting (SAT).

REGELS:
- Gebruik ALLEEN de exacte waarden uit de toegestane opties hieronder
- Als informatie niet in het transcript voorkomt, gebruik null
- Aroma's en smaken als arrays van strings in het Nederlands
- Geef je antwoord als PURE JSON, geen uitleg

TOEGESTANE WAARDEN:
- wijnType: "wit", "rosé", "rood", "mousserend", "versterkt"
- helderheid: "helder", "troebel"
- uiterlijk.intensiteit: "bleek", "medium", "diep"
- kleur wit: "citroengeel-groen", "citroengeel", "goud", "amber", "bruin"
- kleur rosé: "roze", "zalm", "oranje"
- kleur rood: "paars", "robijn", "granaat", "tawny", "bruin"
- conditie: "schoon", "onzuiver"
- intensiteit (neus/smaak): "licht", "medium-", "medium", "medium+", "uitgesproken"
- ontwikkeling: "jeugdig", "in_ontwikkeling", "volledig_ontwikkeld", "voorbij_hoogtepunt"
- zoetheid: "droog", "halfdroog", "medium-droog", "medium-zoet", "zoet", "zeer_zoet"
- schaal (zuurgraad/tannine/alcohol): "laag", "medium-", "medium", "medium+", "hoog"
- body: "licht", "medium-", "medium", "medium+", "vol"
- afdronk lengte: "kort", "medium-", "medium", "medium+", "lang"
- complexiteit: "eenvoudig", "enige_complexiteit", "zeer_complex"
- kwaliteit: "gebrekkig", "slecht", "acceptabel", "goed", "zeer_goed", "uitmuntend"
- drinkbaarheid: "te_jong", "nu_drinken", "voorbij_hoogtepunt"
- rijpingspotentieel: "geen", "geschikt_voor_rijping", "verdere_rijping"

JSON STRUCTUUR:
{
  "wijnNaam": "string",
  "producent": "string of null",
  "regio": "string of null",
  "land": "string of null",
  "druivenras": ["string"] of null,
  "jaargang": number of null,
  "prijs": number of null,
  "wijnType": "rood",
  "uiterlijk": {
    "helderheid": "helder",
    "intensiteit": "medium",
    "kleur": "robijn",
    "overig": ""
  },
  "neus": {
    "conditie": "schoon",
    "intensiteit": "medium+",
    "aromaKenmerken": {
      "primair": ["kers", "pruim"],
      "secundair": ["vanille"],
      "tertiair": []
    },
    "ontwikkeling": "jeugdig"
  },
  "gehemelte": {
    "zoetheid": "droog",
    "zuurgraad": "medium+",
    "tannine": "medium+",
    "alcohol": "medium",
    "body": "medium+",
    "smaakIntensiteit": "medium+",
    "smaakKenmerken": {
      "primair": ["kers", "pruim"],
      "secundair": ["vanille"],
      "tertiair": []
    },
    "afdronk": {
      "lengte": "medium+",
      "complexiteit": "enige_complexiteit"
    }
  },
  "conclusie": {
    "kwaliteit": "goed",
    "drinkbaarheid": "nu_drinken",
    "rijpingspotentieel": "geschikt_voor_rijping"
  }
}`;

export async function structureerMetOllama(transcript: string): Promise<StructureringResult> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyseer deze proefnotitie:\n\n${transcript}` },
        ],
        format: 'json',
        stream: false,
        options: {
          temperature: 0.1, // Lage temperatuur voor consistente output
        },
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout voor lokale modellen
    });

    if (!res.ok) {
      throw new Error(`Ollama fout: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const content = data.message?.content;

    if (!content) {
      throw new Error('Geen antwoord van Ollama');
    }

    // Parse en valideer JSON uit het antwoord
    const rawParsed = JSON.parse(content);
    const parsed = validateAiResponse(rawParsed) || rawParsed;

    // Merge met lege tasting als fallback voor ontbrekende velden
    const empty = createEmptyWineTasting();
    const tastingData: WsetWineTasting = {
      ...empty,
      ...parsed,
      uiterlijk: { ...empty.uiterlijk, ...parsed.uiterlijk },
      neus: {
        ...empty.neus,
        ...parsed.neus,
        aromaKenmerken: {
          ...empty.neus.aromaKenmerken,
          ...parsed.neus?.aromaKenmerken,
        },
      },
      gehemelte: {
        ...empty.gehemelte,
        ...parsed.gehemelte,
        smaakKenmerken: {
          ...empty.gehemelte.smaakKenmerken,
          ...parsed.gehemelte?.smaakKenmerken,
        },
        afdronk: {
          ...empty.gehemelte.afdronk,
          ...parsed.gehemelte?.afdronk,
        },
      },
      conclusie: { ...empty.conclusie, ...parsed.conclusie },
    };

    return { tastingData, vertrouwen: 0.7 };
  } catch (error) {
    console.error('Ollama structurering fout:', error);
    throw error;
  }
}
