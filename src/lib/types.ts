export type UserRole = 'admin' | 'editor' | 'reader';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  approved: boolean;
  password?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SectionTemplate = 'single-column' | 'multi-column' | 'schedule' | 'horario-actividades' | (string & {});

export interface ScheduleActivity {
  id: string;
  time: string;
  title: string;
  description?: string;
  status: 'published' | 'draft';
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SectionContent {
  title: string;
  navLabel?: string;
  subtitle?: string;
  highlight?: string;
  template: SectionTemplate;
  body: string;
  illustrationUrl?: string;
}

export interface Section {
  id: string;
  slug: string;
  order: number;
  live: SectionContent | null;
  draft: SectionContent;
  updatedAt: string;
}

export interface SectionHistoryEntry {
  id: string;
  sectionId: string;
  timestamp: string;
  authorName: string;
  template: SectionTemplate;
  title: string;
  navLabel?: string;
  subtitle?: string;
  highlight?: string;
  body: string;
  illustrationUrl?: string;
  status: 'published' | 'draft';
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  author: string;
  social?: string;
  order: number;
  createdAt: string;
}
