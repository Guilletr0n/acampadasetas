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

export type SectionTemplate = 'single-column' | 'multi-column';

export interface SectionContent {
  title: string;
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
  subtitle?: string;
  highlight?: string;
  body: string;
  illustrationUrl?: string;
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
