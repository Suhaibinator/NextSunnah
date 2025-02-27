import { bukhariHadiths, muslimHadiths, nawawi40Hadiths, getHadithsByChapter, getHadithById } from '@/data/hadiths';
import { Hadith } from '@/types';

describe('Hadiths data', () => {
  test('should have valid hadith data for Bukhari', () => {
    // Check if bukhariHadiths array exists and has items
    expect(bukhariHadiths).toBeDefined();
    expect(Array.isArray(bukhariHadiths)).toBe(true);
    expect(bukhariHadiths.length).toBeGreaterThan(0);
    
    // Test each hadith has required properties
    bukhariHadiths.forEach((hadith: Hadith) => {
      expect(hadith).toHaveProperty('id');
      expect(hadith).toHaveProperty('collectionId');
      expect(hadith).toHaveProperty('bookId');
      expect(hadith).toHaveProperty('chapterId');
      expect(hadith).toHaveProperty('number');
      expect(hadith).toHaveProperty('text');
      expect(hadith).toHaveProperty('textArabic');
      
      // Check types
      expect(typeof hadith.id).toBe('string');
      expect(typeof hadith.collectionId).toBe('string');
      expect(typeof hadith.bookId).toBe('string');
      expect(typeof hadith.chapterId).toBe('string');
      expect(typeof hadith.number).toBe('number');
      expect(typeof hadith.text).toBe('string');
      expect(typeof hadith.textArabic).toBe('string');
      
      // Check non-empty values
      expect(hadith.id).not.toBe('');
      expect(hadith.collectionId).toBe('bukhari');
      expect(hadith.bookId).not.toBe('');
      expect(hadith.chapterId).not.toBe('');
      expect(hadith.number).toBeGreaterThan(0);
      expect(hadith.text).not.toBe('');
      expect(hadith.textArabic).not.toBe('');
      
      // Check if IDs follow the correct format
      expect(hadith.id).toMatch(/^bukhari-\d+-\d+$/);
      expect(hadith.bookId).toMatch(/^bukhari-\d+$/);
      expect(hadith.chapterId).toMatch(/^bukhari-\d+-\d+$/);
    });
  });

  test('should have valid hadith data for Muslim', () => {
    // Check if muslimHadiths array exists and has items
    expect(muslimHadiths).toBeDefined();
    expect(Array.isArray(muslimHadiths)).toBe(true);
    expect(muslimHadiths.length).toBeGreaterThan(0);
    
    // Test each hadith has required properties and correct collectionId
    muslimHadiths.forEach((hadith: Hadith) => {
      expect(hadith).toHaveProperty('id');
      expect(hadith.collectionId).toBe('muslim');
      expect(hadith.id).toMatch(/^muslim-\d+-\d+$/);
      expect(hadith.bookId).toMatch(/^muslim-\d+$/);
      expect(hadith.chapterId).toMatch(/^muslim-\d+-\d+$/);
    });
  });

  test('should have valid hadith data for Nawawi 40', () => {
    // Check if nawawi40Hadiths array exists and has items
    expect(nawawi40Hadiths).toBeDefined();
    expect(Array.isArray(nawawi40Hadiths)).toBe(true);
    expect(nawawi40Hadiths.length).toBeGreaterThan(0);
    
    // Test each hadith has required properties and correct collectionId
    nawawi40Hadiths.forEach((hadith: Hadith) => {
      expect(hadith).toHaveProperty('id');
      expect(hadith.collectionId).toBe('nawawi40');
      expect(hadith.id).toMatch(/^nawawi40-\d+-\d+$/);
      expect(hadith.bookId).toMatch(/^nawawi40-\d+$/);
      expect(hadith.chapterId).toMatch(/^nawawi40-\d+-\d+$/);
    });
  });
  
  test('should have unique hadith IDs across all collections', () => {
    const allHadiths = [...bukhariHadiths, ...muslimHadiths, ...nawawi40Hadiths];
    const allIds = allHadiths.map(hadith => hadith.id);
    
    // Check if all IDs are unique
    expect(allIds.length).toBe(new Set(allIds).size);
  });
  
  test('getHadithsByChapter should return correct hadiths', () => {
    // Test with valid chapter IDs
    const bukhariChapter1Hadiths = bukhariHadiths.filter(hadith => hadith.chapterId === 'bukhari-1-1');
    expect(getHadithsByChapter('bukhari-1-1')).toEqual(bukhariChapter1Hadiths);
    
    const muslimChapter1Hadiths = muslimHadiths.filter(hadith => hadith.chapterId === 'muslim-1-1');
    expect(getHadithsByChapter('muslim-1-1')).toEqual(muslimChapter1Hadiths);
    
    const nawawi40Chapter1Hadiths = nawawi40Hadiths.filter(hadith => hadith.chapterId === 'nawawi40-1-1');
    expect(getHadithsByChapter('nawawi40-1-1')).toEqual(nawawi40Chapter1Hadiths);
    
    // Test with invalid chapter ID
    expect(getHadithsByChapter('invalid-id')).toEqual([]);
  });
  
  test('getHadithById should return correct hadith', () => {
    // Test with valid hadith IDs
    if (bukhariHadiths.length > 0) {
      const hadith = bukhariHadiths[0];
      expect(getHadithById(hadith.id)).toEqual(hadith);
    }
    
    if (muslimHadiths.length > 0) {
      const hadith = muslimHadiths[0];
      expect(getHadithById(hadith.id)).toEqual(hadith);
    }
    
    if (nawawi40Hadiths.length > 0) {
      const hadith = nawawi40Hadiths[0];
      expect(getHadithById(hadith.id)).toEqual(hadith);
    }
    
    // Test with invalid hadith ID
    expect(getHadithById('invalid-id')).toBeUndefined();
  });
  
  test('hadiths should have narrator and grade properties', () => {
    // Check if hadiths have narrator and grade properties
    bukhariHadiths.forEach(hadith => {
      expect(hadith).toHaveProperty('narrator');
      expect(hadith).toHaveProperty('grade');
      
      if (hadith.narrator) {
        expect(typeof hadith.narrator).toBe('string');
        expect(hadith.narrator).not.toBe('');
      }
      
      if (hadith.grade) {
        expect(typeof hadith.grade).toBe('string');
        expect(hadith.grade).not.toBe('');
      }
    });
  });
  
  test('hadith numbers should be unique within each collection', () => {
    // Group hadiths by bookId
    const bukhariBookHadiths = new Map<string, Hadith[]>();
    
    bukhariHadiths.forEach(hadith => {
      if (!bukhariBookHadiths.has(hadith.bookId)) {
        bukhariBookHadiths.set(hadith.bookId, []);
      }
      bukhariBookHadiths.get(hadith.bookId)?.push(hadith);
    });
    
    // Check if hadith numbers are unique within each book
    bukhariBookHadiths.forEach(hadiths => {
      const numbers = hadiths.map(hadith => hadith.number);
      expect(numbers.length).toBe(new Set(numbers).size);
    });
  });
});
