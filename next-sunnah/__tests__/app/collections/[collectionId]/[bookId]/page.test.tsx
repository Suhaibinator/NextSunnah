import React from 'react';
import { render, screen } from '@/test-utils';
import BookPage from '@/app/collections/[collectionId]/[bookId]/page';
import { collections } from '@/data/collections';
import { getBooksByCollection } from '@/data/books';
import { getChaptersByBook } from '@/data/chapters';
import { getHadithsByChapter } from '@/data/hadiths';
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
      id: 'test-chapter-1',
      bookId: 'test-book',
      name: 'Test Chapter 1',
      nameArabic: 'اختبار الفصل 1',
      number: 1,
    },
    {
      id: 'test-chapter-2',
      bookId: 'test-book',
      name: 'Test Chapter 2',
      nameArabic: 'اختبار الفصل 2',
      number: 2,
    },
  ]),
}));

// Mock the hadiths data
jest.mock('@/data/hadiths', () => ({
  getHadithsByChapter: jest.fn((chapterId) => {
    if (chapterId === 'test-chapter-1') {
      return [
        {
          id: 'test-hadith-1',
          collectionId: 'test-collection',
          bookId: 'test-book',
          chapterId: 'test-chapter-1',
          number: 1,
          text: 'Test hadith text 1',
          textArabic: 'اختبار نص الحديث 1',
          grade: 'Sahih',
          narrator: 'Test Narrator',
        },
      ];
    } else if (chapterId === 'test-chapter-2') {
      return [
        {
          id: 'test-hadith-2',
          collectionId: 'test-collection',
          bookId: 'test-book',
          chapterId: 'test-chapter-2',
          number: 2,
          text: 'Test hadith text 2',
          textArabic: 'اختبار نص الحديث 2',
          grade: 'Hasan',
          narrator: 'Another Narrator',
        },
      ];
    }
    return [];
  }),
}));

// Mock the SearchBar component
jest.mock('@/components/search-bar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('BookPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders book information correctly', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
      }),
    };

    render(await BookPage(props));
    
    // Check if collection name is rendered
    expect(screen.getByText('Test Collection')).toBeInTheDocument();
    
    // Check if book name is rendered
    expect(screen.getByText('1. Test Book')).toBeInTheDocument();
    
    // Check if book Arabic name is rendered
    expect(screen.getByText('اختبار الكتاب')).toBeInTheDocument();
    
    // Check if metadata is rendered
    expect(screen.getByText('100 Hadiths')).toBeInTheDocument();
    expect(screen.getByText('10 Chapters')).toBeInTheDocument();
    
    // Check if back link is rendered
    const backLink = screen.getByText('← Back to Test Collection');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/collections/test-collection');
    
    // Check if search bar is rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
  
  test('renders chapters and hadiths correctly', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
      }),
    };

    render(await BookPage(props));
    
    // Check if chapter titles are rendered
    expect(screen.getByText('Chapter 1: Test Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2: Test Chapter 2')).toBeInTheDocument();
    
    // Check if chapter Arabic names are rendered
    expect(screen.getByText('اختبار الفصل 1')).toBeInTheDocument();
    expect(screen.getByText('اختبار الفصل 2')).toBeInTheDocument();
    
    // Check if hadith numbers are rendered
    expect(screen.getByText('Hadith 1')).toBeInTheDocument();
    expect(screen.getByText('Hadith 2')).toBeInTheDocument();
    
    // Check if hadith grades are rendered
    expect(screen.getByText('Sahih')).toBeInTheDocument();
    expect(screen.getByText('Hasan')).toBeInTheDocument();
    
    // Check if hadith narrators are rendered
    expect(screen.getByText('Test Narrator')).toBeInTheDocument();
    expect(screen.getByText('Another Narrator')).toBeInTheDocument();
    
    // Check if hadith texts are rendered
    expect(screen.getByText('Test hadith text 1')).toBeInTheDocument();
    expect(screen.getByText('Test hadith text 2')).toBeInTheDocument();
    
    // Check if hadith Arabic texts are rendered
    expect(screen.getByText('اختبار نص الحديث 1')).toBeInTheDocument();
    expect(screen.getByText('اختبار نص الحديث 2')).toBeInTheDocument();
    
    // Check if hadith links point to the correct URLs
    const hadithLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/test-hadith-')
    );
    expect(hadithLinks[0]).toHaveAttribute('href', '/collections/test-collection/test-book/test-hadith-1');
    expect(hadithLinks[1]).toHaveAttribute('href', '/collections/test-collection/test-book/test-hadith-2');
  });
  
  test('calls notFound when collection is not found', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'non-existent-collection',
        bookId: 'test-book',
      }),
    };

    await BookPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('calls notFound when book is not found', async () => {
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'non-existent-book',
      }),
    };

    await BookPage(props).catch(() => {});
    
    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });
  
  test('renders empty state when no chapters are available', async () => {
    // Mock getChaptersByBook to return an empty array
    require('@/data/chapters').getChaptersByBook.mockReturnValueOnce([]);
    
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
      }),
    };

    render(await BookPage(props));
    
    // Check if empty state message is rendered
    expect(screen.getByText('No chapters available for this book.')).toBeInTheDocument();
  });
  
  test('renders empty state when no hadiths are available for a chapter', async () => {
    // Mock getChaptersByBook to return a chapter with no hadiths
    require('@/data/chapters').getChaptersByBook.mockReturnValueOnce([
      {
        id: 'empty-chapter',
        bookId: 'test-book',
        name: 'Empty Chapter',
        nameArabic: 'فصل فارغ',
        number: 1,
      },
    ]);
    
    // Mock getHadithsByChapter to return an empty array for this chapter
    require('@/data/hadiths').getHadithsByChapter.mockReturnValueOnce([]);
    
    const props = {
      params: Promise.resolve({ 
        collectionId: 'test-collection',
        bookId: 'test-book',
      }),
    };

    render(await BookPage(props));
    
    // Check if empty state message is rendered
    expect(screen.getByText('No hadiths available for this chapter.')).toBeInTheDocument();
  });
});
