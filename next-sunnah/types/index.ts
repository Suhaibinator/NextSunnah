// Collection (e.g., Sahih al-Bukhari)
export interface Collection {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  bookCount: number;
  hadithCount: number;
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
}
