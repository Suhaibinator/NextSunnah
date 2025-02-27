import React from 'react';
import { render, screen } from '@/test-utils';
import HadithPage from '@/app/collections/[collectionId]/[bookId]/[hadithId]/page';
import { collections } from '@/data/collections';
import { getBooksByCollection } from '@/data/books';
import { getChaptersByBook } from '@/data/chapters';
import { getHadithById } from '@/data/hadiths';
import { notFound } from 'next/navigation';

// Mock the collections data
jest.mock('@/data/collections', () => ({
  collections: [
    {
      id: 'test-collection',
      name: 'Test Collection',
      nameArabic: 'اختبار المجموعة',
      description: 'This is a test collection description',
      bookCount: 10,
      hadithCount: 500,
    },
  ],
}));

// Mock the books data
jest.mock('@/data/books', () => ({
  getBooksByCollection: jest.fn(() => [
    {
      id: 'test-book',
      collectionId: 'test-collection',
      name: 'Test Book',
      nameArabic: 'اختبار الكتاب',
      hadithCount: 100,
      chapterCount: 10,
      number: 1,
    },
  ]),
}));

// Mock the chapters data
jest.mock('@/data/chapters', () => ({
  getChaptersByBook: jest.fn(() => [
    {
      id: 'test-chapter',
      bookId: 'test-book',
      name: 'Test Chapter',
      nameArabic: 'اختبار الفصل',
      number: 1,
    },
  ]),
}));

// Mock the hadiths data
jest.mock('@/data/hadiths', () => ({
  getHadithById: jest.fn((hadithId) => {
    if (hadithId === 'test-hadith') {
      return {
        id: 'test-hadith',
        collectionId: 'test-collection',
        bookId: 'test-book',
        chapterId: 'test-chapter',
        number: 42,
        text: 'Test hadith text',
        textArabic: 'اختبار نص الحديث',
        grade: 'Sahih',
        narrator: 'Test Narrator',
      };
    }
    return undefined;
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('HadithPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders hadith information correctly', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
        hadithId: 'test-hadith',
      }),
    };

    render(await HadithPage(props));
    
    // Check if collection and book names are rendered in the breadcrumb
    expect(screen.getByText('Test Collection > Test Book > Test Chapter')).toBeInTheDocument();
    
    // Check if hadith number is rendered
    expect(screen.getByText('Hadith 42')).toBeInTheDocument();
    
    // Check if hadith grade is rendered
    expect(screen.getByText('Sahih')).toBeInTheDocument();
    
    // Check if narrator is rendered
    expect(screen.getByText('Test Narrator')).toBeInTheDocument();
    
    // Check if hadith text is rendered
    expect(screen.getByText('Test hadith text')).toBeInTheDocument();
    
    // Check if hadith Arabic text is rendered
    expect(screen.getByText('اختبار نص الحديث')).toBeInTheDocument();
    
    // Check if back link is rendered
    const backLink = screen.getByText('← Back to Test Book');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/collections/test-collection/test-book');
  });
  
  test('calls notFound when collection is not found', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'non-existent-collection',
        bookId: 'test-book',
        hadithId: 'test-hadith',
      }),
    };

    await HadithPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('calls notFound when book is not found', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'non-existent-book',
        hadithId: 'test-hadith',
      }),
    };

    await HadithPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('calls notFound when hadith is not found', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
        hadithId: 'non-existent-hadith',
      }),
    };

    await HadithPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('renders correctly when chapter is not found', async () => {
    // Mock getChaptersByBook to return an empty array
    require('@/data/chapters').getChaptersByBook.mockReturnValueOnce([]);
    
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
        hadithId: 'test-hadith',
      }),
    };

    render(await HadithPage(props));
    
    // Check if breadcrumb without chapter is rendered
    expect(screen.getByText('Test Collection > Test Book')).toBeInTheDocument();
    
    // Check if other elements are still rendered
    expect(screen.getByText('Hadith 42')).toBeInTheDocument();
    expect(screen.getByText('Test hadith text')).toBeInTheDocument();
  });
});
