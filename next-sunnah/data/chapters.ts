import { Chapter } from "@/types";

export const bukhariChapters: Chapter[] = [
  // Revelation (Book 1)
  {
    id: "bukhari-1-1",
    bookId: "bukhari-1",
    name: "How the Divine Revelation started being revealed to Allah's Messenger",
    nameArabic: "كَيْفَ كَانَ بَدْءُ الْوَحْىِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم",
    number: 1,
  },

  // Belief (Book 2) - First few chapters
  {
    id: "bukhari-2-1",
    bookId: "bukhari-2",
    name: "The statement of the Prophet: \"Islam is based on five principles\"",
    nameArabic: "قَوْلُ النَّبِيِّ صلى الله عليه وسلم \" بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ \"",
    number: 1,
  },
  {
    id: "bukhari-2-2",
    bookId: "bukhari-2",
    name: "Your invocation means your faith",
    nameArabic: "أُمُورُ الإِيمَانِ",
    number: 2,
  },
  {
    id: "bukhari-2-3",
    bookId: "bukhari-2",
    name: "A Muslim is the one who avoids harming Muslims with his tongue and hands",
    nameArabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    number: 3,
  },

  // Knowledge (Book 3) - First few chapters
  {
    id: "bukhari-3-1",
    bookId: "bukhari-3",
    name: "The superiority of knowledge",
    nameArabic: "فَضْلُ الْعِلْمِ",
    number: 1,
  },
  {
    id: "bukhari-3-2",
    bookId: "bukhari-3",
    name: "Whoever Allah wants to do good to, he gives him the understanding of the religion",
    nameArabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    number: 2,
  },
];

export const muslimChapters: Chapter[] = [
  // Faith (Book 1) - First few chapters
  {
    id: "muslim-1-1",
    bookId: "muslim-1",
    name: "What is Islam and its characteristics",
    nameArabic: "بَيَانِ الْإِيمَانِ وَالْإِسْلاَمِ وَالْإِحْسَانِ",
    number: 1,
  },
  {
    id: "muslim-1-2",
    bookId: "muslim-1",
    name: "Prayers",
    nameArabic: "بَيَانِ الصَّلَوَاتِ الَّتِي هِيَ أَحَدُ أَرْكَانِ الْإِسْلاَمِ",
    number: 2,
  },
];

export const nawawi40Chapters: Chapter[] = [
  {
    id: "nawawi40-1-1",
    bookId: "nawawi40-1",
    name: "Forty Hadith of Imam Nawawi",
    nameArabic: "الأربعون النووية",
    number: 1,
  },
];

// Helper function to get chapters by book ID
export function getChaptersByBook(bookId: string): Chapter[] {
  if (bookId.startsWith("bukhari")) {
    return bukhariChapters.filter(chapter => chapter.bookId === bookId);
  } else if (bookId.startsWith("muslim")) {
    return muslimChapters.filter(chapter => chapter.bookId === bookId);
  } else if (bookId.startsWith("nawawi40")) {
    return nawawi40Chapters.filter(chapter => chapter.bookId === bookId);
  }
  return [];
}
