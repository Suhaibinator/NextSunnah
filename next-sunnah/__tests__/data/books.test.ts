import { bukhariBooks, muslimBooks, nawawi40Books, getBooksByCollection } from '@/data/books';
import { Book } from '@/types';

describe('Books data', () => {
  test('should have valid book data for Bukhari', () => {
    // Check if bukhariBooks array exists and has items
    expect(bukhariBooks).toBeDefined();
    expect(Array.isArray(bukhariBooks)).toBe(true);
    expect(bukhariBooks.length).toBeGreaterThan(0);
    
    // Test each book has required properties
    bukhariBooks.forEach((book: Book) => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('collectionId');
      expect(book).toHaveProperty('name');
      expect(book).toHaveProperty('nameArabic');
      expect(book).toHaveProperty('hadithCount');
      expect(book).toHaveProperty('chapterCount');
      expect(book).toHaveProperty('number');
      
      // Check types
      expect(typeof book.id).toBe('string');
      expect(typeof book.collectionId).toBe('string');
      expect(typeof book.name).toBe('string');
      expect(typeof book.nameArabic).toBe('string');
      expect(typeof book.hadithCount).toBe('number');
      expect(typeof book.chapterCount).toBe('number');
      expect(typeof book.number).toBe('number');
      
      // Check non-empty values
      expect(book.id).not.toBe('');
      expect(book.collectionId).toBe('bukhari');
      expect(book.name).not.toBe('');
      expect(book.nameArabic).not.toBe('');
      expect(book.hadithCount).toBeGreaterThan(0);
      expect(book.chapterCount).toBeGreaterThan(0);
      expect(book.number).toBeGreaterThan(0);
    });
  });

  test('should have valid book data for Muslim', () => {
    // Check if muslimBooks array exists and has items
    expect(muslimBooks).toBeDefined();
    expect(Array.isArray(muslimBooks)).toBe(true);
    expect(muslimBooks.length).toBeGreaterThan(0);
    
    // Test each book has required properties and correct collectionId
    muslimBooks.forEach((book: Book) => {
      expect(book).toHaveProperty('id');
      expect(book.collectionId).toBe('muslim');
      expect(book.hadithCount).toBeGreaterThan(0);
      expect(book.chapterCount).toBeGreaterThan(0);
    });
  });

  test('should have valid book data for Nawawi 40', () => {
    // Check if nawawi40Books array exists and has items
    expect(nawawi40Books).toBeDefined();
    expect(Array.isArray(nawawi40Books)).toBe(true);
    expect(nawawi40Books.length).toBeGreaterThan(0);
    
    // Test each book has required properties and correct collectionId
    nawawi40Books.forEach((book: Book) => {
      expect(book).toHaveProperty('id');
      expect(book.collectionId).toBe('nawawi40');
      expect(book.hadithCount).toBeGreaterThan(0);
      expect(book.chapterCount).toBeGreaterThan(0);
    });
  });
  
  test('should have unique book IDs within each collection', () => {
    const bukhariIds = bukhariBooks.map(book => book.id);
    const muslimIds = muslimBooks.map(book => book.id);
    const nawawi40Ids = nawawi40Books.map(book => book.id);
    
    // Check if all IDs are unique within each collection
    expect(bukhariIds.length).toBe(new Set(bukhariIds).size);
    expect(muslimIds.length).toBe(new Set(muslimIds).size);
    expect(nawawi40Ids.length).toBe(new Set(nawawi40Ids).size);
  });
  
  test('getBooksByCollection should return correct books', () => {
    // Test with valid collection IDs
    expect(getBooksByCollection('bukhari')).toEqual(bukhariBooks);
    expect(getBooksByCollection('muslim')).toEqual(muslimBooks);
    expect(getBooksByCollection('nawawi40')).toEqual(nawawi40Books);
    
    // Test with invalid collection ID
    expect(getBooksByCollection('invalid-id')).toEqual([]);
  });
  
  test('book IDs should follow the correct format', () => {
    // Check if book IDs follow the format: collectionId-number
    bukhariBooks.forEach(book => {
      expect(book.id).toMatch(/^bukhari-\d+$/);
    });
    
    muslimBooks.forEach(book => {
      expect(book.id).toMatch(/^muslim-\d+$/);
    });
    
    nawawi40Books.forEach(book => {
      expect(book.id).toMatch(/^nawawi40-\d+$/);
    });
  });
});
