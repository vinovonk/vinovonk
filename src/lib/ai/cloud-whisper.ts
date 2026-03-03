// Cloud spraak-naar-tekst via OpenAI Whisper API
import type { TranscriptionResult } from './provider';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export function isWhisperCloudAvailable(): boolean {
  return !!OPENAI_API_KEY;
}

export async function transcribeMetWhisperCloud(audioBlob: Blob): Promise<TranscriptionResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key niet geconfigureerd');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'opname.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'nl');
  formData.append('response_format', 'verbose_json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Whisper API fout: ${res.status} — ${errorBody}`);
  }

  const data = await res.json();

  return {
    tekst: data.text,
    taal: data.language,
    duur: data.duration,
  };
}
