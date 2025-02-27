import { Book } from "@/types";

export const bukhariBooks: Book[] = [
  {
    id: "bukhari-1",
    collectionId: "bukhari",
    name: "Revelation",
    nameArabic: "كتاب بدء الوحي",
    hadithCount: 7,
    chapterCount: 1,
    number: 1,
  },
  {
    id: "bukhari-2",
    collectionId: "bukhari",
    name: "Belief",
    nameArabic: "كتاب الإيمان",
    hadithCount: 64,
    chapterCount: 42,
    number: 2,
  },
  {
    id: "bukhari-3",
    collectionId: "bukhari",
    name: "Knowledge",
    nameArabic: "كتاب العلم",
    hadithCount: 75,
    chapterCount: 53,
    number: 3,
  },
  {
    id: "bukhari-4",
    collectionId: "bukhari",
    name: "Ablutions (Wudu')",
    nameArabic: "كتاب الوضوء",
    hadithCount: 111,
    chapterCount: 75,
    number: 4,
  },
  {
    id: "bukhari-5",
    collectionId: "bukhari",
    name: "Bathing (Ghusl)",
    nameArabic: "كتاب الغسل",
    hadithCount: 29,
    chapterCount: 28,
    number: 5,
  },
];

export const muslimBooks: Book[] = [
  {
    id: "muslim-1",
    collectionId: "muslim",
    name: "Faith",
    nameArabic: "كتاب الإيمان",
    hadithCount: 432,
    chapterCount: 96,
    number: 1,
  },
  {
    id: "muslim-2",
    collectionId: "muslim",
    name: "Purification",
    nameArabic: "كتاب الطهارة",
    hadithCount: 111,
    chapterCount: 34,
    number: 2,
  },
  {
    id: "muslim-3",
    collectionId: "muslim",
    name: "Menstruation",
    nameArabic: "كتاب الحيض",
    hadithCount: 126,
    chapterCount: 33,
    number: 3,
  },
];

export const nawawi40Books: Book[] = [
  {
    id: "nawawi40-1",
    collectionId: "nawawi40",
    name: "Forty Hadith",
    nameArabic: "الأربعون حديثا",
    hadithCount: 42,
    chapterCount: 1,
    number: 1,
  },
];

// Helper function to get books by collection ID
export function getBooksByCollection(collectionId: string): Book[] {
  switch (collectionId) {
    case "bukhari":
      return bukhariBooks;
    case "muslim":
      return muslimBooks;
    case "nawawi40":
      return nawawi40Books;
    default:
      return [];
  }
}
