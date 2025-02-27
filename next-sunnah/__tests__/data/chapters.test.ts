import { bukhariChapters, muslimChapters, nawawi40Chapters, getChaptersByBook } from '@/data/chapters';
import { Chapter } from '@/types';

describe('Chapters data', () => {
  test('should have valid chapter data for Bukhari', () => {
    // Check if bukhariChapters array exists and has items
    expect(bukhariChapters).toBeDefined();
    expect(Array.isArray(bukhariChapters)).toBe(true);
    expect(bukhariChapters.length).toBeGreaterThan(0);
    
    // Test each chapter has required properties
    bukhariChapters.forEach((chapter: Chapter) => {
      expect(chapter).toHaveProperty('id');
      expect(chapter).toHaveProperty('bookId');
      expect(chapter).toHaveProperty('name');
      expect(chapter).toHaveProperty('nameArabic');
      expect(chapter).toHaveProperty('number');
      
      // Check types
      expect(typeof chapter.id).toBe('string');
      expect(typeof chapter.bookId).toBe('string');
      expect(typeof chapter.name).toBe('string');
      expect(typeof chapter.nameArabic).toBe('string');
      expect(typeof chapter.number).toBe('number');
      
      // Check non-empty values
      expect(chapter.id).not.toBe('');
      expect(chapter.bookId).not.toBe('');
      expect(chapter.name).not.toBe('');
      expect(chapter.nameArabic).not.toBe('');
      expect(chapter.number).toBeGreaterThan(0);
      
      // Check if bookId follows the correct format
      expect(chapter.bookId).toMatch(/^bukhari-\d+$/);
      
      // Check if id follows the correct format
      expect(chapter.id).toMatch(/^bukhari-\d+-\d+$/);
    });
  });

  test('should have valid chapter data for Muslim', () => {
    // Check if muslimChapters array exists and has items
    expect(muslimChapters).toBeDefined();
    expect(Array.isArray(muslimChapters)).toBe(true);
    expect(muslimChapters.length).toBeGreaterThan(0);
    
    // Test each chapter has required properties
    muslimChapters.forEach((chapter: Chapter) => {
      expect(chapter).toHaveProperty('id');
      expect(chapter.bookId).toMatch(/^muslim-\d+$/);
      expect(chapter.id).toMatch(/^muslim-\d+-\d+$/);
      expect(chapter.number).toBeGreaterThan(0);
    });
  });

  test('should have valid chapter data for Nawawi 40', () => {
    // Check if nawawi40Chapters array exists and has items
    expect(nawawi40Chapters).toBeDefined();
    expect(Array.isArray(nawawi40Chapters)).toBe(true);
    expect(nawawi40Chapters.length).toBeGreaterThan(0);
    
    // Test each chapter has required properties
    nawawi40Chapters.forEach((chapter: Chapter) => {
      expect(chapter).toHaveProperty('id');
      expect(chapter.bookId).toMatch(/^nawawi40-\d+$/);
      expect(chapter.id).toMatch(/^nawawi40-\d+-\d+$/);
      expect(chapter.number).toBeGreaterThan(0);
    });
  });
  
  test('should have unique chapter IDs within each collection', () => {
    const bukhariIds = bukhariChapters.map(chapter => chapter.id);
    const muslimIds = muslimChapters.map(chapter => chapter.id);
    const nawawi40Ids = nawawi40Chapters.map(chapter => chapter.id);
    
    // Check if all IDs are unique within each collection
    expect(bukhariIds.length).toBe(new Set(bukhariIds).size);
    expect(muslimIds.length).toBe(new Set(muslimIds).size);
    expect(nawawi40Ids.length).toBe(new Set(nawawi40Ids).size);
  });
  
  test('getChaptersByBook should return correct chapters', () => {
    // Test with valid book IDs
    const bukhariBook1Chapters = bukhariChapters.filter(chapter => chapter.bookId === 'bukhari-1');
    expect(getChaptersByBook('bukhari-1')).toEqual(bukhariBook1Chapters);
    
    const bukhariBook2Chapters = bukhariChapters.filter(chapter => chapter.bookId === 'bukhari-2');
    expect(getChaptersByBook('bukhari-2')).toEqual(bukhariBook2Chapters);
    
    const muslimBook1Chapters = muslimChapters.filter(chapter => chapter.bookId === 'muslim-1');
    expect(getChaptersByBook('muslim-1')).toEqual(muslimBook1Chapters);
    
    const nawawi40Book1Chapters = nawawi40Chapters.filter(chapter => chapter.bookId === 'nawawi40-1');
    expect(getChaptersByBook('nawawi40-1')).toEqual(nawawi40Book1Chapters);
    
    // Test with invalid book ID
    expect(getChaptersByBook('invalid-id')).toEqual([]);
  });
  
  test('chapter numbers should be sequential within each book', () => {
    // Group chapters by bookId
    const bukhariBookChapters = new Map<string, Chapter[]>();
    
    bukhariChapters.forEach(chapter => {
      if (!bukhariBookChapters.has(chapter.bookId)) {
        bukhariBookChapters.set(chapter.bookId, []);
      }
      bukhariBookChapters.get(chapter.bookId)?.push(chapter);
    });
    
    // Check if chapter numbers are sequential within each book
    bukhariBookChapters.forEach(chapters => {
      // Sort chapters by number
      const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);
      
      // Check if the first chapter number is 1
      if (sortedChapters.length > 0) {
        expect(sortedChapters[0].number).toBe(1);
      }
      
      // Check if chapter numbers are sequential
      for (let i = 1; i < sortedChapters.length; i++) {
        expect(sortedChapters[i].number).toBe(sortedChapters[i-1].number + 1);
      }
    });
  });
});
