import fs from 'node:fs';
import path from 'node:path';
import type { Section, SectionContent, SectionHistoryEntry, GalleryItem, ScheduleActivity } from './types';
import { Firestore } from '@google-cloud/firestore';

let firestoreDb: Firestore | null = null;

try {
  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'acampadasetas';
  const databaseId = process.env.FIRESTORE_DATABASE_ID || '(default)';
  const defaultKeyPath = path.resolve(process.cwd(), 'service-account.json');
  const envKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const keyPath = (envKeyPath && fs.existsSync(envKeyPath)) ? envKeyPath : (fs.existsSync(defaultKeyPath) ? defaultKeyPath : undefined);

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firestoreDb = new Firestore({ projectId, credentials, databaseId });
  } else if (keyPath) {
    firestoreDb = new Firestore({ projectId, keyFilename: keyPath, databaseId });
  } else if (process.env.K_SERVICE || process.env.NODE_ENV === 'production') {
    firestoreDb = new Firestore({ projectId, databaseId });
  }
} catch (e) {
  console.warn('Firestore CMS init notice: using local fallback', e);
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const SECTIONS_FILE = path.join(DATA_DIR, 'sections.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

const INITIAL_SECTIONS: Section[] = [
  {
    id: 'sec-manifiesto',
    slug: 'manifiesto',
    order: 1,
    updatedAt: new Date().toISOString(),
    live: {
      title: 'Manifiesto Acampada Setas',
      navLabel: 'Manifiesto',
      subtitle: 'Por el derecho a la vivienda y la ciudad para quienes la habitan',
      highlight: '¡La vivienda es un derecho, no un negocio!',
      template: 'single-column',
      body: `### Por una Sevilla habitable

Nos concentramos en la Plaza de la Encarnación (Las Setas) para denunciar la emergencia habitacional que expulsa a nuestras vecinas de sus barrios. 

1. **Suspensión inmediata de los desahucios** sin alternativa habitacional digna.
2. **Moratoria total a las licencias de pisos turísticos** que devoran el centro histórico y los barrios populares.
3. **Regulación real del precio de los alquileres** vinculada a los salarios medios.

*La ciudad no se vende, la ciudad se defiende.*`,
      illustrationUrl: ''
    },
    draft: {
      title: 'Manifiesto Acampada Setas',
      navLabel: 'Manifiesto',
      subtitle: 'Por el derecho a la vivienda y la ciudad para quienes la habitan',
      highlight: '¡La vivienda es un derecho, no un negocio!',
      template: 'single-column',
      body: `### Por una Sevilla habitable

Nos concentramos en la Plaza de la Encarnación (Las Setas) para denunciar la emergencia habitacional que expulsa a nuestras vecinas de sus barrios. 

1. **Suspensión inmediata de los desahucios** sin alternativa habitacional digna.
2. **Moratoria total a las licencias de pisos turísticos** que devoran el centro histórico y los barrios populares.
3. **Regulación real del precio de los alquileres** vinculada a los salarios medios.

*La ciudad no se vende, la ciudad se defiende.*`,
      illustrationUrl: ''
    }
  },
  {
    id: 'sec-agenda',
    slug: 'agenda',
    order: 2,
    updatedAt: new Date().toISOString(),
    live: {
      title: 'Programa y Actividades',
      navLabel: 'Programa',
      subtitle: 'Asambleas, talleres y formación colectiva',
      highlight: 'Asamblea diaria a las 20:00h',
      template: 'multi-column',
      body: `### Horario de Movilización

- **10:00h** — Desayuno popular y apertura de puntos informativos.
- **12:00h** — Taller jurídico sobre contratos de alquiler y paralización de desahucios.
- **17:00h** — Charla-debate: *Turistificación y expolio del espacio público*.
- **20:00h** — **Gran Asamblea Abierta**: Toma de decisiones colectivas.`,
      illustrationUrl: ''
    },
    draft: {
      title: 'Programa y Actividades',
      navLabel: 'Programa',
      subtitle: 'Asambleas, talleres y formación colectiva',
      highlight: 'Asamblea diaria a las 20:00h',
      template: 'multi-column',
      body: `### Horario de Movilización

- **10:00h** — Desayuno popular y apertura de puntos informativos.
- **12:00h** — Taller jurídico sobre contratos de alquiler y paralización de desahucios.
- **17:00h** — Charla-debate: *Turistificación y expolio del espacio público*.
- **20:00h** — **Gran Asamblea Abierta**: Toma de decisiones colectivas.`,
      illustrationUrl: ''
    }
  }
];

const INITIAL_HISTORY: SectionHistoryEntry[] = [
  {
    id: 'hist-seed-01',
    sectionId: 'sec-manifiesto',
    timestamp: '2026-10-01T10:00:00.000Z',
    authorName: 'Administración Acampada',
    template: 'single-column',
    title: 'Manifiesto Acampada Setas',
    subtitle: 'Por el derecho a la vivienda y la ciudad para quienes la habitan',
    highlight: '¡La vivienda es un derecho, no un negocio!',
    body: INITIAL_SECTIONS[0].live!.body,
    illustrationUrl: '',
    status: 'published',
  },
  {
    id: 'hist-seed-02',
    sectionId: 'sec-agenda',
    timestamp: '2026-10-01T11:00:00.000Z',
    authorName: 'Administración Acampada',
    template: 'multi-column',
    title: 'Programa y Actividades',
    subtitle: 'Asambleas, talleres y formación colectiva',
    highlight: 'Asamblea diaria a las 20:00h',
    body: INITIAL_SECTIONS[1].live!.body,
    illustrationUrl: '',
    status: 'published',
  }
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-01',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Asamblea general en Las Setas al atardecer',
    author: 'Colectivo Fotográfico Sevilla',
    social: 'https://instagram.com/acampadasetas',
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'gal-02',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pancartas vecinales en defensa del alquiler social',
    author: 'Redacción Popular',
    social: 'https://twitter.com/acampadasetas',
    order: 2,
    createdAt: new Date().toISOString()
  }
];

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SECTIONS_FILE)) {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(INITIAL_SECTIONS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(HISTORY_FILE) || (fs.existsSync(HISTORY_FILE) && JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8') || '[]').length === 0)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(INITIAL_HISTORY, null, 2), 'utf-8');
  }
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(INITIAL_GALLERY, null, 2), 'utf-8');
  }
}

function readLocal<T>(file: string, fallback: T): T {
  ensureDataFiles();
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(file: string, data: any) {
  ensureDataFiles();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// SECTIONS
export async function getSections(liveOnly = false): Promise<Section[]> {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('sections').orderBy('order', 'asc').get();
      if (!snap.empty) {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Section));
        return liveOnly ? list.filter(s => s.live !== null) : list;
      } else {
        const initial = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
        for (const s of initial) {
          await firestoreDb.collection('sections').doc(s.id).set(s);
        }
        return liveOnly ? initial.filter(s => s.live !== null) : initial;
      }
    } catch (e) {
      console.warn('Firestore getSections fallback:', e);
    }
  }

  const list = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
  const sorted = [...list].sort((a, b) => a.order - b.order);
  return liveOnly ? sorted.filter(s => s.live !== null) : sorted;
}

export async function getSectionById(id: string): Promise<Section | null> {
  if (firestoreDb) {
    try {
      const doc = await firestoreDb.collection('sections').doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Section;
      }
    } catch (e) {
      console.warn('Firestore getSectionById fallback:', e);
    }
  }
  const list = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
  return list.find(s => s.id === id) || null;
}

export async function saveSectionDraft(
  id: string, 
  draftData: SectionContent, 
  slug?: string, 
  order?: number,
  authorName = 'Editor'
): Promise<Section> {
  const now = new Date().toISOString();
  const existing = await getSectionById(id);
  const finalSlug = slug || existing?.slug || id.replace('sec-', '');
  const finalOrder = order ?? existing?.order ?? 99;

  const updatedSection: Section = {
    id,
    slug: finalSlug,
    order: finalOrder,
    live: existing?.live || null,
    draft: draftData,
    updatedAt: now,
  };

  // Add a history revision record for this draft snapshot
  const draftHistoryEntry: SectionHistoryEntry = {
    id: 'hist-' + Math.random().toString(36).substring(2, 9),
    sectionId: id,
    timestamp: now,
    authorName,
    template: draftData.template,
    title: draftData.title,
    navLabel: draftData.navLabel,
    subtitle: draftData.subtitle,
    highlight: draftData.highlight,
    body: draftData.body,
    illustrationUrl: draftData.illustrationUrl,
    status: 'draft',
  };

  if (firestoreDb) {
    try {
      await firestoreDb.collection('sections').doc(id).set(updatedSection, { merge: true });
      await firestoreDb.collection('sections').doc(id).collection('history').doc(draftHistoryEntry.id).set(draftHistoryEntry);
    } catch (e) {
      console.warn('Firestore saveSectionDraft fallback:', e);
    }
  }

  // Update local history
  const historyList = readLocal<SectionHistoryEntry[]>(HISTORY_FILE, INITIAL_HISTORY);
  historyList.unshift(draftHistoryEntry);
  writeLocal(HISTORY_FILE, historyList);

  // Update local sections
  const list = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
  const index = list.findIndex(s => s.id === id);
  if (index >= 0) {
    list[index] = updatedSection;
  } else {
    list.push(updatedSection);
  }
  writeLocal(SECTIONS_FILE, list);

  return updatedSection;
}

export async function publishSection(id: string, authorName: string): Promise<Section | null> {
  const section = await getSectionById(id);
  if (!section) return null;

  const now = new Date().toISOString();
  const liveContent: SectionContent = { ...section.draft };

  // Create immutable snapshot in history with published status
  const historyEntry: SectionHistoryEntry = {
    id: 'hist-' + Math.random().toString(36).substring(2, 9),
    sectionId: id,
    timestamp: now,
    authorName,
    template: liveContent.template,
    title: liveContent.title,
    navLabel: liveContent.navLabel,
    subtitle: liveContent.subtitle,
    highlight: liveContent.highlight,
    body: liveContent.body,
    illustrationUrl: liveContent.illustrationUrl,
    status: 'published',
  };

  if (firestoreDb) {
    try {
      await firestoreDb.collection('sections').doc(id).collection('history').doc(historyEntry.id).set(historyEntry);
      await firestoreDb.collection('sections').doc(id).update({
        live: liveContent,
        updatedAt: now
      });
    } catch (e) {
      console.warn('Firestore publishSection fallback:', e);
    }
  }

  // Local storage sync
  const historyList = readLocal<SectionHistoryEntry[]>(HISTORY_FILE, INITIAL_HISTORY);
  historyList.unshift(historyEntry);
  writeLocal(HISTORY_FILE, historyList);

  const sectionsList = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
  const secIndex = sectionsList.findIndex(s => s.id === id);
  if (secIndex >= 0) {
    sectionsList[secIndex].live = liveContent;
    sectionsList[secIndex].updatedAt = now;
    writeLocal(SECTIONS_FILE, sectionsList);
    return sectionsList[secIndex];
  }

  return section;
}

export async function deleteSection(id: string): Promise<boolean> {
  if (firestoreDb) {
    try {
      await firestoreDb.collection('sections').doc(id).delete();
    } catch (e) {
      console.warn('Firestore deleteSection fallback:', e);
    }
  }

  const sectionsList = readLocal<Section[]>(SECTIONS_FILE, INITIAL_SECTIONS);
  const filtered = sectionsList.filter(s => s.id !== id);
  if (filtered.length === sectionsList.length) return false;
  writeLocal(SECTIONS_FILE, filtered);

  // Also remove history entries for this section
  const historyList = readLocal<SectionHistoryEntry[]>(HISTORY_FILE, INITIAL_HISTORY);
  const filteredHistory = historyList.filter(h => h.sectionId !== id);
  writeLocal(HISTORY_FILE, filteredHistory);

  return true;
}

export async function getSectionHistory(sectionId: string): Promise<SectionHistoryEntry[]> {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('sections').doc(sectionId).collection('history').orderBy('timestamp', 'desc').get();
      if (!snap.empty) {
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SectionHistoryEntry));
      }
    } catch (e) {
      console.warn('Firestore getSectionHistory fallback:', e);
    }
  }

  const historyList = readLocal<SectionHistoryEntry[]>(HISTORY_FILE, INITIAL_HISTORY);
  return historyList.filter(h => h.sectionId === sectionId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function restoreSectionDraft(sectionId: string, historyId: string): Promise<Section | null> {
  const historyList = await getSectionHistory(sectionId);
  const entry = historyList.find(h => h.id === historyId);
  if (!entry) return null;

  const restoredContent: SectionContent = {
    title: entry.title,
    navLabel: entry.navLabel,
    subtitle: entry.subtitle,
    highlight: entry.highlight,
    template: entry.template,
    body: entry.body,
    illustrationUrl: entry.illustrationUrl,
  };

  return await saveSectionDraft(sectionId, restoredContent);
}

// GALLERY
export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('gallery').get();
      if (!snap.empty) {
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
        return items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
      const initial = readLocal<GalleryItem[]>(GALLERY_FILE, INITIAL_GALLERY);
      for (const g of initial) {
        await firestoreDb.collection('gallery').doc(g.id).set(g);
      }
      return initial;
    } catch (e) {
      console.warn('Firestore getGalleryItems fallback:', e);
    }
  }

  const list = readLocal<GalleryItem[]>(GALLERY_FILE, INITIAL_GALLERY);
  return [...list].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

export async function addGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
  const id = 'gal-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const newItem: GalleryItem = {
    ...data,
    id,
    createdAt: now,
  };

  if (firestoreDb) {
    try {
      await firestoreDb.collection('gallery').doc(id).set(newItem);
    } catch (e) {
      console.warn('Firestore addGalleryItem fallback:', e);
    }
  }

  const list = readLocal<GalleryItem[]>(GALLERY_FILE, INITIAL_GALLERY);
  list.unshift(newItem);
  writeLocal(GALLERY_FILE, list);

  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  // Strip out undefined values to avoid Firestore rejection and local corruption
  const cleanUpdates: Partial<GalleryItem> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      (cleanUpdates as any)[key] = value;
    }
  }

  if (firestoreDb) {
    try {
      await firestoreDb.collection('gallery').doc(id).set(cleanUpdates, { merge: true });
    } catch (e) {
      console.warn('Firestore updateGalleryItem fallback:', e);
    }
  }

  const list = readLocal<GalleryItem[]>(GALLERY_FILE, INITIAL_GALLERY);
  const index = list.findIndex(g => g.id === id);
  if (index === -1) {
    if (firestoreDb) {
      try {
        const snap = await firestoreDb.collection('gallery').doc(id).get();
        if (snap.exists) {
          const item = { id, ...snap.data(), ...cleanUpdates } as GalleryItem;
          list.push(item);
          writeLocal(GALLERY_FILE, list);
          return item;
        }
      } catch (e) {
        console.warn('Firestore read fallback:', e);
      }
    }
    return null;
  }

  list[index] = { ...list[index], ...cleanUpdates };
  writeLocal(GALLERY_FILE, list);
  return list[index];
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  let firestoreSuccess = false;
  if (firestoreDb) {
    try {
      await firestoreDb.collection('gallery').doc(id).delete();
      firestoreSuccess = true;
    } catch (e) {
      console.warn('Firestore deleteGalleryItem fallback:', e);
    }
  }

  const list = readLocal<GalleryItem[]>(GALLERY_FILE, INITIAL_GALLERY);
  const filtered = list.filter(g => g.id !== id);
  writeLocal(GALLERY_FILE, filtered);

  return firestoreDb ? firestoreSuccess : true;
}

// SCHEDULE / ACTIVITIES
const INITIAL_ACTIVITIES: ScheduleActivity[] = [
  {
    id: 'act-1',
    time: '17:30',
    title: 'CHARLA',
    description: 'Pasado y presente de la huelga general por Ángel Carrique',
    status: 'published',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-2',
    time: '18:00',
    title: 'VEN Y ORGANIZA TU BARRIO',
    description: 'Pasado y presente de la huelga general por Ángel Carrique',
    status: 'published',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-3',
    time: '19:00',
    title: 'CONCENTRACIÓN',
    description: 'Pasado y presente de la huelga general por Ángel Carrique',
    status: 'published',
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-4',
    time: '20:00',
    title: 'ASAMBLEA',
    description: '',
    status: 'published',
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'act-5',
    time: '20:00',
    title: 'REUNIÓN',
    description: 'de la Comisión de Actividades',
    status: 'published',
    order: 5,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Calculates the most recent 00:00 (midnight) cutoff timestamp in Spain (Europe/Madrid).
 * Any activity published before this timestamp belongs to a previous daily cycle.
 */
export function getMadridMidnightCutoff(now = new Date()): Date {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const dateStr = dtf.format(now);
  const [year, month, day] = dateStr.split('-').map(Number);

  // Search exact UTC time corresponding to 00:00:00 Europe/Madrid for today
  for (let h = 20; h <= 26; h++) {
    const testDate = new Date(Date.UTC(year, month - 1, day - 1, h, 0, 0, 0));
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(testDate);
    const mDay = Number(parts.find(p => p.type === 'day')?.value);
    const mHour = Number(parts.find(p => p.type === 'hour')?.value);
    const mMin = Number(parts.find(p => p.type === 'minute')?.value);
    if (mDay === day && mHour === 0 && mMin === 0) {
      return testDate;
    }
  }
  return new Date(Date.UTC(year, month - 1, day - 1, 22, 0, 0, 0));
}

// Backward-compatible alias
export const getMadrid4amCutoff = getMadridMidnightCutoff;

/**
 * Checks all activities and transitions any activity published before 00:00 (midnight) into 'draft' status.
 */
export async function checkAndResetExpiredActivities(): Promise<number> {
  const cutoff = getMadridMidnightCutoff();
  let updatedCount = 0;
  const expiredFirestoreIds: string[] = [];

  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('activities').get();
      if (!snap.empty) {
        const batch = firestoreDb.batch();
        for (const doc of snap.docs) {
          const act = doc.data() as ScheduleActivity;
          if (act.status === 'published') {
            const actTime = new Date(act.updatedAt || act.createdAt || 0).getTime();
            if (actTime < cutoff.getTime()) {
              batch.update(doc.ref, {
                status: 'draft',
                updatedAt: new Date().toISOString(),
              });
              expiredFirestoreIds.push(doc.id);
              updatedCount++;
            }
          }
        }
        if (expiredFirestoreIds.length > 0) {
          await batch.commit();
        }
      }
    } catch (e) {
      console.warn('Firestore checkAndResetExpiredActivities fallback:', e);
    }
  }

  const list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
  let localUpdated = false;

  for (const act of list) {
    if (act.status === 'published') {
      const actTime = new Date(act.updatedAt || act.createdAt || 0).getTime();
      if (actTime < cutoff.getTime()) {
        act.status = 'draft';
        act.updatedAt = new Date().toISOString();
        if (!expiredFirestoreIds.includes(act.id)) {
          updatedCount++;
        }
        localUpdated = true;
      }
    }
  }

  if (localUpdated) {
    writeLocal(ACTIVITIES_FILE, list);
  }

  return updatedCount;
}

// Background check every 5 minutes in running Node process
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    checkAndResetExpiredActivities().catch(() => {});
  }, 5 * 60 * 1000);
}

export async function getActivities(publishedOnly = false): Promise<ScheduleActivity[]> {
  // Automatically rollover any activities from before midnight (00:00)
  await checkAndResetExpiredActivities();

  let list: ScheduleActivity[] = [];
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('activities').get();
      if (!snap.empty) {
        list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleActivity));
      } else {
        const initial = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
        for (const a of initial) {
          await firestoreDb.collection('activities').doc(a.id).set(a);
        }
        list = initial;
      }
    } catch (e) {
      console.warn('Firestore getActivities fallback:', e);
      list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
    }
  } else {
    list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
  }

  if (publishedOnly) {
    list = list.filter(a => a.status === 'published');
  }

  return list.sort((a, b) => (a.order - b.order) || a.time.localeCompare(b.time));
}

export async function saveActivity(data: {
  id?: string;
  time: string;
  title: string;
  description?: string;
  status?: 'published' | 'draft';
  order?: number;
}): Promise<ScheduleActivity> {
  const now = new Date().toISOString();
  const list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);

  let item: ScheduleActivity;
  if (data.id) {
    const index = list.findIndex(a => a.id === data.id);
    if (index >= 0) {
      item = {
        ...list[index],
        time: data.time ?? list[index].time,
        title: data.title ?? list[index].title,
        description: data.description ?? list[index].description,
        status: data.status ?? list[index].status,
        order: data.order ?? list[index].order,
        updatedAt: now,
      };
      list[index] = item;
    } else {
      item = {
        id: data.id,
        time: data.time,
        title: data.title,
        description: data.description || '',
        status: data.status || 'published',
        order: data.order ?? (list.length + 1),
        createdAt: now,
        updatedAt: now,
      };
      list.push(item);
    }
  } else {
    const id = 'act-' + Math.random().toString(36).substring(2, 9);
    item = {
      id,
      time: data.time,
      title: data.title,
      description: data.description || '',
      status: data.status || 'published',
      order: data.order ?? (list.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    list.push(item);
  }

  if (firestoreDb) {
    try {
      await firestoreDb.collection('activities').doc(item.id).set(item, { merge: true });
    } catch (e) {
      console.warn('Firestore saveActivity fallback:', e);
    }
  }

  writeLocal(ACTIVITIES_FILE, list);
  return item;
}

export async function updateActivityStatus(id: string, status: 'published' | 'draft'): Promise<boolean> {
  const now = new Date().toISOString();
  let firestoreSuccess = false;
  if (firestoreDb) {
    try {
      await firestoreDb.collection('activities').doc(id).update({ status, updatedAt: now });
      firestoreSuccess = true;
    } catch (e) {
      console.warn('Firestore updateActivityStatus fallback:', e);
    }
  }

  const list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
  const index = list.findIndex(a => a.id === id);
  if (index >= 0) {
    list[index].status = status;
    list[index].updatedAt = now;
    writeLocal(ACTIVITIES_FILE, list);
    return true;
  }

  return firestoreSuccess;
}

export async function deleteDraftActivities(ids: string[]): Promise<{ deleted: number; notAllowed: number }> {
  const targetIds = new Set(ids);
  let fsDeletedCount = 0;
  let fsNotAllowedCount = 0;

  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('activities').get();
      if (!snap.empty) {
        const batch = firestoreDb.batch();
        for (const doc of snap.docs) {
          if (targetIds.has(doc.id)) {
            const data = doc.data() as ScheduleActivity;
            if (data.status === 'draft') {
              batch.delete(doc.ref);
              fsDeletedCount++;
            } else {
              fsNotAllowedCount++;
            }
          }
        }
        if (fsDeletedCount > 0) {
          await batch.commit();
        }
      }
    } catch (e) {
      console.warn('Firestore deleteDraftActivities fallback:', e);
    }
  }

  const list = readLocal<ScheduleActivity[]>(ACTIVITIES_FILE, INITIAL_ACTIVITIES);
  const draftsToDelete = list.filter(a => targetIds.has(a.id) && a.status === 'draft');
  const publishedAttempted = list.filter(a => targetIds.has(a.id) && a.status === 'published');

  const draftIdsSet = new Set(draftsToDelete.map(d => d.id));
  const remaining = list.filter(a => !draftIdsSet.has(a.id));
  writeLocal(ACTIVITIES_FILE, remaining);

  if (firestoreDb) {
    return {
      deleted: fsDeletedCount,
      notAllowed: fsNotAllowedCount,
    };
  }

  return {
    deleted: draftsToDelete.length,
    notAllowed: publishedAttempted.length,
  };
}

