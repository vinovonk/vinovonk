// Proefsessie — bevat meerdere flessen/dranken
import { WsetWineTasting } from './wset-wine';
import { WsetSpiritsTasting } from './wset-spirits';
import { GenericTasting } from './wset-other';
import { AlcoholVrijTasting } from './alcoholvrij';
import { ChampagneTasting } from './champagne';

export type DrankType = 'wijn' | 'spirit' | 'bier' | 'sake' | 'alcoholvrij' | 'anders' | 'champagne';

export type TastingData = WsetWineTasting | WsetSpiritsTasting | GenericTasting | AlcoholVrijTasting | ChampagneTasting;

export interface TastingNote {
  id: string;
  drankType: DrankType;
  fotoPath?: string;
  audioPath?: string;
  transcript?: string;
  tastingData: TastingData;
  persoonlijkeNotitie?: string;
  score?: number; // 1-10
  createdAt: string;
  updatedAt: string;
}

export interface TastingSession {
  id: string;
  naam: string;
  datum: string; // ISO date string
  beschrijving?: string;
  flessen: TastingNote[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  biodynamischDagType?: 'fruit' | 'bloem' | 'blad' | 'wortel';
}

export interface SessionSummary {
  id: string;
  naam: string;
  datum: string;
  aantalFlessen: number;
  createdAt: string;
}
