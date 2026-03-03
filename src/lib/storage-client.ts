// Client-side localStorage opslag voor proefsessies
// Vervangt de server-side storage.ts — geen API routes meer nodig
import { TastingSession, SessionSummary, TastingNote } from '@/types/tasting-session';
import { v4 as uuidv4 } from 'uuid';

const INDEX_KEY = 'vinovonk_sessions_index';
const SESSION_PREFIX = 'vinovonk_session_';

// === Interne helpers ===

function getIndex(): SessionSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  } catch {
    return [];
  }
}

function setIndex(index: SessionSummary[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

function sessionKey(id: string) {
  return `${SESSION_PREFIX}${id}`;
}

// === CRUD Operaties ===

export function getSessions(): SessionSummary[] {
  const index = getIndex();
  return index.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
}

export function getSession(id: string): TastingSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(sessionKey(id));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function createSession(naam: string, beschrijving?: string): TastingSession {
  const id = uuidv4();
  const now = new Date().toISOString();
  const datum = new Date().toISOString().split('T')[0];

  const session: TastingSession = {
    id,
    naam,
    datum,
    beschrijving,
    flessen: [],
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(sessionKey(id), JSON.stringify(session));

  const index = getIndex();
  index.push({ id, naam, datum, aantalFlessen: 0, createdAt: now });
  setIndex(index);

  return session;
}

export function updateSession(id: string, updates: Partial<TastingSession>): TastingSession | null {
  const session = getSession(id);
  if (!session) return null;

  const updated: TastingSession = {
    ...session,
    ...updates,
    id: session.id, // ID nooit overschrijven
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(sessionKey(id), JSON.stringify(updated));

  // Update index
  const index = getIndex();
  const idx = index.findIndex((s) => s.id === id);
  if (idx !== -1) {
    index[idx] = {
      ...index[idx],
      naam: updated.naam,
      datum: updated.datum,
      aantalFlessen: updated.flessen.length,
    };
    setIndex(index);
  }

  return updated;
}

export function deleteSession(id: string): boolean {
  try {
    localStorage.removeItem(sessionKey(id));
    const index = getIndex();
    setIndex(index.filter((s) => s.id !== id));
    return true;
  } catch {
    return false;
  }
}

// === Fles operaties ===

export function addFles(sessionId: string, fles: TastingNote): TastingSession | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.flessen.push(fles);
  return updateSession(sessionId, { flessen: session.flessen });
}

export function updateFles(
  sessionId: string,
  flesId: string,
  updates: Partial<TastingNote>
): TastingSession | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const idx = session.flessen.findIndex((f) => f.id === flesId);
  if (idx === -1) return null;

  session.flessen[idx] = {
    ...session.flessen[idx],
    ...updates,
    id: flesId,
    updatedAt: new Date().toISOString(),
  };

  return updateSession(sessionId, { flessen: session.flessen });
}

export function deleteFles(sessionId: string, flesId: string): TastingSession | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.flessen = session.flessen.filter((f) => f.id !== flesId);
  return updateSession(sessionId, { flessen: session.flessen });
}

// === Foto hulpfunctie ===
// Comprimeert een afbeelding naar een base64 JPEG data URL voor opslag in localStorage

export function compressImage(file: File, maxWidth = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Afbeelding laden mislukt'));
    };

    img.src = objectUrl;
  });
}
