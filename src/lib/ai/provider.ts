// AI Provider abstractie — lokaal (Ollama/Whisper) vs cloud (OpenAI/Claude)
import type { WsetWineTasting } from '@/types/wset-wine';

export interface TranscriptionResult {
  tekst: string;
  taal?: string;
  duur?: number;
}

export interface StructureringResult {
  tastingData: WsetWineTasting;
  vertrouwen?: number; // 0-1 hoe zeker de AI is
}

export interface AIProvider {
  naam: string;
  transcribe(audioBlob: Blob): Promise<TranscriptionResult>;
  structureer(transcript: string, drankType: string): Promise<StructureringResult>;
  isAvailable(): Promise<boolean>;
}

export function getAIMode(): 'manual' | 'local' | 'cloud' {
  return (process.env.AI_MODE as 'manual' | 'local' | 'cloud') || 'manual';
}
