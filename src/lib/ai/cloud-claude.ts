// Cloud AI via Anthropic Claude API — betaald, hogere kwaliteit
import type { StructureringResult } from './provider';
import { createEmptyWineTasting, type WsetWineTasting } from '@/types/wset-wine';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export function isClaudeAvailable(): boolean {
  return !!ANTHROPIC_API_KEY;
}

const SYSTEM_PROMPT = `Je bent een WSET Level 3 gecertificeerde sommelier.
Analyseer het transcript van een proefnotitie en geef een JSON-object terug dat exact het WSET Level 3 SAT format volgt.

Gebruik ALLEEN deze exacte waarden voor de velden:
- wijnType: "wit" | "rosé" | "rood" | "mousserend" | "versterkt"
- helderheid: "helder" | "troebel"
- uiterlijk.intensiteit: "bleek" | "medium" | "diep"
- conditie: "schoon" | "onzuiver"
- intensiteit (neus/smaak): "licht" | "medium-" | "medium" | "medium+" | "uitgesproken"
- ontwikkeling: "jeugdig" | "in_ontwikkeling" | "volledig_ontwikkeld" | "voorbij_hoogtepunt"
- zoetheid: "droog" | "halfdroog" | "medium-droog" | "medium-zoet" | "zoet" | "zeer_zoet"
- schaal: "laag" | "medium-" | "medium" | "medium+" | "hoog"
- body: "licht" | "medium-" | "medium" | "medium+" | "vol"
- afdronk.lengte: "kort" | "medium-" | "medium" | "medium+" | "lang"
- complexiteit: "eenvoudig" | "enige_complexiteit" | "zeer_complex"
- kwaliteit: "gebrekkig" | "slecht" | "acceptabel" | "goed" | "zeer_goed" | "uitmuntend"
- drinkbaarheid: "te_jong" | "nu_drinken" | "voorbij_hoogtepunt"
- rijpingspotentieel: "geen" | "geschikt_voor_rijping" | "verdere_rijping"

Aroma's en smaken als Nederlandse strings in arrays.
Als informatie ontbreekt, gebruik null.
Antwoord ALLEEN met JSON, geen uitleg.`;

export async function structureerMetClaude(transcript: string): Promise<StructureringResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key niet geconfigureerd');
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Analyseer deze proefnotitie:\n\n${transcript}` },
        ],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Claude API fout: ${res.status} — ${errorBody}`);
    }

    const data = await res.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error('Geen antwoord van Claude');
    }

    // Extract JSON uit het antwoord (kan in code block zitten)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Kon geen JSON vinden in Claude antwoord');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Merge met lege tasting als fallback
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

    return { tastingData, vertrouwen: 0.9 };
  } catch (error) {
    console.error('Claude structurering fout:', error);
    throw error;
  }
}
