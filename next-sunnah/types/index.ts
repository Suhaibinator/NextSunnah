// Collection (e.g., Sahih al-Bukhari)
export interface Collection {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  bookCount: number;
  hadithCount: number;
  // Additional fields from the API
  hasBooks?: boolean;
  hasChapters?: boolean;
  totalAvailableHadith?: number;
  shortIntro?: string;
}

// Book (e.g., Book of Revelation)
export interface Book {
  id: string;
  collectionId: string;
  name: string;
  nameArabic: string;
  hadithCount: number;
  chapterCount: number;
  number: number;
}

// Chapter
export interface Chapter {
  id: string;
  bookId: string;
  name: string;
  nameArabic: string;
  number: number;
  intro?: string;
  ending?: string;
}

// Hadith
export interface Hadith {
  id: string;
  collectionId: string;
  bookId: string;
  chapterId: string;
  number: number;
  text: string;
  textArabic: string;
  grade?: string;
  narrator?: string;
  chapterNumber?: string;
  chapterTitle?: string;
  urn?: number;
  grades?: {
    graded_by: string;
    grade: string;
  }[];
}
