// Zod-schemas voor runtime validatie van onbetrouwbare data
// Gebruikt bij: backup-import, AI-responses, localStorage reads
import { z } from 'zod';

// === Backup-import validatie ===

// Lichte validatie: check structuur zonder elk veld diep te valideren
// (de app is tolerant voor ontbrekende velden dankzij createEmpty*Tasting() fallbacks)
const TastingNoteSchema = z.object({
  id: z.string(),
  drankType: z.enum(['wijn', 'spirit', 'bier', 'sake', 'alcoholvrij', 'anders', 'champagne']),
  tastingData: z.record(z.string(), z.unknown()), // diep valideren is niet nodig — form mergt met empty
  fotoPath: z.string().optional(),
  audioPath: z.string().optional(),
  transcript: z.string().optional(),
  persoonlijkeNotitie: z.string().optional(),
  score: z.number().min(1).max(10).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

const TastingSessionSchema = z.object({
  id: z.string(),
  naam: z.string().max(500),
  datum: z.string(),
  beschrijving: z.string().max(5000).optional(),
  flessen: z.array(TastingNoteSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  isArchived: z.boolean().optional(),
  biodynamischDagType: z.enum(['fruit', 'bloem', 'blad', 'wortel']).optional(),
}).passthrough();

const SessionSummarySchema = z.object({
  id: z.string(),
  naam: z.string().max(500),
  datum: z.string(),
  aantalFlessen: z.number().int().min(0),
  createdAt: z.string(),
}).passthrough();

const SessionsIndexSchema = z.array(SessionSummarySchema);

// Maximale backup-grootte: 8MB (localStorage is ~5-10MB)
const MAX_BACKUP_SIZE = 8 * 1024 * 1024;

export type BackupValidationResult =
  | { ok: true; sessieCount: number }
  | { ok: false; error: string };

/**
 * Valideert en importeert een backup-bestand in localStorage.
 * Controleert grootte, structuur en schema voordat data wordt opgeslagen.
 */
export function validateAndImportBackup(rawJson: string): BackupValidationResult {
  // 1. Grootte-check
  if (rawJson.length > MAX_BACKUP_SIZE) {
    return { ok: false, error: `Backup te groot (max ${Math.round(MAX_BACKUP_SIZE / 1024 / 1024)}MB)` };
  }

  // 2. Parse JSON
  let backup: Record<string, unknown>;
  try {
    backup = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: 'Ongeldig JSON-bestand' };
  }

  // 3. Check dat het een object is
  if (typeof backup !== 'object' || backup === null || Array.isArray(backup)) {
    return { ok: false, error: 'Backup moet een JSON-object zijn' };
  }

  // 4. Valideer elke key
  let sessieCount = 0;
  const validEntries: [string, string][] = [];

  for (const [key, value] of Object.entries(backup)) {
    // Alleen vinovonk_ keys toelaten
    if (!key.startsWith('vinovonk_')) continue;

    if (key === 'vinovonk_sessions_index') {
      // Valideer index
      const result = SessionsIndexSchema.safeParse(value);
      if (!result.success) {
        return { ok: false, error: `Ongeldige sessie-index: ${result.error.issues[0]?.message}` };
      }
      validEntries.push([key, JSON.stringify(result.data)]);
    } else if (key.startsWith('vinovonk_session_')) {
      // Valideer individuele sessie
      const result = TastingSessionSchema.safeParse(value);
      if (!result.success) {
        return { ok: false, error: `Ongeldige sessie "${String((value as Record<string, unknown>)?.naam || key)}": ${result.error.issues[0]?.message}` };
      }
      validEntries.push([key, JSON.stringify(result.data)]);
      sessieCount++;
    }
    // Onbekende vinovonk_ keys worden genegeerd
  }

  // 5. Alles geldig — schrijf naar localStorage
  for (const [key, serialized] of validEntries) {
    localStorage.setItem(key, serialized);
  }

  return { ok: true, sessieCount };
}

// === AI-response validatie ===

// Lichte schema voor AI-gestructureerde wijndata
// Accepteert null voor elk veld (AI kan incomplete data teruggeven)
const AromaKenmerkenSchema = z.object({
  primair: z.array(z.string()).optional().default([]),
  secundair: z.array(z.string()).optional().default([]),
  tertiair: z.array(z.string()).optional().default([]),
}).passthrough();

export const AiWineTastingSchema = z.object({
  wijnNaam: z.string().optional(),
  producent: z.string().nullable().optional(),
  regio: z.string().nullable().optional(),
  land: z.string().nullable().optional(),
  druivenras: z.array(z.string()).nullable().optional(),
  jaargang: z.number().nullable().optional(),
  prijs: z.number().nullable().optional(),
  wijnType: z.string().optional(),
  uiterlijk: z.object({
    helderheid: z.string().nullable().optional(),
    intensiteit: z.string().nullable().optional(),
    kleur: z.string().nullable().optional(),
    overig: z.string().optional(),
  }).optional(),
  neus: z.object({
    conditie: z.string().nullable().optional(),
    intensiteit: z.string().nullable().optional(),
    aromaKenmerken: AromaKenmerkenSchema.optional(),
    ontwikkeling: z.string().nullable().optional(),
  }).optional(),
  gehemelte: z.object({
    zoetheid: z.string().nullable().optional(),
    zuurgraad: z.string().nullable().optional(),
    tannine: z.string().nullable().optional(),
    alcohol: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    smaakIntensiteit: z.string().nullable().optional(),
    smaakKenmerken: AromaKenmerkenSchema.optional(),
    afdronk: z.object({
      lengte: z.string().nullable().optional(),
      complexiteit: z.string().nullable().optional(),
    }).optional(),
  }).optional(),
  conclusie: z.object({
    kwaliteit: z.string().nullable().optional(),
    drinkbaarheid: z.string().nullable().optional(),
    rijpingspotentieel: z.string().nullable().optional(),
  }).optional(),
}).passthrough();

/**
 * Valideert AI-response JSON en stript onverwachte toplevel-velden.
 * Retourneert gevalideerde data of null bij ongeldige structuur.
 */
export function validateAiResponse(parsed: unknown): Record<string, unknown> | null {
  const result = AiWineTastingSchema.safeParse(parsed);
  if (!result.success) {
    console.warn('AI-response validatie mislukt:', result.error.issues[0]?.message);
    return null;
  }
  return result.data as Record<string, unknown>;
}
