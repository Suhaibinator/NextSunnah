import { collections } from '@/data/collections';
import { Collection } from '@/types';

describe('Collections data', () => {
  test('should have valid collection data', () => {
    // Check if collections array exists and has items
    expect(collections).toBeDefined();
    expect(Array.isArray(collections)).toBe(true);
    expect(collections.length).toBeGreaterThan(0);
    
    // Test each collection has required properties
    collections.forEach((collection: Collection) => {
      expect(collection).toHaveProperty('id');
      expect(collection).toHaveProperty('name');
      expect(collection).toHaveProperty('nameArabic');
      expect(collection).toHaveProperty('description');
      expect(collection).toHaveProperty('bookCount');
      expect(collection).toHaveProperty('hadithCount');
      
      // Check types
      expect(typeof collection.id).toBe('string');
      expect(typeof collection.name).toBe('string');
      expect(typeof collection.nameArabic).toBe('string');
      expect(typeof collection.description).toBe('string');
      expect(typeof collection.bookCount).toBe('number');
      expect(typeof collection.hadithCount).toBe('number');
      
      // Check non-empty values
      expect(collection.id).not.toBe('');
      expect(collection.name).not.toBe('');
      expect(collection.nameArabic).not.toBe('');
      expect(collection.description).not.toBe('');
      expect(collection.bookCount).toBeGreaterThan(0);
      expect(collection.hadithCount).toBeGreaterThan(0);
    });
  });
  
  test('should have unique collection IDs', () => {
    const ids = collections.map(collection => collection.id);
    const uniqueIds = new Set(ids);
    
    // Check if all IDs are unique
    expect(ids.length).toBe(uniqueIds.size);
  });
  
  test('should include major hadith collections', () => {
    const collectionIds = collections.map(collection => collection.id);
    
    // Check for presence of major collections
    expect(collectionIds).toContain('bukhari');
    expect(collectionIds).toContain('muslim');
    
    // Find Bukhari collection
    const bukhari = collections.find(c => c.id === 'bukhari');
    expect(bukhari).toBeDefined();
    expect(bukhari?.name).toBe('Sahih al-Bukhari');
  });
});
