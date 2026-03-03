// Lokale JSON-bestandsopslag voor proefsessies
import { promises as fs } from 'fs';
import path from 'path';
import { TastingSession, SessionSummary, TastingNote } from '@/types/tasting-session';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data', 'sessions');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// Zorg dat de data directory bestaat
async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// Lees de index (lijst van alle sessies)
async function readIndex(): Promise<SessionSummary[]> {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Schrijf de index
async function writeIndex(index: SessionSummary[]) {
  await ensureDataDir();
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

// Haal sessie-pad op
function getSessionDir(id: string) {
  return path.join(DATA_DIR, id);
}

function getSessionFile(id: string) {
  return path.join(getSessionDir(id), 'session.json');
}

// === CRUD Operaties ===

export async function getSessions(): Promise<SessionSummary[]> {
  const index = await readIndex();
  return index.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
}

export async function getSession(id: string): Promise<TastingSession | null> {
  try {
    const data = await fs.readFile(getSessionFile(id), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function createSession(naam: string, beschrijving?: string): Promise<TastingSession> {
  await ensureDataDir();

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

  // Maak sessiemap aan
  const sessionDir = getSessionDir(id);
  await fs.mkdir(sessionDir, { recursive: true });
  await fs.mkdir(path.join(sessionDir, 'fotos'), { recursive: true });
  await fs.mkdir(path.join(sessionDir, 'audio'), { recursive: true });
  await fs.mkdir(path.join(sessionDir, 'export'), { recursive: true });

  // Sla sessie op
  await fs.writeFile(getSessionFile(id), JSON.stringify(session, null, 2), 'utf-8');

  // Update index
  const index = await readIndex();
  index.push({
    id,
    naam,
    datum,
    aantalFlessen: 0,
    createdAt: now,
  });
  await writeIndex(index);

  return session;
}

export async function updateSession(id: string, updates: Partial<TastingSession>): Promise<TastingSession | null> {
  const session = await getSession(id);
  if (!session) return null;

  const updated: TastingSession = {
    ...session,
    ...updates,
    id: session.id, // ID niet overschrijven
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(getSessionFile(id), JSON.stringify(updated, null, 2), 'utf-8');

  // Update index
  const index = await readIndex();
  const idx = index.findIndex((s) => s.id === id);
  if (idx !== -1) {
    index[idx] = {
      ...index[idx],
      naam: updated.naam,
      datum: updated.datum,
      aantalFlessen: updated.flessen.length,
    };
    await writeIndex(index);
  }

  return updated;
}

export async function deleteSession(id: string): Promise<boolean> {
  try {
    await fs.rm(getSessionDir(id), { recursive: true, force: true });
    const index = await readIndex();
    const filtered = index.filter((s) => s.id !== id);
    await writeIndex(filtered);
    return true;
  } catch {
    return false;
  }
}

// === Fles operaties ===

export async function addFles(sessionId: string, fles: TastingNote): Promise<TastingSession | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  session.flessen.push(fles);
  return updateSession(sessionId, { flessen: session.flessen });
}

export async function updateFles(sessionId: string, flesId: string, updates: Partial<TastingNote>): Promise<TastingSession | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const flesIndex = session.flessen.findIndex((f) => f.id === flesId);
  if (flesIndex === -1) return null;

  session.flessen[flesIndex] = {
    ...session.flessen[flesIndex],
    ...updates,
    id: flesId, // ID niet overschrijven
    updatedAt: new Date().toISOString(),
  };

  return updateSession(sessionId, { flessen: session.flessen });
}

export async function deleteFles(sessionId: string, flesId: string): Promise<TastingSession | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  session.flessen = session.flessen.filter((f) => f.id !== flesId);
  return updateSession(sessionId, { flessen: session.flessen });
}

// === Bestand operaties ===

export async function saveFile(sessionId: string, subDir: 'fotos' | 'audio', filename: string, buffer: Buffer): Promise<string> {
  const dir = path.join(getSessionDir(sessionId), subDir);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

export async function getFilePath(sessionId: string, subDir: 'fotos' | 'audio', filename: string): Promise<string> {
  return path.join(getSessionDir(sessionId), subDir, filename);
}
